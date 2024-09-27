// Client-side code
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      try {
        const response = await fetch('/.netlify/functions/sendEmail', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.message === "Email sent successfully") {
            form.querySelector('.sent-message').style.display = 'block';
            form.querySelector('.error-message').style.display = 'none';
            form.reset();
          } else {
            throw new Error(result.error || 'Failed to send email');
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send email');
        }
      } catch (error) {
        console.error('Error:', error);
        form.querySelector('.error-message').textContent = error.message || 'An error occurred. Please try again.';
        form.querySelector('.error-message').style.display = 'block';
        form.querySelector('.sent-message').style.display = 'none';
      }
    });
  }
});

// Server-side code (Netlify function)
import { setApiKey, send } from '@sendgrid/mail';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { firstName, lastName, email, subject, message } = JSON.parse(event.body);

  setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'dev.abirsarkar@gmail.com',
    from: 'abir07sarkar@gmail.com', // This should be your verified SendGrid sender
    subject: 'New Response from the Website',
    text: `
      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,
    html: `
      <h2>New Form Submission</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to send email" }),
    };
  }
}
