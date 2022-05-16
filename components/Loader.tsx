import { FC } from 'react'

interface props {
    show?: boolean
}

const Loader:FC<props> = ({ show }) => {
  return show ? <div className="loader"></div> : null
}

export default Loader 
