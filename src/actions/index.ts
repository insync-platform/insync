import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import { z } from 'astro:schema';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  sendContactForm: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string(),
      company: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string(),
    }),
    handler: async ({name, company, email, phone, message}) => {
      const { data, error } = await resend.emails.send({
        from: 'Insync <hello@insync.insure>',
        to: ['hello@insync.insure', 'geertjan@geertjanweijman.nl'],
        subject: 'Nieuwe bericht via de website',
        html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="font-size: 16px; line-height: 1.6;">
              <p>Nieuwe contactaanvraag via de website:</p>
              <p><strong>Naam:</strong> ${name}</p>
              <p><strong>Bedrijf:</strong> ${company || 'Niet opgegeven'}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefoon:</strong> ${phone || 'Niet opgegeven'}</p>
              
              <p><strong>Bericht:</strong></p>
              <p>${message}</p>
            </td>
          </tr>
        </table>
        `,
      });

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return data;
    },
  }),
  sendDemoRequest: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string(),
      company: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
    }),
    handler: async ({name, company, email, phone}) => {
      const { data, error } = await resend.batch.send([
        {
          from: 'Insync <hello@insync.insure>',
          to: email,
          replyTo: 'hello@insync.insure',
          subject: 'Demo-aanvraag bevestigd',
          html: `
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <img src="https://insync.insure/logo.svg" alt="Insync" width="120" height="40" style="display: block; margin: 0 auto;" />
            </td>
          </tr>
            <tr>
              <td style="text-align: center; padding-bottom: 30px;">
                <h1 style="font-size: 28px; margin: 0; color: #111827;">Bedankt voor je demo-aanvraag</h1>
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; line-height: 1.6;">
                <p>Hallo ${name},</p>
                
                <p>We hebben je aanvraag voor een demo van <strong>Insync</strong> goed ontvangen. Binnenkort nemen we 
                contact met je op om een geschikt moment af te stemmen.</p>
                
                <p>
                  Tijdens de demo laten we je graag zien hoe je met Insync:
                </p>
          
                <ul style="padding-left: 1.25rem;">
                  <li>Klanten een modern, veilig portaal biedt</li>
                  <li>Efficiënter werkt als intermediair</li>
                  <li>Inzicht krijgt in al je klantdata</li>
                </ul>
                
                <p>
                  Heb je in de tussentijd vragen? Neem gerust contact met ons op via <a href="mailto:hello@insync.insure" style="color: #5B59F8;">hello@insync.insure</a> of reageer op deze mail.
                </p>
                
                <p>
                  Met vriendelijke groet,<br /><br />
                  <strong>Team Insync</strong>
                </p>
                
                <hr style="margin-top: 2rem; border: none; border-top: 1px solid #e5e7eb;" />
  
                <p style="font-size: 12px; color: #9ca3af;">
                  Deze e-mail is automatisch gegenereerd op basis van je aanvraag via onze website. Je ontvangt binnenkort persoonlijk bericht van ons.
                </p>
              </td>
            </tr>
          </table>
          `,
        },
        {
          from: 'Insync <hello@insync.insure>',
          to: ['hello@insync.insure', 'geertjan@geertjanweijman.nl'],
          subject: 'Nieuwe demo-aanvraag',
          html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <tr>
            <td style="font-size: 16px; line-height: 1.6;">
              <p>Nieuwe demo-aanvraag via de website:</p>
              <p><strong>Naam:</strong> ${name}</p>
              <p><strong>Bedrijf:</strong> ${company}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefoon:</strong> ${phone || 'Niet opgegeven'}</p>
            </td>
          </tr>
        </table>
        `,
        }]);

      if (error) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return data;
    },
  }),
};