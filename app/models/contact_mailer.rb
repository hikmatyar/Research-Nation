class ContactMailer < ActionMailer::Base

  def feedback_email message
    recipients   "admin@researchnation.net"
    subject      "Feedback - Sent from About Us Page"
    from         "no-reply@researchnation.net"
    content_type "text/html"
    body         :message => message
  end

  def contact_us_email name, email, mail_subject, message
    recipients   "admin@researchnation.net"
    subject      "Feedback - Sent from Contact Us Page"
    from         "no-reply@researchnation.net"
    content_type "text/html"
    body         :name => name, :email => email, :mail_subject => mail_subject, :message => message
  end

  def profile_email (sender_name, sender_email_address, email_subject, message, recipient)
      recipients   [ recipient ]
      subject      "You have a message from #{sender_name}"
      from         "admin@researchnation.net"
      bcc          ["admin@researchnation.net"]
      reply_to      sender_email_address
      content_type "text/html"
      body         :sender_name => sender_name,
                   :subject => email_subject,
                   :message => message, :sender_email => sender_email_address
    sent_on Time.now
  end

end
