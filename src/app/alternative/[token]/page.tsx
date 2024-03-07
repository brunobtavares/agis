"use client";
import { Api } from "@/axios/client";
import ClassCardComponent from "@/components/classCardComponent";
import { ResponseModel } from "@/models/ResponseModel";
import { UserDataModel } from "@/models/userData";
import { Skeleton } from "primereact/skeleton";
import { exit } from "process";
import { useEffect, useState } from "react";

export default function Alternative({ params }: { params: { token: string } }) {
  const [user, setUser] = useState<UserDataModel>();
  const [error, setError] = useState(false);

  useEffect(() => {
    Api.post<ResponseModel<UserDataModel>>("/alternative", {
      token: params.token,
    })
      .then((response) => {
        if (response.data.success) {
          setUser(response.data.data);
        }
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      });
  }, []);

  if (error) {
    return <h1>Erro</h1>;
  }

  return (
    <div className="container mt-sm-2 mt-md-5">
      <div className="d-flex align-items-center">
        <i className="pi pi-user mx-1" />
        <span className="usernameText">
          {user ? (
            user.name
          ) : (
            <Skeleton width="17rem" height="1.3rem"></Skeleton>
          )}
        </span>
        <i
          className="pi pi-sign-out text-danger ms-2"
          title="Sair"
          onClick={() => exit()}
        />
      </div>
      <div className="mt-1">
        {user ? (
          user.data.map((item) => {
            return <ClassCardComponent key={item.classCode} item={item} />;
          })
        ) : (
          <div className="d-flex flex-column gap-2">
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
            <Skeleton height="11.5rem"></Skeleton>
          </div>
        )}
      </div>
    </div>
  );
}
