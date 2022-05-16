import Link from 'next/link'
import { FC } from 'react'

interface props {

}

const Custom404:FC<props> = ({ }) => {
  return (
    <div>
        <h1>404 - That page does not seem to exist...</h1>
        <iframe 
          src="https://giphy.com/embed/l2JehQ2GitHGdVG9y" 
          frameBorder="0"
          width="480"
          height="362"
          allowFullScreen
        ></iframe>
        <Link href="/">
          <button className='btn-blue'>Go home</button>
        </Link>
    </div>
  )
}

export default Custom404