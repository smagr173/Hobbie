class SessionsController < ApplicationController
  include LoginController
  include LogoutController
  include VerifiesActiveUserController

  def new
    if current_user
      redirect_to dashboard_index_path
    end
  end
  
  def create
    if @user
      if params[:SAMLRequest]
        mark_user_as_logged_in(@user, false)
      else
        perform_login(@user)
      end
    else
      respond_to do |format|
        format.html { redirect_to root_path(post_nav_url: @post_nav_url), flash: { error: @login_message }}
        format.json { render :login_failed, locals: { post_nav_url: @post_nav_url, error: @login_message }}
      end
    end
  end

  def destroy
    logout_current_user(force_new_key: true)

    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { render }
    end
  end

  def sso_login
    unless _process_sso_login(current_user)
      respond_to do |format|
        format.html
      end
    end
  end
  
  def sso_login_complete
    unless _process_sso_login(@user)
      render :sso_login
    end
  end
  
  protected

  def attempt_login
    user = User.find_by_email(params[:user_identifier].downcase)
    
    if user
      if user.login_disabled?
        @login_message = I18n.t('hobbie.errors.auth.login_not_supported')
      else
        if user.authenticate(params[:password])
          if is_active?(user)
            @user = user
          elsif user.banned?
            @login_message = I18n.t('hobbie.errors.auth.banned')
          else
            @login_message = I18n.t('hobbie.errors.auth.inactive_account')
          end
        end
      end
    end
    
    @login_message ||= I18n.t('hobbie.errors.auth.invalid_creds') unless @user
  end
  
  def cache_service_provider
    @service_provider = Hobbie::Extensions::SsoProviders.new(params.delete(:service_provider))
    @service_provider.add_params(params)
  end

  def parse_domain_from_email(email)
    return if email.blank?

    match_result = email.match(User::EMAIL_REGEX)
    return if match_result.blank?
		
    match_result[2]
  end

  def _prepare_sso_redirect(sso_consumer, email)
    request = sso_consumer.provider.generate_url
    Hobbie::Cache::Features::Sso.mark_pending(email, request[:uuid])
    request[:url]
  end

  def _process_sso_login(user_entity)
    render status: 400 and return true unless @service_provider

    if user_entity
      @service_provider.configure({
        name: user_entity.name,
        email: user_entity.email,
        timestamp: Time.now.getutc.to_i.to_s,
        user_id: user_entity.id
      })
      redirect_to @service_provider.generate_url
      true
    end
  end
  
end