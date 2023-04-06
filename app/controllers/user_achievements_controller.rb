class UserAchievementsController < ApplicationController

  before_action :_verify_access, only: [:bulk_create, :bulk_upgrade, :edit, :index, :new, :update]

  load_resource only: [:show, :edit, :update, :destroy, :export_preview, :use_cert_avatar, :export, :generate_status]

  class << self
    def bulk_create_list(candidate_data, achievement_level, items = [], candidate_ids = [])
      begin
        ActiveRecord::Base.transaction do
          unless candidate_data.blank?
            candidate_data.each do |index, candidate|
              user = User.find(candidate["user_id"])
              user_achievement = UserCertification.from_components(user, achievement_level)
              user_achievement.save!

              items << user_achievement
              candidate_ids << candidate.delete(:candidate_id)
            end
          end
        end

        return true
      rescue StandardError => se
        Rails.logger.error se.message
        return false
      end
    end

  end

  def bulk_create
    achievement_id = params.delete(:id)
    candidate_data = params.delete(:candidate_data)
    achievement_level = CertificationLevel.order(:position).where(achievement_id: achievement_id).first

    items = []
    candidate_ids = []

    save_completed = self.class.bulk_create_from_list(candidate_data, achievement_level, items, candidate_ids)

    respond_to do |format|
      if save_completed
        _user_achievement_notifications(items)
        format.json {render locals: {action: :create, adapter: self._adapter_with_items(items), results: {saved_candidates: candidate_ids}}}
      else
        params[:action] = 'bulk_create'
      end
    end

  end

  def bulk_upgrade
    candidate_data = params.delete(:candidate_data)
    items = []
    candidate_ids = []

    save_completed = self.class.bulk_update_from_list(candidate_data, items, candidate_ids)

    respond_to do  |format|
      if save_completed
        _user_achievement_notifications(items)

        format.json {render locals: {action: :update, adapter: self._adapter_with_items(items), results: {saved_candidates: candidate_ids}}}
        format.js { render 'shared/list_on_table_create_item', layout: 'event', locals: { adapter: self._adapter_with_items(items) } }
      else
        arams[:action] = 'bulk_update'
      end
    end

  end

  def edit
    respond_to do |format|
      format.js { render layout: "modal" }
    end
  end

  def index
    @achievement_id = params["achievement_id"]

    respond_to do |format|
      format.html
      format.json do
        self._render_fetch_items_for_list_using_tokens(nil, :user_achievements)
      end
    end

  end

  def new
    respond_to do |format|
      format.html
      format.js { render layout: "modal" }
    end
  end

  def show
    raise CanCan::AccessDenied unless can?(:show, @user_achievement)

    respond_to do |format|
      format.html do
        render 'show', layout: 'modal', locals: {new_announcement: params["congratulations"] ? true : false}
      end
      format.js do
        render 'show', layout: 'modal', locals: {new_announcement: params["congratulations"] ? true : false}
      end
    end
  end

  def update
    save_completed = true
    begin
      ActiveRecord::Base.transaction do
        valid_update = true
        is_level_update = false

        # currently, only level may change, but just in case, keep the check separate
        if params["achievement_level_id"]
          is_level_update = true
          valid_update = @user_achievement.valid_upgrade?(CertificationLevel.find(params["achievement_level_id"]))
        end

        if valid_update
          @user_achievement.update_attributes!(permitted_params.user_achievement)
          save_completed = true
        end
      end
    rescue
      save_completed = false
    end

    respond_to do |format|
      if save_completed
        _user_achievement_notification(@user_achievement)
      else
        format.html { render action: "edit", layout: 'modal' }
        format.js { render action: "edit", layout: 'event' }
      end
    end

  end

  def use_cert_avatar
    raise CanCan::AccessDenied unless can?(:use_cert_avatar, @user_achievement)
    user = @user_achievement.user

    user.avatar = @user_achievement.achievement_level.badge
    user.save!

    respond_to do |format|
      format.json {render locals: {action: :use_cert_avatar, success: true, avatar_path: user.safe_avatar_url(:thumb)}}
    end
  end

  protected
	
  def _adapter_with_items(items)
    UserAchievementsList::InfoTableContainerAdapter.new(nil, { items: items })
  end

  def create_render_context_for_export(command)
    UserAchievementsRenderContext.new(:export_excel)
  end

  def current_render_context
    @render_context ||= UserAchievementsRenderContext.new(:view)
  end

  def get_model_instance(mode = nil)
    return "UserAchievements" if mode == :export_excel
    Rails.logger.info("X 401 get model instance from applications controller")
    super
  end

  def load_and_authorize_owner
    @owner = @user_achievement
  end

  def load_instance
    @user_achievement ||= UserCertification.find(params[:id])
    @user_achievement
  end

end
