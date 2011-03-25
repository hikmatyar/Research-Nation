class CreateResources < ActiveRecord::Migration
  def self.up
    create_table :resources do |t|
        t.float :selling_price
        t.text :description
        t.references :user
      t.timestamps
    end
  end

  def self.down
    drop_table :resources
  end
end
