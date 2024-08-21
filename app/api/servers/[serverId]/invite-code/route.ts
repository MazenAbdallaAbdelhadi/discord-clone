import { NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentUser();

    if (!profile) return new NextResponse("unAuthorized", { status: 401 });

    if (!params.serverId) {
      return new NextResponse("server id is missing", { status: 400 });
    }

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: {
        inviteCode: uuidV4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID PATCH ERROR]", error);
    return new NextResponse("internal error", { status: 500 });
  }
};
