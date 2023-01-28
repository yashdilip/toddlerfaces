import React, { useState } from 'react'
import Router, { useRouter } from 'next/router'
import axios from 'axios';
import { useFormik } from "formik";
import * as Yup from "yup";
import { HiUser, HiEye, HiEyeSlash } from "react-icons/hi2"
import { HiOutlineMail } from "react-icons/hi";
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'



const SignUp = (props) => {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { push } = useRouter()

  const redirectToHome = () => {
    const { pathname } = Router;

    if (pathname === "/auth-page")
      push("/home")
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      cpassword: '',
    },
    onSubmit: async values => {
      try {
        const response = await axios.post('/api/signup', values);

        // Handle successful sign up
        if (response.statusText==="Created") {
          setSuccess(true)

          const login = await signIn("credentials", {...values,
            redirect: false,
            callbackUrl: `${window.location.origin}`
          })
      
          login.error ? console.log(login.error) : redirectToHome() 
        }
      } catch (error) {
        setErrors(error);
        console.error(error);
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      cpassword: Yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password does not matched"
        )
      })
    }),
  });

  const [show, setShow] = useState({ password: false, cpassword: false })

  return (
    <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-lg dark:bg-black">
      <h1 className="flex items-center justify-center mb-4 text-lg font-medium">Sign Up</h1>
      <hr class="border-1 border-gray-500 mb-4" />

      {success && <p className="text-green-500">Successfully registered</p>}

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

      <div className="mb-4">
        <label htmlFor="cpassword" className="justify-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
        <div className="flex">
          <span 
            className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            onClick={() => setShow({ ...show, cpassword: !show.cpassword})}
          >
            {show.cpassword ? <HiEye size={25} /> : <HiEyeSlash size={25} />}
          </span>
          <input
            id="cpassword"
            name="cpassword"
            type={`${show.cpassword ? "text" : "password"}`}
            placeholder="********"
            className={`${formik.errors.cpassword ? 'border-red-500':''} rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cpassword}
          />
          {formik.touched.cpassword && formik.errors.cpassword ? (
            <div className="text-red-500">{formik.errors.cpassword}</div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600" type="submit">
          Sign Up
        </button>
      </div>

      <div className="flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
        Have an account? 
        <Link href="#" legacyBehavior>
          <a className='text-blue-700 hover:underline dark:text-blue-500' onClick={() => props.toggleForm()}>Sign In</a>
        </Link>
      </div>

      {/* <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="John Doe"
          className={`${formik.errors.username ? 'border-red-500':''} rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          className={`w-full border border-gray-400 p-2 rounded-lg ${formik.errors.username ? 'border-red-500':''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        <span className='icon flex items-center px-4'>
          <HiUser size={25} />
        </span>
        {formik.touched.username && formik.errors.username ? (
          <div className="text-red-500">{formik.errors.username}</div>
        ) : null}        
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder="example@email.com"
          className={`w-full border border-gray-400 p-2 rounded-lg ${formik.errors.email ? 'border-red-500':''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        <span className='icon flex items-center px-4'>
          <HiAtSymbol size={25} />
        </span>
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}        
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type={`${show.password ? "text" : "password"}`}
          placeholder="********"
          className={`w-full border border-gray-400 p-2 rounded-lg ${formik.errors.password ? 'border-red-500':''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password})}>
          {show.password ? <HiEye size={25} /> : <HiEyeSlash size={25} />}
        </span>
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500">{formik.errors.password}</div>
        ) : null}        
      </div> 
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2" htmlFor="cpassword">Confirm Password</label>
        <input
          id="cpassword"
          name="cpassword"
          type={`${show.password ? "text" : "password"}`}
          placeholder="********"
          className={`w-full border border-gray-400 p-2 rounded-lg ${formik.errors.cpassword ? 'border-red-500':''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cpassword}
        />
        <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, cpassword: !show.cpassword})}>
          {show.cpassword ? <HiEye size={25} /> : <HiEyeSlash size={25} />}
        </span>
        {formik.touched.cpassword && formik.errors.cpassword ? (
          <div className="text-red-500">{formik.errors.cpassword}</div>
        ) : null}        
      </div> 
      
      <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600" type="submit">
        Sign Up
      </button>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Have an account? 
        <Link href="#" legacyBehavior>
          <a className='text-blue-700 hover:underline dark:text-blue-500' onClick={() => props.toggleForm()}>Sign In</a>
        </Link>
      </div>
      */}
      
    </form>
  )
}

export default SignUp