# AGENTS.md — Multi-Agent Coordination Guide
## Varito Solutions | How Gemini + Claude Work Together

> Read this if you are new to this project or starting from a different computer.
> This file explains the entire agent system.

---

## 🤖 The Two Agents

### Agent 1 — Gemini Flash (UI/UX)
| Property | Value |
|----------|-------|
| **Tool** | Gemini CLI |
| **Model** | Gemini 2.5 Flash |
| **Domain** | Frontend, UI components, pages, styling |
| **Config file** | `GEMINI.md` (root) |
| **Files it owns** | `src/components/`, `src/app/(shop)/`, `src/app/admin/` (UI only), `src/styles/` |
| **Start command** | `gemini` (in project root) |
| **Key strength** | Speed — rapid component iteration |

### Agent 2 — Claude Code (Backend)
| Property | Value |
|----------|-------|
| **Tool** | Claude Code CLI |
| **Model** | Claude Opus or Sonnet 4.6/4.7 |
| **Domain** | API routes, database, payments, auth, bug fixes |
| **Config file** | `CLAUDE.md` (root) |
| **Files it owns** | `src/app/api/`, `src/lib/`, `src/db/`, `src/server/` |
| **Start command** | `claude` (in project root) |
| **Key strength** | Deep reasoning — complex logic, security, bugs |

---

## 📋 How to Start a Session (Any Computer, Any Agent)

### Step 1 — Get Latest Code
```bash
cd /path/to/project
git pull origin main
```

### Step 2 — Check Status
```bash
cat STATUS.md          # What phase are we in? What's done?
cat TASKS.md           # What needs to be done next?
```

### Step 3 — Start Your Agent
```bash
# For UI/UX work:
gemini                 # Gemini CLI reads GEMINI.md automatically

# For backend work:
claude                 # Claude Code reads CLAUDE.md automatically
```

### Step 4 — Agent Reads Its Config
Both CLIs auto-load their respective `.md` files. The agent will know:
- The project context
- What it's responsible for
- What to build next (from TASKS.md)
- What's already built (from STATUS.md)

---

## 🔄 Workflow Between Agents

```
┌─────────────────────────────────────────────────────────┐
│                    SHARED REPOSITORY                    │
│                  (GitHub: main branch)                  │
└────────────────┬────────────────────┬───────────────────┘
                 │                    │
         ┌───────▼──────┐    ┌───────▼──────┐
         │  GEMINI CLI  │    │ CLAUDE CODE  │
         │  Flash Model │    │ Opus/Sonnet  │
         │              │    │              │
         │  Reads:      │    │  Reads:      │
         │  GEMINI.md   │    │  CLAUDE.md   │
         │  STATUS.md   │    │  STATUS.md   │
         │  TASKS.md    │    │  TASKS.md    │
         │  DESIGN.md   │    │  API_SPEC.md │
         └──────┬───────┘    └──────┬───────┘
                │                   │
         Builds frontend      Builds backend
         Commits to main      Commits to main
                │                   │
                └────────┬──────────┘
                         │
                  Updates STATUS.md
                  Updates TASKS.md
                  git push origin main
```

---

## 📁 Full File Ownership Map

```
Root files (both agents read, human maintains):
├── STATUS.md          ← BOTH agents update this
├── TASKS.md           ← BOTH agents update this
├── AGENTS.md          ← Documentation (do not edit)
├── GEMINI.md          ← Gemini agent reads + human maintains
├── CLAUDE.md          ← Claude agent reads + human maintains
├── ROADMAP.md         ← Human reference (do not modify)
└── TECH_STACK.md      ← Human reference (do not modify)

docs/ (reference — both agents read):
├── DESIGN_SYSTEM.md   ← Gemini primary, Claude reads for context
├── API_SPEC.md        ← Claude primary, Gemini reads for data shapes
├── DB_SCHEMA.md       ← Claude primary, Gemini reads for types
├── COMPONENT_REGISTRY.md ← Gemini primary, human reviews
└── ENV_VARS.md        ← Human reference

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

## 🚦 The Approval Gate

The one point where human approval is REQUIRED before proceeding:

```
Gemini finishes component library
           ↓
Gemini opens /component-preview in browser
           ↓
Gemini tells human: "Please review at localhost:3000/component-preview"
           ↓
Human reviews every component
           ↓
    ┌──────┴──────┐
    │             │
"approved"    "change X, Y, Z"
    │             │
    │          Gemini fixes
    │          Human reviews again
    ↓             │
Gemini starts     └── (loop until approved)
building pages
```

**Neither agent proceeds to pages until the user says "approved".**

---

## 🛑 Conflict Resolution

If both agents need to change the same file:

1. Whoever gets there first — add a comment at the top of the file: `// LOCKED: Gemini working 2026-05-22`
2. The other agent sees the lock and works on other tasks
3. When done, remove the lock comment and commit
4. Other agent then makes their changes

**For `src/types/` conflicts:** Gemini defines the shape, Claude reviews for API compatibility.
**For `package.json` conflicts:** Coordinate — both list needed packages, Claude adds them all at once.

---

## 📝 Update Protocol

**After every work session:**

1. Update `TASKS.md`:
   - Mark completed tasks as `[x]`
   - Add new discovered tasks
   - Leave notes in "Agent Notes" section if needed

2. Update `STATUS.md`:
   - Move completed items to "What's Done"
   - Update "Last Updated" date and agent name
   - Note any blockers

3. Commit everything:
   ```bash
   git add STATUS.md TASKS.md
   git commit -m "chore: update STATUS and TASKS after [session description]"
   git push origin main
   ```

---

## 🌍 Working from Different Computers

This system is designed to work seamlessly across locations:

1. `git pull origin main` — always start fresh
2. `cat STATUS.md` — know exactly where the project is
3. `cat TASKS.md` — pick up your next task
4. Start your CLI tool — it reads its config file
5. Work, commit, push
6. Next session from any computer = same starting point

**Required on every machine:**
- Node.js 20+
- Git
- Gemini CLI (`npm install -g @google/gemini-cli`) or Claude Code CLI (`npm install -g @anthropic/claude-code`)
- Access to `.env.local` (share securely, NOT via git — use a password manager)

---

## 🆕 New Computer Setup — Complete Checklist

Run this ONCE on any new computer before starting work:

```bash
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org (v20 LTS)

# 2. Clone the repo
git clone https://github.com/SHAHID8142/varitosolutionsfinal2026plan-executions
cd varitosolutionsfinal2026plan-executions

# 3. Install your agent CLI tool
npm install -g @google/gemini-cli    # For Gemini UI/UX work
npm install -g @anthropic/claude-code # For backend/Claude work

# 4. Get your .env.local file
# Open your Bitwarden (password manager)
# Find the note: "Varito Solutions .env.local"
# Create the file: touch .env.local
# Paste the contents in

# 5. Pull latest code
git pull origin main

# 6. Verify everything is there
cat STATUS.md    # Should show project status
cat TASKS.md     # Should show task list
ls docs/skills/  # Should list 15 skill files

# 7. Start your agent
gemini   # Opens Gemini CLI (reads GEMINI.md automatically)
# OR
claude   # Opens Claude Code CLI (reads CLAUDE.md automatically)
```

**Skills are already in the repo** — no separate skill install needed.
All 15 skill docs are in `docs/skills/` and come with the git clone.

---

## 🧰 Skills in This Project

All skill knowledge docs are stored in `docs/skills/` and pushed to git.
Every new computer gets them automatically with `git pull`.

See `docs/SKILLS.md` for the full list and when to use each one.

---

## ⚠️ Things That Will Break the System

1. **Committing `.env.local`** — NEVER. It's in `.gitignore`. Share keys via password manager.
2. **Gemini touching API routes** — It will break auth/payment logic
3. **Claude touching `src/components/`** without Gemini coordination — style conflicts
4. **Both agents pushing to main simultaneously** — do a `git pull` before every push
5. **Not updating STATUS.md** — next session the agent won't know what happened
6. **Building pages before component approval** — design will be inconsistent

---

*Varito Solutions | Multi-Agent Coordination | 2026*
