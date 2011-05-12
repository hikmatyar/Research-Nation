class PaymentPreference < ActiveRecord::Base
  belongs_to :user

  def update_preferences(preference)
    self.update_attributes(:paypal => preference[:paypal], :address => preference[:address], :option => preference[:option])
  end

  def paypal?
    self.option == "Paypal"
  end

  def address?
    self.option == "Cheque"
  end

end