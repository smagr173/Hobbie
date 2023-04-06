module SharedHelper
  
  def shared_permission_level_option(shared, permission_level)
    is_selected = (shared.level == permission_level[1])
    content_tag(:option, value: permission_level[1], selected: ('selected' if is_selected))
  end
  
  def shared_search_values(group_name, shared_object)
    search_values = [group_name]
    if shared_object.user.present?
      search_values << shared_object.user.email
    end
    search_values.join(' ')
  end
  
  def shareable_display(shared)
    shareable = shared.shareable
		
    return if shareable.nil?
    link title_for_model_instance(shareable), shareable
  end
  
end
