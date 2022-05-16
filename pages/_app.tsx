import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from "react-hot-toast"
import { UserContext } from '../lib/context'

// components
import NavBar from '../components/NavBar'
import { useUserData } from '../lib/hooks'

function MyApp({ Component, pageProps }: AppProps) {
  const { user, username } = useUserData() 

  return (
    <UserContext.Provider value={{user, username}}>
      <NavBar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
