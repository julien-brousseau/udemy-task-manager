// Sendgrid config
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email template
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "user@example.com",
    subject: "Welcome!",
    text: `Welcome to the site, ${name}! `,
  })
}

// Email template
const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "user@example.com",
    subject: "Goodbye!",
    text: `But.. why are you leaving, ${name}?! `,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}
