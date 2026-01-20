# Evangelism Onboarding Platform

A React-based onboarding platform for evangelism training with user management, topic learning, and progress tracking.

## Features

- User authentication with Supabase
- Admin dashboard for user and content management
- Interactive learning topics with quizzes
- Progress tracking and messaging system
- Multi-language support (English, Amharic, Oromo, Tigrinya)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## Project Structure

- `/components` - React components
  - `/ui` - Reusable UI components
  - `/figma` - Figma-specific components
- `/services` - API and Supabase services
- `/utils` - Utility functions and configurations
- `/data` - Mock data and constants
- `/types.ts` - TypeScript type definitions

## Configuration

The project uses Supabase for backend services. Configuration is handled through the `utils/supabase/info.tsx` file.