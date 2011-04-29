class AddAttachmentsOriginalToAttachment < ActiveRecord::Migration
  def self.up
    remove_column :attachments, :file_name

    add_column :attachments, :original_file_name, :string
    add_column :attachments, :original_content_type, :string
    add_column :attachments, :original_file_size, :integer
    add_column :attachments, :original_updated_at, :datetime
  end

  def self.down
    add_column :attachments, :file_name, :string

    remove_column :attachments, :original_file_name
    remove_column :attachments, :original_content_type
    remove_column :attachments, :original_file_size
    remove_column :attachments, :original_updated_at
  end
end
