'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Inloggen...')
  const [debug, setDebug] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()
      
      // Debug info
      const url = window.location.href
      const hash = window.location.hash
      const search = window.location.search
      setDebug(`URL: ${url}\nHash: ${hash}\nSearch: ${search}`)
      
      // Check for error in hash
      if (hash.includes('error')) {
        const hashParams = new URLSearchParams(hash.substring(1))
        setStatus('Fout: ' + hashParams.get('error_description'))
        return
      }

      // Check for code in query params (PKCE flow)
      const params = new URLSearchParams(search)
      const code = params.get('code')
      
      if (code) {
        setStatus('Code ontvangen, sessie aanmaken...')
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setStatus('Exchange error: ' + error.message)
          return
        }
      }

      // Check session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus('Session error: ' + error.message)
        return
      }

      if (session) {
        setStatus('Ingelogd! Doorsturen...')
        router.push('/dashboard')
      } else {
        setStatus('Geen sessie gevonden')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-content p-8">
      <div className="text-center w-full">
        <div className="w-8 h-8 border-4 border-ifr-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 mb-4">{status}</p>
        <pre className="text-left text-xs bg-gray-100 p-4 rounded overflow-auto max-w-xl mx-auto">{debug}</pre>
      </div>
    </div>
  )
}
