'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContact(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'ProVox Website <onboarding@resend.dev>',
      to: ['brad@provoxcoach.com'],
      replyTo: email,
      subject: `New ProVox inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #132861;">New Consultation Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Name</td><td>${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <h3 style="color: #132861; margin-top: 16px;">Message</h3>
          <p style="color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999;">Sent from provoxcoach.com</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: 'Failed to send message. Please try again.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}
