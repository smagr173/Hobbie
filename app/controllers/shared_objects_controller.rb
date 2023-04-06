class SharedObjectsController < CompanyResourceController

  load_and_authorize_resource only: [:resend_email]
  before_action :load_company_from_model, only: [:resend_email]

  include ProvidesBaseRenderContext

  def index
    respond_to do |format|
      format.json do
        self._render_fetch_items_for_list_using_tokens(@company, :shared_objects)
      end
    end
  end
  
  def resend_email
    options = {
      shared_with_id: @shared_object.user_id,
      shared_by_id: current_user.id,
      shared_object_id: @shared_object.id
    }

    EmailSharedWithUserWorker.perform_async(options.to_json)
    
    head :ok
  end
  
  protected

  def _fetch_shared_objects_with_token(model_instance, token, limit)
    shared_objects = model_instance.shared_objects_for_reports.reorder(:id).limit(limit)
    shared_objects = shared_objects.where('shared_objects.id > ?', token) unless token.zero?
    shared_objects = shared_objects.to_a
    shared_objects.keep_if { |shared_object| can?(:show, shared_object) }
    shared_objects
  end

  def include_shareable?(shareable)
    return false if shareable.nil?
    can? :share_with, shareable
  end
  
end