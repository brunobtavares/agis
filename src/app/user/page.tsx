"use client";
import ClassCardComponent from "@/components/classCardComponent";
import ProfileComponent from "@/components/profileComponent";
import SuggestionComponent from "@/components/suggestionComponent";
import { useUserContext } from "@/contexts/userContext";
import { DataItem } from "@/models/userData";
import { getUserData } from "@/services/userService";
import { useRouter } from "next/navigation";
import { ProgressBar } from "primereact/progressbar";
import { Skeleton } from "primereact/skeleton";
import useSWR from "swr";

export default function User() {
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const { isLoading, isValidating } = useSWR(`/user`, getUserData, {
    onSuccess: (response) => setUser(response),
    onError: () => exit(),
  });

  function exit() {
    localStorage.removeItem("hash");
    router.push("/");
  }

  return (
    <div className="container mt-sm-2 mt-md-5">
      <ProfileComponent user={user} onExit={exit} />
      {isValidating && (
        <ProgressBar
          mode="indeterminate"
          color="#20262E"
          style={{ height: "2px" }}
        ></ProgressBar>
      )}
      <div className="mt-1">
        {isLoading || !user ? (
          <div className="d-flex flex-column gap-2">
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
          </div>
        ) : (
          <div>
            <RenderClassCard data={user.data} />
            <SuggestionComponent />
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
