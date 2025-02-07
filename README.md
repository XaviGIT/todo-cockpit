This is yet another Todo app, this time using the cockpit technique.
It separates the items into a maximum of 5 categories, one for each area of work/life defined by the user.
It allows also to mark the most valuable ones as important, assign due dates and labels.
Every Todo item should be writen as an actionable item.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Components Created:

- CategoryList (category selection)
- TodoList (main todo management)
- TodoItem (individual todo display/edit)
- DatePicker (due date selection)
- LabelPicker (label management)
- CategorySelect (category dropdown)

## Functionality Working:

- Add/complete todos
- Set due dates
- Mark as important
- Add/edit labels
- Filter by category
- Filter by status (ALL/ACTIVE/COMPLETED)

## Next Steps:

- Category editing in TodoItem
- Edit todo titles
- Connect to backend
- Persist data
- Add authentication
