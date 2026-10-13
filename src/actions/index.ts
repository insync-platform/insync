import { ActionError, defineAction } from "astro:actions";
import { RESEND_API_KEY } from "astro:env/server";
import { Resend } from "resend";
import { z } from "astro:schema";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const interesseLabels: Record<string, string> = {
  "insync-ai": "Insync AI voor ons team",
  klantportaal: "Klantportaal voor onze klanten",
  allebei: "Allebei",
  onbekend: "Weet ik nog niet",
};

const backofficeLabels: Record<string, string> = {
  novulo: "Novulo",
  anva: "ANVA",
  ccs: "CCS",
  anders: "Anders",
  onbekend: "Weet ik niet",
};

export const server = {
  requestDemo: defineAction({
    accept: "form",
    input: z.object({
      naam: z.string().trim().min(1),
      email: z.string().trim().email(),
      organisatie: z.string().trim().min(1),
      interesse: z.string().optional(),
      backoffice: z.string().optional(),
      bericht: z.string().trim().max(4000).optional(),
    }),
    handler: async ({ naam, email, organisatie, interesse, backoffice, bericht }) => {
      const rows = [
        ["Naam", naam],
        ["E-mail", email],
        ["Organisatie", organisatie],
        ["Interesse", interesse ? (interesseLabels[interesse] ?? interesse) : "Niet opgegeven"],
        ["Backoffice", backoffice ? (backofficeLabels[backoffice] ?? backoffice) : "Niet opgegeven"],
        ["Bericht", bericht || "—"],
      ]
        .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
        .join("");

      const resend = new Resend(RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: "Insync <hello@insync.insure>",
        to: ["hello@insync.insure"],
        replyTo: email,
        subject: `Demo-aanvraag: ${organisatie}`,
        html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="font-size: 16px; line-height: 1.6;">
              <p>Nieuwe demo-aanvraag via de website:</p>
              ${rows}
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

};
