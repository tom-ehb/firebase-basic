import { snapshotToArray } from './utils.js';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
var firebaseConfig = {
    apiKey: "XXXXXXX",
    authDomain: "localhost",
    // The value of `databaseURL` depends on the location of the database
    // databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "XXXXX",
    // storageBucket: "PROJECT_ID.appspot.com",
    //  messagingSenderId: "SENDER_ID",
    //appId: "APP_ID",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    //measurementId: "G-MEASUREMENT_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

const todosCollection = db.collection("todos");

//****** SHOT ITEMS ******
async function renderTodos() {
    const querySnapshot = await todosCollection.get();
    const todos = snapshotToArray(querySnapshot);
    console.log(todos);

    let htmlString = '';
    todos.forEach(todo => {
        const checked = todo.checked ? "checked" : "";
        htmlString += `
    <li>
    <input id="checkbox1" type="checkbox" ${checked} name="todoCheckbox" value="${todo.id}">
    <label for="checkbox1">${todo.name}</label>
    </li>
`;
    });
    document.getElementById('todos').innerHTML = htmlString;
    const checkboxes = document.getElementsByName("todoCheckbox");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkboxChange);
    })
}

renderTodos();


//****** ADD ITEM ******
const form = document.getElementById("form");
form.addEventListener("submit", addTodo);

async function addTodo(e) {
    e.preventDefault();
    const nameInput = document.getElementById("name");
    const name = nameInput.value;
    nameInput.value = "";

    try {
        const docRef = await todosCollection.add({
            checked: false,
            createdAt: new Date(),
            name
        });
        console.log(docRef.id);
        renderTodos();

    } catch (error) {
        console.log(error);
    }
}

//****** UPDATE ITEM ******
async function checkboxChange(event) {
    const checked = event.target.checked;
    // of const checked = this.checked
    const id = event.target.value;
    //console.log(checked);
    await todosCollection.doc(id).update({
        checked   // update het veld 'checked' in firebase, met de upgehaalde waarde uit de checkbox
    });
}

