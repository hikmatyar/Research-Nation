class Order < ActiveRecord::Base

    belongs_to :resource
    has_many :transactions, :class_name => "OrderTransaction"

    attr_accessor :card_number, :card_verification

    validate_on_create :validate_card


    named_scope :user_purchases, (lambda do |user_id|
      {:conditions => ["success=? and buyer_id =?",true, user_id], :order => "created_at DESC"}
    end)

    def purchase
      response = GATEWAY.purchase(price_in_cents, credit_card, purchase_options)
      transactions.create!(:action => "purchase", :amount => price_in_cents, :response => response)
      self.update_attribute(:success, true) if response.success?
      response.success?
    end

    def price_in_cents
      (resource.selling_price*100).round
    end

    def self.authorized_access?(user_id, resource_id)
      order = self.find(:first, :conditions => ["success=? and buyer_id =? and resource_id =?",true, user_id, resource_id])
      order.success?
    end

    private

    def purchase_options
      {
        :ip => ip_address,
        :billing_address => {
          :name     => first_name + " "+ last_name,
          :address1 => address,
          :city     => city,
          :state    => state,
          :country  => country,
          :zip      => zip
        }
      }
    end

    def validate_card
      unless credit_card.valid?
        credit_card.errors.full_messages.each do |message|
          errors.add_to_base message
        end
      end
    end

    def credit_card
      @credit_card ||= ActiveMerchant::Billing::CreditCard.new(
        :type               => card_type,
        :number             => card_number,
        :verification_value => card_verification,
        :month              => card_expires_on.month,
        :year               => card_expires_on.year,
        :first_name         => first_name,
        :last_name          => last_name
      )
    end
end