import Link from 'next/link'

const ErrorPage = () => {
  return (
    <>
      <div className="center">
        <h2>404</h2>
        <Link href="/">Back to Homepage</Link>
      </div>
    </>
  )
};

export default ErrorPage;