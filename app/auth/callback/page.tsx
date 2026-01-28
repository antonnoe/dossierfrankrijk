'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Inloggen...')

  useEffect(() => {
    const supabase = createClient()
    
    // Supabase detecteert automatisch de code in de URL
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setStatus('Fout: ' + error.message)
        setTimeout(() => router.push('/login'), 3000)
        return
      }
      
      if (session) {
        router.push('/dashboard')
      } else {
        setStatus('Sessie wordt aangemaakt...')
        // Luister naar auth changes
        supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            router.push('/dashboard')
          }
        })
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
