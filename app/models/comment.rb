class Comment < ActiveRecord::Base
  belongs_to :resource
  belongs_to :user  
  named_scope :recent, :order => "created_at DESC"
  
  validates_presence_of :comment, :title, :user_name

  cattr_reader :per_page
  @@per_page = 25
  
  delegate :url_slug, :to => :resource

  def self.average_rating_for resource
  	resources = all(:conditions => {:resource_id => resource.id})
    if resources.present?
    	comment_count = 0
    	resources.each {|resource| comment_count += resource.stars }
    	(comment_count.to_f / resources.count).round
    end
  end

end