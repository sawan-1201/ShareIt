const { model } = require('mongoose')
const nodemailer = require('nodemailer')

async function sendMail({from, to, subject,text, html}){
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({ //this sendMail is the internal function of nodemailer
        from: `shareIt <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    })
    // console.log(info)

}

module.exports = sendMail