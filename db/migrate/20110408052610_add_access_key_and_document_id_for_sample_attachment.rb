class AddAccessKeyAndDocumentIdForSampleAttachment < ActiveRecord::Migration
  def self.up
    add_column :attachments, :access_key, :string
    add_column :attachments, :document_id, :integer
  end

  def self.down
    remove_column :attachments, :access_key
    remove_column :attachments, :document_id
  end
end
