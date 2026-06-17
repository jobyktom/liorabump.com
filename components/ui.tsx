import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { medicalDisclaimer } from "@/lib/content";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-navy md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-slate md:text-lg">{text}</p> : null}
    </div>
  );
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold transition ${
        variant === "primary" ? "bg-navy text-white hover:bg-navySoft" : "bg-peach text-navy hover:bg-[#edd9bf]"
      }`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function MedicalNotice() {
  return (
    <div className="rounded-2xl border border-coral/20 bg-peach/55 p-5 text-sm leading-6 text-slate">
      <div className="mb-2 flex items-center gap-2 font-bold text-navy">
        <ShieldAlert className="h-5 w-5" />
        Educational health content
      </div>
      {medicalDisclaimer}
    </div>
  );
}

export function LifestyleImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-soft ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
    </div>
  );
}

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-lavenderDeep" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
