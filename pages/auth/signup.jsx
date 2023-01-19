import { useState } from 'react'
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from "react-icons/hi"
import Link from 'next/link'


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [show, setShow] = useState({ password: false, cpassword: false })
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = {};
    // validation code
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setSuccess(true)
      console.log(data);
    } catch (errors) {
      setErrors(errors)
      console.error(errors);
    }
    
  };  

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col gap-5 items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-lg">
        <h1 className="text-lg font-medium mb-4">Sign Up</h1>
        {success && <p className="text-green-500">Successfully registered</p>}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            className={`w-full border border-gray-400 p-2 rounded-lg ${errors.name ? 'border-red-500':''}`}
            type="text"
            placeholder="John Doe"
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <span className='icon flex items-center px-4'>
            <HiOutlineUser size={25} />
          </span>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            className={`w-full border border-gray-400 p-2 rounded-lg ${errors.email ? 'border-red-500':''}`}
            type="email"
            placeholder="example@email.com"
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <span className='icon flex items-center px-4'>
            <HiAtSymbol size={25} />
          </span>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            className={`w-full border border-gray-400 p-2 rounded-lg ${errors.password ? 'border-red-500':''}`}
            type={`${show.password ? "text" : "password"}`}
            placeholder="********"
            onChange={e => setFormData({ ...formData, password: e.target.value })}
           />
          <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password})}>
            <HiFingerPrint size={25} />
          </span>
           {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input
            className={`w-full border border-gray-400 p-2 rounded-lg ${errors.cpassword ? 'border-red-500':''}`}
            type={`${show.password ? "text" : "password"}`}
            placeholder="********"
            onChange={e => setFormData({ ...formData, cpassword: e.target.value })}
           />
          <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, cpassword: !show.cpassword})}>
            <HiFingerPrint size={25} />
          </span>
           {errors.cpassword && <p className="text-red-500">{errors.cpassword}</p>}
        </div>
        <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600">
          Sign Up
        </button>
      </form>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Have an account? 
        <Link href={'/auth/signin'} legacyBehavior>
          <a className='text-blue-700 hover:underline dark:text-blue-500'>Sign In</a>
        </Link>
      </div>
    </div>
  )
}