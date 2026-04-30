import { Resend } from 'resend'

interface InvitationEmailProps {
  to: string
  inviterEmail: string
  token: string
}

export async function sendInvitationEmail({ to, inviterEmail, token }: InvitationEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const link = `${appUrl}/invite/${token}`

  if (!process.env.RESEND_API_KEY) {
    console.warn(`[email] RESEND_API_KEY not set. Invite link for ${to}: ${link}`)
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Planiprof <noreply@planiprof.ca>',
    to,
    subject: `${inviterEmail} vous invite a collaborer sur Planiprof`,
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
  <h2 style="color:#4A8AB8;margin-bottom:8px">Invitation a collaborer sur Planiprof</h2>
  <p><strong>${inviterEmail}</strong> vous a invite(e) a collaborer sur la planification globale et mensuelle.</p>
  <a href="${link}" style="display:inline-block;background:#4A8AB8;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:20px 0">
    Accepter l'invitation
  </a>
  <p style="color:#9CA3AF;font-size:0.8rem">Ce lien expire dans 7 jours. Si vous n'avez pas de compte, vous devrez en creer un avec cette adresse courriel.</p>
</div>`,
  })
}