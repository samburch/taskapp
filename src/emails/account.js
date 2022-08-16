const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sam.burch85@gmail.com',
        subject: 'Thanks for joining',
        text: `Welcome to the app ${name}! Let me know how you get on with the app!`
    })
    .then((sent) => {
        console.log(`${sent}: Email trigger success`)
    })
    .catch((error) => {
        console.log({error: error})
    })

}

const sendCancelAccountEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sam.burch85@gmail.com',
        subject: 'Were sorry to see you leave',
        text: `We're sorry to see you go ${name}, if there is anything we can do to get you back, please let us know by responding to this email.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelAccountEmail
}