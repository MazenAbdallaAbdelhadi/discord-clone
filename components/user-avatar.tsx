import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  src?: string;
  className?: string;
}

export const UserAvatar = ({ className, src, name }: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarFallback className="text-white text-xs">
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
      <AvatarImage src={src} />
    </Avatar>
  );
};
