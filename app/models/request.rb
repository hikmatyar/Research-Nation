class Request < ActiveRecord::Base

  belongs_to :user

  validates_presence_of :description

  def self.create_request request_data
    request = request_data
    request.save
  end

end
