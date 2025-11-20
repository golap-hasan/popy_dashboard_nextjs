"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

const Title = ({ title, length }: { title: string; length?: number }) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft />
      </Button>
      <h1 className="text-md font-semibold tracking-[0.35em]">{title} {length && `(${length})`}</h1>
    </div>
  );
};
 
export default Title;
