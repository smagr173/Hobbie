class AchievementsController < ApplicationController
  include FetchesItemsForListUsingTokens

  load_resource only: [:edit, :update, :destroy]
  authorize_resource
  add_fetch_items_for_table_using_tokens_mapping(:index, adapter_module: AchievementsList, limit: 50)

  def index
    respond_to do |format|
      format.html
      format.json do
        self._render_fetch_items_for_list_using_tokens(nil, :achievements)
      end
    end

  end

  def update
    save_completed = true
    begin
      ActiveRecord::Base.transaction do
        @achievement.update_attributes!(permitted_params.achievement)
      end
    rescue
      save_completed = false
    end

    if save_completed
      respond_to do |format|
        format.html { redirect_to achievement_levels_path(@achievement), notice: @notice }
        format.js { flash.now[:notice] = @notice and render layout: "event" }
      end
    else
      respond_to do |format|
        format.html { render action: "edit" }
        format.js { render action: "edit", layout: 'modal' }
      end
    end
  end

  protected

  def _adapter_with_items(items)
    AchievementsList::InfoTableContainerAdapter.new(nil, { items: items })
  end

  def _fetch_achievements_with_token(model_instance, token, limit)
    items = Certification.order(:position, :id).limit(limit)
    items = items.where('enabled = 1')
    items = items.where('id > ?', token) unless token.zero?

    items
  end
end