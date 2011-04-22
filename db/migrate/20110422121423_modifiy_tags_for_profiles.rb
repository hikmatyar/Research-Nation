class ModifiyTagsForProfiles < ActiveRecord::Migration
  def self.up
    rename_column :profiles, :expertise, :research_type
    add_column :profiles, :industry_focus, :string
  end

  def self.down
    rename_column :profiles, :research_type, :expertise
    remove_column :profiles, :industry_focus
  end
end
