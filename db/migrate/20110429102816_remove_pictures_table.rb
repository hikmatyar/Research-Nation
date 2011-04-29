class RemovePicturesTable < ActiveRecord::Migration
  def self.up
    drop_table :pictures
  end

  def self.down
  end
end
