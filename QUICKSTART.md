# Quick Start Guide

## What Changed?

Your JaxerWeb application now has a unified navigation system! Here's what's new:

### ✅ Before
- Had to manually type URLs to switch between pages
- No navigation bar
- Separate disconnected pages

### ✅ After
- **Sidebar navigation** on every page
- Click to navigate between Dashboard, Projects, and Chat
- **New Chat page** with search functionality
- **Home page** automatically redirects to Dashboard
- Everything is connected!

## Running the App

Open Command Prompt (not PowerShell) and run:

```bash
cd C:\Users\USER\Documents\jaxerweb\jaxerweb
npm run dev
```

Then open: **http://localhost:3000**

## What You'll See

### 1. **Left Sidebar** (Always Visible)
```
┌─────────────┐
│  JaxerWeb   │
│  Chat Bot   │
├─────────────┤
│ Dashboard   │ ← Click to go to dataset management
│ Projects    │ ← Click to go to projects
│ Chat        │ ← Click to go to chat (NEW!)
├─────────────┤
│ Account     │ ← Click to go to login
└─────────────┘
```

### 2. **Home Page** (/)
- Automatically redirects to Dashboard
- Shows loading spinner during redirect

### 3. **Dashboard Page** (/dashboard)
- **LEFT**: Sidebar with navigation
- **RIGHT**: Your existing dataset management table
- Upload documents, edit, delete - all works as before!

### 4. **Projects Page** (/projects)
- **LEFT**: Sidebar with navigation
- **RIGHT**: Your existing project cards
- Add projects, delete projects - all works as before!

### 5. **Chat Page** (/chat) - **NEW!**
```
┌──────────┬──────────────┬────────────────────────┐
│          │              │                        │
│ Sidebar  │ Chat History │   Main Chat Area       │
│          │              │                        │
│ - Dash   │ [New Chat]   │  Chat Assistant        │
│ - Proj   │              │  ──────────────        │
│ - Chat   │ [Search...]  │                        │
│ - Login  │              │  Messages appear here  │
│          │ Recent chats │                        │
│          │ - Chat 1     │  [Type message...]     │
│          │ - Chat 2     │  [Send →]              │
│          │              │                        │
└──────────┴──────────────┴────────────────────────┘
```

**Chat Features:**
- Type messages and get AI responses (demo)
- Search through chat history
- Create new conversations
- Delete old chats
- All saved automatically in browser

## Navigation Flow

```
Open Website (/)
    ↓
Redirects to Dashboard (/dashboard)
    ↓
Click "Projects" in sidebar → Goes to /projects
    ↓
Click "Chat" in sidebar → Goes to /chat
    ↓
Click "Dashboard" in sidebar → Goes back to /dashboard
```

## Testing Each Feature

### Test Dashboard
1. Go to http://localhost:3000/dashboard
2. Click "Upload" button
3. Add a document
4. Edit or delete it
5. Check pagination

### Test Projects
1. Click "Projects" in sidebar
2. Click "+" to add new project
3. Upload an image
4. See the card appear
5. Hover and click "×" to delete

### Test Chat
1. Click "Chat" in sidebar
2. Type a message: "Hello!"
3. Press Enter or click Send
4. See the AI response
5. Type another message to continue
6. Click "New Chat" to start fresh
7. Use search bar to find old chats

## File Structure

```
src/
├── components/
│   └── Sidebar.tsx          ← NEW! Navigation sidebar
├── app/
│   ├── page.tsx             ← NEW! Redirects to dashboard
│   ├── layout.tsx           ← Updated metadata
│   ├── dashboard/
│   │   └── page.tsx         ← Updated with sidebar
│   ├── projects/
│   │   └── page.tsx         ← Updated with sidebar
│   ├── chat/
│   │   └── page.tsx         ← NEW! Chat interface
│   └── login/
│       └── page.tsx         ← Unchanged
```

## Common Issues & Solutions

### Issue: PowerShell script errors
**Solution**: Use Command Prompt (cmd) instead of PowerShell

### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill the process and restart
npm run dev -- -p 3001
```

### Issue: Sidebar not showing
**Solution**: Hard refresh browser (Ctrl + Shift + R)

### Issue: Chat history not saving
**Solution**: Check browser console for errors, ensure localStorage is enabled

## Next Steps

1. ✅ Run the app: `npm run dev`
2. ✅ Test navigation between pages
3. ✅ Try the chat feature
4. ⚡ Connect chat to your AI API (replace demo responses)
5. ⚡ Add real authentication
6. ⚡ Connect to database instead of localStorage

## Need Help?

Check `SETUP.md` for detailed documentation!
