module CollectionsHelper

  def collection_can_render_toggle_dropdown?(render_context, porfolio)
    current_render_context.feature_enabled?(:item_mapping) ||
    (current_render_context.feature_enabled?(:analytics_report_status) && can?(:view_analytics, @collection))
  end

  def collection_list_on_table_data_params(render_context, collection, user)
    args = {
      id: collection.id,
      type: collection.name,
      url: collection_path(collection)
    }.merge!(collection_status_duration_params(render_context, collection, user))
		
    bulk_request_id = BulkGeneration.current(collection.name, collection.id)
		
    unless bulk_request_id.blank?
      entry = BulkGeneration.read(bulk_request_id)
      args[:bulk_request_id] = bulk_request_id if entry.active?
    end
		
    args
  end

end