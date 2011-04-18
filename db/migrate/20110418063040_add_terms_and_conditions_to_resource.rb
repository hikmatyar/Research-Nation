class AddTermsAndConditionsToResource < ActiveRecord::Migration
  def self.up
    add_column :resources, :terms_and_conditions, :text
  end

  def self.down
    remove_column :resources, :terms_and_conditions
  end
end
