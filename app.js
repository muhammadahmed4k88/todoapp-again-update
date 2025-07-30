 const supabaseUrl = 'https://alsyjerexekuajnorbwl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsc3lqZXJleGVrdWFqbm9yYndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MTcxODQsImV4cCI6MjA2ODM5MzE4NH0.rxJ2zKAZCU6OQAwk0X1h8EY8kdX2bGOCBulBoingwlo'
const client = supabase.createClient(supabaseUrl, supabaseKey)
console.log(client);


let input = document.getElementById("inpitems");
let taskbtn = document.getElementById("addtask");
let updatebtn = document.getElementById("updatetask");
let clearbtn = document.getElementById("clearall");
let show = document.getElementById("show");

let data = JSON.parse(localStorage.getItem("names")) || [];
let editIndex = null;

function render() {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html += `<li>${data[i]} 
                    <button onclick="edit(${i})">Edit</button> 
                    <button onclick="del(${i})">Delete</button>
                 </li>`;
    }
    show.innerHTML = html;

    // Show or hide Clear All button
    clearbtn.style.display = data.length >= 2 ? "inline-block" : "none";

    // Always update localStorage
    localStorage.setItem("names", JSON.stringify(data));
}

// Add new task
taskbtn.addEventListener("click", function () {
    let value = input.value.trim();
    if (!value) {
        alert("Please enter a task");
        return;
    }

    data.push(value);
    input.value = "";
    render();
});

// Update task
updatebtn.addEventListener("click", function () {
    let value = input.value.trim();
    if (!value) {
        alert("Please enter updated task");
        return;
    }

    if (editIndex !== null) {
        data[editIndex] = value;
        editIndex = null;
        input.value = "";

        // Switch buttons back
        taskbtn.style.display = "inline-block";
        updatebtn.style.display = "none";

        render();
    }
});

// Delete task
function del(index) {
    data.splice(index, 1);
    render();
}

// Edit task
function edit(index) {
    input.value = data[index];
    editIndex = index;

    // Switch buttons
    taskbtn.style.display = "none";
    updatebtn.style.display = "inline-block";
}

// Clear All
clearbtn.addEventListener("click", () => {
    if (data.length > 0 && confirm("Delete all tasks?")) {
        data = [];
        localStorage.setItem("names", JSON.stringify(data));
        render();
    }
});

render();
