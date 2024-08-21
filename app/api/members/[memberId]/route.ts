import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server Id", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Missing member Id", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID DELETE]", error);

    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentUser();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Missing server Id", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Missing member Id", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID PATCH]", error);

    return new NextResponse("internal error", { status: 500 });
  }
}
