"use client";
import { Button } from "antd";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { applyPost } from "@/app/actions/post.action";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const { data: sessioin, status } = useSession();
  const [applicationStatus, setApplicationStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  console.log(status);

  const handleApply = async (jobId: string) => {
    try {
      const res = await applyPost(jobId);
      if (res?.success) {
        setApplicationStatus("success");
      } else {
        setApplicationStatus("error");
        setErrorMessage(res?.error || "");
      }
    } catch (error) {
      setApplicationStatus("error");
      console.log(error);
    }
  };

  if (status === "loading") {
    return (
      <Button loading type="primary">
        Loading...
      </Button>
    );
  }

  if (status === "unauthenticated") {
    return <Button>Login to Apply</Button>;
  }

  if (status === "authenticated") {
    return (
      <>
        <Button type="primary" onClick={() => handleApply(jobId)}>
          ApplyButton
        </Button>
        {applicationStatus === "error" && <p>{errorMessage}</p>}
      </>
    );
  }
}
