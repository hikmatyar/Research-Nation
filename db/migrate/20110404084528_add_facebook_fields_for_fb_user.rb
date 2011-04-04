class AddFacebookFieldsForFbUser < ActiveRecord::Migration
  def self.up
    add_column :users, :gender, :string
    add_column :users, :location, :string
    add_column :users, :education, :string
    add_column :users, :work, :string
    add_column :users, :birthday, :datetime
  end

  def self.down
    remove_column :users, :gender
    remove_column :users, :location
    remove_column :users, :education
    remove_column :users, :work
    remove_column :users, :birthday
  end
end
