module SharedWithHelper
  
  def shared_with_permission_level_display(shared)
    case shared.permission_level
    when Membership::CONTRACTOR_AUTHOR[:level]
      'Can Edit'
    when Membership::CONTRACTOR_REVIEWER[:level]
      'Can Read & Comment'
    when Membership::CONTRACTOR_READER[:level]
      'Read only'
    when Membership::CONTRACTOR_NO_ACCESS[:level]
      'No Access'
    else
      'Contact Support'
    end
  end
  
  def shared_with_permission_level_option(shared, permission_level)
    is_selected = (shared.level == permission_level[1])
    content_tag(:option, permission_level[0], value: permission_level[1], selected: ('selected' if is_selected))
  end
  
  def shared_with_search_values(group_name, shared_object)
    search_values = [group_name]
    if shared_object.user.present?
      search_values << shared_object.user.name
      search_values << shared_object.user.email
    end
    search_values.join(' ')
  end
  
  def shared_with_shareable_display(shared)
    shareable = shared.shareable
		
    return if shareable.nil?
    link_to title_for_model_instance(shareable), shareable
  end
  
end
