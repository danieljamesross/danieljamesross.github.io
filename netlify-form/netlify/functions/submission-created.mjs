import nodemailer from "nodemailer";

// Netlify runs a function with this exact name for every verified form
// submission on the site (spam is filtered out before it gets here), so this
// is what turns a contact form post into an email.
//
// Required env vars (Netlify → Project configuration → Environment variables):
//   SMTP_USER         the Gmail address that sends the email
//   SMTP_PASS         a Gmail app password for that account
// Optional:
//   CONTACT_TO_EMAIL  where to deliver messages (defaults to SMTP_USER)
//   SMTP_HOST         defaults to smtp.gmail.com
//   SMTP_PORT         defaults to 465 (implicit TLS)

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  if (payload.form_name !== "contact") return { statusCode: 200 };

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_USER and SMTP_PASS must be set to email contact form submissions");
  }

  const name = String(payload.data.name ?? "").trim();
  const email = String(payload.data.email ?? "").trim();
  const message = String(payload.data.message ?? "").trim();

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    // Gmail only sends as the authenticated account, so the visitor goes in
    // Reply-To; Nodemailer encodes the address object, which keeps
    // user-supplied text out of raw headers.
    from: { name: "Website contact form", address: SMTP_USER },
    to: process.env.CONTACT_TO_EMAIL ?? SMTP_USER,
    replyTo: { name, address: email },
    subject: `Website message from ${name || email}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return { statusCode: 200 };
};
