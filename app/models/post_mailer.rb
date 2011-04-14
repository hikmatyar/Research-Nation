class PostMailer < ActionMailer::Base

  def post_email(sender_name, sender_email_address, email_subject, message, recipient)
      recipients   [ recipient.email]
      subject      "You have a message from #{sender_name}"
      from         "admin@researchnation.net"
      bcc          ["admin@researchnation.net"]
      reply_to      sender_email_address
      content_type "text/html"
      body         :sender_name => sender_name,
                   :subject => email_subject,
                   :message => message, :recipient_name => recipient.name, :sender_email => sender_email_address
    sent_on Time.now
  end
end
