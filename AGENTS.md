# AGENTS.md — Multi-Agent Coordination Guide
## Varito Solutions | Three-Agent System

> Read this if you are new to this project or starting from a different computer.
> This file explains the entire agent system — all three roles and how they interact.

---

## 🤖 The Three Agents

### Agent 1 — Gemini CLI (Design Agent)
| Property | Value |
|----------|-------|
| **Role name** | **Design** |
| **Tool** | Gemini CLI |
| **Model** | Gemini 2.5 Flash |
| **Domain** | Frontend only — UI components, pages, styling |
| **Config file** | `GEMINI.md` (root) |
| **Files it owns** | `src/components/`, `src/app/(shop)/`, `src/app/admin/` (UI only), `src/styles/` |
| **Start command** | `gemini` (in project root) |
| **Key strength** | Speed — rapid component and page iteration |
| **Does NOT touch** | `src/app/api/`, `src/lib/`, `src/db/`, `src/server/` |

### Agent 2 — Claude Code CLI (Backend + 2nd Inspector)
| Property | Value |
|----------|-------|
| **Role name** | **Backend + 2nd Inspector** |
| **Tool** | Claude Code CLI |
| **Model** | Claude Opus or Sonnet 4.6/4.7 |
| **Primary domain** | API routes, database, auth, payments, bug fixes |
| **2nd role** | Code inspection and fixing — reviews ALL code before it's marked done |
| **Config file** | `CLAUDE.md` (root) |
| **Files it owns** | `src/app/api/`, `src/lib/`, `src/db/`, `src/server/` |
| **Start command** | `claude` (in project root) |
| **Key strength** | Deep reasoning — architecture decisions, security, complex bugs |

### Agent 3 — Antigravity (Inspector)
| Property | Value |
|----------|-------|
| **Role name** | **Inspector** |
| **Tool** | Antigravity AI |
| **Domain** | Quality gate — inspects work from Gemini and Claude |
| **Does NOT write** | Production code — inspection and coordination only |
| **Approves** | All completed sections before work proceeds |
| **Reports to** | The user directly |
| **Key strength** | Unbiased cross-agent review — catches what each agent misses in its own work |

---

## 🔄 The Three-Agent Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER (Owner)                             │
│                    Approves every section                        │
└───────────────┬──────────────────────────┬───────────────────────┘
                │                          │
                │ reviews via              │ reviews via
                ▼                          ▼
┌──────────────────────┐      ┌────────────────────────┐
│   ANTIGRAVITY        │      │   ANTIGRAVITY          │
│   Inspector          │      │   Inspector            │
│   (checks frontend)  │      │   (checks backend)     │
└──────────┬───────────┘      └────────────┬───────────┘
           │ inspects                      │ inspects
           ▼                              ▼
┌──────────────────────┐      ┌────────────────────────┐
│   GEMINI CLI         │      │   CLAUDE CODE          │
│   Design Agent       │      │   Backend Agent        │
│                      │      │   + 2nd Inspector      │
│   Reads:             │      │   Reads:               │
│   GEMINI.md          │      │   CLAUDE.md            │
│   STATUS.md          │      │   STATUS.md            │
│   TASKS.md           │      │   TASKS.md             │
│   DESIGN_SYSTEM.md   │      │   API_SPEC.md          │
│                      │      │   DB_SCHEMA.md         │
└──────────┬───────────┘      └────────────┬───────────┘
           │                               │
    Builds frontend               Builds backend
    Commits to main               Commits to main
    Then asks Claude              Then marks done in
    to inspect frontend           TASKS.md
           │                               │
           └──────────────┬────────────────┘
                          │
                   SHARED REPOSITORY
                   (GitHub: main branch)
```

---

## 📋 Role Responsibilities — Detailed

### Design Agent (Gemini CLI) responsibilities:
- Build the entire frontend component library FIRST (before any page)
- Show all components at 4 breakpoints (375/768/1280/1440px) for user approval
- Assemble pages ONLY after component approval
- Follow `docs/DESIGN_SYSTEM.md` exactly — no invented colors or patterns
- After building each section, ask Claude (2nd Inspector) to review the code
- Fix any issues Claude reports before marking the task done

### Backend Agent (Claude Code) responsibilities:
- Implement all API routes, database schema, auth, payments
- Mark each completed API route as `[READY]` in `docs/API_SPEC.md`
- **2nd Inspector duties** — when Gemini finishes a section, review its code:
  - Check for TypeScript errors, Tailwind v4 violations, "use client" misuse
  - Check for wrong shadcn props, hardcoded colors, missing accessibility
  - Report: `✅ PASS` or `❌ ISSUES FOUND: [numbered list with file:line]`
- Fix bugs reported by the Inspector (Antigravity) or the user

### Inspector (Antigravity) responsibilities:
- Review completed sections from both agents before user approves them
- Run through the full inspection checklist (see `PROMPT.md → Inspector Prompt`)
- Report clearly: what passed, what failed, what needs fixing
- Does NOT write production code — only reports and coordinates
- Maintains `docs/TOKEN_EFFICIENCY.md` discipline across all agents

---

## 🚦 Section-by-Section Approval Gate

Every section of work goes through this gate before the next one starts:

```
Agent completes section
         ↓
Claude (2nd Inspector) reviews the code
         ↓
Claude reports: ✅ PASS or ❌ ISSUES
         ↓
    ┌────┴────┐
    │         │
  PASS      ISSUES
    │         │
    │      Agent fixes
    │      Claude re-reviews
    │         │
    └────┬────┘
         ↓
Antigravity (Inspector) does final check
         ↓
Inspector tells user: "Section ready for your review"
         ↓
User reviews → says "ok" or "change X"
         ↓
     ┌───┴───┐
     │       │
    "ok"   "change X"
     │       │
     │    Agent fixes
     │    Loop repeats
     ↓
Next section begins
```

**No section is marked `[x]` in TASKS.md until the user says "ok".**

---

## 📁 Full File Ownership Map

```
Root files (all agents read, human maintains):
├── STATUS.md          ← ALL agents update this
├── TASKS.md           ← ALL agents update this
├── AGENTS.md          ← Documentation (human maintains)
├── PROMPT.md          ← Master onboarding prompt (human uses)
├── GEMINI.md          ← Design agent config (human maintains)
├── CLAUDE.md          ← Backend agent config (human maintains)
├── ROADMAP.md         ← Human reference
└── TECH_STACK.md      ← Human reference

docs/ (reference — all agents read):
├── DESIGN_SYSTEM.md   ← Gemini primary, others read for context
├── API_SPEC.md        ← Claude primary, Gemini reads for data shapes
├── DB_SCHEMA.md       ← Claude primary, Gemini reads for types
├── COMPONENT_REGISTRY.md ← Gemini primary, Claude reads for inspection
├── ENV_VARS.md        ← Human reference (never commit values)
├── MCP_SERVERS.md     ← Both agents configure MCPs from this
├── TOKEN_EFFICIENCY.md ← ALL agents follow this always
└── SKILLS.md          ← Index — which skill doc to read before each task

docs/skills/ (expert knowledge — read before each type of work):
├── shadcn-ui.md, tailwind.md, mobile-design.md ← Gemini reads
├── drizzle-orm.md, neon-postgres.md ← Claude reads
├── api-design.md, security.md ← Claude reads
├── nextjs-patterns.md, nextjs-supabase-auth.md ← Both read
└── [+ 6 more — see docs/SKILLS.md]

src/ (code — strict ownership):
├── app/
│   ├── (shop)/        ← GEMINI ONLY
│   ├── admin/         ← GEMINI (UI) + CLAUDE (API)
│   └── api/           ← CLAUDE ONLY
├── components/        ← GEMINI ONLY
├── styles/            ← GEMINI ONLY
├── lib/               ← CLAUDE ONLY
├── db/                ← CLAUDE ONLY
├── server/            ← CLAUDE ONLY
└── types/             ← BOTH (coordinate before changes)
```

---

## 🛑 Conflict Resolution

If both agents need to change the same file:

1. Whoever gets there first adds a comment at the top: `// LOCKED: Gemini working 2026-05-22`
2. The other agent sees the lock and works on other tasks
3. When done, remove the lock comment and commit
4. Other agent then makes their changes

**For `src/types/` conflicts:** Gemini defines the shape, Claude reviews for API compatibility.
**For `package.json` conflicts:** Both list needed packages, Claude adds them all at once.

---

## 📝 Update Protocol

**After every work session — ALL agents:**

1. Update `TASKS.md`:
   - Mark completed tasks `[x]`
   - Add newly discovered tasks
   - Leave notes in Agent Notes section

2. Update `STATUS.md`:
   - Move completed items to "What's Done"
   - Update "Last Updated" date and agent name
   - Note any blockers

3. Commit:
   ```bash
   git add STATUS.md TASKS.md
   git commit -m "chore: update STATUS and TASKS after [session description]"
   git push origin main
   ```

---

## 🌍 Working from Different Computers

1. `git pull origin main` — always start fresh
2. `cat STATUS.md` — know exactly where the project is
3. `cat TASKS.md` — pick up your next task
4. `cat PROMPT.md` — paste master prompt into your agent
5. Work, commit, push
6. Next session from any computer = same starting point

**Required on every machine:**
- Node.js 20+
- Git
- Gemini CLI (`npm install -g @google/gemini-cli`) or Claude Code CLI (`npm install -g @anthropic/claude-code`)
- Access to `.env.local` (share via Bitwarden — NEVER via git)

---

## 🆕 New Computer Setup — Complete Checklist

```bash
# 1. Install Node.js v20 LTS — https://nodejs.org

# 2. Clone the repo
git clone https://github.com/SHAHID8142/varitosolutionsfinal2026plan-executions
cd varitosolutionsfinal2026plan-executions

# 3. Install your agent CLI
npm install -g @google/gemini-cli       # For Design work
npm install -g @anthropic/claude-code   # For Backend work

# 4. Get .env.local from Bitwarden
# Note: "Varito Solutions .env.local"
touch .env.local   # then paste contents

# 5. Install graphify (token efficiency tool)
npm install -g graphify-codebase
graphify init   # builds knowledge graph at project root

# 6. Pull latest code
git pull origin main

# 7. Verify
cat STATUS.md    # shows current phase
cat TASKS.md     # shows task queue
ls docs/skills/  # shows skill docs

# 8. Start your agent
gemini   # Design work — reads GEMINI.md automatically
# OR
claude   # Backend work — reads CLAUDE.md automatically
```

---

## ⚠️ Things That Will Break the System

1. **Committing `.env.local`** — NEVER. Share keys via Bitwarden only.
2. **Gemini touching `src/app/api/`** — breaks auth and payment security
3. **Claude touching `src/components/`** without coordination — design conflicts
4. **Both agents pushing to main simultaneously** — always `git pull` before push
5. **Not updating STATUS.md** — next session no agent knows what happened
6. **Building pages before component approval** — design will be inconsistent
7. **Not reading skill docs before starting work** — leads to hallucinated API usage
8. **Skipping Inspector review** — bugs ship to production

---

*Varito Solutions | Three-Agent System: Design + Backend + Inspector | 2026*
