class AddComments < ActiveRecord::Migration
  def self.up
    create_table :comments do |t|
      t.integer :user_id
      t.string :user_name
      t.integer :resource_id
      t.integer :stars
      t.string :comment
      t.timestamps
    end
  end

  def self.down
    drop_table :comments
  end
end
