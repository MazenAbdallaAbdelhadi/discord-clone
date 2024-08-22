import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await auth(req, res);

    if (!session) {
      return res.status(401).json({ error: "unAuthorized" });
    }

    const profile = session.user;
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!serverId) {
      return res.status(400).json({ error: "Missing server id" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Missing channel id" });
    }

    if (!content) {
      return res.status(400).json({ error: "Missing content" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile?.id
    );

    if (!member) {
      return res.status(404).json({ message: "Memeber not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKay = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKay, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal error" });
  }
}
