class CreateOrders < ActiveRecord::Migration
  def self.up
    create_table :orders do |t|
      t.integer :resource_id
      t.string :status, :default => "pending"
      t.boolean :success
      t.string :ip_address
      t.string :first_name
      t.string :last_name
      t.string :card_type
      t.date :card_expires_on
      t.string :address
      t.string :city
      t.string :state
      t.string :country
      t.string :zip
      t.integer :buyer_id

      t.timestamps
    end
  end

  def self.down
    drop_table :orders
  end
end
