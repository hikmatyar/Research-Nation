class CreatePictures < ActiveRecord::Migration
  def self.up
    create_table :pictures do |t|
      t.string :picture_name
      t.string :picture_path

      t.references :profile
      t.timestamps
    end
  end

  def self.down
    drop_table :pictures
  end
end
