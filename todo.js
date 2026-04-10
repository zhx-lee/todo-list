todoMain();

function todoMain() {
    let todoInput,
        categoryInput,
        dateInput,
        timeInput,
        addButton,
        categoryFilter;
    // a lock to prevent saveData being called during loadData
    let isLoading = false;

    // state-driven variables
    let todoRows = [];
    let currentFilter = "all";

    getElements();
    addListeners();
    loadData();
    render();

    function getElements() {
        // get references to inputs,addButton and category filter elements
        todoInput = document.getElementById("todoInput");
        categoryInput = document.getElementById("categoryInput");
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
        addButton = document.getElementById("addBtn");
        categoryFilter = document.getElementById("categoryFilter");
    }

    function addListeners() {
        // add event listeners to the add button and the category filter
        addButton.addEventListener("click", addEntry, false);
        categoryFilter.addEventListener("change", filterEntries, false);
    }

    function addEntry() {
        let todoValue = todoInput.value.trim();
        let categoryValue = categoryInput.value.trim() || "general";
        let dateValue = dateInput.value || "none";
        let timeValue = timeInput.value || "none";

        if (todoValue === "") return;

        // clear both input boxes after getting the values
        todoInput.value = "";
        categoryInput.value = "";
        dateInput.value = "";
        timeInput.value = "";

        // update the data state instead of the DOM directly
        todoRows.push({
            todo: todoValue,
            category: categoryValue,
            date: dateValue,
            time: timeValue,
            isDone: false
        });

        render();
        if (!isLoading) saveData();

        // set focus back to the todoInput for better UX
        todoInput.focus();
    }

    function render() {
        let table = document.getElementById("todoTable");

        // clear the table (keeping the header row at index 0)
        while (table.rows.length > 1) table.deleteRow(1);

        // build the table based on the current state (todoRows)
        todoRows.forEach((todoRow, index) => {
            // apply filtering logic
            let categoryNotMatch = currentFilter !== "all" && todoRow.category !== currentFilter;
            if (categoryNotMatch) return;

            // create a new row for each to-do item
            let trElem = document.createElement("tr");
            if (todoRow.isDone) trElem.classList.add("strike");
            table.appendChild(trElem);


            // 1st date cell
            let tdElem1 = document.createElement("td");
            // tdElem1.innerText = todoRow.date;
            if (todoRow.date !== "none") {
                let dateObj = new Date(todoRow.date);
                tdElem1.innerText = dateObj.toLocaleDateString("en-GB", { month: 'long', day: 'numeric', year: 'numeric' });
            } else {
                tdElem1.innerText = "none";
            }
            trElem.appendChild(tdElem1);

            // 2nd time cell
            let tdElem2 = document.createElement("td");
            tdElem2.innerText = todoRow.time;
            trElem.appendChild(tdElem2);

            // 3rd checkbox cell
            let checkboxElem = document.createElement("input");
            checkboxElem.type = "checkbox";
            checkboxElem.checked = todoRow.isDone;
            checkboxElem.addEventListener("click", done, false);

            let tdElem3 = document.createElement("td");
            tdElem3.appendChild(checkboxElem);
            trElem.appendChild(tdElem3);

            // 4th to-do cell
            let tdElem4 = document.createElement("td");
            tdElem4.innerText = todoRow.todo;
            trElem.appendChild(tdElem4);

            // 5th category cell
            let tdElem5 = document.createElement("td");
            tdElem5.innerText = todoRow.category;
            trElem.appendChild(tdElem5);

            // 6th delete cell
            let spanElem = document.createElement("span");
            spanElem.innerText = "delete";
            spanElem.className = "material-symbols-outlined";
            spanElem.addEventListener("click", deleteItem, false);

            let tdElem6 = document.createElement("td");
            tdElem6.appendChild(spanElem);
            trElem.appendChild(tdElem6);

            // defined inside forEach to capture the correct 'todoRow' and 'index' via closure
            function done() {
                todoRow.isDone = !todoRow.isDone;
                render();
                if (!isLoading) saveData();
            }

            function deleteItem() {
                todoRows.splice(index, 1);
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
        // get all categories from the todoRows state and use set to remove duplicates
        let options = todoRows.map(todo => todo.category);
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
        localStorage.setItem("todoRows", JSON.stringify(todoRows));
    }

    function loadData() {
        let storedData = localStorage.getItem("todoRows");
        if (storedData) {
            isLoading = true;
            todoRows = JSON.parse(storedData);
            isLoading = false;
        }
    }
}