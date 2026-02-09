'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { sendAssignmentNotification } from './mail'

// --- USER (PILOTE/COPILOTE) ACTIONS ---


function formatForWhatsApp(phone: string) {
  // Remove all non-digit characters
  let clean = phone.replace(/\D/g, '');

  // If it starts with '0', remove it and add '33' (France)
  if (clean.startsWith('0')) {
    return `33${clean.substring(1)}`;
  }
  
  // If it's already international (starts with 33), keep it
  return clean;
}

export async function createUser(data: any) {
  try {
    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
      },
    })
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    console.error('Failed to create user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { lastName: 'asc' }
  })
}

// --- FAMILY ACTIONS ---

export async function createFamily(data: any) {
  try {
    await prisma.family.create({
      data: {
        name: data.name,
        address: data.address,
        piloteId: data.piloteId || null,
        copiloteId: data.copiloteId || null,
        latitude: data.latitude, // Save
        longitude: data.longitude,
      },
    })
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    console.error('Failed to create family:', error)
    return { success: false, error: 'Failed to create family' }
  }
}

export async function updateFamily(id: string, data: any) {
  try {
    await prisma.family.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        piloteId: data.piloteId || null,
        copiloteId: data.copiloteId || null,
        latitude: data.latitude, // Save
        longitude: data.longitude,
      },
    })
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    console.error('Failed to update family:', error)
    return { success: false, error: 'Failed to update family' }
  }
}

export async function deleteFamily(id: string) {
  try {
    // First, disconnect all members from this family
    await prisma.member.updateMany({
      where: { familyId: id },
      data: { familyId: null }
    })
    
    // Then delete the family
    await prisma.family.delete({ where: { id } })
    
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete family:', error)
    return { success: false, error: 'Failed to delete family' }
  }
}

export async function getFamilies() {
  return await prisma.family.findMany({
    include: {
      pilote: true,
      copilote: true,
      members: true,
    },
    orderBy: { name: 'asc' }
  })
}

// --- MEMBERSHIP MANAGEMENT ---

export async function addMemberToFamily(familyId: string, memberId: string) {
  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { familyId },
    })


    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: { 
        pilote: true, 
        copilote: true 
      }
    })

    // if (family) {
    //   // We run this without 'await' if we don't want to delay the UI response, 
    //   // OR await it if we want to ensure it sent. 
    //   // Usually, it is better to await to catch errors, but for UX speed, we can let it run.
    //   await sendAssignmentNotification(family, member);
    // }

    let whatsappLink = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const followUpLink = `${baseUrl}/follow-up/${member.id}/`;
    if (family && family.pilote && family.pilote.phone) {
      const phone = formatForWhatsApp(family.pilote.phone);
      const text = `
      Bonjour ${family.pilote.firstName},

      Nouveau membre assigné à votre famille "${family.name}" ! 🏠

      👤 *${member.firstName} ${member.lastName}*
      📞 ${member.phone}
      📍 ${member.address}

      Merci de prendre contact pour l'accueillir !
      >>> Merci de valider le fait que vous les ayez contactés vien ce lien: ${followUpLink} <<<
      `;
      // Create the universal WhatsApp link
      whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }
    revalidatePath('/families')
    return { success: true, whatsappLink }
  } catch (error) {
    return { success: false, error: 'Failed to add member' }
  }
}

export async function removeMemberFromFamily(memberId: string) {
  try {
    await prisma.member.update({
      where: { id: memberId },
      data: { familyId: null },
    })
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to remove member' }
  }
}

// Helper to get members NOT in a family (for selection)
export async function getAvailableMembers() {
  return await prisma.member.findMany({
    where: { familyId: null },
    orderBy: { lastName: 'asc' }
  })
}


// ... inside app/actions.ts ...

// --- USER ACTIONS ---

export async function updateUser(id: string, data: any) {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
      },
    })
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    console.error('Failed to update user:', error)
    return { success: false, error: 'Failed to update user' }
  }
}

export async function deleteUser(id: string) {
  try {
    // 1. Unassign this user from any families they lead (Pilote)
    await prisma.family.updateMany({
      where: { piloteId: id },
      data: { piloteId: null }
    })

    // 2. Unassign this user from any families they co-lead (Copilote)
    await prisma.family.updateMany({
      where: { copiloteId: id },
      data: { copiloteId: null }
    })

    // 3. Delete the user
    await prisma.user.delete({ where: { id } })
    
    revalidatePath('/families')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}



export async function getMemberAndClosestFamilies(memberId: string) {
  // Fetch Member
  const member = await prisma.member.findUnique({
    where: { id: memberId.toString() }
  });

  if (!member || !member.latitude || !member.longitude) {
    return { member, closestFamilies: [] };
  }

  // Fetch All Families with coordinates
  const families = await prisma.family.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    },
    include: { pilote: true, copilote: true, members: true }
  });

  // Calculate Distances in Memory
  const familiesWithDistance = families.map(family => {
    const distance = getDistance(
      member.latitude!, 
      member.longitude!, 
      family.latitude!, 
      family.longitude!
    );
    return { ...family, distance };
  });

  // Sort and take top 3
  const top3 = familiesWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return { member, closestFamilies: top3 };
}




export async function getFamilyWithDetails(familyId: string) {
  const [family, availableMembers] = await Promise.all([
    prisma.family.findUnique({
      where: { id: familyId },
      include: {
        pilote: true,
        copilote: true,
        members: {
          orderBy: { lastName: 'asc' } // Sort members alphabetically
        }
      }
    }),
    prisma.member.findMany({
      where: { familyId: null },
      orderBy: { lastName: 'asc' }
    })
  ]);

  if (!family) return null;

  // Helper to serialize dates for client components


  return {
    family,
    availableMembers
  };
}