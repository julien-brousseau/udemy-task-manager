const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "djoolien@gmail.com",
    subject: "Welcome!",
    text: `Welcome to the site, ${name}! `,
  })
}

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "djoolien@gmail.com",
    subject: "Noooooooo!!",
    text: `Why are you leaving, ${name}?! `,
  })
}


module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
}
