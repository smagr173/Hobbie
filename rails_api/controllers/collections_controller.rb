class CollectionsController < ApplicationController
  
  load_and_authorize_resource :collection, except: [:create, :export_preview, :index, :new, :new_projects_assigned, :new_styles_assigned]
  load_resource :collection, only: [:export_preview]
  
  include DelegateCreateAndIndexAuthorizations
  
  helper_method :model_instance
  helper_method :current_render_context
  
  def create
    @collection = @company.collections.new(permitted_params.collection)
    @collection.created_by_id = current_user.id
    
    @projects = self._parse_assigned_projects
    parse_assigned_styles

    save_completed = false
    ActiveRecord::Base.transaction do
      save_completed = @collection.save
      if save_completed
        update_assigned_projects
        update_assigned_styles
      end
    end
    
    respond_to do |format|
      if true == save_completed
        format.js do
          flash.now[:notice] = notice
          render 'shared/create_collection', layout: 'event', locals: { adapter: CollectionLibrary::InfoTableContainerAdapter.new(@company, { items: [@collection] })}
        end
      else
        params[:action] = "new"
        format.js { render action: "new", layout: "modal" }
      end
    end
  end
  
  def create_reports
    respond_to do |format|
      format.js { render 'shared/create_collections', locals: view_params_for_create_reports }
    end
  end
  
  def destroy
    project_reassignments = params[:collection].delete(:project_reassign) if params.key?(:collection)

    ActiveRecord::Base.transaction do
      @collection.destroy

      unless project_reassignments.blank?
        valid_project_ids = @company.projects.not_deleted.pluck(:id)
        valid_collection_ids = @company.collections.not_deleted.pluck(:id)

        project_reassignments.each do |project_id, collection_id|
          next if collection_id.blank?

          CollectionProject.create!(project_id: project_id, collection_id: collection_id)
        end
      end
    end

    respond_to do |format|
      format.html { redirect_to company_collections_path(@company), notice: 'Collection was removed.' }
    end
  end

  def edit
    active_tab = params['active_tab'] 
    active_tab = 'general' unless ['projects'].include? active_tab

    locals = {
      active_tab: active_tab,
      active_view_id: @collection.active_view_id || params[:active_view_id],
      assign_styles: {
        item_icon: 'file-code-o',
        resource_key: :style,
      },
      styles_url_builder: self._styles_url_builder(@collection, @company)
    }

    respond_to do |format|
      format.js { render layout: "modal", locals: self._locals_for_assign_projects(locals, @collection, @company) }
    end
  end
  
  def index
    respond_to do |format|
      format.html
      format.json do
        self._render_fetch_items_for_list_using_tokens(@company, :collections)
      end
    end
  end

  def new
    @collection = @company.collections.new()

    locals = {
      assign_styles: {
        item_icon: 'file-code-o',
        model_instance: @collection,
        resource_key: :style
      },
      styles_url_builder: self._styles_url_builder(@collection, @company)
    }

    respond_to do |format|
      format.js { render layout: "modal", locals: self._locals_for_assign_projects(locals, @collection, @company) }
    end

  end
  
  def update
    @projects = self._parse_assigned_projects
    parse_assigned_styles
    
    @collection.attributes = permitted_params.collection
    
    save_completed = false
    
    ActiveRecord::Base.transaction do
      update_assigned_projects
      update_assigned_styles
      save_completed = @collection.save
    end
    
    respond_to do |format|
      if true == save_completed
        notice = 'Collection was successfully updated.'
        format.js { flash.now[:notice] = notice and render layout: "event" }
      else
        params[:action] = "edit"
        format.js { render action: "edit", layout: "modal" }
      end
    end
  end
  
  def update_sort
    if params.has_key?(:view_id)
      active_view = CollectionView.find(params[:view_id])
      column_entry = CollectionView.add_column_entry(nil, params[:column_id])
      active_view.update_sort_order!(column_entry, params[:sort_order])
    end
    
    head :ok
  end
  
  protected
  
  def assign_collaborators(collaborators)
    @collection.collection_collaborators = collaborators
  end

  def _configure_collection_options(collection_options, active_view, rows)
    rows_provider = self._rows_provider_for_active_view(active_view)
    rows_provider.configure_collection_options(collection_options, rows)
  end

  def current_render_context(mode = nil)
    @render_context ||= @collection ? CollectionRenderContext.new(@collection) : RenderContextBase.new(@company)
  end
  alias_method :create_render_context_for_export, :current_render_context

  def _determine_row_count(active_view)
    rows_provider = self._rows_provider_for_active_view(active_view)
    rows_provider.determine_row_count(@collection)
  end
  
  def load_and_authorize_owner
    @owner = @collection
  end
  
  def load_instance
    @collection = Collection.find(params[:id])
  end

  def model_instance
    @collection
  end

  def update_assigned_projects
    @update_reports_view ||= false
    return if (@projects.nil? || (@collection.projects == @projects))
    
    @collection.projects = @projects
    complete_candidates_count = 0
    complete_count = 0
    @projects.each do |project|
      complete_candidates_count += project.complete_candidates_count
      complete_count += project.complete_count
    end
    @collection.complete_candidates_count = complete_candidates_count
    @collection.complete_count = complete_count
    
    @update_reports_view = true
  end
  
  def verify_action(action)
    authorize! action, @company
  end
  
end