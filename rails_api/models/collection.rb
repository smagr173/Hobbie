class Collection < ActiveRecord::Base

  include HasCreatedBy
  
  has_many        :items, -> { where(deleted_at: nil) }, through: :collection_items
  
  has_many        :collection_users, dependent: :destroy
  has_many        :collection_collaborators, through: :collection_users, source: :user, before_add: :before_add_collaborator
  has_many        :label_associations, as: :labelable, dependent: :destroy

  validates       :name, presence: true, length: {minimum: 2, maximum: 250}
  validates       :company_id, presence: true
  
  class << self
    def find_recent_last_update(collection_id)
      recent_audit = Audit.select([:created_at, :user_id]).where(owner_type: 'Collection', owner_id: collection_id).order(:created_at).last
      return Hobbie::Cache::Models::CollectionCache.update_context_from_audit(recent_audit) if recent_audit
      
      Hobbie::Cache::Models::CollectionCache.update_context_with(Collection.select(:updated_at).where(id: collection).first.try(:updated_at), 0)
    end
  end

  def last_update
    @last_update ||= Hobbie::Cache::Models::CollectionCache.last_update(self.id, default_updated_at: self.updated_at)
  end

  def items_count
    self.items.count
  end
  
  def reports_count
    self.reports.count
  end
  
  protected
	
  def before_add_collaborator(user)
    company_user = user.company_user
    if company_user.present?
      self.items.each do |project|
        begin
          project.users << user
        rescue ActiveRecord::RecordNotUnique
        end
      end
    end
    true
  end

end