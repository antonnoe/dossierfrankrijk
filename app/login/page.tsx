'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Check je inbox! We hebben een login-link gestuurd naar ' + email 
        })
        setEmail('')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Er ging iets mis. Probeer het opnieuw.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🇫🇷</div>
          <h1 className="font-poppins text-2xl font-bold text-ifr-800">
            Mijn Dossier
          </h1>
          <p className="text-gray-600 mt-2">
            Je persoonlijke dossier voor Frankrijk
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-poppins text-xl font-semibold text-gray-800 mb-6">
            Inloggen
          </h2>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' && <span className="mr-2">✉️</span>}
              {message.type === 'error' && <span className="mr-2">⚠️</span>}
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ifr-800 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ifr-800 text-white py-3 px-4 rounded-lg font-poppins font-semibold hover:bg-ifr-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Even geduld...
                </>
              ) : (
                'Stuur login-link →'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              We sturen een beveiligde link naar je inbox.<br />
              Geen wachtwoord nodig.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Een dienst van{' '}
            <a href="https://infofrankrijk.com" target="_blank" rel="noopener noreferrer" className="text-ifr-800 hover:underline">
              InfoFrankrijk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
