# JaxerWeb - Chat Bot Assistant

A modern web application with AI chat capabilities, document management, and project organization.

## Features

✨ **Unified Navigation** - Seamless navigation between all pages with a fixed sidebar
- Dashboard (Dataset Management)
- Projects
- Chat (ChatGPT-like interface)
- Login

🤖 **Chat Interface** - ChatGPT-style chat with:
- Real-time messaging
- Chat history with search
- Persistent storage (localStorage)
- Message timestamps
- Loading indicators

📁 **Document Management** - Upload and manage various file types
- PDF, Video, PPT, Word, Excel, Images
- CRUD operations (Create, Read, Update, Delete)
- Pagination

📊 **Project Management** - Visual project cards with:
- Custom images/colors
- Document type categorization
- Add/Delete functionality

## Project Structure

```
src/
├── app/
│   ├── chat/          # Chat interface page
│   ├── dashboard/     # Document management page
│   ├── login/         # Login page
│   ├── projects/      # Projects page
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page (redirects to dashboard)
│   └── globals.css    # Global styles
└── components/
    └── Sidebar.tsx    # Navigation sidebar component
```

## Running the Application

### Option 1: Using Command Prompt (cmd)
```bash
npm run dev
```

### Option 2: Using PowerShell (if execution policy issues occur)
```powershell
# Set execution policy for current session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Then run
npm run dev
```

### Option 3: Direct Node execution
```bash
npx next dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## Navigation Flow

1. **Home (`/`)** → Automatically redirects to Dashboard
2. **Dashboard (`/dashboard`)** → Manage documents/datasets
3. **Projects (`/projects`)** → View and manage projects
4. **Chat (`/chat`)** → AI chat interface with search
5. **Login (`/login`)** → Authentication page

## Key Updates Made

### 1. Created Sidebar Component (`src/components/Sidebar.tsx`)
- Fixed left sidebar with navigation
- Active page highlighting
- Links to all main pages

### 2. Created Chat Page (`src/app/chat/page.tsx`)
- ChatGPT-like interface
- Chat history sidebar with search functionality
- Message persistence using localStorage
- Real-time chat simulation
- Create new chats
- Delete chat history

### 3. Updated Existing Pages
- **Dashboard**: Added sidebar, maintains all original functionality
- **Projects**: Added sidebar, maintains all original functionality
- **Home**: Now redirects to dashboard automatically

### 4. Unified Layout
- All pages now have consistent navigation
- No need to manually navigate between pages
- Sidebar is fixed and always visible
- Main content area is responsive with proper margins

## Data Persistence

- **Chat History**: Saved in localStorage as `chatHistories`
- **Projects**: Saved in localStorage as `projects`

## Styling

- Uses Tailwind CSS for all styling
- Consistent color scheme across pages
- Responsive design
- Smooth transitions and hover effects

## Future Enhancements

- [ ] Connect chat to actual AI backend API
- [ ] Implement real file upload functionality
- [ ] Add authentication with JWT
- [ ] Database integration for persistence
- [ ] Real-time collaboration features
- [ ] Export chat conversations
- [ ] Advanced search filters

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management
- **localStorage** - Client-side data persistence

## Notes

- The chat responses are currently simulated for demo purposes
- Replace the simulated AI responses with actual API calls to your backend
- File uploads are handled client-side only (base64 encoding for projects)
- All data is stored in browser localStorage
