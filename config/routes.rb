Rails.application.routes.draw do

  resources :collection,              only: [:show, :edit, :destroy] do
    resources :alerts,                only: [:index, :new, :create, :update]
    resources :milestones,            only: [:index, :new, :create, :update]
    resources :collectible,           only: [:index, :new, :create] do
      collection do
        exportable_methods.call
      end
    end
    resources :collection_users,         only: [:destroy]

    creates_bulk_collectible.call
    links_collectible_pdfs.call
    
    member do
      get :generate_status
      get :move_collectible
      get :render_collectible_row
      get :collectible_tag_columns
      get :collectible_tags
      get :templates_assigned
      get :users_assigned
    end

    get "create_collection_user/:user_id" => "collection_users#create", as: "create_collection_user"
  end
	
  resources :system_admins,           except: [:show] do
    collection do
      get :system_admins_for_showing
    end
  end
	
  resources :labels, only: [:destroy, :edit, :update] do
    member do
      get :assign_item, action: :assign_item_ui
      post :assign_item
      get :assigned_items
    end
  end
	
  get 'login', to: 'sessions#new'
  delete "logout" => "sessions#destroy", as: "log_out"

  resource :password_reset, only: [:new, :create, :edit, :update]
	
  resources :achievements, except: [:new, :create, :show, :destroy] do
    member do
      get :achievement_candidates
    end

    resources :achievement_levels, only: [:index]
  end

  resources :user_achievements, except: [:destroy] do
    collection do
      exportable_methods.call
    end

    member do
      exportable_methods.call
      get :generate_status
      post :bulk_create
      post :bulk_upgrade
      post :use_cert_avatar
    end
  end

  resources :labels, only: [:destroy, :edit, :update] do
    member do
      get :assign_item, action: :assign_item_ui
      post :assign_item
      get :assigned_items
    end
  end

end
