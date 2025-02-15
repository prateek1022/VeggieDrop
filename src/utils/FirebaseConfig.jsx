import { initializeApp } from '@react-native-firebase/app';
import getAuth from '@react-native-firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAHQbLcLr_ZD-auNewdUM7_NCoviJky3Fg",
    authDomain: "veggiedrop2.firebaseapp.com",
    projectId: "veggiedrop2",
    storageBucket: "veggiedrop2.firebasestorage.app",
    messagingSenderId: "601032048832",
    appId: "1:601032048832:web:9e3accfc62312716066d25",
    measurementId: "G-29HT0P9JLW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };