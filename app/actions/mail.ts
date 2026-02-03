'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "user@example.com",
      pass: process.env.SMTP_PASS || "password",
    },
  });
  
  export async function sendAssignmentNotification(family: any, member: any) {
  
    const recipients = [];
    if (family.pilote?.email) recipients.push(family.pilote.email);
    if (family.copilote?.email) recipients.push(family.copilote.email);
  
    if (recipients.length === 0) {
      console.log("No leaders assigned to this family. No email sent.");
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const followUpLink = `${baseUrl}/follow-up/${member.id}/`;
  
    // 2. Compose Email
    const subject = `Nouveau membre assigné: ${member.firstName} ${member.lastName}`;
    const text = `
      Bonjour Cher Pilote/Copilote,
  
      Un nouveau membre vient d'être assigné à votre Famille d'Impact  "${family.name}".
  
      ---  Details ---
      Nom:  ${member.lastName}
      Prénom: ${member.firstName}
      Téléphone: ${member.phone}
      Email: ${member.email}
      Adresse: ${member.address}
      
      Parent: ${member.parentName || 'N/A'} (${member.parentPhone || 'N/A'})
      Notes: ${member.notes || 'None'}
  
      Veuillez les contacter le plus tôt possible pour leur souhaiter la bienvenue et les intégrer dans la famille d'impact.
      >>> Merci de valider le fait que vous les ayez contactés vien ce lien: ${followUpLink} <<<


      Cordialement,
      Team Intégration
    `;
  
    // 3. Send
    try {
      const info = await transporter.sendMail({
        from: '"Integration" <no-reply@integration-fi-icc-toulouse.com>', // sender address
        to: recipients.join(', '), // list of receivers
        subject: subject,
        text: text, // plain text body
        // html: "<b>Hello world?</b>", // html body (optional)
      });
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      // Don't throw error here to avoid blocking the UI assignment success
    }
  }