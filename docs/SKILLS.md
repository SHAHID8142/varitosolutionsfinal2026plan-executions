# SKILLS.md — Varito Solutions
## Installed Skills Reference | Both Agents Read This

> **HOW SKILLS WORK FOR THIS PROJECT:**
> These skill docs are stored in `docs/skills/` so ALL computers get them via `git pull`.
> Skills give agents specific expert knowledge for common tasks.
> Each agent should read the relevant skill file BEFORE doing that type of work.
>
> **On a new computer:** Just run `git pull` — skills are already in the repo. No separate install needed.

---

## When Agents Should Use Skills

| Task You Are Doing | Read This Skill File |
|---------------------|----------------------|
| Writing DB schema or queries | `docs/skills/drizzle-orm.md` |
| Setting up/querying Neon DB | `docs/skills/neon-postgres.md` |
| Adding/using shadcn/ui components | `docs/skills/shadcn-ui.md` |
| Building Next.js pages or API routes | `docs/skills/nextjs-patterns.md` |
| Auth with Supabase (phone OTP) | `docs/skills/nextjs-supabase-auth.md` |
| Cloudflare Pages or R2 | `docs/skills/cloudflare.md` |
| Mobile-first UI design | `docs/skills/mobile-design.md` |
| Finding and fixing bugs | `docs/skills/debugging.md` |
| Writing or reviewing API specs | `docs/skills/api-design.md` |
| Security review | `docs/skills/security.md` |
| SEO (meta tags, structured data) | `docs/skills/seo.md` |
| Code review before committing | `docs/skills/code-review.md` |
| Setting up Brevo email | `docs/skills/brevo.md` |
| Payment integration (aamarPay) | `docs/skills/payment-integration.md` |
| Courier booking (Steadfast/Pathao/RedX) | `docs/skills/courier-integration.md` |
| Tailwind CSS styling | `docs/skills/tailwind.md` |
| **Starting ANY coding work** | `docs/CODING_STANDARDS.md` (not a skill — a rule file) |

---

## Skill Files in This Repo (`docs/skills/`)

All files below are extracted from the installed skill library and adapted for this project:

| File | Source Skill | Agent |
|------|-------------|-------|
| `drizzle-orm.md` | `drizzle-orm-expert` | Claude |
| `neon-postgres.md` | `neon-postgres` | Claude |
| `shadcn-ui.md` | `shadcn` | Gemini |
| `nextjs-patterns.md` | `nextjs-best-practices` + `nextjs-app-router-patterns` | Both |
| `nextjs-supabase-auth.md` | `nextjs-supabase-auth` | Claude |
| `cloudflare.md` | `cloudflare-workers-expert` | Claude |
| `mobile-design.md` | `mobile-design` | Gemini |
| `debugging.md` | `systematic-debugging` + `error-diagnostics-smart-debug` | Both |
| `api-design.md` | `api-design-principles` | Claude |
| `security.md` | `api-security-best-practices` + `backend-security-coder` | Claude |
| `seo.md` | `seo-fundamentals` + `nextjs-best-practices` | Gemini |
| `code-review.md` | `code-review-checklist` + `clean-code` | Both |
| `brevo.md` | `brevo-automation` + `email-systems` | Claude |
| `payment-integration.md` | aamarPay-specific (rewritten for this project) | Claude |
| `courier-integration.md` | Steadfast + Pathao + RedX (project-specific) | Claude |
| `tailwind.md` | `tailwind-patterns` | Gemini |

---

## Install Skills on a New Computer (One Command)

These skills are now IN the git repo — no external install needed.
Simply:

```bash
git clone https://github.com/SHAHID8142/varitosolutionsfinal2026plan-executions
cd varitosolutionsfinal2026plan-executions
# All skills are in docs/skills/ — ready to use
```

---

## How Agents Should Use These Skills

### Gemini Flash Agent
Before ANY coding session, read:
```
cat docs/CODING_STANDARDS.md      # File structure, comment rules — EVERY session
```
Before building a component or page, also read:
```
cat docs/skills/shadcn-ui.md
cat docs/skills/mobile-design.md
cat docs/skills/tailwind.md
```

### Claude Code Agent
Before ANY coding session, read:
```
cat docs/CODING_STANDARDS.md      # File structure, comment rules — EVERY session
```
Before writing an API route or DB query, also read:
```
cat docs/skills/drizzle-orm.md
cat docs/skills/neon-postgres.md
cat docs/skills/api-design.md
```

Before writing any security-sensitive code:
```
cat docs/skills/security.md
```

Before debugging any error:
```
cat docs/skills/debugging.md
```

---

*Updated: 2026-05-22 | Skills are part of the repo — always up to date*
