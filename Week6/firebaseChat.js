
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getDatabase, ref, onValue, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const replicateProxy = "https://replicate-api-proxy.glitch.me"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBfVvxGNT8vrtYs7bAjN-63YXcxVNyS_Hc",
    authDomain: "hello-5f8d5.firebaseapp.com",
    databaseURL: "https://hello-5f8d5-default-rtdb.firebaseio.com",
    projectId: "hello-5f8d5",
    storageBucket: "hello-5f8d5.appspot.com",
    messagingSenderId: "96550242411",
    appId: "1:96550242411:web:1b3325fbbd60b38217492e",
    measurementId: "G-B0Y3TLLJPH"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let myContainer;
let name;
//let textContainerDiv
let db;

init(); //same as setup but we call it ourselves


function init() {
    console.log("init");
    let nameField = document.createElement('name');
    document.body.append(nameField);
    db = getDatabase();
    //let name = localStorage.getItem('fb_name');
    if (!name) {
        name = prompt("Enter Your Name Here");
        //localStorage.setItem('fb_name', name);  //save name
    }
    console.log("name", name);
    if (name) {
        nameField.value = name;
    }
    subscribeToUsers()
    askForExistingUser(name)

}

window.addEventListener('mouseup', function (event) {
    console.log("mouse moved", event);
    if (!myContainer.contains(event.target)) {
        let x = event.clientX;
        let y = event.clientY;
        myContainer.style.left = x + "px";
        myContainer.style.top = y + "px";
        set(ref(db, 'image/users/' + name + "/location"), {
            "x": x,
            "y": y
        });
    }
});

function subscribeToUsers() {
    const commentsRef = ref(db, 'image/users/');
    onChildAdded(commentsRef, (data) => {
        let container = addDiv(data.key, data);
        fillContainer(container, data.key, data);
        console.log("added", data.key, data);
    });

    onChildChanged(commentsRef, (data) => {
        let container = document.getElementById(data.key);
        if (!container) {
            container = addDiv(data.key, data);
        }
        fillContainer(container, data.key, data);
        console.log("changed", data.key, data);
    });

    onChildRemoved(commentsRef, (data) => {
        console.log("removed", data.key, data.val());
    });


}

function fillContainer(container, key, data) {
    let name = document.getElementById("name_element_" + key);
    let input = document.getElementById("input_element_" + key);
    let image = document.getElementById("image_element_" + key);
    let x = data.val().location.x;
    let y = data.val().location.y;
    container.style.position = "absolute";
    container.style.left = x + "px";
    container.style.top = y + "px";
    name.value = data.val().username;
    input.value = data.val().prompt;
    image.src = data.val().image;
}

function addDiv(key, data) {
    //div holds two things
    let container = document.createElement('div');
    container.style.border = "2px solid black";
    container.style.width = "256px";
    container.style.height = "256px";
    if (key == name) {
        container.style.border = "2px solid red";
        myContainer = container;
    }

    container.id = key;
    let x = data.val().location.x;
    let y = data.val().location.y;
    container.style.position = "absolute";
    container.style.left = x + "px";
    container.style.top = y + "px";

    let imageElement = document.createElement('img');
    imageElement.style.width = "256px";
    imageElement.style.height = "256px";
    imageElement.id = "image_element_" + key;

    let nameElement = document.createElement('span');
    nameElement.style.width = "25px";
    nameElement.id = "name_element_" + key;
    nameElement.innerHTML = data.val().username + ": ";

    let inputField = document.createElement('input');
    inputField = document.createElement('input');
    inputField.style.width = "170px";
    inputField.style.height = "20px";
    inputField.id = "input_element_" + key;
    inputField.addEventListener('keyup', function (event) {
        if (event.key == "Enter") {
            askForImage(key, inputField, imageElement, x, y);
        }

    });

    container.append(imageElement);
    container.append(document.createElement('br'));
    container.append(nameElement);
    container.append(inputField);
    document.body.append(container);
    return container;
}

function askForExistingUser(name) {
    const db = getDatabase();
    const usersRef = ref(db, 'image/users/' + name);
    console.log("usersRef", usersRef);
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            console.log("new user");
            let newX = Math.random() * window.innerWidth;
            let newY = Math.random() * window.innerHeight;
            set(ref(db, 'image/users/' + name), {
                username: name,
                prompt: "",
                image: "",
                location: { "x": newX, "y": newY }
            });
        }
        console.log("from database", data);
    });
}


async function askForImage(key, textField, imageElement, x, y) {
    prompt = "Virtual pet: "+ textField.value;
    textField.value = "waiting: " + textField.value;
    //const imageDiv = document.getElementById("resulting_image");
    //imageDiv.innerHTML = "Waiting for reply from Replicate's Stable Diffusion API...";
    let data = {
        "version": "069aacafc926187c8b65023f033fcf458a95eac89e06dab6afbe838f416f18b9",
        input: {
            "prompt": prompt,
            "width": 512,
            "height": 512,
        },
    };
    console.log("Asking for Picture Info From Replicate via Proxy", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    console.log("url", url, "options", options);
    const picture_info = await fetch(url, options);
    //console.log("picture_response", picture_info);
    const proxy_said = await picture_info.json();

    if (proxy_said.output.length == 0) {
        textField.value = "Something went wrong, try it again";
    } else {
        console.log("proxy_said", proxy_said.output[0]);
        let imageURL = proxy_said.output[0];
        imageElement.src = imageURL;
        textField.value = prompt;
        set(ref(db, 'image/users/' + key), {
            prompt: prompt,
            image: imageURL,
            username: key,
            location: { "x": x, "y": y }
        });

    }
}
