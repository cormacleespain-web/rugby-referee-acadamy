"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type TeamMember = {
  id: string;
  name: string;
  country: string | null;
  languages: string[] | null;
  roleTitle: string | null;
  photoUrl: string | null;
  bio: string | null;
};

export function AnimatedTeamCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 28,
        delay: index * 0.08,
      }}
      whileHover={{ y: -4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={member.photoUrl ?? undefined} alt={member.name} />
              <AvatarFallback>
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{member.name}</h3>
              {member.roleTitle && (
                <p className="text-muted-foreground text-sm">
                  {member.roleTitle}
                </p>
              )}
              {member.country && (
                <p className="text-muted-foreground text-sm">
                  {member.country}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        {member.bio && (
          <CardContent>
            <p className="text-muted-foreground text-sm">{member.bio}</p>
            {member.languages && member.languages.length > 0 && (
              <p className="text-muted-foreground mt-2 text-xs">
                Languages: {member.languages.join(", ")}
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
