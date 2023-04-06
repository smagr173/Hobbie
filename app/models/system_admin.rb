class SystemAdmin < ActiveRecord::Base
  belongs_to                                  :user
  validates_presence_of                       :user
  
  accepts_nested_attributes_for               :user
  
  validates_uniqueness_of                     :user_id

  delegate :name, :avatar, :membership, :signature, to: :user

  class << self
    def register_data_integrator
      self._register_service_user_account(DATA_INTEGRATOR, 'Hobbie Data Integrator')
    end

    def register_synchronizer
      self._register_service_user_account(SYNCHRONIZER_EMAIL, 'Hobbie Synchronizer')
    end

    def data_integrator_user
      User.where(email: DATA_INTEGRATOR).first
    end

    def synchronizer_user
      User.where(email: SYNCHRONIZER_EMAIL).first
    end

    protected

    def _register_service_user_account(email, name)
      ActiveRecord::Base.transaction do
        begin
          pass = SecureRandom.uuid
          user = User.create!({
            email: email,
            name: name,
            options: User::OPTIONS[:NO_LOGIN],
            password: pass,
            password_confirmation: pass
          })
          SystemAdmin.create!({ user: user })
        rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid
        end
      end
    end
  end

end
