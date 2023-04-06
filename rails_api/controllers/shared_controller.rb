class SharedController

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
      shared_with_id: @shared.user_id,
      shared_by_id: current_user.id,
      shared_id: @shared.id
    }
    
    head :ok
  end
  
  protected

  def include_shareable?(shareable)
    return false if shareable.nil?
    can? :share_with, shareable
  end
  
end
