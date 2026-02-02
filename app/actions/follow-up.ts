'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'


export async function updateMemberFollowUp(memberId: string, data: { isContacted: boolean, leaderNotes: string }) {
    try {
      await prisma.member.update({
        where: { id: memberId },
        data: {
          isContacted: data.isContacted,
          leaderNotes: data.leaderNotes,
          // Set contact date to now if marked as contacted, otherwise null
          contactDate: data.isContacted ? new Date() : null 
        }
      })
      
      revalidatePath(`/follow-up/${memberId}`)
      revalidatePath('/members')
      return { success: true }
    } catch (error) {
      return { success: false, error: error }
    }
  }
  
  // 3. NEW: Get Member for Follow-up Page
  export async function getMemberForFollowUp(id: string) {
    const member = await prisma.member.findUnique({
      where: { id },
      include: { family: true }
    })
    
    if (!member) return null
  
    // Serialize dates
    return {
      ...member,
      dateOfBirth: member.dateOfBirth,
      registrationDate: member.registrationDate,
      contactDate: member.contactDate || null,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    }
  }
