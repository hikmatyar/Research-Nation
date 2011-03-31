class ChangePriceDataType < ActiveRecord::Migration
  def self.up
    change_column :resources, :selling_price, :integer
  end

  def self.down
    change_column :resources, :selling_price, :float
  end
end
