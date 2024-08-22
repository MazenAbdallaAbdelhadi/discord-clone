import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentUser();

    if (!profile) return new NextResponse("unAuthorized", { status: 401 });

    const server = await db.server.delete({
      where: { id: params.serverId, profileId: profile.id },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentUser();
    const { name, imageUrl } = await req.json();

    if (!profile) return new NextResponse("unAuthorized", { status: 401 });

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("internal error", { status: 500 });
  }
};
