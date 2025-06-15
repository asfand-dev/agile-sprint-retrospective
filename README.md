# Agile Sprint Retrospective

A modern, collaborative retrospective tool for agile teams to reflect on sprints, track action items, and improve team performance in real-time.

## 🚀 Features

- **Real-time Collaboration**: Multiple participants can join retrospective sessions simultaneously
- **Structured Retrospectives**: Organize feedback into "What Went Well", "What Could Improve", and "What Should We Start" columns
- **Action Item Tracking**: Create and track action items from retrospective discussions
- **Voting System**: Team members can vote on retrospective items and action items to prioritize discussions
- **Session Management**: Create password-protected workspaces for team retrospectives
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Live updates using Supabase real-time subscriptions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI Components
- **Backend**: Supabase (PostgreSQL + Real-time)
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives with custom styling

## 📋 Prerequisites

- Node.js 18+ or Bun
- Supabase account and project
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd agile-sprint-retrospective
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the Supabase dashboard
3. Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Database Migrations

Apply the database schema using the Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Start Development Server

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
agile-sprint-retrospective/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components (Radix UI)
│   │   ├── AddRetroItemForm.tsx
│   │   ├── ActionItemCard.tsx
│   │   ├── CreateWorkspaceForm.tsx
│   │   ├── JoinWorkspaceForm.tsx
│   │   ├── RetroColumn.tsx
│   │   └── ...
│   ├── data/retro/        # Data layer for retrospectives
│   │   ├── api.ts         # API functions
│   │   └── types.ts       # TypeScript types
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions
│   └── pages/             # Route components
│       ├── Index.tsx      # Landing page
│       ├── Workspace.tsx  # Workspace management
│       ├── Retro.tsx      # Retrospective session
│       └── NotFound.tsx   # 404 page
├── supabase/
│   └── migrations/        # Database schema migrations
├── package.json
└── vite.config.ts
```

## 🎯 How to Use

### Creating a Workspace

1. Visit the application homepage
2. Click "Create Workspace"
3. Enter a workspace name and password
4. Share the workspace details with your team

### Joining a Retrospective

1. Get workspace credentials from your team lead
2. Click "Join Workspace" on the homepage
3. Enter the workspace name and password
4. Enter your name to join the session

### Running a Retrospective

1. Create a new retrospective within your workspace
2. Team members add items to three columns:
   - **What Went Well**: Positive aspects of the sprint
   - **What Could Improve**: Areas needing improvement
   - **What Should We Start**: New practices to adopt
3. Vote on items to prioritize discussion
4. Create action items for follow-up tasks
5. Vote on action items to determine priority

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application uses the following main tables:

- **sessions**: Workspace/session information
- **session_participants**: Users in each session  
- **retros**: Individual retrospective meetings
- **retro_items**: Feedback items categorized by column type
- **action_items**: Follow-up tasks from retrospectives

## 🔒 Security Considerations

- Workspace passwords are currently stored as plain text (⚠️ **Note**: This should be hashed in production)
- Row Level Security (RLS) is enabled but currently allows public access
- Consider implementing proper authentication for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing problems
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🚧 Roadmap

- [ ] Implement password hashing for security
- [ ] Add user authentication
- [ ] Export retrospective reports
- [ ] Email notifications for action items
- [ ] Sprint metrics and analytics
- [ ] Mobile app support
- [ ] Integration with Jira/Azure DevOps

---

Built with ❤️ for agile teams everywhere
