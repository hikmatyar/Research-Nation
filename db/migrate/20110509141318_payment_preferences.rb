class PaymentPreferences < ActiveRecord::Migration
  def self.up
    create_table :payment_preferences do |t|
      t.integer :user_id
      t.string :option
      t.string :paypal
      t.text :address

      t.timestamps
    end

  end

  def self.down
    drop_table :payment_preferences
  end
end
