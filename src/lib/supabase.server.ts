import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'

// For server components and API routes
export async function createServerSupabaseClient() {
    const { getToken } = await auth()
    const token = await getToken({ template: 'supabase' })

    const cookieStore = cookies()

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    )
}
