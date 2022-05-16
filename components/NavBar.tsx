import Link from 'next/link';
import { useContext } from "react"
import { UserContext } from '../lib/context';
import { auth } from '../lib/firebase';


const signOut =  () => {
  auth.signOut();
}

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext)

  console.log("HERE", user, username)

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {(user && username) && (
          <>
            <li>
              <button onClick={signOut}>Sign Out</button>
            </li>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}