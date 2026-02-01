'use server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers' // Add this


export async function login(formData: FormData) {
  const password = formData.get('password') as string
  
  if (password === process.env.SITE_PASSWORD) {
    // Set a cookie valid for 7 days
    const cookieStore = await cookies()
    cookieStore.set('site_access', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 week
      path: '/',
    })
    
    return { success: true }
  }
  
  return { success: false, error: 'Invalid code' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('site_access')
  revalidatePath('/')
}