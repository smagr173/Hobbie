class UserStats
  attr_reader :access_level, :profile_entity, :last_login_at

  class << self
    def show_access_for(user, default = nil)
      access_level = default

      if (user.membership.company_user?)
        access_level = user.company_user.access_level
      elsif (user.membership.domain_user?)
        access_level = "Domain"
      elsif (user.membership.system_admin?)
        access_level = "Root"
      end

      access_level
    end
  end

  def self.for_user(user)
    last_login_at = user.last_login_at
    last_login_at ||= Time.now

    access_level = self.show_access_for(user)

    UserStats.new(access_level, user.membership.profile_entity, last_login_at)
  end

  def initialize(access_level, profile_entity, last_login_at)
    @access_level = access_level
    @profile_entity = profile_entity
    @last_login_at = last_login_at
  end
end
