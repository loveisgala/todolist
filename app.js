const todoInput = document.querySelector("#input-txt");
const todosContainer = document.querySelector(".todos");
const completedCount = document.querySelector(".completedCount");

var elem = null;
let todos = [];



//evento para que al presionar enter se imprima el valor del input
todoInput.addEventListener("keyup", function(e) {
    if (e.key == "Enter" || e.keyCode == 13) {
        todos.push({ value: e.target.value, checked: false });
        newTodo(e.target.value);
        todoInput.value = "";
        countCompleted();
    }
});

function isBefore(el1, el2) {
    for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
        if (cur === el2) return true;
    return false;
}


function updateTodos(value, bool) {
    todos.forEach((t) => {
        if (t.value === value) {
            t.checked = bool;
        }
    });
}

//funcion nueva tarea
function newTodo(value) {
    const todo = document.createElement("div");
    const todoText = document.createElement("p");
    const todoCheckBox = document.createElement("input");
    const todoCheckBoxLabel = document.createElement("label");
    const todoCross = document.createElement("span");
    const todosContainer = document.querySelector(".todos");

    let obj = todos.find((t) => t.value === value);

    todoText.textContent = value;
    todoCheckBox.type = "checkbox";
    todoCheckBox.name = "checkbox";
    todoCheckBoxLabel.htmlFor = "checkbox";
    //funcion check
    todoCheckBoxLabel.addEventListener("click", function(e) {


        if (todoCheckBox.checked) {
            todoCheckBox.checked = false;
            todoText.style.textDecoration = "none";
            todoCheckBoxLabel.classList.remove("active");
            updateTodos(value, false);
            countCompleted();
        } else {
            updateTodos(value, true);
            countCompleted();
            todoCheckBox.checked = true;
            todoText.style.textDecoration = "line-through";
            todoCheckBoxLabel.classList.add("active");
        }
    });

    //boton x para remover 
    todoCross.textContent = "✘";

    todoCross.addEventListener("click", function(e) {
        e.target.parentElement.remove();
        todos = todos.filter((t) => t !== obj);
        countCompleted();
    });

    todo.classList.add("todo");
    todoCheckBoxLabel.classList.add("circulo");
    todoCross.classList.add("cross");

    todo.appendChild(todoCheckBox);
    todo.appendChild(todoCheckBoxLabel);
    todo.appendChild(todoText);
    todo.appendChild(todoCross);

    todo.draggable = true;
    todo.addEventListener("dragstart", (e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", null); // para navegadores antiguos
        elem = e.target;
    });
    todo.addEventListener("dragover", (e) => {
        let el1;
        e.preventDefault();
        if (e.target.classList.contains("todo")) {
            el1 = e.target;
        } else {
            el1 = e.target.parentElement;
        }
        if (isBefore(elem, el1)) {
            el1.parentNode.insertBefore(elem, el1);
        }
    });
    todo.addEventListener("dragend", () => {
        elem = null;
        let index = todos.findIndex((t) => t.value === value);
        todos.splice(index, 1);
        if (todo.nextSibling) {
            let index1 = todos.findIndex((t) => t.value === todo.nextSibling.querySelector("p").textContent);
            todos.splice(index1, 0, {
                value: value,
                checked: todo.querySelector("input").checked,
            });

        } else {
            todos.push({
                value: value,
                checked: todo.querySelector("input").checked,
            });
        }
    });

    todosContainer.appendChild(todo);
}

//funcion conteo
function countCompleted() {
    completedCount.textContent = `Quedan ${
        todos.filter((t)=>t.checked===false ).length
    } items`;
}

//funcion para cambiar tema
function changeTheme() {
    document.body.classList.toggle("light");
}

function clearCompleted() {
    todos = todos.filter((t) => t.checked !== true);
    document.querySelectorAll(".todo").forEach((todo) => {
        if (todo.querySelector("input").checked) {
            todo.remove();
        }
    });
}

//funcion mostrar todo
function showAll(e) {
    document.querySelectorAll(".filters div").forEach((d, i) => {
        if (i === 0) {
            d.classList.add("filterActive");
        } else {
            d.classList.remove("filterActive");
        }
    });
    document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "grid";
    });
}


function filterCompleted() {
    document.querySelectorAll(".filters div").forEach((d, i) => {
        if (i === 2) {
            d.classList.add("filterActive");
        } else {
            d.classList.remove("filterActive");
        }
    });
    document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "grid";
        if (!todo.querySelector("input").checked) {
            todo.style.display = "none";
        }
    });
}

function filterActive() {
    document.querySelectorAll(".filters div").forEach((d, i) => {
        if (i === 1) {
            d.classList.add("filterActive");
        } else {
            d.classList.remove("filterActive");
        }
    });
    document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "grid";
        if (todo.querySelector("input").checked) {
            todo.style.display = "none";
        }
    });
}