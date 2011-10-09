class AddFieldsToComments < ActiveRecord::Migration
  def self.up
  	add_column :comments, :telephone, :string
  	add_column :comments, :linkedin, :string
  	add_column :comments, :relationship, :string
  end

  def self.down
  	remove_column :comments, :telephone
  	remove_column :comments, :linkedin
  	remove_column :comments, :relationship
  end
end
