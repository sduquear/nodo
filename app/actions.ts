"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function addLink(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;

  if (!title || !url) {
    throw new Error("Title and URL are required");
  }

  // Buscar el usuario en la base de datos
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  // Crear el link
  await prisma.link.create({
    data: {
      title,
      url,
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
}

export async function deleteLink(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const linkId = formData.get("linkId") as string;

  if (!linkId) {
    throw new Error("Link ID is required");
  }

  // Buscar el usuario en la base de datos
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  // Eliminar el link (verificando que pertenece al usuario)
  await prisma.link.delete({
    where: {
      id: parseInt(linkId),
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
}
