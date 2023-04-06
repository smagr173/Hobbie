module UserAchievementsHelper

  def achievement_level_options(user_achievement)
    achievement_levels = user_achievement.achievement_level.achievement.achievement_levels.order(:position)

    options = []
    achievement_levels.each do |achievement_level|
      if achievement_level.position >= user_achievement.achievement_level.position || achievement_level == user_achievement.achievement_level
        options << [achievement_level.display_name, achievement_level.id, {'data-level-position' => achievement_level.position}]
      end
    end

    options_for_select(options, {selected: user_achievement.achievement_level.id})
  end

  def fetch_achievement_types
    Achievement.where(enabled: 1)
  end

  def user_permission_levels
    permissions = {}
    CompanyUser::LEVELS.each do |level|
      permissions[UserAchievement.permission_identifier(level[:title])] = level[:title]
    end
		
    permissions
  end

  protected

  def _filter_achievements
    options = []

    Achievement.where(enabled: 1).each do |record|
      options << _user_achievement_filter_item(record.name, record.id)
    end

    options
  end

  def _user_achievements_filter(id, placeholder, candidates)
    {
      select_id: id,
      label_placeholder: placeholder,
      label_candidates: candidates
    }
  end

end
