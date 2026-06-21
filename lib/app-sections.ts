import {
  Baby,
  CalendarDays,
  Camera,
  CheckSquare,
  HeartHandshake,
  HeartPulse,
  NotebookPen,
  ScanLine,
  Settings,
  Timer,
  Utensils
} from "lucide-react";

export const appSections = {
  "health-tracker": {
    title: "Health tracker",
    icon: HeartPulse,
    description: "Track symptoms, blood pressure, medication reminders, questions for your midwife and private documents.",
    actions: ["Log symptom", "Add blood pressure", "Upload letter", "Export summary"]
  },
  "food-guide": {
    title: "Food guide",
    icon: Utensils,
    description: "Save safe food guidance, cravings, hydration, shopping lists and clearly labelled sponsor recipes.",
    actions: ["Add craving", "Save food", "Plan shopping", "Review avoid list"]
  },
  journal: {
    title: "Journal",
    icon: NotebookPen,
    description: "Write daily reflections, letters to baby, voice-note placeholders and weekly pregnancy memories.",
    actions: ["New entry", "Letter to baby", "Weekly reflection", "Export memories"]
  },
  "scan-uploads": {
    title: "Scan uploads",
    icon: ScanLine,
    description: "Keep scan images and reports organised privately with captions, dates and appointment notes.",
    actions: ["Upload scan", "Add caption", "Record scan date", "Share with partner"]
  },
  "kick-counter": {
    title: "Kick counter",
    icon: Timer,
    description: "Record movement sessions and see prompts about when to contact your maternity unit.",
    actions: ["Start session", "Save pattern", "Add note", "Emergency contact"]
  },
  "birth-plan": {
    title: "Birth plan",
    icon: CheckSquare,
    description: "Build preferences, hospital bag lists, journey-to-hospital notes and partner support tasks.",
    actions: ["Add preference", "Hospital bag", "Partner task", "Export plan"]
  },
  "baby-profile": {
    title: "Baby profile",
    icon: Baby,
    description: "Prepare birth records, feeding, sleep, nappy tracking, vaccinations and milestone memories.",
    actions: ["Birth record", "Feeding tracker", "Sleep tracker", "Milestone"]
  },
  calendar: {
    title: "Calendar",
    icon: CalendarDays,
    description: "Manage scans, midwife appointments, blood tests, reminders and partner notifications.",
    actions: ["Add appointment", "Scan reminder", "Question list", "Sync calendar"]
  },
  album: {
    title: "Photo album",
    icon: Camera,
    description: "Collect bump photos, baby photos, videos and future printed album exports.",
    actions: ["Add photo", "Create album", "Add caption", "Export book"]
  },
  "couple-sync": {
    title: "Couple sync",
    icon: HeartHandshake,
    description: "Share appointment questions, preparation tasks and practical support so pregnancy feels like a team effort.",
    actions: ["Add task", "Assign support", "Mark done", "Plan appointment"]
  },
  settings: {
    title: "Settings",
    icon: Settings,
    description: "Control privacy, consent, data export, account deletion and notification preferences.",
    actions: ["Privacy", "Notifications", "Export data", "Delete account"]
  }
} as const;

export type AppSectionSlug = keyof typeof appSections;
