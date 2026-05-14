import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useSession, signIn } from 'next-auth/react'

const fieldClass = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-200"

const SignIn = (props) => {
  const { data: session, status } = useSession()
  const [serverError, setServerError] = useState('')
  const { push } = useRouter()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async values => {
      setServerError('')
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      })

      response?.error ? setServerError("Email or password is incorrect.") : push("/home")
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
  })

  if (status === 'loading') return <p className="text-sm text-gray-600 dark:text-gray-300">Checking authentication...</p>
  if (session) push("/home")

  return (
    <form onSubmit={formik.handleSubmit} className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">Sign in to Toddlerfaces</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Parents, photographers, and database-promoted admins can sign in here.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {serverError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
          {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formik.errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" name="password" type="password" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
          {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{formik.errors.password}</p>}
        </div>
      </div>

      <button className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30" type="submit">
        Sign in
      </button>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        Need an account?{' '}
        <button type="button" className="font-medium text-indigo-600 dark:text-indigo-400" onClick={() => props.toggleForm()}>Create one</button>
      </p>
    </form>
  )
}

export default SignIn
