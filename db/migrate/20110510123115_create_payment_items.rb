class CreatePaymentItems < ActiveRecord::Migration
  def self.up
    create_table :payment_items do |t|
      t.string :email
      t.string :status
      t.string :option
      t.text :details
      t.date :start_time
      t.date :end_time
      t.float :amount

      t.timestamps
    end
  end

  def self.down
    drop_table :payment_items
  end
end
