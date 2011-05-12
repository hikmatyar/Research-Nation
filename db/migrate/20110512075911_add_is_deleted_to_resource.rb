class AddIsDeletedToResource < ActiveRecord::Migration
  def self.up
    add_column :resources, :is_deleted, :boolean, :default => false
    add_index :resources, :is_deleted
    remove_column :resources, :deleted_at
  end

  def self.down
    remove_column :resources, :is_deleted
    remove_index :resources, :is_deleted
    add_column :resources, :deleted_at, :date
  end
end
