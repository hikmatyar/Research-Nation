class RemoveAndRenameFieldsOfRequest < ActiveRecord::Migration
  def self.up
    rename_column :requests, :title, :description
    # change_column :requests, :budget, :float
    # change_column :requests, :deadline, :datetime
    remove_column :requests, :email
    remove_column :requests, :comment

  end

  def self.down
    rename_column :requests, :description, :title
    change_column :requests, :budget, :string
    change_column :requests, :deadline, :string
    add_column :requests, :email
    add_column :requests, :comment
  end
end
