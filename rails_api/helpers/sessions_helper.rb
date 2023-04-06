module SessionsHelper

  def user_candidates_data_attributes(user)
    data = { id: user.id, name: user.name, avatar_url: user.safe_avatar_url(:thumb) }
    data[:active] = 'enabled' if user.present?
    data
  end
	
end
