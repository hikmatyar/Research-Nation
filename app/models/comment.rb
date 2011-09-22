class Comment < ActiveRecord::Base
  belongs_to :resource
  belongs_to :profile
  belongs_to :user  

  named_scope :recent, :order => "created_at DESC"
  named_scope :resources, :conditions => ["resource_id IS NOT NULL"]
  named_scope :profiles, :conditions => ["profile_id IS NOT NULL"]
  
  validates_presence_of :comment, :title, :user_name, :stars


  delegate :url_slug, :to => :resource

  validate :comment_must_not_contain_url

  ajaxful_rateable :stars => 5
  cattr_reader :per_page
  @@per_page = 25
  
  def profile_url_slug
    profile.url_slug
  end

  def self.average_rating_for resource
    star_sum = 0.0
    stars = comments_for(resource).map(&:stars)
  	stars.each do |star|
      star_sum += star
    end
    (star_sum / stars.count)
  end

  def self.comments_for resource
    all(:conditions => {:resource_id => resource.id})
  end

  private

  def comment_must_not_contain_url
    if comment.match(/[a-z0-9\.\-]+[\.][a-z]{2,4}/)
      errors.add("You comment must not contain any URL's and")
    end
  end

end