todoMain();

function todoMain() {
    let inputElem,
        inputElem2,
        addButton,
        categoryFilter;
    // a lock to prevent saveData being called during loadData
    let isLoading = false;

    // state-driven variables
    let todos = [];
    let currentFilter = "all";

    getElements();
    addListeners();
    loadData();
    render();

    function getElements() {
        // get references to both input boxes, add button, and category filter
        inputElem = document.getElementsByTagName("input")[0];
        inputElem2 = document.getElementsByTagName("input")[1];
        addButton = document.getElementById("addBtn");
        categoryFilter = document.getElementById("categoryFilter");
    }

    function addListeners() {
        // add event listeners to the add button and the category filter
        addButton.addEventListener("click", addEntry, false);
        categoryFilter.addEventListener("change", filterEntries, false);
    }

    function addEntry() {
        let inputValue = inputElem.value.trim();
        let inputValue2 = inputElem2.value.trim() || "general";

        if (inputValue === "") return;

        // clear both input boxes after getting the values
        inputElem.value = "";
        inputElem2.value = "";

        // update the data state instead of the DOM directly
        todos.push({
            task: inputValue,
            category: inputValue2,
            isDone: false
        });

        render();
        if (!isLoading) saveData();
    }

    function render() {
        let table = document.getElementById("todoTable");

        // clear the table (keeping the header row at index 0)
        while (table.rows.length > 1) table.deleteRow(1);

        // build the table based on the current state (todos)
        todos.forEach((todo, index) => {
            // apply filtering logic
            let categoryNotMatch = currentFilter !== "all" && todo.category !== currentFilter;
            if (categoryNotMatch) return;

            // create a new row for each to-do item
            let trElem = document.createElement("tr");
            if (todo.isDone) trElem.classList.add("strike");
            table.appendChild(trElem);

            // checkbox cell
            let checkboxElem = document.createElement("input");
            checkboxElem.type = "checkbox";
            checkboxElem.checked = todo.isDone;
            checkboxElem.addEventListener("click", done, false);

            let tdElem1 = document.createElement("td");
            tdElem1.appendChild(checkboxElem);
            trElem.appendChild(tdElem1);

            // to-do cell
            let tdElem2 = document.createElement("td");
            tdElem2.innerText = todo.task;
            trElem.appendChild(tdElem2);

            // category cell
            let tdElem3 = document.createElement("td");
            tdElem3.innerText = todo.category;
            trElem.appendChild(tdElem3);

            // delete cell
            let spanElem = document.createElement("span");
            spanElem.innerText = "delete";
            spanElem.className = "material-symbols-outlined";
            spanElem.addEventListener("click", deleteItem, false);

            let tdElem4 = document.createElement("td");
            tdElem4.appendChild(spanElem);
            trElem.appendChild(tdElem4);

            // defined inside forEach to capture the correct 'todo' and 'index' via closure
            function done() {
                todo.isDone = !todo.isDone;
                render();
                if (!isLoading) saveData();
            }

            function deleteItem() {
                todos.splice(index, 1);
                render();
                if (!isLoading) saveData();
            }
        });

        updateSelectOptions();
    }

    // helper function of the addListeners function
    function filterEntries() {
        currentFilter = categoryFilter.value;
        render();
    }

    // helper function of the render function
    function updateSelectOptions() {
        // get all categories from the todos state and use set to remove duplicates
        let options = todos.map(todo => todo.category);
        let optionsSet = new Set(options);

        // save current selection to restore it after rebuilding options
        let currentSelection = categoryFilter.value;

        // remove all options except "all"
        categoryFilter.innerHTML = '<option value="all">all</option>';
        for (let option of optionsSet) {
            let newOptionElem = document.createElement("option");
            newOptionElem.value = option;
            newOptionElem.innerText = option;
            categoryFilter.appendChild(newOptionElem);
        }

        // restore selection if it still exists in the new list
        if (Array.from(categoryFilter.options).some(opt => opt.value === currentSelection)) {
            categoryFilter.value = currentSelection;
        }
    }

    // save and load functions
    function saveData() {
        localStorage.setItem("simpleTodos", JSON.stringify(todos));
    }

    function loadData() {
        let storedData = localStorage.getItem("simpleTodos");
        if (storedData) {
            isLoading = true;
            todos = JSON.parse(storedData);
            isLoading = false;
        }
    }
}