todoMain();
function todoMain() {
    let inputElem;
    let ulElem;
    getElements();
    addListeners();

    function getElements() {
        inputElem = document.getElementsByTagName("input")[0];
        ulElem = document.getElementsByTagName("ul")[0]
    }
    function addListeners() {
        inputElem.addEventListener("change", onChange, false);
    }
    function onChange(event) {
        let flag = true;

        let inputValue = inputElem.value;
        inputElem.value = "";
        let liElem = document.createElement("li");

        let checkboxElem = document.createElement("input");
        checkboxElem.type = "checkbox";
        liElem.appendChild(checkboxElem)

        let textElem = document.createElement("span");
        textElem.innerText = inputValue;
        liElem.appendChild(textElem);

        // liElem.innerText = inputValue;
        // liElem.addEventListener("click", onClick, false);

        let spanElem = document.createElement("span");
        spanElem.innerText = "delete";
        spanElem.className = "material-symbols-outlined";

        spanElem.addEventListener("click", deleteItem, false);

        liElem.appendChild(spanElem);

        ulElem.appendChild(liElem);
        function deleteItem() {
            liElem.remove();
        }

        function onClick() {
            if (flag) {
                //     this.style.textDecoration = "line-through";
                //     flag = !flag;
                this.classList.add("strike");
            } else {
                // this.style.textDecoration = "none";
                // flag = !flag;
                this.classList.remove("strike");
            }

        }
    }
}
