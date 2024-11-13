import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Get email and token from query string
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  // Create state for verification status
  const [verified, setVerified] = useState(false)

  // Call API to verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  if (!email || !token) {
    return <Navigate to="/404" />
  }

  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification