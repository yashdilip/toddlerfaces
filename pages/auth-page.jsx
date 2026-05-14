import React, { useState } from 'react'
import { SignIn, SignUp } from '../components'

const AuthPage = () => {
  const [form, setForm] = useState('signin')

  return (
    <div className="mx-auto grid min-h-[calc(100vh-220px)] max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_520px] lg:items-center">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Adult accounts only</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-5xl">
          Sign in as a parent, photographer, or database-promoted admin.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          Parent and photographer accounts can be created here. Admin access is intentionally unavailable during signup and must be assigned directly in MongoDB.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Adult attestation", "Private by default", "Audit-ready actions"].map(item => (
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      {form === 'signin' ? (
        <SignIn toggleForm={() => setForm('signup')} />
      ) : (
        <SignUp toggleForm={() => setForm('signin')} />
      )}
    </div>
  )
}

export default AuthPage;
