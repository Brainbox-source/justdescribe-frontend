import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { requestRecommendation } from './api/tickets'
import {ApiError} from './api/apiError'
import { BackgroundGlow } from './components/BackgroundGlow'
import { DescriptionForm } from './components/DescriptionForm'
import { Logo } from './components/Logo'
import { ResultCard } from './components/ResultCard'
import { SignIn } from './components/SignIn'

/**
 * Utility to decode JWT token payload without external libraries
 */
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

/**
 * @param {{ title: string }} props
 */
function PageHeading({ title }) {
  return (
    <header className="flex flex-col items-center gap-3 text-center md:flex-row md:gap-4 md:text-left">
      <Logo className="h-12 w-auto shrink-0 md:h-16" />
      <h1 className="font-['Sora',sans-serif] text-[28px] font-bold leading-tight tracking-tight text-[#061E32] md:text-[40px]">
        {title}
      </h1>
    </header>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [description, setDescription] = useState('')
  const [view, setView] = useState({ kind: 'editing', errorMessage: null })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')

    if (tokenFromUrl) {
      localStorage.setItem('auth_token', tokenFromUrl)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    const token = localStorage.getItem('auth_token')
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded && decoded.email) {
        setUser({ email: decoded.email, firstName: decoded.first_name })
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }, [])

  async function handleSubmit() {
    if (view.kind === 'submitting') return

    setView({ kind: 'submitting' })

    try {
      const recommendation = await requestRecommendation(description.trim())
      setView({ kind: 'result', recommendation })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Something unexpected happened. Try again.'
      setView({ kind: 'editing', errorMessage: message })
    }
  }

  function handleEditOriginal() {
    setView({ kind: 'editing', errorMessage: null })
  }

  function handleDescribeAnother() {
    setDescription('')
    setView({ kind: 'editing', errorMessage: null })
  }

  function handleSignOut() {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  if (!user) {
    return (
      <>
        <BackgroundGlow />
        <SignIn />
      </>
    )
  }

  return (
    <>
      <BackgroundGlow />
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[600px] flex-col px-4 md:px-0">

        {/* Mobile Email Top Right */}
        <div className="flex w-full justify-end pt-6 pb-2 md:hidden">
          <span className="text-sm font-medium text-black/60">{user.email}</span>
        </div>

        {view.kind === 'result' ? (
          <div className="flex w-full flex-1 flex-col pb-6 md:py-20 md:pb-10">
            <div className="mt-4 md:mt-0">
              <PageHeading title="Here's what to use for your ticket." />
            </div>
            <div className="mt-6 w-full">
              <ResultCard
                recommendation={view.recommendation}
                onDescribeAnother={handleDescribeAnother}
              />
            </div>
            <button
              type="button"
              onClick={handleEditOriginal}
              className="mt-3 inline-flex self-center cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-base text-brand-navy/70 transition-colors hover:text-brand-navy"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Edit your original description
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col pb-6 md:py-50 md:pb-10">
            {/* flex-1 and justify-end pushes the heading down, placing the form right at the bottom on mobile */}
            <div className="flex flex-1 flex-col justify-center pb-8 md:flex-none md:justify-start">
              <PageHeading title={`Hey ${user.firstName}! Just describe it.`} />
            </div>
            <div className="w-full">
              <DescriptionForm
                description={description}
                onDescriptionChange={setDescription}
                onSubmit={handleSubmit}
                isSubmitting={view.kind === 'submitting'}
                errorMessage={view.kind === 'editing' ? view.errorMessage : null}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex w-full flex-col items-center gap-1.5 pb-8 md:pt-16 md:pb-10">
          <span className="hidden text-sm font-medium text-black/60 md:block">
            {user.email}
          </span>
          <button
            onClick={handleSignOut}
            className="cursor-pointer text-sm font-semibold text-[#061E32] transition-opacity hover:opacity-70"
          >
            Sign out
          </button>
        </div>
      </main>
    </>
  )
}
