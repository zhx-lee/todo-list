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
        let inputValue = inputElem.value;
        inputElem.value = "";
        let liElem = document.createElement("li");
        liElem.innerText = inputValue;
        let spanElem = document.createElement("span");
        spanElem.innerText = "delete";
        spanElem.className = "material-symbols-outlined";



        spanElem.addEventListener("click", deleteItem, false);

        liElem.appendChild(spanElem);
        ulElem.appendChild(liElem);
        function deleteItem() {
            liElem.remove();
        }
    }
}