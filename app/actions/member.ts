'use server'

import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMember(formData: any) {
  await prisma.member.create({
    data: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender,
      address: formData.address,
      parentName: formData.parentName || null,
      parentPhone: formData.parentPhone || null,
      notes: formData.notes || null,
      registrationDate: new Date(),
    },
  })

  revalidatePath('/members')
  revalidatePath('/')
  revalidatePath('/statistics')
  redirect('/members')
}

export async function getMembers() {
  const members = await prisma.member.findMany({
    orderBy: { registrationDate: 'desc' }
  })
  
  // Serialize dates to strings for Client Components
  return members.map(m => ({
    ...m,
    dateOfBirth: m.dateOfBirth.toISOString(),
    registrationDate: m.registrationDate.toISOString(),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }))
}


export async function getPaginatedMembers({
  page = 1,
  pageSize = 10,
  query = '',
  gender = 'all',
  startDate,
  endDate,
}: {
  page?: number
  pageSize?: number
  query?: string
  gender?: string
  startDate?: string
  endDate?: string
}) {
  const skip = (page - 1) * pageSize
  
  const where: Prisma.MemberWhereInput = {}
  
  // 1. Text Search Filter
  if (query) {
    where.OR = [
      { firstName: { contains: query } },
      { lastName: { contains: query } },
      { email: { contains: query } },
      { phone: { contains: query } },
    ]
  }

  // 2. Gender Filter
  if (gender && gender !== 'all') {
    where.gender = gender
  }

  // 3. Date Range Filter (Registration Date)
  if (startDate || endDate) {
    where.registrationDate = {}
    if (startDate) {
      where.registrationDate.gte = new Date(startDate)
    }
    if (endDate) {
      // Set end date to end of the day to include the selected day
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      where.registrationDate.lte = end
    }
  }

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { registrationDate: 'desc' },
    }),
    prisma.member.count({ where }),
  ])

  return {
    members: members.map(m => ({
      ...m,
      dateOfBirth: m.dateOfBirth.toISOString(),
      registrationDate: m.registrationDate.toISOString(),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    })),
    metadata: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page < Math.ceil(total / pageSize),
      hasPrevPage: page > 1,
    }
  }
}


export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({ where: { id } })
    revalidatePath('/members')
    revalidatePath('/')
    revalidatePath('/statistics')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete member:', error)
    return { success: false, error: 'Failed to delete member' }
  }
}

export async function updateMember(id: string, data: any) {
  try {
    await prisma.member.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        // Only update dateOfBirth if it's provided (handle potentially empty strings)
        ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
        gender: data.gender,
        address: data.address,
        parentName: data.parentName || null,
        parentPhone: data.parentPhone || null,
        notes: data.notes || null,
      },
    })
    revalidatePath('/members')
    return { success: true }
  } catch (error) {
    console.error('Failed to update member:', error)
    return { success: false, error: 'Failed to update member' }
  }
}