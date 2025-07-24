# Rate My Course 🏌️‍♂️⛳️

**Rate My Course** is a full-stack web application that allows users to rate and review golf courses across the United States. Users can rate courses based on conditions like greens, fairways, rough, and staff — helping other golfers make informed decisions.

## 🔗 Live Site

[https://rate-my-course-green.vercel.app](https://rate-my-course-green.vercel.app)

## ✨ Features

- 🔐 **Authentication** (Google & Email link login)
- 📝 **Multi-step review form** with golf ball rating system
- 📸 **Photo upload (coming soon)**
- 🧠 **Admin dashboard** for approving reviews
- 📊 **Course detail pages** with ratings, averages, and comments
- 🗺️ **Browse courses** by state
- ⚠️ **One review per course per user**
- ⏱️ Reviews are sorted by newest first and only show after approval

## 📁 Project Structure

```
src/
├── components/
│   ├── AddCourse/
│   ├── ReviewForms/
│   └── ...
├── hooks/
├── lib/
├── pages/
└── App.jsx
```

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Firebase Firestore + Firebase Auth
- **Routing:** React Router
- **State Management:** React Context API
- **Notifications:** React Toastify

## 🧪 Setup Instructions

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/rate-my-course.git
   cd rate-my-course
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a project in [Firebase](https://console.firebase.google.com)
   - Enable Firestore and Authentication
   - Replace the `firebaseConfig` inside `lib/firebase.js` with your own

4. **Run the app:**
   ```bash
   npm run dev
   ```

## 🔒 Admin Access

Admins can approve reviews from the dashboard. Update the allowed emails inside:
```js
lib/admin.js
```

## 📸 Screenshots

*(Add screenshots of homepage, review form, and admin dashboard if available.)*

## 📌 Future Improvements

- Image uploads to reviews
- Course search/filter functionality
- User profile pages with submitted reviews
