import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { FaDiscord } from "react-icons/fa";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export default function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-4">
      <h1
        className={cn(
          "flex flex-col gap-1 items-center text-3xl font-semibold",
          font.className
        )}
      >
        <FaDiscord className="h-10 w-10" />
        <span>Discord Clone</span>
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
