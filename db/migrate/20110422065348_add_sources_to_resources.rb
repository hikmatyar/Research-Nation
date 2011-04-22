class AddSourcesToResources < ActiveRecord::Migration
  def self.up
    add_column :resources, :sources, :text
  end

  def self.down
    remove_column :resources, :sources
  end
end
