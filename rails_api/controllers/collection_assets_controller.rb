class CollectionAssetsController < ApplicationController

  load_resource only: [:destroy, :edit, :show, :update]
  before_action :load_container

  include FetchesItemsForListUsingTokens
  add_fetch_items_for_table_using_tokens_mapping(:index, adapter_module: FileAssetLibrary, fallback: :render, limit: 50)
  add_fetch_items_for_table_using_tokens_callback(:index, :file_assets_adapter) do |adapter_options|
    adapter_options[:permission_provider] = current_ability
  end

  def create
    modify_file_param(:file_asset)
    @collection_asset = @container.assets.create(permitted_params.collection_asset)
  
    end
  end
  
  def destroy
    @collection_asset.destroy
    
    respond_to do |format|
      format.json { render json: { id: @collection_asset.id } }
    end
  end
  
  def update
    modify_file_param(:file_asset)

    @collection_asset.update_attributes!(collection_asset)
  end
  
  protected
  
  def verify_action(action)
    authorize! action, @container
  end
  
end
