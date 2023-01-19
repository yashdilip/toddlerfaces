import Router, { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react'
import { BsGithub } from 'react-icons/bs'
import { useState } from 'react';
import Link from 'next/link'

const providers = [
  {
    name: 'github',
    Icon: BsGithub
  }
]

const SignIn = () => {
  const { data: session, status } = useSession()
  const { push } = useRouter()
  const [showMe, setShowMe] = useState(false);

  const [userInfo, setUserInfo] = useState({ email: '', username: '', password: '' })

  const redirectToHome = () => {
    const { pathname } = Router;

    if (pathname === "/auth/signin")
    push("/home")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await signIn("credentials", {
      email: userInfo.email,
      username: userInfo.username,
      password: userInfo.password,
      redirect: false,
      callbackUrl: `${window.location.origin}`
    })

    response.error ? console.log(response.error) : redirectToHome()
  }

  if (status === 'loading') return <p>Checking Authentication...</p>

  if (session) {
    redirectToHome()
  }

  const handleOAuthSignIn = (provider) => () => signIn(provider)  

  return (
    <>
      <div className="grid place-items-center">
        {
          providers.map(({ name, Icon }) => (
            <button key={name} type="button" className="uppercase text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
              onClick={handleOAuthSignIn(name)}
            >
              <Icon className="mr-1" />
              Sign in with {name}
            </button>
          ))
        }

        <button key="signInWithUserPassword" type="button" className="uppercase text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
          onClick={() => setShowMe(!showMe)}
        >
          Sign in with User/Pass
        </button>

        <div id="signInForm" className="grid place-items-center" style={{ display: showMe ? "" : "none" }}>
          {/* {
            pageState.error !== '' && 
            Notiflix.Notify.warning(simplifyError(pageState.error))
        } */}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="justify-left mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg aria-hidden="true" className="w-3 h-3 text-gray-500 dark:text-gray-400" fillRule="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </span>
              <input type="text" id="email" value={userInfo.email} onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })} className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@domain.com" />
            </div>

            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fillRule="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
                </svg>
              </span>
              <input type="text" id="username" value={userInfo.username} onChange={({ target }) => setUserInfo({ ...userInfo, username: target.value })} className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="elonmusk" />
            </div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                &nbsp;*&nbsp;
              </span>
              <input type="password" id="password" value={userInfo.password} onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })} className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="**********" />
            </div>

            <div className="flex">
              <div className="flex items-start">
                  <div className="flex items-center h-5">
                      <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                  </div>
                  <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
              </div>
              <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
            </div>

            <div className="flex">
              <input type="submit" className="mt-3 text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2" value="Sign in" />
            </div>

            
          </form>
        </div>

        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          Not registered? 
          <Link href={'/auth/signup'} legacyBehavior>
            <a className='text-blue-700 hover:underline dark:text-blue-500'>Create account</a>
          </Link>
        </div>

      </div>
    </>
  )
}

export default SignIn;