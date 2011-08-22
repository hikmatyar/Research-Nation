class Comment < ActiveRecord::Base
  belongs_to :resource
  belongs_to :user  
  named_scope :recent, :order => "created_at DESC"
  
  validates_presence_of :comment
  
end