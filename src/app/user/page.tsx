'use client'
import ClassCardComponent from '@/components/classCardComponent';
import ProfileComponent from '@/components/profileComponent';
import SuggestionComponent from '@/components/suggestionComponent';
import { useUserContext } from '@/contexts/userContext';
import { DataItem } from '@/models/userData';
import { getUserData } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState } from 'react';


export default function User() {
    const router = useRouter();
    const { user, setUser } = useUserContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserData()
            .then((response) => {
                if (response) {
                    setUser(response);
                }
                else { exit(); }
            })
            .catch(() => exit())
            .finally(() => setLoading(false));
    }, []);

    function exit() {
        localStorage.removeItem('hash');
        router.push('/');
    }

    return (
        <div className='container mt-sm-2 mt-md-5'>
            <ProfileComponent user={user} onExit={exit} />
            <div className='mt-1'>
                {
                    loading || !user ?
                        <div className='d-flex flex-column gap-2'>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                        </div>
                        :
                        <div>
                            <RenderClassCard data={user.data} />
                            <SuggestionComponent />
                        </div>
                }
            </div>
        </div>
    )
}

function RenderClassCard({ data }: { data: DataItem[] }) {
    return (<>
        {data.map((item) => { return <ClassCardComponent key={item.classCode} item={item} /> })}
    </>);
}