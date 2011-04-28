class AddIsEditedToProfiles < ActiveRecord::Migration
  def self.up
    add_column :profiles, :is_edited, :boolean, :default => false
  end

  def self.down
    remove_column :profiles, :is_edited
  end
end
