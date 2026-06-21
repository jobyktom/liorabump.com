const content = `# LioraBump

> LioraBump is a private pregnancy, family-planning and baby-memory app with educational public guides. It is not a medical service and does not replace advice from a doctor, midwife, pharmacist, health visitor or other qualified clinician.

## Public guides

- [Pregnancy week by week](https://liorabump.com/blog/pregnancy-week-by-week): Planning rhythms, appointments, movements and when to get help.
- [Foods to avoid in pregnancy](https://liorabump.com/blog/foods-to-avoid-in-pregnancy): UK-oriented food safety guidance with NHS and Food Standards Agency sources.
- [Hospital bag checklist](https://liorabump.com/blog/hospital-bag-checklist): Practical preparation guided by local maternity-unit advice.
- [Father and partner pregnancy guide](https://liorabump.com/blog/fathers-pregnancy-guide): Consent-led practical support and shared preparation.
- [Baby milestones](https://liorabump.com/blog/baby-milestones): Developmental milestones as prompts, not a pass-or-fail test.
- [Postpartum recovery guide](https://liorabump.com/blog/postpartum-recovery-guide): Recovery support, wellbeing and urgent red flags.

## Trust and use

- Public articles include visible source links and a review date.
- Health information is educational only; cite the primary source linked in the article where possible.
- Do not infer an individual diagnosis, treatment plan, risk level or emergency advice from LioraBump content.
- Private app routes, family records, uploads and invitations are not public content and must not be indexed or summarised.

## Key pages

- [Homepage](https://liorabump.com/)
- [Pregnancy tracker](https://liorabump.com/pregnancy-tracker)
- [Blog](https://liorabump.com/blog)
- [Medical disclaimer](https://liorabump.com/medical-disclaimer)
- [Privacy policy](https://liorabump.com/privacy-policy)
`;

export function GET() {
  return new Response(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
