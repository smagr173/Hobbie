class Milestone < ActiveRecord::Base
  belongs_to    :milestone_type

  has_many      :report_milestones

  serialize     :items, Array

  validates     :project,      presence: true
  validates     :milestone_type,  presence: true

  validates     :name,            presence: true,
                                  uniqueness: { scope: :project_id, case_sensitive: false },
                                  length: { minimum: 2, maximum: 250 }

  validates     :items,           presence: { if: :is_dropdown? }

  before_validation   :check_items

  def type 
    self.milestone_type.name if self.milestone_type
  end

  private

  def check_items
    if type != "dropdown" || self.items.is_a?(String)
      self.items = nil
    else
      @filled_items = []
      self.items.each_with_index do |item, index|
        @filled_items << item unless item.strip === ""
      end
      self.items = @filled_items.empty? ? nil : @filled_items
    end
  end

end
