import { Skeleton } from 'primereact/skeleton';

interface ProfileComponentProps {
  userName: string | null;
  onExit: () => void;
}

export default function ProfileComponent({ userName, onExit }: ProfileComponentProps) {
  return (
    <div className="d-flex align-items-center">
      <i className="pi pi-user mx-1" />
      <span className="usernameText">{userName ? userName : <Skeleton width="17rem" height="1.3rem"></Skeleton>}</span>
      <i className="pi pi-sign-out text-danger ms-2" title="Sair" onClick={() => onExit()} />
    </div>
  );
}
