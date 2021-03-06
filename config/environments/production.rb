# Settings specified here will take precedence over those in config/environment.rb

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
config.action_controller.perform_caching             = true
config.action_view.cache_template_loading            = true

# See everything in the log (default is :info)
# config.log_level = :debug

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Use a different cache store in production
# config.cache_store = :mem_cache_store

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host = "http://assets.example.com"

# Disable delivery errors, bad email addresses will be ignored
# config.action_mailer.raise_delivery_errors = false

# Enable threaded mode
# config.threadsafe!
Paperclip.options[:command_path] = "/usr/local/bin"

config.after_initialize do
  ActiveMerchant::Billing::Base.mode = :test
  ::GATEWAY = ActiveMerchant::Billing::PaypalGateway.new(
    :login => "bus_1304358683_biz_api1.d3velopers.com",
    :password => "1304358709",
    :signature => "A4op4KaUu.JEJqAThlPb0WKKoU9gASfn83TFzN4mQMLCUg.8lIA5rjNy "
  )

  ExceptionNotification::Notifier.exception_recipients = %w(ali.ibrahim@d3velopers.com)
end