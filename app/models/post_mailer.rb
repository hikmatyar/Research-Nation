class PostMailer < ActionMailer::Base

  def post_email(sender_name, sender_email_address, email_subject, message, recipient_email)
      recipients   recipient_email
      subject      email_subject
      from         sender_email_address
      content_type "text/html"
      body         :name => sender_name,
                   :subject => email_subject,
                   :message => message
    sent_on Time.now
  end
end
