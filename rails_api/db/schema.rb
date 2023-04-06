# File is auto-generated from the current state of the database. Rather than
# editing this file, please use the migrations feature of Active Record to
# progressively modify your database, then regenerate this schema definition.

ActiveRecord::Schema.define(version: 2023_10_11) do

  create_table "system_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "permission_level"
    t.integer "status", default: 1
    t.integer "flags", default: 0, null: false
    t.index ["user_id"], name: "index_company_users_on_user_id"
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

  create_table "feature_dependencies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "feature_id", null: false
    t.integer "dependent_on_feature_id", null: false
    t.index ["feature_id", "dependent_on_feature_id"], name: "feature_dependencies_on_feature_and_dependency", unique: true
  end

  create_table "features", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", limit: 64, null: false
    t.string "description", limit: 256
    t.string "internal_name", limit: 64, null: false
    t.integer "parent_feature_id", default: 0
    t.integer "flags", default: 0
    t.string "category", limit: 128
    t.index ["internal_name"], name: "index_features_on_internal_name", unique: true
  end

  create_table "file_asset_associations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "file_asset_id", null: false
    t.bigint "target_id", null: false
    t.string "target_type", null: false
    t.integer "position", default: 0, null: false
    t.index ["file_asset_id"], name: "index_file_asset_associations_on_file_asset_id"
    t.index ["target_type", "target_id", "file_asset_id"], name: "index_file_asset_associations_target_file", unique: true
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.datetime "last_login_at"
    t.string "single_login_key", limit: 96
    t.string "reset_token", limit: 128
    t.datetime "reset_token_expires_at"
    t.string "api_login_key", limit: 96
    t.index ["email"], name: "users_on_email", unique: true
  end

end
