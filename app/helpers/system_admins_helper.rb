module SystemAdminsHelper

  def create_system_admin_link
    link_to new_system_admin_path, data: { "title" => "New User" }, title: "Create User" do 
      icon("plus", "Add Root User")
    end
  end
	
end
