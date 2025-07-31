"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function createPost(data: any) {
  data = JSON.parse(JSON.stringify(data));
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return redirect("/auth/signin");
  }

  try {
    const job = await prisma.job.create({
      data: {
        ...data,
        postedById: session.user.id,
      },
    });
    return JSON.parse(JSON.stringify(job));
  } catch (error) {
    console.error("Error creating job: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function getPosts() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      postedAt: "desc",
    },
    include: {
      postedBy: true,
    },
  });
  return JSON.parse(JSON.stringify(jobs));
}
