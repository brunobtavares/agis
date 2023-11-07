import { UserDataModel } from '@/models/userData';
import { Skeleton } from 'primereact/skeleton';

interface ProfileComponentProps {
    user: UserDataModel | null;
    onExit: () => void;
}

export default function ProfileComponent({ user, onExit }: ProfileComponentProps) {
    return (
        <div className='d-flex align-items-center'>
            <i className="pi pi-user mx-1" />
            <span className='usernameText'>
                {user ? user.name : <Skeleton width='17rem' height="1.3rem"></Skeleton>}
            </span>
            <i className="pi pi-sign-out text-danger ms-2" title='Sair' onClick={() => onExit()} />
        </div>
    );
}