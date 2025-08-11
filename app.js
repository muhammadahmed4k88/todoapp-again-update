 const supabaseUrl = 'https://alsyjerexekuajnorbwl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsc3lqZXJleGVrdWFqbm9yYndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MTcxODQsImV4cCI6MjA2ODM5MzE4NH0.rxJ2zKAZCU6OQAwk0X1h8EY8kdX2bGOCBulBoingwlo'
const client = supabase.createClient(supabaseUrl, supabaseKey)
console.log(client);


let input = document.getElementById("inpitems");
    let taskbtn = document.getElementById("addtask");
    let updatebtn = document.getElementById("updatetask");
    let clearbtn = document.getElementById("clearall");
    let show = document.getElementById("show");

    let data = [];
    let editId = null;

    async function fetchTasks() {
        const { data: tasks, error } = await client
            .from("tasks")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            alert("Error fetching tasks");
            console.log(error);
        } else {
            data = tasks;
            render();
        }
    }

    function render() {
        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<li>${data[i].task} 
                        <button onclick="edit(${i})">Edit</button> 
                        <button onclick="del(${data[i].id})">Delete</button>
                     </li>`;
        }
        show.innerHTML = html;
        clearbtn.style.display = data.length >= 2 ? "inline-block" : "none";
    }

   taskbtn.addEventListener("click", async () => {
    let value = input.value.trim();
    if (!value) return alert("Please enter a task");

    
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    const { error } = await client.from("tasks").insert([{ task: value }]);
    if (error) {
        alert("Error adding task");
        console.log(error);
    } else {
        input.value = "";
        fetchTasks();
    }
});


    updatebtn.addEventListener("click", async () => {
        let value = input.value.trim();
        if (!value || editId === null){
            alert('Update failed')
        }
        return

        const { error } = await client
            .from("tasks")
            .update({ task: value })
            .eq("id", editId);

        if (error) {
            alert("Error updating task");
            console.log(error);
        } else {
            input.value = "";
            editId = null;
            taskbtn.style.display = "inline-block";
            updatebtn.style.display = "none";
            fetchTasks();
        }
    });

    window.edit = (index) => {
        input.value = data[index].task;
        editId = data[index].id;
        taskbtn.style.display = "none";
        clearbtn.style.display ='none'
        updatebtn.style.display = "inline-block";
    };

    window.del = async (id) => {
        const { error } = await client.from("tasks").delete().eq("id", id);
        if (!error) fetchTasks();
    };

    clearbtn.addEventListener("click", async () => {
        if (confirm("Delete all tasks?")) {
            const { error } = await client.from("tasks").delete().neq("id", 0);
            if (!error) fetchTasks();
        }
    });

    // Load tasks on page load
    fetchTasks();
