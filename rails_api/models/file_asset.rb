class FileAsset < ActiveRecord::Base
  INTEGRATION = {
    ICONS: 5
  }

  FLAGS = {
    NONE: 0,
    SYSTEM: 1,
  }

  belongs_to :container, polymorphic: true

  has_mirror_container(:container)
  has_mirrored_associations(:file_asset_associations)

  has_many :file_asset_associations, dependent: :destroy, inverse_of: :file_asset

  validate :validate_file_exists
  do_not_validate_attachment_file_type :file

  after_create :execute_after_create_operations
  after_destroy :execute_after_destroy_operations
  after_update :execute_after_update_operations

  scope :background_images, -> { where('integration=4') }
  scope :excluding_mirror_targets, -> { where('flags & 4 = 0')}
  scope :icons, -> { where('integration=5') }

  class << self
    def create_marker_asset!(company, asset_path)
      File.open(asset_path) do |file|
        file_asset = FileAsset.where({
          container_id: company.id,
          container_type: Company.name,
          internal_name: "_hobbie_#{File.basename(asset_path)}",
          flags: FileAsset::FLAGS[:SYSTEM]
        }).first_or_initialize
        file_asset.integration = FileAsset::INTEGRATION[:MAP_MARKERS] if file_asset.new_record?
        file_asset.update_attributes!({
          local_file: file
        })

        Hobbie::TransactionEndCallbacks::RunsWorkerMetaDataItem.enqueue_unique_for(
          file_asset,
          UploadFileAssetToS3Worker,
          file_asset.id
        )
      end
    end

    def remap_target(raw_data, file_asset_mapping)
      match = FileAsset::URL_MATCHER.match(raw_data)
      return if match.nil?
      id_components = match[1].split(File::SEPARATOR)
      source_file_asset_id = 0
      multiplier = 1
      id_components.reverse_each do |id_component|
        source_file_asset_id += id_component.to_i * multiplier
        multiplier *= 1000
      end
      mapped_file_asset_id = file_asset_mapping[source_file_asset_id].to_i
      return if mapped_file_asset_id.zero?
    end
  end

  def content_type
    self.local_file_content_type || self.file_content_type
  end

  def display_name
    display = self.caption
    return display unless display.blank?
    file_name = self.file_file_name || self.local_file_file_name
    display = File.basename(file_name, File.extname(file_name))
    display.titleize
  end

  def file_size
    self.file_file_size || self.local_file_file_size
  end

  def icon?
    INTEGRATION[:ICONS] == self.integration
  end

  def mark_as_mirror_source!
    self.flags = self.flags | FLAGS[:MIRROR_SOURCE]
    self.save!
  end

  def mirror_source?
    FLAGS[:MIRROR_SOURCE] == (FLAGS[:MIRROR_SOURCE] & self.flags)
  end

  def mirror_target?
    FLAGS[:MIRROR_TARGET] == (FLAGS[:MIRROR_TARGET] & self.flags)
  end

  def not_mirror_source?
    0 == (FLAGS[:MIRROR_SOURCE] & self.flags)
  end

  def on_before_mirror_target_created(source_component, sync_context, sync_options)
    super
    self.flags = self.flags & ~FLAGS[:MIRROR_SOURCE] | FLAGS[:MIRROR_TARGET]
    self.file = nil
    self.local_file = source_component.file
  end

  def on_before_update_from_mirror_source(source_component, sync_context, sync_options)
    super
    self.file = nil
    self.local_file = source_component.file
    self._trigger_upload_of_file
  end

  def preferred_file_url
    if self.file.present?
      if Imageable.image_type?(self.file.content_type)
        self.file.url(:thumb)
      else
        self.file.url(:original)
      end
    else
      'missing'
    end
  end

  def system?
    FLAGS[:SYSTEM] == (FLAGS[:SYSTEM] & self.flags)
  end

  protected

  def execute_after_create_operations
    if self.string_package?
      Hobbie::TransactionEndCallbacks::RunsWorkerMetaDataItem.enqueue_unique_for(
        self,
        StringResourceConfigWorker,
        StringResourceConfigWorker.worker_args_for(
          self,
          StringResourceConfigWorker::OPERATIONS[:INITIALIZE]
        )
      )
    end
    true
  end

  def execute_after_destroy_operations
    if self.string_package?
      Hobbie::TransactionEndCallbacks::RunsWorkerMetaDataItem.enqueue_unique_for(
        self,
        StringResourceConfigWorker,
        StringResourceConfigWorker.worker_args_for(
          self,
          StringResourceConfigWorker::OPERATIONS[:DELETE]
        )
      )
    end
    true
  end

  def execute_after_update_operations
    if self.string_package?
      Hobbie::TransactionEndCallbacks::RunsWorkerMetaDataItem.enqueue_unique_for(
        self,
        StringResourceConfigWorker,
        StringResourceConfigWorker.worker_args_for(
          self,
          StringResourceConfigWorker::OPERATIONS[:UPDATE]
        )
      )
    end
    true
  end

  def _trigger_upload_of_file
    Hobbie::TransactionEndCallbacks::RunsBlockMetaDataItem.enqueue_unique_for(self, :upload) do
      UploadFileAssetToS3Worker.perform_async(self.id)
    end
  end

  def validate_file_exists
    errors.add(:local_file_file_name, "must exist") unless (self.file.present? || self.local_file.present?)
  end
  
end
