# TOKEN_EFFICIENCY.md — Varito Solutions
## Reduce Token Consumption + Prevent Hallucination | All Agents Read This

> **Why this matters:** Every token costs money and time. Agents that read entire files
> when they only need one function waste 80% of their context window. This doc gives
> every agent a strict discipline for efficient, accurate work.

---

## 🧠 Strategy 1 — Graphify (Knowledge Graph)

**What it is:** Graphify converts the entire codebase (code + DB schema + docs + configs)
into a queryable knowledge graph. Instead of reading files, agents query the graph.

**Result:** Up to 70–95% token reduction on codebase exploration tasks.

### Install Graphify (One-Time Per Computer)

```bash
# Install globally
npm install -g graphify-codebase

# Initialize at project root — builds the knowledge graph
cd /path/to/varito-solutions
graphify init

# Update graph after code changes
graphify update

# Query the graph (example)
graphify query "What tables does the orders API write to?"
graphify query "Which components use the Button component?"
graphify query "Where is payment signature verification done?"
```

### How Agents Must Use Graphify

**BEFORE reading any file, query the graph first:**

```bash
# WRONG — reads the whole file (expensive)
cat src/db/schema.ts

# RIGHT — queries only what you need (cheap)
graphify query "What columns does the orders table have?"

# WRONG — searches through many files
grep -r "aamarPay" src/

# RIGHT — graph already knows the relationships
graphify query "Where is aamarPay used in the codebase?"
```

### When to Update the Graph

```bash
# Run this after ANY file change before starting the next task
graphify update

# Shortcut — add to your post-commit hook
echo 'graphify update' >> .git/hooks/post-commit
```

---

## 🔍 Strategy 2 — Search Hierarchy (Tiered Lookup)

Agents must follow this order. **Never skip to a lower tier without trying the one above.**

```
Tier 1: LEXICAL (ripgrep) ─────── fastest, most token-efficient
         Use for: exact function names, variable names, import paths
         Command: rg "functionName" src/
         
Tier 2: GRAPH (graphify) ─────── for relationships and context
         Use for: "what depends on X", "what does Y write to"
         Command: graphify query "..."
         
Tier 3: STRUCTURAL (ast-grep) ── for code patterns
         Use for: "find all async functions that call db.insert"
         Command: ast-grep --pattern 'await db.insert($$$)'
         
Tier 4: SEMANTIC (read files) ── last resort only
         Use for: understanding logic that can't be described structurally
         Rule: read ONLY the specific function, not the whole file
```

**Never read an entire file when you only need one function.**

```bash
# WRONG — loads entire 400-line file
cat src/lib/aamarpay.ts

# RIGHT — loads only the function you need
rg -A 20 "verifySignature" src/lib/aamarpay.ts
```

---

## ✂️ Strategy 3 — Context Discipline Rules

### For EVERY agent — follow these always:

**Rule 1: Cap all list outputs**
```bash
# Always pipe long outputs through head
git log --oneline | head -20
ls src/components/ | head -30
npm list | head -50
```

**Rule 2: Read only the section you need**
```bash
# Use line numbers to read specific sections
sed -n '45,80p' src/db/schema.ts    # Read lines 45-80 only
```

**Rule 3: Never load node_modules or generated files**
```bash
# These are already in .gitignore and .graphifyignore
# Never run: cat node_modules/...
# Never run: cat .next/...
# Never run: cat drizzle/...  (generated migrations — use graphify instead)
```

**Rule 4: Use ripgrep with context limit**
```bash
# Limit context lines shown per match
rg -A 5 -B 2 "functionName" src/   # 5 lines after, 2 before — not whole file
```

**Rule 5: State what you're looking for before searching**
Before any search, write ONE sentence: "I need to find X because Y."
This prevents rabbit-hole searching and token waste.

---

## 📦 Strategy 4 — Prompt Caching (Claude Code Only)

Claude Code CLI supports Anthropic's prompt caching. Stable context placed at the
top of the conversation is cached and NOT re-billed on repeated calls.

**What gets cached automatically:**
- `CLAUDE.md` content (system prompt) — cached after first read
- Stable docs like `docs/DB_SCHEMA.md` if placed in system context

**How Claude agent should use this:**
1. Load `CLAUDE.md` ONCE at session start (cached)
2. Load `docs/DB_SCHEMA.md` ONCE (cached)
3. All subsequent turns reuse cached context at ~10% of original cost
4. Only load NEW files when actually needed for a specific task

---

## 🚫 Strategy 5 — Anti-Hallucination Checklist

These are the specific checks that prevent agents from inventing wrong code.

### Before writing ANY code:
- [ ] Did I read the actual file/function I'm modifying (not guess its structure)?
- [ ] Did I check `docs/API_SPEC.md` for the exact API contract?
- [ ] Did I check `docs/DB_SCHEMA.md` for the exact column names?
- [ ] Did I verify the import path exists (not invent it)?
- [ ] Did I check `docs/COMPONENT_REGISTRY.md` for the exact component name?

### Before installing any package:
- [ ] Did I verify the package name on npmjs.com (not guess it)?
- [ ] Did I check it's not already in `package.json`?
- [ ] Did I check the version is compatible with Next.js 15?

### For Gemini Flash specifically — THESE ARE YOUR KNOWN FAILURE MODES:

| Known Mistake | What to Do Instead |
|--------------|-------------------|
| Adding `"use client"` to fix errors | Check WHY the error occurs first. Server Components are default. Only add `"use client"` when using hooks/events. |
| Using Tailwind v3 class patterns | This project uses **Tailwind v4**. Read `docs/skills/tailwind.md` before writing ANY class. |
| Inventing shadcn component props | Run `npx shadcn@latest docs [component]` and fetch the docs BEFORE using any component. |
| Importing from wrong paths | Always check the actual file path with `rg "export.*ComponentName" src/` |
| Duplicating `"use client"` at top | Check if the directive already exists: `head -3 src/components/[file].tsx` |
| Using `space-y-*` for spacing | Always use `flex flex-col gap-*` — never `space-y-*` in this project |
| Using `w-10 h-10` for square sizing | Always use `size-10` shorthand |
| Hardcoding colors like `bg-blue-500` | Always use design tokens: `bg-primary`, `text-muted-foreground` etc. |
| Writing `any` type in TypeScript | STOP. Ask yourself what the type actually is. Check `src/types/`. |
| Generating code without reading existing file | ALWAYS `cat` the file first (use line ranges, not full file) |

---

## 📊 Strategy 6 — .graphifyignore File

Create this at project root (already in `.gitignore`):

```
# .graphifyignore — files excluded from knowledge graph
node_modules/
.next/
dist/
build/
drizzle/          # Generated SQL — DB_SCHEMA.md is the source of truth
*.test.ts
*.spec.ts
coverage/
.env*
*.lock
```

---

## 🔄 Strategy 7 — Session Reset Protocol

When a task is COMPLETE, reset context before starting the next one.

### Claude Code:
```
/clear    # Clears conversation history, keeps system prompt cached
```

### Gemini CLI:
```
/chat new    # Starts fresh conversation
```

**When to reset:**
- After completing a full feature (e.g., finished the orders API)
- When context is getting long (over ~40k tokens used)
- Before switching from one domain to another (e.g., frontend → backend)
- NEVER reset mid-task — you'll lose the working context

---

## 📈 Token Budget Awareness

Rough cost guide for this project:

| Action | Approx Tokens | Cost Rating |
|--------|--------------|-------------|
| `cat` a full 300-line file | ~1,500 | 🔴 Expensive |
| `graphify query "..."` | ~200 | 🟢 Cheap |
| `rg -A5 "name" src/` | ~300 | 🟢 Cheap |
| Reading `CLAUDE.md` (cached) | ~0 after 1st | 🟢 Free |
| `ls src/` | ~100 | 🟢 Cheap |
| Full session without reset | compounds | 🔴 Very Expensive |

**Target:** Keep average task under 10k tokens. Reset between tasks.

---

*Varito Solutions | Token Efficiency Guide | All agents follow this every session*
