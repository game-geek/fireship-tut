import { User } from "firebase/auth";
import { createContext } from "react";


export type UserType = null | {
    photoURL: string
    uid: string
    displayName: string
}
export interface userContextData {
    user: UserType    // fireship uses : null | undefined | User
    username: null | string
}

export const UserContext = createContext<userContextData>({user: null, username: null})

