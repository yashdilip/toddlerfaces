import React, { useState } from 'react'
import { SignIn, SignUp } from '../components'

const AuthPage = () => {
  const [form, setForm] = useState('signin')

  return (
    <div className="app-container grid min-h-[calc(100vh-220px)] gap-10 py-12 lg:grid-cols-[1fr_520px] lg:items-center">
      <section>
        <p className="inline-flex rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-sm font-bold uppercase tracking-wide text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-gray-950/70 dark:text-indigo-300">Protected family access</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-950 dark:text-white md:text-6xl">
          A calmer place for childhood photo albums.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          Parents and photographers can create accounts here to organize albums, connect trusted storage, and manage sharing with care. Admin access is handled privately by the service owner.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Family-first albums", "Careful sharing", "Trusted storage links"].map(item => (
            <div className="rounded-md border border-gray-200 bg-white/85 p-4 text-sm font-semibold text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-950/85 dark:text-gray-200" key={item}>
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
