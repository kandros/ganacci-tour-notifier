import nodemailer from "nodemailer";
import type { TourDate } from "./types";

function ensureEnv(envKey: string) {
  const value = process.env[envKey];
  if (!value) {
    console.error(`\nmissing process.env.${envKey}`);
    process.exit(1);
  }
  return value;
}

const googleAuthEmail = ensureEnv("GOOGLE_AUTH_EMAIL");
const googleAppPassword = ensureEnv("GOOGLE_APP_PASSWORD");
const emailTo = ensureEnv("EMAIL_TO");

const client = nodemailer.createTransport({
  service: "Gmail",
  from: "test gino",
  auth: {
    user: googleAuthEmail,
    pass: googleAppPassword,
  },
});

export function sendEmail(tourDates: TourDate[]) {
  const tourDatesString = tourDates
    .map((x) => {
      return `
${x.title}
${x.city}
${x.date}`;
    })
    .join("\n");

  const text = `
The tour dates have changed! Here are the new tour dates:
${tourDatesString}
`;
  client.sendMail({
    to: emailTo,
    subject: "🐴 📆 Ganacci Tour Dates Changed",
    text,
  });
}
