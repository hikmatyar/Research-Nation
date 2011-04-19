class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|

      t.string :name
      t.string :website
      t.string :phone_number
      t.string :competitors
      t.string :expertise
      t.string :profile_type
      t.string :interested_in

      t.text :humor_me
      t.text :address
      t.text :description

      t.timestamps
    end
  end

  def self.down
    drop_table :profiles
  end
end
