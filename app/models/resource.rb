class Resource < ActiveRecord::Base
  belongs_to :user
  has_many :attachments

  validates_presence_of :selling_price
  validates_numericality_of :selling_price
end
