class AddIndustryAndGeographyTagsToResources < ActiveRecord::Migration
  def self.up
    add_column :resources, :industry, :string
    add_column :resources, :geography, :string
  end

  def self.down
    remove_column :resources, :industry
    remove_column :resources, :geography
  end
end
