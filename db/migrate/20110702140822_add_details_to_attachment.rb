class AddDetailsToAttachment < ActiveRecord::Migration
  def self.up
    add_column :attachments, :details, :string
  end

  def self.down
    remove_column :attachments, :details
  end
end
