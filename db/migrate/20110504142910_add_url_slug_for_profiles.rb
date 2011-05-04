class AddUrlSlugForProfiles < ActiveRecord::Migration
  def self.up
    add_column :profiles, :url_slug, :string
    add_index :profiles, :url_slug
  end

  def self.down
    remove_column :profiles, :url_slug, :string
    remove_index :profiles, :url_slug
  end
end
