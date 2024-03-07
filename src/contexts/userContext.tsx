'use client';
import { UserDataModel } from '@/models/userData';
import { getSavedUserData, getUserProfile } from '@/services/userService';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';

type UserContextProvider = { children: ReactNode };

type UserContextProps = {
  user: UserDataModel | null;
  setUser: Dispatch<SetStateAction<UserDataModel | null>>;
  loading: boolean;
};

const UserContext = createContext<UserContextProps>({} as UserContextProps);

const UserProvider: React.FC<UserContextProvider> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDataModel | null>(null);

  useEffect(() => {
    if (pathname.includes('/alternative')) return;

    getUserProfile()
      .then((response) => {
        const data = response.data;
        if (data && data.success) {
          setUser({
            name: data.data.name,
            ra: data.data.ra,
            data: [],
          });

          router.push('/user');
        }
      })
      .catch(() => {
        const userData = getSavedUserData();

        if (userData.data.length > 0) {
          router.push('/user');
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };

export const useUserContext = () => {
  return useContext(UserContext);
};
