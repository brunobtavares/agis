'use client';
import ClassCardComponent from '@/components/classCardComponent';
import ProfileComponent from '@/components/profileComponent';
import SuggestionComponent from '@/components/suggestionComponent';
import { DataItem } from '@/models/userData';
import { StorageService } from '@/services/storageService';
import { getUserDataAsync } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function User() {
  const router = useRouter();

  const [hash, setHash] = useState('');

  const {
    data: swrResponse,
    isLoading,
    isValidating,
  } = useSWR(hash ? `/api/user` : null, () => getUserDataAsync(hash));

  function handleExit() {
    StorageService.clear();
    router.push('/');
  }

  useEffect(() => {
    const localHash = StorageService.getHash();
    if (!localHash) handleExit();
    setHash(localHash);
  }, []);

  return (
    <div className="container mt-sm-2 mt-md-5">
      <ProfileComponent userName={swrResponse?.data.data.name ?? null} onExit={handleExit} />

      {!isLoading && isValidating && (
        <ProgressBar mode="indeterminate" color="#20262E" style={{ height: '2px' }}></ProgressBar>
      )}

      <div className="mt-1">
        {isLoading || !hash ? (
          <SkeletonLoader />
        ) : (
          <div>
            <RenderClassCard data={swrResponse?.data.data.data ?? []} />
            <SuggestionComponent username={swrResponse?.data.data.name ?? null} />
          </div>
        )}
      </div>
    </div>
  );
}

function RenderClassCard({ data }: { data: DataItem[] }) {
  return (
    <>
      {data.map((item) => {
        return <ClassCardComponent key={item.classCode} item={item} />;
      })}
    </>
  );
}

function SkeletonLoader() {
  return (
    <div className="d-flex flex-column gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} height="11.5rem" />
      ))}
    </div>
  );
}
