# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_researchnation_session',
  :secret      => '137105e5e8ca5cd58d1df1ddf4e43eae90f13715e8a4504ca9d67643a3a4f0c740c19b1c52d981b6d412f63994ae62f31ebcfb171fed3e69789743ccff77350d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
