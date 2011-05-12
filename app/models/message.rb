class Message < ActiveRecord::Base

  is_private_message

  # The :to accessor is used by the scaffolding,
  # uncomment it if using it or you can remove it if not
  #attr_accessor :to

  cattr_reader :per_page
  @@per_page = 25

end
