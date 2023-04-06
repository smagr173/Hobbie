class LabelsController < CompanyResourceController

  before_action :verify_filter, only: [:index, :new]
  load_and_authorize_resource only: [:assign_item, :assign_item_ui, :assigned_items, :destroy, :edit, :update]
  before_action :load_company_from_model, only: [:assign_item_ui, :destroy]

  def assign_item
    project_ids = read_array_param(params[:assign_projects])
    projects = Project.find(project_ids) unless project_ids.blank?
    projects ||= []
    
    @label.projects = projects
  end

  def assigned_items
    type = params[:type].underscore.pluralize
    self._handle_fetch_items_for_assignment_using_tokens(@label, "assigned_#{type}")
  end

  def create
    mode = params[:mode]
    @label = @company.labels.new(permitted_params.label)
    
    if @label.save
      respond_to do |format|
        flash.now[:notice] = flash_message_for_action(mode)
        format.js { render_view_with_mode(mode, 'event') }
      end
    end
  end
    
  def destroy
    mode = params[:mode]
    @label.destroy
    
    respond_to do |format|
      flash.now[:notice] = flash_message_for_action(mode)
      format.js { render_view_with_mode(mode, 'event') }
    end
  end
  
  def edit
    respond_to do |format|
      format.js { render layout: 'modal', locals: { mode: params[:mode] }}
    end
  end
  
  def index
    @labels = @company.labels_for_filter(@label_filter).order(:name)
    
    respond_to do |format|
      format.js { render layout: 'modal'}
    end
  end
  
  def new
    @label = Label.new(filter: @label_filter)
    respond_to do |format|
      format.js { render layout: 'modal', locals: { mode: params[:mode] }}
    end
  end
  
  def update
    load_company_from_model
    mode = params[:mode]
    
    if @label.update_attributes(permitted_params.label)
      respond_to do |format|
        flash.now[:notice] = flash_message_for_action(mode)
        format.js { render_view_with_mode(mode, 'event') }
      end
    end    
  end
  
  protected

  def _fetch_assigned_projects(label, token, limit)
    items = label.projects.order(:id).limit(limit)
    items = items.where('projects.id > ?', token) unless token.zero?
    items
  end

  def _get_preferred_view(mode, action)
    view_name = if mode == 'folder'
      case action
      when 'create', 'update'
        'shared/create_item'
      end
    end
    view_name ||= preferred_view(mode.pluralize, action) if mode.present?
    view_name
  end

  def load_label
    @label = Label.find(params[:id])
  end

end
