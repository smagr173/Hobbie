
ActiveRecord::Schema.define(version: 2023_10_11) do

  create_table "system_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "permission_level"
  end

  create_table "collection_dependencies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "collection_id", null: false
    t.integer "depends_on_collection_id", null: false
    t.index ["collection_id", "depends_on_collection_id"], name: "collection_depends_on_collection", unique: true
  end
  
  create_table "collections", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", limit: 64, null: false
    t.string "description", limit: 256
    t.integer "root_collection_id", default: 0
    t.string "category", limit: 128
  end
  
  create_table "contacts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "title", null: false
    t.string "address", null: false
    t.string "address_2"
    t.string "city"
    t.string "state"
    t.string "zip_code"
    t.string "phone"
    t.string "type"
    t.integer "company_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "flags", default: 0
  end

  create_table "file_asset_associations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "file_asset_id", null: false
    t.bigint "target_id", null: false
    t.string "target_type", null: false
    t.integer "position", default: 0, null: false
    t.index ["target_type", "target_id", "file_asset_id"], name: "index_file_asset_association", unique: true
  end

  create_table "file_assets", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "file_file_name"
    t.string "file_content_type"
    t.integer "file_file_size"
    t.datetime "file_updated_at"
    t.string "local_file_file_name"
    t.string "local_file_content_type"
    t.integer "local_file_file_size"
    t.datetime "local_file_updated_at"
    t.string "caption"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "integration", default: 0
    t.integer "flags", default: 0
  end

  create_table "shared_objects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "shareable_id", null: false
    t.string "shareable_type", null: false
    t.integer "permission_level", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "previous_permission_level", default: 999
  end

  create_table "user_achievements", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", force: :cascade do |t|
    t.integer "user_id", null: false
    t.bigint "achievement_id", null: false
    t.bigint "achievement_level_id", null: false
    t.text "metadata"
    t.integer "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.datetime "last_login_at"
    t.string "single_login_key", limit: 96
    t.string "reset_token", limit: 128
    t.datetime "reset_token_expires_at"
  end

end
