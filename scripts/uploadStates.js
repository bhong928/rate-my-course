// Import the Firebase Modules
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import axios from "axios";
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Pexels API Key
const PEXELS_API_KEY = process.env.VITE_PEXELS_API_KEY;

// Axios config for Pexels
const pexelsClient = axios.create({
  baseURL: "https://api.pexels.com/v1",
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

// 50 states list with optional image placeholders
const states = [
  { id: "alabama", name: "Alabama", imageUrl:"", },
  { id: "alaska", name: "Alaska", imageUrl:"", },
  { id: "arizona", name: "Arizona", imageUrl:"", },
  { id: "arkansas", name: "Arkansas", imageUrl:"", },
  { id: "california", name: "California", imageUrl:"", },
  { id: "colorado", name: "Colorado", imageUrl:"", },
  { id: "connecticut", name: "Connecticut", imageUrl:"", },
  { id: "delaware", name: "Delaware", imageUrl:"", },
  { id: "florida", name: "Florida", imageUrl:"", },
  { id: "georgia", name: "Georgia", imageUrl:"", },
  { id: "hawaii", name: "Hawaii", imageUrl:"", },
  { id: "idaho", name: "Idaho", imageUrl:"", },
  { id: "illinois", name: "Illinois", imageUrl:"", },
  { id: "indiana", name: "Indiana", imageUrl:"", },
  { id: "iowa", name: "Iowa", imageUrl:"", },
  { id: "kansas", name: "Kansas", imageUrl:"", },
  { id: "kentucky", name: "Kentucky", imageUrl:"", },
  { id: "louisiana", name: "Louisiana", imageUrl:"", },
  { id: "maine", name: "Maine", imageUrl:"", },
  { id: "maryland", name: "Maryland", imageUrl:"", },
  { id: "massachusetts", name: "Massachusetts", imageUrl:"", },
  { id: "michigan", name: "Michigan", imageUrl:"", },
  { id: "minnesota", name: "Minnesota", imageUrl:"", },
  { id: "mississippi", name: "Mississippi", imageUrl:"", },
  { id: "missouri", name: "Missouri", imageUrl:"", },
  { id: "montana", name: "Montana", imageUrl:"", },
  { id: "nebraska", name: "Nebraska", imageUrl:"", },
  { id: "nevada", name: "Nevada", imageUrl:"", },
  { id: "new_hampshire", name: "New Hampshire", imageUrl:"", },
  { id: "new_jersey", name: "New Jersey", imageUrl:"", },
  { id: "new_mexico", name: "New Mexico", imageUrl:"", },
  { id: "new_york", name: "New York", imageUrl:"", },
  { id: "north_carolina", name: "North Carolina", imageUrl:"", },
  { id: "north_dakota", name: "North Dakota", imageUrl:"", },
  { id: "ohio", name: "Ohio", imageUrl:"", },
  { id: "oklahoma", name: "Oklahoma", imageUrl:"", },
  { id: "oregon", name: "Oregon", imageUrl:"", },
  { id: "pennsylvania", name: "Pennsylvania", imageUrl:"", },
  { id: "rhode_island", name: "Rhode Island", imageUrl:"", },
  { id: "south_carolina", name: "South Carolina", imageUrl:"", },
  { id: "south_dakota", name: "South Dakota", imageUrl:"", },
  { id: "tennessee", name: "Tennessee", imageUrl:"", },
  { id: "texas", name: "Texas", imageUrl:"", },
  { id: "utah", name: "Utah", imageUrl:"", },
  { id: "vermont", name: "Vermont", imageUrl:"", },
  { id: "virginia", name: "Virginia", imageUrl:"", },
  { id: "washington", name: "Washington", imageUrl:"", },
  { id: "west_virginia", name: "West Virginia", imageUrl:"", },
  { id: "wisconsin", name: "Wisconsin", imageUrl:"", },
  { id: "wyoming", name: "Wyoming", imageUrl:"", },
];

async function getImageForState(stateName) {
  try {
    const res = await pexelsClient.get("/search", {
      params: { query: `${stateName} landscape`, per_page: 1 }
    });

    // Get the landscape image (original or large)
    return res.data.photos[0]?.src.large || null;
  } catch (err) {
    console.error(`❌ Failed to fetch image for ${stateName}:`, err.message);
    return null;
  }
}

async function uploadStates() {
  for (const state of states) {
    const imageUrl = await getImageForState(state.name);
    
    await setDoc(doc(db, "states", state.id), {
      name: state.name,
      imageUrl: imageUrl || "", // fallback to empty string if failed
      totalReviews: 0,
    });

    console.log(`✅ Uploaded ${state.name}`);
  }
}

uploadStates();