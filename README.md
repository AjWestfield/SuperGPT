# SuperGPT

An AI-powered search engine with a generative UI based on the Morphic project.

![capture](/public/screenshot-2025-05-04.png)

## 🗂️ Overview

- 🛠 [Features](#-features)
- 🧱 [Stack](#-stack)
- 🚀 [Quickstart](#-quickstart)
- 🔎 [Current Configuration](#-current-configuration)
- ⏪ [How to Revert](#-how-to-revert)
- 🌐 [Deploy](#-deploy)

## 🛠 Features

### Core Features

- AI-powered search with GenerativeUI
- Natural language question understanding
- Multiple search providers support (Tavily, SearXNG, Exa)
- Model selection from UI (switch between available AI models)
  - Reasoning models with visible thought process

### Chat & History

- Chat history functionality (Enabled)
- Share search results (Enabled)
- Redis support (Local)

### AI Providers

The following AI providers are supported:

- OpenAI (Default - Currently configured)
- Google Generative AI
- Azure OpenAI
- Anthropic
- Ollama
- Groq
- DeepSeek
- Fireworks
- xAI (Grok)
- OpenAI Compatible

Models are configured in `public/config/models.json`. Each model requires its corresponding API key to be set in the environment variables.

### Search Capabilities

- URL-specific search
- Video search support (Optional)
- SearXNG integration (Currently configured) with:
  - Customizable search depth (basic/advanced)
  - Configurable engines
  - Adjustable results limit
  - Safe search options
  - Custom time range filtering

## 🧱 Stack

### Core Framework

- [Next.js](https://nextjs.org/) - App Router, React Server Components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - Text streaming / Generative UI

### AI & Search

- [OpenAI](https://openai.com/) - Default AI provider
- [SearXNG](https://docs.searxng.org/) - Currently configured search provider

### Data Storage

- [Redis](https://redis.io/) - Local Redis for chat history

### UI & Styling

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

## 🔎 Current Configuration

The application is currently configured with:

1. **OpenAI Integration**
   - API Key: Configured in .env.local
   - Models available: All OpenAI models

2. **SearXNG Search Provider**
   - Running locally via Docker on port 8080
   - Configured with Google, Bing, DuckDuckGo, and Wikipedia engines
   - Maximum results: 50
   - Default search depth: basic

3. **Chat History**
   - Enabled with local Redis storage
   - Share functionality enabled

4. **Docker Configuration**
   - Modified to run SearXNG and Redis only
   - Original morphic service removed for local development

## ⏪ How to Revert

To revert to this exact working version:

```bash
# Clone the repository
git clone https://github.com/AjWestfield/SuperGPT.git

# Navigate to the directory
cd SuperGPT

# Checkout the tagged version
git checkout websearch-and-openai-working

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your API keys:
# - OPENAI_API_KEY=your_openai_key
# - TAVILY_API_KEY=your_tavily_key (though SearXNG is configured as primary)

# Configure SearXNG settings in .env.local:
# - SEARCH_API=searxng
# - SEARXNG_SECRET=generate_a_secret_with_openssl_rand_-base64_32
# - Other SearXNG settings are pre-configured

# Start Docker containers for Redis and SearXNG
docker compose up -d

# Install dependencies
bun install

# Start the application
bun dev
```

The application should now be accessible at http://localhost:3000 (or next available port).

## 🌐 Deploy

Host your own live version of SuperGPT with Vercel, Cloudflare Pages, or Docker.

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAjWestfield%2FSuperGPT)

When deploying to Vercel, ensure that:
1. Your API keys are added to environment variables
2. For SearXNG, either configure a publicly accessible SearXNG instance or switch to Tavily

### Docker

For Docker deployment, use the included docker-compose.yaml file:

```bash
docker compose up -d
```

This will start the Redis and SearXNG containers. The SearXNG settings are already configured in the .env.local file.