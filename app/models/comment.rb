class Comment < ActiveRecord::Base
  belongs_to :resource
  belongs_to :user  
  named_scope :recent, :order => "created_at DESC"
  
  validates_presence_of :comment

  cattr_reader :per_page
  @@per_page = 25
  
  delegate :url_slug, :to => :resource

end