class AddSlugToResources < ActiveRecord::Migration
  def self.up
    add_column :resources, :url_slug, :string
    add_index :resources, :url_slug
  end

  def self.down
    remove_column :resources, :url_slug
    remove_index :resources, :url_slug
  end
end
