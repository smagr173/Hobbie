class Achievement < ActiveRecord::Base

  has_many :achievement_levels, dependent: :destroy
  has_many :user_achievements, through: :achievement_levels

  has_attached_file :badge, validate_media_type: false, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => ":style/missing-badge.png"
  has_attached_file :banner, validate_media_type: false, :styles => { :medium => "2001x665>", :thumb => "300x100>" }, :default_url => ":style/missing-banner.png"
  do_not_validate_attachment_file_type :badge
  do_not_validate_attachment_file_type :banner

  alias_attribute :name, :display_name

  class << self
		def fetch_candidates(achievement_id)
      current_user = User.current_user

      instance = self.new
      instance.user = user
      instance.achievement = achievement_id.achievement
      instance.achievement_level = achievement_id

      instance
    end

  end

  def safe_badge_url(style = :thumb, token_hint = nil)
    if self.badge.present?
      self.proxy_url(style, :badge, token_hint: token_hint)
    else
      uri = URI.parse(self.badge.url(style))
      uri.path
    end
  end

  def safe_banner_url(style = :thumb, token_hint = nil)
    if self.banner.present?
      self.proxy_url(style, :banner, token_hint: token_hint)
    else
      uri = URI.parse(self.banner.url(style))
      uri.path
    end
  end

end
