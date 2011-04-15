class ContactMailer < ActionMailer::Base

  def feedback_email message
    recipients   "admin@researchnation.net"
    subject      "Feedback From User"
    from         "no-reply@researchnation.net"
    content_type "text/html"
    body         :message => message
  end

  def contact_us_email name, email, subject, message
    recipients   "admin@researchnation.net"
    subject      "Question From User"
    from         "no-reply@researchnation.net"
    content_type "text/html"
    body         :name => name, :email => email, :subject => subject, :message => message
  end  

end
