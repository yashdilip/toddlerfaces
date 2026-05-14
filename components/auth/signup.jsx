import React, { useState } from 'react'
import axios from 'axios'
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

const months = [
  ["1", "January"],
  ["2", "February"],
  ["3", "March"],
  ["4", "April"],
  ["5", "May"],
  ["6", "June"],
  ["7", "July"],
  ["8", "August"],
  ["9", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 90 }, (_, index) => currentYear - 18 - index)

const fieldClass = "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-200"
const errorClass = "mt-1 text-xs text-red-600 dark:text-red-400"

const SignUp = (props) => {
  const [serverError, setServerError] = useState('')
  const { push } = useRouter()

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      role: 'parent',
      birthMonth: '',
      birthYear: '',
      password: '',
      cpassword: '',
      legalAccepted: false,
    },
    onSubmit: async values => {
      setServerError('')

      try {
        const response = await axios.post('/api/signup', values)

        if (response.status === 201) {
          const login = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          })

          login?.error ? setServerError(login.error) : push("/home")
        }
      } catch (error) {
        setServerError(error?.response?.data?.message || "Could not create account.")
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().min(2, 'Name is too short').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      role: Yup.string().oneOf(['parent', 'photographer']).required('Role is required'),
      birthMonth: Yup.number().min(1).max(12).required('Birth month is required'),
      birthYear: Yup.number().max(currentYear - 18, 'Adult accounts only').required('Birth year is required'),
      password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
      cpassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required('Confirm your password'),
      legalAccepted: Yup.boolean().oneOf([true], 'Legal attestation is required'),
    }),
  })

  const showError = (name) => formik.touched[name] && formik.errors[name]

  return (
    <form onSubmit={formik.handleSubmit} className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Create account</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">Start a protected family gallery</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Adult accounts only. Admin accounts are created manually by the database owner.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {serverError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="username" className={labelClass}>Full name</label>
          <input id="username" name="username" type="text" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
          {showError('username') && <p className={errorClass}>{formik.errors.username}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
          {showError('email') && <p className={errorClass}>{formik.errors.email}</p>}
        </div>

        <div>
          <label htmlFor="role" className={labelClass}>Account type</label>
          <select id="role" name="role" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.role}>
            <option value="parent">Parent</option>
            <option value="photographer">Photographer</option>
          </select>
          {showError('role') && <p className={errorClass}>{formik.errors.role}</p>}
        </div>

        <div>
          <label htmlFor="birthMonth" className={labelClass}>Birth month</label>
          <select id="birthMonth" name="birthMonth" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birthMonth}>
            <option value="">Select month</option>
            {months.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          {showError('birthMonth') && <p className={errorClass}>{formik.errors.birthMonth}</p>}
        </div>

        <div>
          <label htmlFor="birthYear" className={labelClass}>Birth year</label>
          <select id="birthYear" name="birthYear" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birthYear}>
            <option value="">Select year</option>
            {years.map(year => <option value={year} key={year}>{year}</option>)}
          </select>
          {showError('birthYear') && <p className={errorClass}>{formik.errors.birthYear}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" name="password" type="password" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
          {showError('password') && <p className={errorClass}>{formik.errors.password}</p>}
        </div>

        <div>
          <label htmlFor="cpassword" className={labelClass}>Confirm password</label>
          <input id="cpassword" name="cpassword" type="password" className={fieldClass} onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.cpassword} />
          {showError('cpassword') && <p className={errorClass}>{formik.errors.cpassword}</p>}
        </div>
      </div>

      <label className="mt-5 flex gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
        <input name="legalAccepted" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600" checked={formik.values.legalAccepted} onChange={formik.handleChange} onBlur={formik.handleBlur} />
        <span>
          I attest that I am an adult, I will only upload media I am authorized to use, and I agree to the{' '}
          <Link href="/terms" className="font-medium text-indigo-600 dark:text-indigo-400">Terms</Link>,{' '}
          <Link href="/privacy" className="font-medium text-indigo-600 dark:text-indigo-400">Privacy Policy</Link>, and{' '}
          <Link href="/child-privacy" className="font-medium text-indigo-600 dark:text-indigo-400">Child Privacy Notice</Link>.
        </span>
      </label>
      {showError('legalAccepted') && <p className={errorClass}>{formik.errors.legalAccepted}</p>}

      <button className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30" type="submit">
        Create secure account
      </button>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <button type="button" className="font-medium text-indigo-600 dark:text-indigo-400" onClick={() => props.toggleForm()}>Sign in</button>
      </p>
    </form>
  )
}

export default SignUp
