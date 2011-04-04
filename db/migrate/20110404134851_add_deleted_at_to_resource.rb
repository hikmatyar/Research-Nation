class AddDeletedAtToResource < ActiveRecord::Migration
  def self.up
    add_column :resources, :deleted_at, :datetime
  end

  def self.down
    remove_column :resources, :deleted_at
  end
end
