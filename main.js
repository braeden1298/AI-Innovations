// Firebase configuration
// Replace the config object with your Firebase project's config
var firebaseConfig = {
    apiKey: "AIzaSyBMSDvOLxMLCGrFZhF269IJ1A1vor4Ono8",
    authDomain: "ai-innovations-6eeb6.firebaseapp.com",
    projectId: "ai-innovations-6eeb6",
    storageBucket: "ai-innovations-6eeb6.appspot.com",
    messagingSenderId: "250887139253",
    appId: "1:250887139253:web:ad5f164659e4a86c1ab3fc",
    measurementId: "G-RR1QJEZGMV"
  };
firebase.initializeApp(firebaseConfig);

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
        // User signed in
        var user = userCredential.user;
        console.log('User:', user); // Log the user

        // Get user data from Firestore
        firebase.firestore().collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    console.log('User data:', doc.data()); // Log the user's data

                    if (doc.data().isAdmin) {
                        // User is an admin, show admin panel
                        document.getElementById('login').style.display = 'none';
                        document.getElementById('admin-panel').style.display = 'block';
                    } else {
                        // User is not an admin, show regular website
                        document.getElementById('login').style.display = 'none';
                        var elements = document.querySelectorAll('header, section, footer');
                        for(var i = 0; i < elements.length; i++) {
                            elements[i].style.display = 'block';
                        }
                    }
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    })
    .catch((error) => {
        // Error happened
        alert('Incorrect username or password');
    });
});
                  
         // Handle registration form submission
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var newUsername = document.getElementById('new-username').value;
    var newPassword = document.getElementById('new-password').value;

    firebase.auth().createUserWithEmailAndPassword(newUsername, newPassword)
        .then((userCredential) => {
            // User created
            var user = userCredential.user;
            // Add the new user to Firestore as a non-admin
            firebase.firestore().collection('users').doc(user.uid).set({
                username: newUsername,
                isAdmin: false,
            })
            .then(() => {
                alert('User successfully registered!');
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
            // Error happened
            alert('Unable to register new user');
        });
});

// Handle logout button click
document.getElementById('logout-button').addEventListener('click', function(event) {
    firebase.auth().signOut()
        .then(() => {
            // User signed out
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        })
        .catch((error) => {
            // Error happened
            console.error('Sign-out error', error);
        });
});
         
