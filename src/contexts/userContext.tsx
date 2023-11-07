'use client'
import { useRouter } from 'next/navigation';
import { UserDataModel } from "@/models/userData";
import { getUserData } from "@/services/userService";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type UserContextProvider = { children: ReactNode }

type UserContextProps = {
    user: UserDataModel | null,
    setUser: Dispatch<SetStateAction<UserDataModel | null>>,
    loading: boolean
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

const UserProvider: React.FC<UserContextProvider> = ({ children }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserDataModel | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };

export const useUserContext = () => { return useContext(UserContext); };

