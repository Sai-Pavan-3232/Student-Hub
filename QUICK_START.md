# Quick Start Guide - Testing & Real-time Features

## 🚀 Getting Started (After npm install completes)

### Step 1: Verify Installation

```bash
node verify-setup.js
```

Expected output:
```
✅ All dependencies installed!
```

---

### Step 2: Run Backend Tests

```bash
# Run tests in watch mode
npm test

# Or run once
npm run test:run
```

**Expected Result:**
```
✓ server/__tests__/routes.test.ts (35 tests)
Test Files  1 passed (1)
Tests  35 passed (35)
```

---

### Step 3: Start the Server

```bash
npm run dev:server
```

**Look for these messages:**
```
[express] WebSocket server initialized
[websocket] WebSocket server ready
[express] serving on port 5000
```

---

### Step 4: Test WebSocket Connection

Open browser console (F12) and run:

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5000/ws?userId=test-user-123');

ws.onopen = () => {
  console.log('✅ WebSocket Connected!');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('📨 Received:', data);
};

ws.onerror = (error) => {
  console.error('❌ WebSocket Error:', error);
};

// Send a ping
ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
```

**Expected Response:**
```javascript
✅ WebSocket Connected!
📨 Received: {
  type: "notification",
  payload: {
    type: "system",
    title: "Connected",
    message: "WebSocket connection established"
  }
}
📨 Received: { type: "pong", timestamp: 1735710228000 }
```

---

### Step 5: Test Real-time Notifications

#### Test Thread Reply Notification

**Terminal 1 - Create a thread:**
```bash
curl -X POST http://localhost:5000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Thread",
    "content": "Testing notifications",
    "category": "academic",
    "isAnonymous": false
  }'
```

**Terminal 2 - Reply to the thread:**
```bash
curl -X POST http://localhost:5000/api/threads/{THREAD_ID}/replies \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a reply",
    "isAnonymous": false
  }'
```

**Browser Console - Should receive:**
```javascript
📨 Received: {
  type: "notification",
  payload: {
    type: "thread_reply",
    title: "New Reply",
    message: "Someone replied to your thread",
    data: {
      threadId: "...",
      threadTitle: "Test Thread",
      replyId: "..."
    }
  }
}
```

---

### Step 6: Test Connection Notifications

**Send connection request:**
```bash
curl -X POST http://localhost:5000/api/connections \
  -H "Content-Type: application/json" \
  -d '{
    "targetId": "target-user-id"
  }'
```

**Accept connection:**
```bash
curl -X PATCH http://localhost:5000/api/connections/{CONNECTION_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

---

## 🧪 Running Different Test Modes

### Watch Mode (Recommended for Development)
```bash
npm test
```
- Tests re-run automatically when files change
- Great for TDD workflow

### Run Once
```bash
npm run test:run
```
- Runs all tests once and exits
- Good for CI/CD

### Interactive UI
```bash
npm run test:ui
```
- Opens browser-based test UI
- Visual test explorer
- Great for debugging

### Coverage Report
```bash
npm run test:coverage
```
- Generates coverage report
- Shows which code is tested
- Creates HTML report in `coverage/` folder

---

## 🔧 Troubleshooting

### Tests Fail with "Cannot find module"
```bash
# Make sure all dependencies are installed
npm install

# Check if vitest is installed
npm list vitest
```

### WebSocket Connection Refused
```bash
# Make sure server is running
npm run dev:server

# Check if port 5000 is available
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # macOS/Linux
```

### "USE_MOCK_DB" Warning
This is normal! Tests use mock storage by default.
To use real database in tests, remove the `USE_MOCK_DB` setting in `server/test-setup.ts`.

### WebSocket Disconnects Immediately
- Check userId parameter: `ws://localhost:5000/ws?userId=YOUR_USER_ID`
- Verify server logs for authentication errors
- Make sure session is valid

---

## 📊 Test Output Explained

```
✓ server/__tests__/routes.test.ts (35)
  ✓ API Routes (35)
    ✓ User Management (3)
      ✓ GET /api/me - should return current user
      ✓ PATCH /api/me - should update current user
      ✓ GET /api/discover - should return discoverable users
```

- **Green checkmarks (✓)** = Tests passed
- **Numbers in parentheses** = Number of tests in that suite
- **Test names** = What each test is checking

---

## 🎯 What to Test

### Critical Paths
1. ✅ User can create account (anonymous)
2. ✅ User can create thread
3. ✅ User can reply to thread
4. ✅ Thread author receives notification
5. ✅ User can send connection request
6. ✅ Target user receives notification
7. ✅ User can accept connection
8. ✅ Requester receives acceptance notification

### Edge Cases
- Empty thread title
- Invalid category
- Non-existent thread ID
- Duplicate connection request
- Self-connection attempt

---

## 🚀 Next Steps After Verification

1. **Integrate NotificationCenter into your app**
   ```tsx
   import { NotificationCenter } from '@/components/NotificationCenter';
   
   <NotificationCenter userId={currentUser.id} />
   ```

2. **Add more notification types**
   - Event reminders
   - Club announcements
   - Mentorship acceptance

3. **Customize notification behavior**
   - Add sounds
   - Customize icons
   - Add notification preferences

4. **Deploy to production**
   - Use WSS (WebSocket Secure) for HTTPS
   - Set up proper authentication
   - Configure CORS for production domain

---

## 📚 Additional Resources

- **Full Guide**: `TESTING_AND_REALTIME_GUIDE.md`
- **Walkthrough**: Check artifacts folder
- **Implementation Plan**: Check artifacts folder
- **Backend Status**: `BACKEND_STATUS_REPORT.md`

---

## ✅ Success Criteria

You'll know everything is working when:

- [x] `npm test` shows 35 tests passing
- [x] Server starts without errors
- [x] WebSocket connects successfully
- [x] Browser receives welcome notification
- [x] Ping/pong works
- [x] Thread reply triggers notification
- [x] Connection request triggers notification
- [x] NotificationCenter displays notifications
- [x] Unread count updates correctly

---

## 🎉 You're Ready!

Once all tests pass and WebSocket connects, you have:
- ✅ Fully tested backend API
- ✅ Real-time notification system
- ✅ Production-ready WebSocket server
- ✅ Beautiful notification UI

**Happy coding!** 🚀
