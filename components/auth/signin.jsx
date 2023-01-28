import React, { useState } from 'react'
import Router, { useRouter } from 'next/router'
import axios from 'axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiUser, HiEye, HiEyeSlash } from "react-icons/hi2"
import { HiOutlineMail } from "react-icons/hi";
import Link from 'next/link'

import { useSession, signIn } from 'next-auth/react'
import { BsGithub } from 'react-icons/bs'

const providers = [
  {
    name: 'github',
    Icon: BsGithub
  }
]

const SignIn = (props) => {
  const { data: session, status } = useSession()
  const [show, setShow] = useState({ password: false })

  const { push } = useRouter()
  const redirectToHome = () => {
    const { pathname } = Router;

    if (pathname === "/auth-page")
      push("/home")
  }

  const handleOAuthSignIn = (provider) => () => signIn(provider) 

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: async values => {
      try {
        
        const response = await signIn("credentials", {
          ...values,
          redirect: false,
          callbackUrl: `${window.location.origin}`
        })
    
        response.error ? console.log(response.error) : redirectToHome()

      } catch (error) {
        console.error(error);
        // Handle sign in error
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
  });

  if (status === 'loading') return <p>Checking Authentication...</p>

  if (session) {
    redirectToHome()
  }
  

  return (
    <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-lg dark:bg-black">
      <h1 className="flex items-center justify-center mb-4 text-lg font-medium">Sign In</h1>

      <hr className="border-1 border-gray-500 mb-4" />

      <div className="mb-4">
        {
          providers.map(({ name, Icon }) => (
            <div className="flex" key={name}>
              <button type="button" className="w-full uppercase text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
                onClick={handleOAuthSignIn(name)}
              >
                <Icon className="mr-5" />
                Sign in with {name}
              </button>
            </div>
          ))
        }
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-b border-gray-500"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm italic">Or</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="justify-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <HiUser size={25} />
          </span>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="John Doe"
            className={`${formik.errors.username ? 'border-red-500':''} rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-500">{formik.errors.username}</div>
          ) : null}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="justify-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <HiOutlineMail size={25} />
          </span>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="example@email.com"
            className={`${formik.errors.email ? 'border-red-500':''} rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="justify-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <div className="flex">
          <span 
            className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            onClick={() => setShow({ ...show, password: !show.password})}
          >
            {show.password ? <HiEye size={25} /> : <HiEyeSlash size={25} />}
          </span>
          <input
            id="password"
            name="password"
            type={`${show.password ? "text" : "password"}`}
            placeholder="********"
            className={`${formik.errors.password ? 'border-red-500':''} rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500">{formik.errors.password}</div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600" type="submit">
          Sign In
        </button>
      </div>
      <div className="flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?  
        <Link href="#" legacyBehavior>
          <a className='text-blue-700 hover:underline dark:text-blue-500' onClick={() => props.toggleForm()}>Sign Up</a>
        </Link>
      </div>
    </form>
  );
}

export default SignIn;