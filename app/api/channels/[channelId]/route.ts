import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentUser();
    const {name, type} = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("unAuthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Missing server id", { status: 400 });

    if (!params.channelId)
      return new NextResponse("Missing channel id", { status: 400 });

    if (name === "general")
      return new NextResponse("Name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where:{
              id: params.channelId,
              NOT:{
                name: "general"
              }
            },
            data:{
              name,
              type
            }
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("unAuthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Missing server id", { status: 400 });

    if (!params.channelId)
      return new NextResponse("Missing channel id", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
};
