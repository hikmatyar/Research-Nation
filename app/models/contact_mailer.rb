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

end
