"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

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

export async function getPosts(data: any = {}) {
  const { query, location, type } = data;
  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ],
            }
          : {},
        location
          ? { location: { contains: location, mode: "insensitive" } }
          : {},
        type ? { type: { contains: type, mode: "insensitive" } } : {},
      ],
    },
    orderBy: {
      postedAt: "desc",
    },
    include: {
      postedBy: true,
    },
  });
  return JSON.parse(JSON.stringify(jobs));
}

export async function getPostById(id: string) {
  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      postedBy: true,
    },
  });
  return JSON.parse(JSON.stringify(job));
}

export async function updatePostById(data: any) {
  const { id, title, company, location, type, salary, description } = data;
  try {
    const job = await prisma.job.update({
      where: {
        id,
      },
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        postedAt: new Date(),
      },
    });
    revalidatePath("/jobs");
    return JSON.parse(JSON.stringify(job));
  } catch (err) {
    console.error(err);
  }
}

export async function applyPost(jobId: string) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return redirect("/auth/signin", RedirectType.push);
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return {
        success: false,
        error: "Job not found",
        code: 404,
      };
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        userId: session.user.id,
      },
    });
    if (existingApplication) {
      return {
        success: false,
        error: "You already have applied for this job",
        code: 400,
      };
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        status: "PENDING",
      },
    });
    return JSON.parse(JSON.stringify(application));
  } catch (err) {
    toast.error("Failed to apply for the job");
  }
}
