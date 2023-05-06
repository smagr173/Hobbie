class UserAchievement < ActiveRecord::Base
  extend ActiveSupport::Concern
  include Generatable
  included do
    include SubmitsGeneratorRequest
    after_initialize :initialize_generator_state
  end

  belongs_to :user
  belongs_to :achievement_level
  belongs_to :achievement

  delegate :achievement_id, to: :achievement_level
  delegate :avatar, to: :user
  delegate :badge, to: :achievement_level
  delegate :company, to: :user
  delegate :display_name, to: :achievement_level

  class << self
    def from_components(user, achievement_level)
      current_user = Auditor::User.current_user

      instance = self.new
      instance.user = user
      instance.achievement = achievement_level.achievement
      instance.achievement_level = achievement_level
      instance.created_by_id = current_user.id

      instance
    end

    def permission_identifier(display_value)
      display_value.gsub(' ', '').underscore
    end
  end

  def safe_company_name
    return unless self.user.respond_to?(:company)
    return if self.user.company.nil?

    self.user.company.name
  end

  def upgrade_level
    candidate_record = fetch_upgrade_candidacy
    return if candidate_record.nil?

    candidate_record.achievement_level.position if candidate_record.respond_to?('achievement_level')

    nil
  end

  def valid_upgrade?(new_achievement_level)
    false unless new_achievement_level

    self.achievement == new_achievement_level.achievement && self.achievement_level.position < new_achievement_level.position
  end

  protected

  def initialize_generator_state
    self.generator_state ||= :ready
  end

end
