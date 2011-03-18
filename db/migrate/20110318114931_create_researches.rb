class CreateResearches < ActiveRecord::Migration
  def self.up
    create_table :researches do |t|

      t.string :title

      t.float :budget
      t.date :deadline
      t.references :user

      t.timestamps
    end
  end

  def self.down
    drop_table :researches
  end
end
