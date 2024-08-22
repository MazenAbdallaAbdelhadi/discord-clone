import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentUser();

    if (!profile) {
      return new NextResponse("unAuthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Missing server id", { status: 400 });
    }

    const server = await db.server.update({
        where:{
            id: params.serverId,
            profileId:{
                not: profile?.id
            },
            members: {
                some:{
                    profileId: profile?.id
                }
            }
        },
        data:{
            members:{
                deleteMany:{
                    profileId: profile?.id
                }
            }
        }
    })

    return NextResponse.json(server);
  } catch (error) {
    console.log("[LEAVE_SERVER_PATCH]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
