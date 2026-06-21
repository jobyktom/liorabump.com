import {
  Baby,
  CalendarDays,
  Camera,
  Dumbbell,
  HeartPulse,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Utensils
} from "lucide-react";
import { blogArticles } from "@/lib/blog-content";

export const medicalDisclaimer =
  "LioraBump provides educational pregnancy and baby development information only. It does not replace advice from a doctor, midwife, paediatrician, or other qualified healthcare professional. If you have urgent concerns, seek medical help immediately.";

export const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pregnancy-tracker", label: "Tracker" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Sign in" }
];

export const featureCards = [
  {
    icon: CalendarDays,
    title: "Pregnancy tracker",
    text: "Week, trimester, due date countdown, appointments, scan reminders and support prompts."
  },
  {
    icon: HeartPulse,
    title: "Health hub",
    text: "Symptoms, blood pressure, medication reminders, questions for appointments and private document records."
  },
  {
    icon: Utensils,
    title: "Food and nutrition",
    text: "Safe food guidance, foods to avoid, hydration, cravings, shopping lists and labelled sponsor offers."
  },
  {
    icon: Dumbbell,
    title: "Exercise and wellbeing",
    text: "Trimester-based movement, breathing, pelvic floor reminders, sleep and mood check-ins."
  },
  {
    icon: Camera,
    title: "Memory album",
    text: "Bump photos, scan images, letters to baby, videos, voice notes and future printed album options."
  },
  {
    icon: UsersRound,
    title: "Couple mode",
    text: "Invite a partner, share checklists, sync reminders and receive practical support ideas."
  },
  {
    icon: Baby,
    title: "Beyond pregnancy",
    text: "Birth records, feeding, sleep, nappies, vaccinations, growth and milestone memories."
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Consent-led sharing, data export, account deletion and privacy-first product decisions."
  }
];

export const pregnancyWeeks = Array.from({ length: 42 }, (_, index) => {
  const week = index + 1;
  return {
    week,
    title: `Week ${week}`,
    baby: week < 5 ? "Early foundations are forming." : `Baby is developing new skills and growing steadily in week ${week}.`,
    body:
      week < 13
        ? "Hormonal changes may affect energy, appetite and mood."
        : week < 28
          ? "Many parents notice body changes, movement patterns and new appointment rhythms."
          : "Rest, preparation and regular checkups become increasingly important.",
    partner: "Offer practical help, listen carefully and join appointments where possible.",
    checklist: ["Review symptoms", "Plan questions for your midwife", "Capture a memory", "Rest and hydrate"],
    warning: "Contact your maternity unit or healthcare professional if you notice bleeding, severe pain, reduced movements later in pregnancy, fever, or anything that worries you."
  };
});

export const milestoneMonths = Array.from({ length: 25 }, (_, month) => ({
  month,
  title: month === 0 ? "Birth record" : `${month} month${month === 1 ? "" : "s"}`,
  summary:
    month === 0
      ? "Capture birth details, first photos, feeding preferences and family notes."
      : "Track feeding, sleep, growth, memories and development moments at your baby's pace.",
  prompts: ["Photo memory", "Growth note", "Feeding rhythm", "Family milestone"]
}));

export const blogPosts = blogArticles.map(({ slug, title, description, category }) => ({ slug, title, description, category }));

export const sponsorOffers = [
  { label: "Sponsored", title: "Hydration bottle bundle", brand: "Bloomwell", metric: "2.8k impressions" },
  { label: "Affiliate", title: "Hospital bag essentials", brand: "Nest & Navy", metric: "8.4% CTR" },
  { label: "Sponsored", title: "Trimester snack ideas", brand: "Peach Pantry", metric: "1.2k saves" }
];

export const appActions = [
  { icon: Camera, label: "Add photo" },
  { icon: NotebookPen, label: "Journal" },
  { icon: HeartPulse, label: "Symptom" },
  { icon: CalendarDays, label: "Appointment" },
  { icon: Sparkles, label: "Scan upload" }
];
