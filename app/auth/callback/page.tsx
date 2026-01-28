'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Inloggen...')

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()
      
      // Check for hash params (Supabase PKCE puts tokens here)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const error = hashParams.get('error')
      
      if (error) {
        setStatus('Fout: ' + hashParams.get('error_description'))
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      // Wait for Supabase to process the URL and establish session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        setStatus('Sessie fout: ' + sessionError.message)
        setTimeout(() => router.push('/login'), 2000)
        return
      }

      if (session) {
        setStatus('Ingelogd! Doorsturen...')
        router.push('/dashboard')
      } else {
        // Give Supabase time to exchange the code
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession()
          if (retrySession) {
            router.push('/dashboard')
          } else {
            setStatus('Kon niet inloggen. Probeer opnieuw.')
            setTimeout(() => router.push('/login'), 2000)
          }
        }, 1000)
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-ifr-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
