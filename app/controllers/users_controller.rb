class UsersController < ApplicationController

  use_database_pool [:recent_report_updates, :settings, :signature, :stamps] => :persistent

  include ManagesUserCompanyFilesController
  include RequiresLoginController
  requires_login_for(:worker)

  before_action :load_user, only: [:edit, :resize_image, :show, :update]

  after_action :seed_recent_report_list_cache, only: :recent_report_updates
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(permitted_params.user)
    @user.options = get_bit_values(params[:user].delete(:options))
    if @user.save
      redirect_to root_url, :notice => "Please sign in!"
    else
      render "new"
    end
  end

  def edit
    fetch_company_candidates
    fetch_resumes
    self.fetch_stamps(@user)
    
    respond_to do |format|
      format.js { render layout: 'modal'}
    end
  end
  
  def resize_image
    @user.resize_signature_with_extent = true
    @user.signature = params[:user][:image]
    @user.save!
    
    respond_to do |format|
      format.json
    end
  end

  def settings
    @user_settings = current_user && current_user.settings

    respond_to do |format|
      format.json { render json: @user_settings }
    end
  end

  
  def show 
  end

  def update_settings
    @user = current_user

    unless @user
      head 401
    else
      dynamic_params = {}
      params.each do |param_key, param_value|
        matched = DYNAMIC_SETTINGS.match(param_key)
        dynamic_params[param_key] = param_value unless matched.nil?
      end

      permitted_params = params.except(:_browser_id).permit(*ALLOWED_SETTINGS).to_h
      permitted_params.merge!(dynamic_params) unless dynamic_params.blank?

      @user_settings = @user.update_settings(permitted_params)
    
      respond_to do |format|
        format.json { render json: @user_settings }
      end
    end
  end

  def stamps
    @stamps = current_user.user_company_file_stamps.enabled
    
    respond_to do |format|
      format.json
    end
  end

  def update
    resumes_to_remove = params.delete(:remove_resume)
    resumes = params.delete(:resume)
    stamps = params[:user].try(:delete, :stamps) || {}
    @user.options = get_bit_values(params[:user].delete(:options))

    crop_signature_data = self.parse_signature_cropping_data_from_params(params[:user])
    save_completed = false
    
    ActiveRecord::Base.transaction do
      self.remove_user_company_files(@user.user_company_files, resumes_to_remove)
      @user.update_attributes!(crop_signature_data.merge!(permitted_params.user))
      self.process_resumes(resumes.permit(company: {}).to_h[:company], @user) unless resumes.blank?
      self.process_stamps(stamps, @user)
      save_completed = true
    end
    
    if save_completed
      flash.now[:notice] = 'Profile successfully updated.'
      respond_to do |format|
        format.html { redirect_to @user }
        format.js { render 'layouts/empty', layout: 'event'}
      end
    else
      respond_to do |format|
        format.html { render action: "edit" }
        format.js { render action: 'edit', layout: 'modal'}
      end
    end
  end

  def current_resource
    @current_resource ||= User.find(params[:id]) if params[:id]
  end

  protected
  
  def company_id_for_recent_report_list
    @report_list_company_id ||= params[:company_id] || (current_user.membership.tenant.id if current_user.membership.company_user?) || 0
  end

  def fetch_company_candidates
    @company_candidates = @user.membership.tenant.companies if @user.membership.contractor_user?
    @company_candidates ||= []
  end
    
  def load_user
    @user = User.find(params[:id])
    authorize! params[:action].to_sym, @user
  end
  
end