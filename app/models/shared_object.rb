class SharedObject < ActiveRecord::Base
  belongs_to :user
  belongs_to :shareable, polymorphic: true

  validate :user_not_disabled, on: :create
  before_update :transfer_permission_level

  def self.for(params)
    shareable_id = params.has_key?(:shareable) ? params[:shareable].id : params[:shareable_id]
    shareable_type = params.has_key?(:shareable) ? params[:shareable].class.table_name.titleize.singularize : params[:shareable_type]
    
    if params.has_key?(:company)
      SharedObject.find_by_user_id_and_company_id_and_shareable_type_and_shareable_id(
        params[:user].id,
        params[:company].id,
        shareable_type,
        shareable_id
      )
    else 
      SharedObject.find_by_user_id_and_shareable_type_and_shareable_id(
        params[:user].id,
        shareable_type,
        shareable_id
      )
    end
  end

  protected
  
  def transfer_permission_level
    self.previous_permission_level = self.permission_level_in_database if self.will_save_change_to_permission_level?
  end
  
  def user_not_disabled
    company_contractor = CompanyContractor.where(company_id: self.company_id, user_id: self.user_id).first
  end
  
end
