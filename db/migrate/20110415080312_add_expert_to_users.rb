class AddExpertToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :is_expert, :boolean, :default => false
  end

  def self.down
    remove_column :users, :is_expert
  end
end
