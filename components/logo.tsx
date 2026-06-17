import Link from "next/link";
import Image from "next/image";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className={`grid h-11 w-11 place-items-center rounded-full ${light ? "bg-white/95" : "bg-peach"}`}>
        <Image src="/brand/liorabump-mark.png" alt="" width={26} height={36} className="h-8 w-auto object-contain" />
      </span>
      <span className="font-serif text-2xl font-bold tracking-tight">
        <span className={light ? "text-white" : "text-navy"}>Liora</span>
        <span className={light ? "text-peach" : "text-coral"}>Bump</span>
      </span>
    </Link>
  );
}
