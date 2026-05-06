# 📱 Firebase App Store

A **social networking mobile app** built using **React Native (Expo)** and **Firebase**, featuring real-time chat, user connections, and video calling.

---

## 🚀 Features

- 🔐 Phone Authentication (Firebase Auth)
- 👤 User Profile Creation & Management
- 🤝 Send / Accept Connection Requests
- 💬 Real-time Chat (Firestore)
- 🔔 Unread Message Count
- 🔍 User Search
- 📹 1-to-1 Video / Voice Calling (ZegoCloud)
- ⚡ Fast state management with Redux Toolkit + Saga
- 💾 Persistent state using Redux Persist

---

## 🏗️ Tech Stack

| Technology          | Usage                     |
| ------------------- | ------------------------- |
| React Native (Expo) | Mobile App Development    |
| Firebase Auth       | Authentication            |
| Firestore           | Database & Real-time Chat |
| Redux Toolkit       | State Management          |
| Redux Saga          | Side Effects Handling     |
| Redux Persist       | Local Storage             |
| ZegoCloud SDK       | Video / Voice Calling     |

---

## 📂 Project Structure

```
firebase-app-store
├── app
│   ├── (tabs)
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   └── search.tsx
│   ├── (auth)
│   │   ├── createProfile.tsx
│   │   └── phoneLogin.tsx
│   ├── (root)
│   │   ├── interests.tsx
│   │   └── userProfile/[uid].tsx
│   └── _layout.tsx
├── components
├── constants
├── features
│   ├── auth
│   ├── chat
│   └── connectionRequest
├── firebase
├── store
├── types
└── README.md
```

---

## ⚙️ Installation

```bash
git clone <your-repo-url>
cd firebase-app-store
npm install
```

---

## ▶️ Run Project

```bash
npx expo start
```

Run on Android:

```bash
npx expo run:android
```

---

## 🔥 Firebase Setup

1. Create Firebase Project
2. Enable:
   - Authentication (Phone)
   - Firestore Database

3. Add Android app in Firebase
4. Download `google-services.json`
5. Place it inside:

```
android/app/google-services.json
```

---

## 💬 Chat System (Firestore)

- Chats stored in:

```
chats/{chatId}/messages/{messageId}
```

- Features:
  - Real-time messaging
  - Unread message count
  - Last message preview
  - Read receipts (`isRead`)

---

## 📹 Video Calling (ZegoCloud)

### Install

```bash
npm install @zegocloud/zego-uikit-prebuilt-call-rn
```

---

### How It Works

- `userID` → Unique per user (IMPORTANT)
- `callID` → Same for both users (chatId recommended)

```tsx
<ZegoUIKitPrebuiltCall
  appID={YOUR_APP_ID}
  appSign="YOUR_APP_SIGN"
  userID={user.uid}
  userName={user.name}
  callID={chatId}
  config={ONE_ON_ONE_VIDEO_CALL_CONFIG}
/>
```

---

### ⚠️ Important Rules

- ❗ Both users must open call screen
- ❗ Same `callID` required
- ❗ Different `userID` required
- ❗ No auto incoming call (you must trigger via UI/notification)

---

## 🔄 State Management Flow

### Redux + Saga

- UI → Dispatch Action
- Saga → Handle async (Firebase)
- Slice → Update Store
- UI → Auto re-render

---

## 📦 Build APK

```bash
npx expo run:android
```

OR

```bash
cd android
./gradlew assembleRelease
```

---

## 🧠 Key Concepts

### SDK (Software Development Kit)

SDK = Ready-made tools to build features faster

Example:

- Firebase SDK → Auth, DB
- Zego SDK → Video Call

---

## 🛠️ Future Improvements

- 🔔 Push Notifications (Incoming Calls)
- 🌐 Online / Offline Status
- 📁 Media Sharing (Images, Videos)
- 🔐 End-to-End Encryption

---

## 👨‍💻 Author

**Hardip Solanki**

---

## ⭐ Support

If you like this project:

- ⭐ Star the repo
- 🍴 Fork it
- 📢 Share it

---

## 📜 License

MIT License

---

**Happy Coding 🚀**
