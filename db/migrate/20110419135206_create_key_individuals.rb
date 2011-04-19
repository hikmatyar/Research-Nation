class CreateKeyIndividuals < ActiveRecord::Migration
  def self.up
    create_table :key_individuals do |t|

      t.string :name
      t.string :title
      t.string :email
      t.string :skype_id
      t.string :linkedin
      t.boolean :skype_availability

      t.references :profile
      t.timestamps
    end
  end

  def self.down
    drop_table :key_individuals
  end
end
