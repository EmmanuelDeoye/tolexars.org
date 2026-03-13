var config = {
    apiKey: "AIzaSyAuT-RlMl5g4m96V3DtUWGFV6ym7YnMXt8",
    authDomain: "tolexars-ac868.firebaseapp.com",
    databaseURL: "https://tolexars-ac868-default-rtdb.firebaseio.com",
    projectId: "tolexars-ac868",
    storageBucket: "tolexars-ac868.appspot.com",
    messagingSenderId: "148559800786"
};

// Initialize Firebase
firebase.initializeApp(config);

// Export database reference for use in other files
var database = firebase.database();