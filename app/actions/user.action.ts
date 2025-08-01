"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getDbUserId() {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("User not found");
  return user.id;
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      id: clerkId,
    },
  });
}
