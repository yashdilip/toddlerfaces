import React, { useState } from 'react'
import { SignIn, SignUp } from '../components'


const AuthPage = () => {
  const [form, setForm] = useState('signin')

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col gap-5 items-center justify-center dark:bg-black">
      {form === 'signin' ? (
        <SignIn toggleForm={() => setForm('signup')} />
      ) : (
        <SignUp toggleForm={() => setForm('signin')} />
      )}
    </div>
  )
}

export default AuthPage;
