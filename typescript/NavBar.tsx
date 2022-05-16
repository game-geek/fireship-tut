

import { FC, useState, useRef } from 'react'

interface Person {
    firstName: string,
    lastName: string
}

interface props {
    name: string
    fn: (bob: string) => string
    obj?: Person
    handleChange: () => void
}

const NavBar:FC<props> = ({ name, handleChange }) => {
    const [state] = useState<{ name: string | number }>({ name: "lol" }) // overite generics    
    state.name = 5
    const inputRef = useRef<HTMLInputElement>(null) //HTMLInputElement
    

    return (
        <>
            <div>{name}</div>
            <input ref={inputRef} onChange={handleChange}></input>
        </>
    )
}


export default NavBar