
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCLCcgaoW9gNYhKk0c0gDWC6i5mKVTN4XE",
    authDomain: "profile-d1214.firebaseapp.com",
    projectId: "profile-d1214",
    storageBucket: "profile-d1214.firebasestorage.app",
    messagingSenderId: "914980131889",
    appId: "1:914980131889:web:72f8da15c42dbee671b110",
    measurementId: "G-C587M69LZW"
};

const ADMIN_UID = "VYIs9XHLR9RMStwtcdwMrOIo33w1";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const isAdmin = (user: User | null) => {
  return user?.uid === ADMIN_UID;
};

// Image Upload Helper
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Firestore Helpers
export const getPortfolioData = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveItem = async (collectionName: string, id: string | null, data: any) => {
  const colRef = collection(db, collectionName);
  const docRef = id ? doc(colRef, id) : doc(colRef);
  await setDoc(docRef, data, { merge: true });
  return docRef.id;
};

export const deleteItem = async (collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};
