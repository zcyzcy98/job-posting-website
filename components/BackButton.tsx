"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";

import React from "react";

export default function BackButton({ title }: { title: string }) {
  const router = useRouter();
  return (
    <Button onClick={() => router.back()} type="primary" className="mb-4">
      {title}
    </Button>
  );
}
