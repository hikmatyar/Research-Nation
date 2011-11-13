class AddIndexToProfileResource < ActiveRecord::Migration
  def self.up
    add_index :resources, :user_id
    add_index :profiles, :name
  end

  def self.down
    remove_index :resources, :user_id
    remove_index :profiles, :name
  end
end
