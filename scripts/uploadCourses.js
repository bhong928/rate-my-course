// Import the Firebase Modules
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJhex1vfEZ0G7Kj3r3hitbml7BxrWudws",
  authDomain: "ratemycourse-b21f2.firebaseapp.com",
  projectId: "ratemycourse-b21f2",
  storageBucket: "ratemycourse-b21f2.firebasestorage.app",
  messagingSenderId: "782164801746",
  appId: "1:782164801746:web:4742b0e116b09e45dcd50b",
  measurementId: "G-TG73KWVJVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to slugify course names
function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "_").replace(/[^\w\-]+/g, "");
}

// gold courses by state data set
const IMAGE_URL = "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const golfCoursesByState = {
    alabama: [
        {
            name: "Ross Bridge Golf Resort",
            city: "Hoover",
            imageUrl: IMAGE_URL,
        },
        {
            name: "Capitol Hill – The Judge",
            city: "Prattville",
            imageUrl: IMAGE_URL,
        },
    ],
    alaska: [
        {
            name: "Anchorage Golf Course",
            city: "Anchorage",
            imageUrl: IMAGE_URL,
        },
    ],
    arizona: [
        {
            name: "TPC Scottsdale",
            city: "Scottsdale",
            imageUrl: IMAGE_URL,
        },
        {
            name: "Troon North Golf Club",
            city: "Scottsdale",
            imageUrl: IMAGE_URL,
        },
    ],
    arkansas: [
        {
            name: "Mystic Creek Golf Club",
            city: "El Dorado",
            imageUrl: IMAGE_URL,
        },
    ],
    california: [
        {
            name: "Pebble Beach Golf Links",
            city: "Pebble Beach",
            imageUrl: IMAGE_URL,
        },
        {
            name: "Torrey Pines (South Course)",
            city: "La Jolla",
            imageUrl: IMAGE_URL,
        },
    ],
    colorado: [
        {
            name: "The Broadmoor Golf Club",
            city: "Colorado Springs",
            imageUrl: IMAGE_URL,
        },
    ],
    connecticut: [
        {
            name: "Great River Golf Club",
            city: "Milford",
            imageUrl: IMAGE_URL,
        },
    ],
    delaware: [
        {
            name: "Baywood Greens",
            city: "Long Neck",
            imageUrl: IMAGE_URL,
        },
    ],
    florida: [
        {
            name: "TPC Sawgrass",
            city: "Ponte Vedra Beach",
            imageUrl: IMAGE_URL,
        },
        {
            name: "Seminole Golf Club",
            city: "Juno Beach",
            imageUrl: IMAGE_URL,
        },
    ],
    georgia: [
        {
            name: "Augusta National Golf Club",
            city: "Augusta",
            imageUrl: IMAGE_URL,
        },
    ],
    hawaii: [
        {
            name: "Kapalua Plantation Course",
            city: "Lahaina",
            imageUrl: IMAGE_URL,
        },
    ],
    idaho: [
        {
            name: "Coeur d'Alene Resort Golf Course",
            city: "Coeur d'Alene",
            imageUrl: IMAGE_URL,
        },
    ],
    illinois: [
        {
            name: "Cog Hill Golf & Country Club",
            city: "Lemont",
            imageUrl: IMAGE_URL,
        },
    ],
    indiana: [
        {
            name: "The Fort Golf Resort",
            city: "Indianapolis",
            imageUrl: IMAGE_URL,
        },
    ],
    iowa: [
        {
            name: "Blue Top Ridge",
            city: "Riverside",
            imageUrl: IMAGE_URL,
        },
    ],
    kansas: [
        {
            name: "Sand Creek Station",
            city: "Newton",
            imageUrl: IMAGE_URL,
        },
    ],
    kentucky: [
        {
            name: "Keene Trace Golf Club",
            city: "Nicholasville",
            imageUrl: IMAGE_URL,
        },
    ],
    louisiana: [
        {
            name: "The Bluffs on Thompson Creek",
            city: "St. Francisville",
            imageUrl: IMAGE_URL,
        },
    ],
    maine: [
        {
            name: "Belgrade Lakes Golf Club",
            city: "Belgrade Lakes",
            imageUrl: IMAGE_URL,
        },
    ],
    maryland: [
        {
            name: "Bulle Rock Golf Course",
            city: "Havre de Grace",
            imageUrl: IMAGE_URL,
        },
    ],
    massachusetts: [
        {
            name: "The Country Club",
            city: "Brookline",
            imageUrl: IMAGE_URL,
        },
    ],
    michigan: [
        {
            name: "Forest Dunes Golf Club",
            city: "Roscommon",
            imageUrl: IMAGE_URL,
        },
    ],
    minnesota: [
        {
            name: "The Quarry at Giants Ridge",
            city: "Biwabik",
            imageUrl: IMAGE_URL,
        },
    ],
    mississippi: [
        {
            name: "Dancing Rabbit Golf Club",
            city: "Philadelphia",
            imageUrl: IMAGE_URL,
        },
    ],
    missouri: [
        {
            name: "Buffalo Ridge Springs",
            city: "Branson",
            imageUrl: IMAGE_URL,
        },
    ],
    montana: [
        {
            name: "Old Works Golf Course",
            city: "Anaconda",
            imageUrl: IMAGE_URL,
        },
    ],
    nebraska: [
        {
            name: "The Prairie Club",
            city: "Valentine",
            imageUrl: IMAGE_URL,
        },
    ],
    nevada: [
        {
            name: "Shadow Creek Golf Course",
            city: "North Las Vegas",
            imageUrl: IMAGE_URL,
        },
    ],
    new_hampshire: [
        {
            name: "Bald Peak Colony Club",
            city: "Melvin Village",
            imageUrl: IMAGE_URL,
        },
    ],
    new_jersey: [
        {
            name: "Pine Valley Golf Club",
            city: "Pine Hill",
            imageUrl: IMAGE_URL,
        },
    ],
    new_mexico: [
        {
            name: "Paa-Ko Ridge Golf Club",
            city: "Sandia Park",
            imageUrl: IMAGE_URL,
        },
    ],
    new_york: [
        {
            name: "Bethpage Black",
            city: "Farmingdale",
            imageUrl: IMAGE_URL,
        },
    ],
    north_carolina: [
        {
            name: "Pinehurst No. 2",
            city: "Pinehurst",
            imageUrl: IMAGE_URL,
        },
    ],
    north_dakota: [
        {
            name: "Bully Pulpit Golf Course",
            city: "Medora",
            imageUrl: IMAGE_URL,
        },
    ],
    ohio: [
        {
            name: "Muirfield Village Golf Club",
            city: "Dublin",
            imageUrl: IMAGE_URL,
        },
    ],
    oklahoma: [
        {
            name: "Southern Hills Country Club",
            city: "Tulsa",
            imageUrl: IMAGE_URL,
        },
    ],
    oregon: [
        {
            name: "Bandon Dunes Golf Resort",
            city: "Bandon",
            imageUrl: IMAGE_URL,
        },
    ],
    pennsylvania: [
        {
            name: "Oakmont Country Club",
            city: "Oakmont",
            imageUrl: IMAGE_URL,
        },
    ],
    rhode_island: [
        {
            name: "Newport Country Club",
            city: "Newport",
            imageUrl: IMAGE_URL,
        },
    ],
    south_carolina: [
        {
            name: "Harbour Town Golf Links",
            city: "Hilton Head",
            imageUrl: IMAGE_URL,
        },
    ],
    south_dakota: [
        {
            name: "The Golf Club at Red Rock",
            city: "Rapid City",
            imageUrl: IMAGE_URL,
        },
    ],
    tennessee: [
        {
            name: "The Honors Course",
            city: "Ooltewah",
            imageUrl: IMAGE_URL,
        },
    ],
    texas: [
        {
            name: "Whispering Pines Golf Club",
            city: "Trinity",
            imageUrl: IMAGE_URL,
        },
    ],
    utah: [
        {
            name: "Sand Hollow Resort",
            city: "Hurricane",
            imageUrl: IMAGE_URL,
        },
    ],
    vermont: [
        {
            name: "Ekwanok Country Club",
            city: "Manchester",
            imageUrl: IMAGE_URL,
        },
    ],
    virginia: [
        {
            name: "Primland Resort",
            city: "Meadows of Dan",
            imageUrl: IMAGE_URL,
        },
    ],
    washington: [
        {
            name: "Chambers Bay",
            city: "University Place",
            imageUrl: IMAGE_URL,
        },
    ],
    west_virginia: [
        {
            name: "The Greenbrier",
            city: "White Sulphur Springs",
            imageUrl: IMAGE_URL,
        },
    ],
    wisconsin: [
        {
            name: "Whistling Straits",
            city: "Sheboygan",
            imageUrl: IMAGE_URL,
        },
    ],
    wyoming: [
        {
            name: "3 Creek Ranch",
            city: "Jackson",
            imageUrl: IMAGE_URL,
        },
    ],
};

async function uploadCourses() {
  for (const state in golfCoursesByState) {
    const courses = golfCoursesByState[state];
    for (const course of courses) {
      const id = slugify(course.name);
      await setDoc(doc(db, "states", state, "courses", id), {
        name: course.name,
        city: course.city,
        imageUrl: course.imageUrl,
      });
      console.log(`✅ Added ${course.name} to ${state}`);
    }
  }
}

uploadCourses();