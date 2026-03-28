todoMain();
function todoMain() {
    let inputElem,
        inputElem2,
        button,
        selectElem;
    // a lock to prevent saveData being called during loadData
    let isLoading = false;
    getElements();
    addListeners();
    loadData();

    function getElements() {
        inputElem = document.getElementsByTagName("input")[0];
        inputElem2 = document.getElementsByTagName("input")[1];
        button = document.getElementById("addBtn");
        selectElem = document.getElementById("categoryFilter");
    }
    function addListeners() {
        button.addEventListener("click", addEntry, false);
        selectElem.addEventListener("change", filterEntries, false);
    }
    function addEntry() {
        let inputValue = inputElem.value;
        let inputValue2 = inputElem2.value;

        if (inputValue.trim() === "") return;

        inputElem.value = "";
        inputElem2.value = "";
        // add a new row
        let table = document.getElementById("todoTable");
        let trElem = document.createElement("tr");
        table.appendChild(trElem);
        // checkbox cell
        let checkboxElem = document.createElement("input");
        checkboxElem.type = "checkbox";
        checkboxElem.addEventListener("click", done, false);
        let tdElem1 = document.createElement("td");
        tdElem1.appendChild(checkboxElem);
        trElem.appendChild(tdElem1);
        // to-do cell
        let tdElem2 = document.createElement("td");
        tdElem2.innerText = inputValue;
        trElem.appendChild(tdElem2);
        // category cell
        let tdElem3 = document.createElement("td");
        tdElem3.innerText = inputValue2;
        trElem.appendChild(tdElem3);
        // delete cell
        let spanElem = document.createElement("span");
        spanElem.innerText = "delete";
        spanElem.className = "material-symbols-outlined";
        spanElem.addEventListener("click", deleteItem, false);
        let tdElem4 = document.createElement("td");
        tdElem4.appendChild(spanElem);
        trElem.appendChild(tdElem4);


        updateSelectOptions();
        if (!isLoading) saveData();


        // defined inside addEntry to capture each 'trElem' via closure
        function deleteItem() {
            trElem.remove();
            updateSelectOptions();
            if (!isLoading) saveData();
        }
        function done() {
            trElem.classList.toggle("strike");
            if (!isLoading) saveData();
        }
    }
    // helper function of the addListeners function
    function filterEntries() {
        let selection = selectElem.value;
        let rows = document.getElementsByTagName("tr");
        if (selection == "all") {
            Array.from(rows).forEach((row, index) => {
                if (index == 0) return;
                row.style.display = "";
            });
        } else {
            Array.from(rows).forEach((row, index) => {
                if (index == 0) return;
                let category = row.getElementsByTagName("td")[2].innerText;
                if (category == selectElem.value) row.style.display = "";
                else row.style.display = "none";
            });
        }
    }
    // helper function of the addEntry function
    function updateSelectOptions() {
        // get all categories and use set to remove duplicates
        let options = [];
        let rows = document.getElementsByTagName("tr");
        Array.from(rows).forEach((row, index) => {
            if (index == 0) return;
            let category = row.getElementsByTagName("td")[2].innerText;
            options.push(category);
        });
        let optionsSet = new Set(options);
        // remove all options except "all"
        selectElem.innerHTML = '<option value="all">all</option>';
        for (let option of optionsSet) {
            let newOptionElem = document.createElement("option");
            newOptionElem.value = option;
            newOptionElem.innerText = option;
            selectElem.appendChild(newOptionElem);
        }
    }

    // save and load functions
    function saveData() {
        let table = document.getElementById("todoTable");
        let rows = table.getElementsByTagName("tr");
        let todos = [];

        // traverse from i = 1, ignoring header row (checkbox, to-do, category, delete)
        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName("td");
            todos.push({
                task: cells[1].innerText,
                category: cells[2].innerText,
                isDone: rows[i].classList.contains("strike")
            });
        }
        localStorage.setItem("simpleTodos", JSON.stringify(todos));
    }
    function loadData() {
        let storedData = localStorage.getItem("simpleTodos");
        if (storedData) {
            // locked to prevent saveData being called when addEntry is called due to simulating add button click
            isLoading = true;
            let todos = JSON.parse(storedData);
            // build the table based on loaded data
            todos.forEach(todo => {
                inputElem.value = todo.task;
                inputElem2.value = todo.category;
                // simulate add button click to reuse addEntry function
                button.click();// 
                if (todo.isDone) {
                    let table = document.getElementById("todoTable");
                    let lastRow = table.rows[table.rows.length - 1];
                    let checkbox = lastRow.cells[0].getElementsByTagName("input")[0];
                    checkbox.checked = true;
                    lastRow.classList.add("strike");
                }
            });
            // unlock after loading data, allow saveData to be called
            isLoading = false;
        }
    }
}
