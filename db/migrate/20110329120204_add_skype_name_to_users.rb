class AddSkypeNameToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :skype_name, :string
  end

  def self.down
    remove_column :users, :skype_name
  end
end
