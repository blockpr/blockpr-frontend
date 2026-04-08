import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const { topic, name, email, message } = await req.json()

  if (!topic || !name || !email || !message) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'unickeys <onboarding@resend.dev>',
    to: 'blockprcode@gmail.com',
    replyTo: email,
    subject: `[unickeys] ${topic} — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; color: #111;">
        <h2 style="margin-bottom: 4px;">Nuevo mensaje de contacto</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">unickeys.com</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; width: 100px;">Motivo</td><td style="padding: 8px 0;"><strong>${topic}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Nombre</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4db888;">${email}</a></td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
