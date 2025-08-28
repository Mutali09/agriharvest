import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (cachedTransport) return cachedTransport;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!host || !user || !pass) {
    // Dev fallback: log email contents instead of throwing
    cachedTransport = nodemailer.createTransport({ jsonTransport: true });
  } else {
    cachedTransport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  return cachedTransport;
}

export async function sendMail(options: MailOptions): Promise<void> {
  const transporter = getTransport();
  const from = process.env.MAIL_FROM || "no-reply@agriharvest.local";
  await transporter.sendMail({ from, ...options });
}

