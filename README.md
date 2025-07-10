# Copywrit Dev

A modern AI-powered copywriting assistant built with Next.js, Convex, and Clerk authentication.

## Features

- 🔐 **Clerk Authentication** - Secure user authentication with email and social providers
- 💬 **AI Chat Interface** - Powered by Google's Gemini AI
- 📁 **Client Management** - Organize projects by client with custom contexts
- 🗃️ **File Upload & Context** - Upload files to provide context for better AI responses
- ⚡ **Real-time Updates** - Live chat with streaming responses
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd copywrit-dev
npm install
```

### 2. Set up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your API keys

### 3. Set up Convex

1. Install Convex CLI: `npm install -g convex`
2. Run: `npx convex dev`
3. Follow the setup instructions

### 4. Environment Variables

Create a `.env.local` file:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google AI (for chat functionality)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
```

### 5. Set Convex Environment Variables

In your Convex dashboard, add:
- `CLERK_SECRET_KEY`

### 6. Run the Application

```bash
# Terminal 1: Start Convex
npm run convex:dev

# Terminal 2: Start Next.js
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (chat)/            # Chat interface
│   ├── (main)/            # Landing page
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── main/              # Landing page components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities and services

convex/                    # Convex backend
├── schema.ts              # Database schema
├── users.ts               # User management
├── chats.ts               # Chat functionality
├── clients.ts             # Client management
└── files.ts               # File handling
```

## Authentication Flow

1. **Frontend**: Users authenticate via Clerk's UI components
2. **Middleware**: Routes are protected using Clerk middleware
3. **API Routes**: Clerk tokens validate API requests
4. **Database**: User profiles are automatically created in Convex

## Development

### Adding New Features

1. **Database Changes**: Update `convex/schema.ts`
2. **API Functions**: Add functions in `convex/` directory
3. **Frontend**: Create components in `src/components/`
4. **Routing**: Add pages in `src/app/`

### Key Commands

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run convex:dev      # Start Convex backend
npm run convex:codegen  # Generate TypeScript types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
