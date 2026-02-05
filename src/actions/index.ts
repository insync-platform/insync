import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";
import { z } from "astro:schema";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  sendContactForm: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      company: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string(),
    }),
    handler: async ({ name, company, email, phone, message }) => {
      const { data, error } = await resend.emails.send({
        from: "Insync <hello@insync.insure>",
        to: ["hello@insync.insure", "geertjan@geertjanweijman.nl"],
        subject: "Nieuwe bericht via de website",
        html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="font-size: 16px; line-height: 1.6;">
              <p>Nieuwe contactaanvraag via de website:</p>
              <p><strong>Naam:</strong> ${name}</p>
              <p><strong>Bedrijf:</strong> ${company || "Niet opgegeven"}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefoon:</strong> ${phone || "Niet opgegeven"}</p>

              <p><strong>Bericht:</strong></p>
              <p>${message}</p>
            </td>
          </tr>
        </table>
        `,
      });

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    },
  }),
  sendDemoRequest: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      company: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      date: z.string(),
      time: z.string(),
    }),
    handler: async ({ name, company, email, phone, date, time }) => {
      // Format the date for display
      const dateObj = new Date(date);
      const formattedDate = new Intl.DateTimeFormat("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateObj);

      const { data, error } = await resend.batch.send([
        {
          from: "Insync <hello@insync.insure>",
          to: email,
          replyTo: "hello@insync.insure",
          subject: "Demo ingepland - Insync",
          html: `
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <img src="https://insync.insure/logo.svg" alt="Insync" width="120" height="40" style="display: block; margin: 0 auto;" />
            </td>
          </tr>
            <tr>
              <td style="text-align: center; padding-bottom: 30px;">
                <h1 style="font-size: 28px; margin: 0; color: #111827;">Je demo is ingepland!</h1>
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; line-height: 1.6;">
                <p>Hallo ${name},</p>

                <p>Leuk dat je een demo hebt ingepland! We zien je graag op:</p>

                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 18px;"><strong>${formattedDate}</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 18px;"><strong>${time} uur</strong></p>
                </div>

                <p>
                  Tijdens de demo laten we je zien hoe je met Insync:
                </p>

                <ul style="padding-left: 1.25rem;">
                  <li>Klanten een modern, veilig portaal biedt</li>
                  <li>Efficiënter werkt als kantoor met onze AI tools</li>
                </ul>

                <p>
                  We nemen kort voor de demo contact met je op met de link naar de videocall.
                </p>

                <p>
                  Heb je in de tussentijd vragen? Neem gerust contact met ons op via <a href="mailto:hello@insync.insure" style="color: #5B59F8;">hello@insync.insure</a> of reageer op deze mail.
                </p>

                <p>
                  Met vriendelijke groet,<br /><br />
                  <strong>Team Insync</strong>
                </p>

                <hr style="margin-top: 2rem; border: none; border-top: 1px solid #e5e7eb;" />

                <p style="font-size: 12px; color: #9ca3af;">
                  Deze e-mail is automatisch gegenereerd op basis van je aanvraag via onze website.
                </p>
              </td>
            </tr>
          </table>
          `,
        },
        {
          from: "Insync <hello@insync.insure>",
          to: ["hello@insync.insure"],
          subject: "Nieuwe demo ingepland",
          html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="font-size: 16px; line-height: 1.6;">
              <p>Nieuwe demo ingepland via de website:</p>
              <p><strong>Naam:</strong> ${name}</p>
              <p><strong>Bedrijf:</strong> ${company}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefoon:</strong> ${phone || "Niet opgegeven"}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
              <p><strong>Datum:</strong> ${formattedDate}</p>
              <p><strong>Tijd:</strong> ${time} uur</p>
            </td>
          </tr>
        </table>
        `,
        },
      ]);

      if (error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    },
  }),
};
