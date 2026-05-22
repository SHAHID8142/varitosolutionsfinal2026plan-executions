# MCP_SERVERS.md — Varito Solutions
## Model Context Protocol Servers | Both Agents Configure These

> **What is MCP?**
> MCP (Model Context Protocol) gives AI agents direct, structured access to your tools and databases.
> Instead of copy-pasting database schemas or API docs into prompts, the agent can query them live.
> Think of it as a "USB-C port" — one standard interface that connects AI to anything.
>
> **Who uses MCPs here:**
> - Claude Code CLI has native MCP support (configure in `.mcp.json` at project root)
> - Gemini CLI uses MCP via tool configuration
> - Both agents should configure these BEFORE starting work

---

## 🚦 Priority — Set Up These MCPs First

| Priority | MCP Server | Why |
|----------|-----------|-----|
| 🔴 MUST HAVE | Neon Postgres | Agents can see live schema, run migrations, inspect DB |
| 🔴 MUST HAVE | Cloudflare | Deploy to Pages, manage R2, check KV |
| 🟡 HIGH | Supabase | Auth management, user inspection, RLS rules |
| 🟡 HIGH | GitHub | Read issues, create PRs, check CI status |
| 🟢 NICE | PostHog | See analytics, feature flags, error tracking |
| 🟢 NICE | Brevo | Check email delivery, manage templates |

---

## ⚙️ Configuration File

Create `.mcp.json` at the project root (this file is already in `.gitignore`):

```json
{
  "mcpServers": {
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon", "start"],
      "env": {
        "NEON_API_KEY": "${NEON_API_KEY}"
      }
    },
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "${CLOUDFLARE_API_TOKEN}",
        "CLOUDFLARE_ACCOUNT_ID": "${CLOUDFLARE_ACCOUNT_ID}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "posthog": {
      "type": "sse",
      "url": "https://mcp.posthog.com/mcp",
      "headers": {
        "Authorization": "Bearer ${POSTHOG_API_KEY}"
      }
    },
    "brevo": {
      "command": "npx",
      "args": ["-y", "@houtini/brevo-mcp"],
      "env": {
        "BREVO_API_KEY": "${BREVO_API_KEY}"
      }
    }
  }
}
```

---

## 🔑 Required API Keys for MCP

Add these to your `.env.local` file (already tracked in `docs/ENV_VARS.md`):

```bash
# MCP Server Keys (DO NOT COMMIT)
NEON_API_KEY=          # Neon Dashboard → Settings → API Keys
CLOUDFLARE_API_TOKEN=  # Cloudflare → My Profile → API Tokens → Create Token
CLOUDFLARE_ACCOUNT_ID= # Cloudflare → Right sidebar (any page)
SUPABASE_ACCESS_TOKEN= # supabase.com → Account → Access Tokens
GITHUB_PERSONAL_ACCESS_TOKEN= # GitHub → Settings → Developer settings → PAT
POSTHOG_API_KEY=       # PostHog → Settings → API Keys
BREVO_API_KEY=         # Brevo → My Account → SMTP & API → API Keys
```

---

## 📦 Installation (One-Time Per Computer)

```bash
# Claude Code CLI — MCPs configured automatically from .mcp.json
# Just start claude: it reads .mcp.json at startup

# Verify MCP servers are running (Claude Code CLI)
claude mcp list

# Test a specific MCP server connection
claude mcp test neon

# Gemini CLI — run this once to enable MCP support
gemini --mcp-config .mcp.json
```

---

## 🧠 What Each Agent Uses MCPs For

### Claude Code Agent
| Task | MCP Used | What It Does |
|------|---------|--------------|
| Write DB schema | **Neon** | Inspect existing tables, columns, indexes live |
| Run migrations | **Neon** | Create branches, apply schema, verify changes |
| Debug auth | **Supabase** | Inspect user records, check RLS policies |
| Deploy to production | **Cloudflare** | Trigger Pages deploy, check worker status |
| Debug production errors | **PostHog** | Pull recent errors, session replays, funnel data |
| Check email delivery | **Brevo** | Verify transactional emails sent correctly |
| Coordinate with Gemini | **GitHub** | Read issues, check PR status |

### Gemini Flash Agent
| Task | MCP Used | What It Does |
|------|---------|--------------|
| Check which APIs are ready | **GitHub** | Read TASKS.md status in issues |
| Verify deployment | **Cloudflare** | Check Pages build status |
| Check page analytics | **PostHog** | See which pages users actually visit |

---

## 🛡️ Security Rules for MCPs

1. **Never connect MCPs with write access to production DB** — use Neon branches
2. **Use read-only scopes** where possible — only give agents what they need
3. **The `.mcp.json` file IS in `.gitignore`** — verify this before any push
4. **API keys are loaded from `.env.local`** — never hardcoded in `.mcp.json`
5. **Rotate MCP API keys** if you suspect they were exposed

---

## 🔄 Per-Session MCP Workflow

### Agent (Claude) — Start of Every Session:
```bash
# 1. Verify MCP servers are online
claude mcp list

# 2. Check live DB schema (via Neon MCP)
# Just ask: "Show me the current database schema"
# Claude will use the Neon MCP to fetch it live

# 3. Check Cloudflare Pages status
# Ask: "What's the current deployment status on Cloudflare Pages?"
```

---

## 📖 Learn More Before Configuring

Both agents must READ these before configuring any MCP:

| Documentation | Read At |
|--------------|---------|
| Neon MCP docs | https://neon.tech/docs/ai/neon-mcp-server |
| Cloudflare MCP guide | https://developers.cloudflare.com/mcp |
| Supabase MCP guide | https://supabase.com/blog/mcp-server |
| MCP Inspector (testing tool) | https://modelcontextprotocol.io/docs/tools/inspector |

> **Rule: Always read the official MCP docs for a service BEFORE installing its MCP server.**
> Never assume configuration — each MCP has different auth patterns and scopes.

---

*Varito Solutions | MCP Configuration Guide | Both agents configure before starting work*
