# Todo Cockpit

Todo Cockpit is a productivity application that helps you organize your tasks in a focused, efficient way. It implements the "cockpit technique" which limits you to a maximum of 5 categories, encouraging you to prioritize and simplify task management.

![Todo Cockpit Screenshot](public/screenshot.png)

## Core Features

- **Category Management**: Organize tasks in up to 5 customizable categories plus an Inbox
- **Important Tasks View**: Filter to see all important tasks across categories
- **Due Dates**: Set and track deadlines for your tasks
- **Labels**: Create and assign color-coded labels to categorize tasks further
- **Task Status**: Mark tasks as active or completed
- **Drag & Drop**: Reorder categories and tasks intuitively
- **Statistics Dashboard**: Get insights on your productivity metrics

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/todo-cockpit.git
   cd todo-cockpit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory with:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/todocockpit"
   ```

4. Initialize the database:

   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- **Frontend**: React, Next.js 15, TailwindCSS
- **State Management**: TanStack React Query
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (to be implemented)

## Project Structure

- `/src/app` - Next.js pages and API routes
- `/src/components` - React components
- `/src/types` - TypeScript interfaces
- `/src/lib` - Utility functions and libraries
- `/src/hooks` - Custom React hooks
- `/prisma` - Database schema and migrations

## Contributing

Contributions are welcome! Please check our [ROADMAP.md](ROADMAP.md) for future plans and enhancement ideas.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- This project was built using Next.js 15 and TailwindCSS
- Todo Cockpit is inspired by productivity techniques that focus on simplification and focus
