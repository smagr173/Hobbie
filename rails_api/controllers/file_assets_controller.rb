class FileAssetsController < ApplicationController

  load_resource only: [:destroy, :edit, :show, :update]
  before_action :load_container
  after_action :enqueue_upload, only: [:create, :update]

  include FetchesItemsForListUsingTokens
  add_fetch_items_for_table_using_tokens_mapping(:index, adapter_module: FileAssetLibrary, fallback: :render, limit: 50)
  add_fetch_items_for_table_using_tokens_callback(:index, :file_assets_adapter) do |adapter_options|
    adapter_options[:permission_provider] = current_ability
  end

  def create
    modify_file_param(:file_asset)
    @file_asset = @container.file_assets.create(permitted_params.file_asset)
    
    respond_to do |format|
      format.json {
        json_data = render_to_string('shared/create_item', layout: 'event', formats: [:js], locals: { adapter: self._adapter_with_items([@file_asset]) })
        render json: { response_data: json_data }
      }
    end
  end
  
  def destroy
    @file_asset.destroy
    
    respond_to do |format|
      format.json { render json: { id: @file_asset.id } }
    end
  end
  
  def index
    respond_to do |format|
      format.html
      format.json do
        self._render_fetch_items_for_list_using_tokens(@company, :file_assets)
      end
    end
  end

  def new
    @file_asset = @container.file_assets.build
    
    respond_to do |format|
      format.js { render layout: 'modal'}
    end
    
  end
  
  def update
    modify_file_param(:file_asset)

    @file_asset.update_attributes!(permitted_params.file_asset)

    respond_to do |format|
      format.js { render 'shared/list_on_table_create_item', layout: 'event', locals: { adapter: self._adapter_with_items([@file_asset]) } }
    end
  end
  
  protected

  def _adapter_with_items(items)
    FileAssetLibrary::InfoTableContainerAdapter.new(@company, { items: items, permission_provider: current_ability })
  end

  def _fetch_file_assets_with_token(model_instance, token, limit)
    file_assets = @company.file_assets.excluding_mirror_targets.order(:id).limit(limit)
    file_assets = file_assets.where('file_assets.id > ?', token) unless token.zero?
    file_assets
  end

  def load_container
    @container = Company.find(params[:company_id]) if params.has_key?(:company_id)

    @company = @container
    @domain = @company.domain
  end
  
  def verify_action(action)
    authorize! action, @container
  end
  
end
