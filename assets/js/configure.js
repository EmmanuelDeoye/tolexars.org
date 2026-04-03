// Firebase Configuration for Tolexars Foundation
const firebaseConfig = {
    apiKey: "AIzaSyCW-ALNP0ZsUQocness1gvB-lsfvgfXGGk",
    authDomain: "tolexars-foundation.firebaseapp.com",
    databaseURL: "https://tolexars-foundation-default-rtdb.firebaseio.com",
    projectId: "tolexars-foundation",
    storageBucket: "tolexars-foundation.firebasestorage.app",
    messagingSenderId: "827105409630",
    appId: "1:827105409630:web:21f070d131cd55b07f12cf",
    measurementId: "G-3K2HJ0RLYH"
};

// Check if Firebase is already initialized (prevents duplicate initialization)
if (!firebase.apps || !firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
} else {
    // Use the existing app
    firebase.app();
}

// Export database reference for use in other files
const database = firebase.database();

// Optional: Enable offline persistence for better user experience
database.goOnline();

// Log successful connection (for debugging - remove in production)
console.log('Firebase initialized successfully with database:', firebaseConfig.databaseURL);