"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { validateUsername } from "@/lib/validations";

export async function claimUsername(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const username = formData.get("username") as string;

  // Validar username usando función compartida
  const validation = validateUsername(username);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Crear usuario en la base de datos
  // Prisma lanzará error si username ya existe (constraint unique)
  await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      username: username.toLowerCase(),
      name: user.firstName ?? null,
    },
  });

  redirect("/");
}
