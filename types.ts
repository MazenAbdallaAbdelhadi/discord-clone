import type { Member, Server, User } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: User })[];
};
