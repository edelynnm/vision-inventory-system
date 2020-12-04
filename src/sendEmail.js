import nodemailer from "nodemailer";

export default (HTMLmessage, msgSubject, recipientEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // no need to set port or host because gmail is well known
    auth: {
      user: "vision.inventory.system@gmail.com",
      pass: "visionDummy123!",
    },
  });

  const mailOptions = {
    from: '"VISION Accounts" vision.inventory.system@gmail.com',
    to: recipientEmail,
    subject: msgSubject,
    html: HTMLmessage,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log({ success: true, info });
    }
  });
};
