class Order < ActiveRecord::Base

    belongs_to :resource
    has_many :transactions, :class_name => "OrderTransaction"

    attr_accessor :card_number, :card_verification

    validate_on_create :validate_card


    named_scope :user_purchases, (lambda do |user_id|
      {:conditions => ["success=? and buyer_id =?",true, user_id], :order => "created_at DESC"}
    end)


    named_scope :successful_resource_orders, (lambda do |resource_id| {:conditions => ["resource_id =? AND success=?", resource_id, true]}
    end)

    named_scope :successful_resource_orders_within_month, (lambda do |resource_id, start_time, end_time| {:conditions => {:resource_id => resource_id, :success=> true, :created_at => start_time..end_time}}
    end)

    named_scope :payment_pending, :conditions => "status = 'pending'"
    named_scope :payment_paid, :conditions => "status = 'paid'"

    def self.authorized_access?(user_id, resource_slug)
      resource = Resource.find_by_url_slug resource_slug
      order = self.find(:first, :conditions => ["success=? and buyer_id =? and resource_id =?",true, user_id, resource.id])
      order.success?
    end

    def purchase
      response = GATEWAY.purchase(price_in_cents, credit_card, purchase_options)
      transactions.create!(:action => "purchase", :amount => price_in_cents, :response => response)
      self.update_attribute(:success, true) if response.success?
      response.success?
    end

    def price_in_cents
      (resource.selling_price*100).round
    end


    def pay
      self.update_attributes :status => "paid"
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