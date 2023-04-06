class User < ActiveRecord::Base
  include Rails.application.routes.url_helpers
  include ChannelHelpers

  EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

  OPTIONS = {
    BANNED: 2,
    NO_LOGIN: 4
  }

  has_secure_password
  has_one                   :system_admin  
  has_one                   :company_user, inverse_of: :user
  has_one                   :company,         through: :company_user

  has_many                  :shared_objects, dependent: :destroy

  has_attached_file :avatar, :assets => { :medium => "320x320>", :thumb => "100x100>" }, :default_url => ":assets/no-avatar.png"
  
  before_post_process :rename_images
  
  validates :email,         :presence     => true,
                            :uniqueness   => true,
                            :format       => {:with => EMAIL_REGEX}

  validates :name,          :presence     => true,
                            :length => { :minimum => 2, :maximum => 45 }

  validates :password,      :presence     => true, :on => :create,
                            :confirmation => true,
                            :length => { :minimum => 5, :maximum => 45 },
                            unless: :password_waiting_reset?

  after_save :_perform_after_save_operations

  class << self
    def provision_for_sso(email, name)
      begin
        pass = SecureRandom.uuid
        User.create!({
          email: email,
          name: name,
          password: pass,
          password_confirmation: pass
        })
      rescue ActiveRecord::RecordNotUnique
        User.find_by_email(email)
      end
    end

    def register_user(email, name)
      pass = SecureRandom.uuid
      user = User.new({
        name: name,
        email: email,
        password: pass,
        password_confirmation: pass
      })
      user.reset_password(Time.now + 3.days)
      user.save!
      user
    end
  end

  def ban!
    self.options |= OPTIONS[:BANNED]
    self.save!
    Hobbie::Persist::Models::UserSettings.ban(self.id)
  end

  def banned?
    OPTIONS[:BANNED] == (OPTIONS[:BANNED] & self.options)
  end

  def email=(value)
    email_value = value.downcase
    write_attribute(:email, email_value)
  end

  def login_disabled?
    OPTIONS[:NO_LOGIN] == (OPTIONS[:NO_LOGIN] & self.options)
  end

  def matches_password_reset_token?(password_reset_token)
    self.reset_token == password_reset_token && !self.reset_password_token_expired?
  end

	def password_reset_url(extra_params = {})
		Rails.application.routes.url_helpers.edit_password_reset_url(extra_params.merge(email: email, reset_token: reset_token))
	end

  def rename_images
    self.avatar.instance_write :file_name, "avatar" unless self.avatar.nil? || !self.avatar.file?
    self.signature.instance_write :file_name, "signature" unless self.signature.nil? || !self.signature.file?
  end
  
  def reset_password(expire_at = nil)
    expire_at ||= Time.now + 1.day
    self.reset_token = SecureRandom.uuid
    self.reset_token_expires_at = expire_at
  end

  def reset_password!(expire_at = nil)
    reset_password(expire_at)
    save!
  end

  def reset_password_token_expired?
    self.reset_token_expires_at.present? && Time.now.utc > self.reset_token_expires_at
  end

  def safe_avatar_url(style = :thumb, token_hint = nil)
    if self.avatar.present?
      self.proxy_url(style, :avatar, token_hint: token_hint)
    else
      uri = URI.parse(self.avatar.url(style))
      uri.path
    end
  end

  def unban!
    self.options &= ~OPTIONS[:BANNED]
    self.save!
    Hobbie::Persist::Models::UserSettings.unban(self.id)
  end

  protected
  
  def password_waiting_reset?
    self.reset_token.present?
  end

end
