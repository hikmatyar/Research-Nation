class PaymentItem < ActiveRecord::Base

  named_scope :pending, :conditions => "status = 'pending'"

  def pay
    self.update_attributes :status => "paid"
  end

  def pending
    self.update_attributes :status => "pending"
  end

  def pending?
    status == "pending"
  end

  def paid?
    status == "paid"
  end


end
