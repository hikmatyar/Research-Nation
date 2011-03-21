class AddEmailAndCommentToRequest < ActiveRecord::Migration
  def self.up
    add_column :requests, :email, :string
    add_column :requests, :comment , :text
  end

  def self.down
     remove_column :requests, :email
    remove_column :requests, :comment
  end
end
