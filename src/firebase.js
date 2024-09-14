// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyAiu2zA6npyFjpobUGIb9aFBNz7dr_FoOE",
  authDomain: "todoapp-5b80e.firebaseapp.com",
  projectId: "todoapp-5b80e",
  storageBucket: "todoapp-5b80e.appspot.com",
  messagingSenderId: "920366743942",
  appId: "1:920366743942:web:c77efb52c0cd7c405fec07",
  measurementId: "G-1E67PQH46E",
  databaseURL: "https://todoapp-5b80e-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const auth = getAuth();
console.log("🚀 ~ auth:", auth)

export function addTodo(todo) {
  const user = auth.currentUser;
  if (user) {
    const newTodoRef = push(ref(database, `todos/${user.uid}`));
    set(newTodoRef, {
      item: todo,
      completed: false,
    });
  }
};

export async function getTodos() {
  const user = auth.currentUser;
  if (user) {
    const databaseRef = ref(database, `todos/${user.uid}`);
    try {
      const snapshot = await get(databaseRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return [];
      }
    } catch (err) {
      console.log(err);
      return [];
    };
  }
};

export function updateTodo(id, updatedItem) {
  const user = auth.currentUser;
  if (user) {
    const todoRef = ref(database, `todos/${user.uid}/${id}`);
    return update(todoRef, {
      item: updatedItem,
    });
  } else {
    console.error("User not logged in");
  }
};

export function deleteTodo(id) {
  const user = auth.currentUser;
  if (user) {
    const todoRef = ref(database, `todos/${user.uid}/${id}`);
    return remove(todoRef);
  } else {
    console.error("User not logged in");
  }
};

export function deleteAllTodos() {
  const user = auth.currentUser;
  if (user) {
    const todoRef = ref(database, `todos/${user.uid}`);
    return remove(todoRef);
  } else {
    console.error("User not logged in");
  }
};

export function completeTodo(id, completed) {
  const user = auth.currentUser;
  if (user) {
    const todoRef = ref(database, `todos/${user.uid}/${id}`);
    return update(todoRef, {
      completed: completed,
    });
  } else {
    console.error("User not logged in");
  }
};

export async function deleteCompletedTodos() {
  const user = auth.currentUser;
  if (user) {

    const dbRef = ref(database, `todos/${user.uid}`);
    const completedTodosQuery = query(dbRef, orderByChild('completed'), equalTo(true));

    try {
      const snapshot = await get(completedTodosQuery);
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach((childSnapshot) => {
          updates[childSnapshot.key] = null;
        });
        return update(dbRef, updates);
      };
    } catch (error) {
      console.error(error);
    };
  } else {
    console.error("User not logged in");
  }
};

export async function signIn(obj) {
  const result = await signInWithEmailAndPassword(auth, obj.email, obj.password)
  return result;
};

export async function signUp(obj) {
  const result = await createUserWithEmailAndPassword(auth, obj.email, obj.password)
  return result;
};

export function listenForAuthChange(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // If the user is logged in, call the callback with the user's UID
      callback(user.uid);
    } else {
      // If no user is logged in, check localStorage for a stored UID
      const storedUid = localStorage.getItem("uid");
      if (storedUid) {
        callback(storedUid);
      } else {
        callback(null); // No user logged in
      }
    }
  });
};

export { auth };