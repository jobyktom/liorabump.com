# LioraBump SEO, Agent Optimisation and Growth Loop

This loop is designed to grow qualified search traffic and free-account signups without spam, misleading health claims or low-value AI publishing.

## One-Time Setup

### Google Search Console

1. Open Google Search Console: https://search.google.com/search-console
2. Add `liorabump.com` as a **Domain property** if you can edit DNS, or as a **URL-prefix property** for `https://liorabump.com`.
3. For URL-prefix meta-tag verification, copy only the `content` token from Google's verification tag.
4. Add it in Hostinger as:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-token
```

5. Rebuild/redeploy the app.
6. In Search Console, click **Verify**.
7. After verification, submit:

```text
https://liorabump.com/sitemap.xml
```

8. Inspect these key URLs and request indexing after deployment:

```text
https://liorabump.com/
https://liorabump.com/pregnancy-tracker
https://liorabump.com/due-date-calculator
https://liorabump.com/blog/hospital-bag-checklist
https://liorabump.com/blog/pregnancy-week-by-week
```

### Google Analytics 4

The app already supports GA4 through:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-C3E0HT2PPE
```

Analytics loads only after consent. Track weekly:

- Public landing page views
- `begin_signup`
- `sign_up`
- `due_date_calculator_signup_click`
- Organic traffic to signup conversion
- Blog and pregnancy-week pages that assist signups

### Agent-Readable Optimisation

Already implemented:

- `/sitemap.xml`
- `/robots.txt`
- `/llms.txt`
- Schema.org `Organization`, `WebSite`, `SoftwareApplication` and `Product`
- Medical disclaimer and privacy pages

Keep `/llms.txt` factual, concise and explicit that private app data must not be indexed or summarised.

## Weekly Growth Loop

Run this loop every Monday or after each meaningful content release.

### 1. Measure

Inputs:

- Search Console: clicks, impressions, CTR, average position by query/page
- GA4: organic landing pages, signup starts, signup completions
- Stripe/app: free-account and paid-plan conversion, if available

Output:

- 5 pages with high impressions and low CTR
- 5 pages ranking positions 4-20
- 3 queries with strong signup intent
- Technical errors: not indexed, 404s, sitemap issues, page experience warnings

### 2. Improve One Existing Asset

Pick one page, not ten. Improve:

- Title tag and meta description
- First-screen clarity
- Internal links to `/signup`, `/due-date-calculator`, `/pregnancy-tracker` or the relevant blog guide
- Source links and review date for health content
- One restrained CTA

Success measure:

- CTR improvement after 14-28 days
- Organic signup lift from that page

### 3. Create One Useful Content Asset

Prefer intent-led resources that match product value:

- Printable hospital bag checklist
- Pregnancy appointment questions by trimester
- Partner support checklist by week
- Due date calculator guide
- Safe food guide with country-specific source links
- Scan appointment preparation checklist

Every article must include:

- Evidence/source plan
- Medical disclaimer
- Review/update date
- One natural product CTA
- Internal links to related tools

### 4. Earn Visibility Without Spam

Build a shortlist of 5-10 relevant opportunities:

- Parenting publications
- Antenatal class providers
- Midwife/doula blogs
- Pregnancy newsletter creators
- Local family directories
- Founder-story podcasts
- Pregnancy product partners with clear sponsorship disclosure

Prepare drafts only. Do not submit automatically.

For each opportunity record:

- Site/person
- Audience fit
- Proposed contribution
- Submission/contact URL
- Suggested LioraBump destination URL with UTM
- Quality/risk note
- Status: researched, drafted, approved, sent, replied, published, measured

### 5. Distribute Approved Assets

Allowed after owner approval:

- Submit a guest article or founder story through official submission forms
- Send a personalised email to a named editor/creator
- Share a useful resource in relevant communities only when rules allow it
- Repurpose an article into LinkedIn, Pinterest, Instagram or email content

Not allowed:

- Mass submissions
- Link farms
- Paid dofollow link schemes
- Fabricated testimonials
- Fake comments or community posts
- Medical claims without primary sources

### 6. Report

Produce a short weekly report:

- What changed
- What shipped
- What needs approval
- Search Console/GA4 movement
- Signups and conversion
- Next 7-day action list

## Current 7-Day Execution Plan

1. Verify Search Console and submit `/sitemap.xml`.
2. Confirm GA4 Realtime receives a page view after accepting analytics consent.
3. Publish or improve one lead magnet landing path around the hospital bag checklist.
4. Prepare 5 outreach pitches for pregnancy/parenting publications; do not send until approved.
5. Add one internal link block from blog posts to `/due-date-calculator` and `/signup`.
6. Review Search Console indexing after 48-72 hours.

## First Outreach Themes

Use these as approval-ready content angles:

- "A calm hospital bag checklist that avoids overbuying"
- "How partners can support pregnancy without taking over"
- "Why pregnancy tracking should include appointments, memories and consent"
- "A privacy-first pregnancy app for modern families"
- "Founder story: building LioraBump after seeing how fragmented pregnancy planning can feel"
