import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { validateUsername } from "@/lib/validations"

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación de campos requeridos
    if (!body.clerkId || !body.email || !body.username) {
      return NextResponse.json(
        { error: "clerkId, email, and username are required" },
        { status: 400 }
      )
    }

    // Validar username usando función compartida
    const validation = validateUsername(body.username)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        clerkId: body.clerkId,
        email: body.email,
        username: body.username.toLowerCase(),
        name: body.name ?? null,
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating user:", error)

    // Manejar error de unicidad de Prisma
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
