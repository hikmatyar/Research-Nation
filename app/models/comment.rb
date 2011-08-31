class Comment < ActiveRecord::Base
  belongs_to :resource
  belongs_to :user  

  named_scope :recent, :order => "created_at DESC"
  
  validates_presence_of :comment, :title, :user_name

  cattr_reader :per_page
  @@per_page = 25
  
  delegate :url_slug, :to => :resource

  def self.average_rating_for resource
    star_sum = 0.0
    stars = comments_for(resource).map(&:stars)
  	stars.each do |star|
      star_sum += star
    end
    (star_sum / stars.count).round
  end

  def self.comments_for resource
    all(:conditions => {:resource_id => resource.id})
  end

end