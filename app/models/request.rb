class Request < ActiveRecord::Base
  belongs_to :user

  validates_presence_of :title
  validates_presence_of :email

  validates_uniqueness_of :title
end
