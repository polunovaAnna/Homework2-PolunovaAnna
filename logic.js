const input = document.querySelector(".search-item");
const addButton = document.querySelector(".add-item");
const itemsBlock = document.querySelector(".product-item");

const products = [
    { itemName: "помідори", amount: 1, bought: false },
    { itemName: "печиво", amount: 1, bought: false },
    { itemName: "сир", amount: 1, bought: false }
];

addButton.addEventListener("click", () => {
    addItem();
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addItem();
    }
});

itemsBlock.addEventListener("click", (e) => {
    if(e.target.classList.contains("plus")) {
        increaseAmount(e);
    } else if (e.target.classList.contains("minus")) {
        decreaseAmount(e);
    } else if (e.target.classList.contains("remove")) {
        removeItem(e);
    } else if (e.target.classList.contains("bought-or-not")){
        buyItem(e);
    } else if (e.target.classList.contains("item-name")) {
        enableItemNameEditing(e.target);
    }
})

function addItem() {
    const inputValue = input.value.trim();
    if (inputValue === ""){
        return;
    }

    const exists = products.some(products => products.itemName.toLowerCase() === inputValue.toLowerCase());
    if (exists) {
        alert("Такий товар уже є у списку!!!");
        input.value = '';
        input.focus();
        return;
    }

    const newProduct = {itemName: inputValue, amount: 1, bought: false};
    products.push(newProduct);

    renderItem(newProduct);
    addToSidebar(newProduct);

    input.value = '';
    input.focus();
}

function removeItem(e) {
    const item = e.target.closest(".items");
    const itemName = item.querySelector(".item-name").textContent.trim();

    const divider = item.previousElementSibling;
    if (divider && divider.classList.contains("divider")) {
        divider.remove();
    }

    item.remove();

    const index = products.findIndex(products => products.itemName.toLowerCase() === itemName.toLowerCase());
    if (index !== -1){
        products.splice(index, 1);
    }

    removeFromSidebar(itemName);
}

function buyItem(e) {
    const item = e.target.closest(".items");
    const itemName = item.querySelector(".item-name").textContent.trim();

    const product = products.find(products => products.itemName.toLowerCase() === itemName.toLowerCase());

    product.bought = !product.bought;

    const isBought = product.bought;

    const plus = item.querySelector(".plus");
    const minus = item.querySelector(".minus");
    const remove = item.querySelector(".remove");
    const button = e.target;

    if (isBought) {
        item.classList.add("bought");
        item.querySelector(".item-name").style.textDecoration = "line-through";
        button.textContent = "Не куплено";

        plus.style.display = "none";
        minus.style.display = "none";
        remove.style.display = "none";

        moveToBought(itemName, product.amount);
    } else {
        item.classList.remove("bought");
        item.querySelector(".item-name").style.textDecoration = "none";
        button.textContent = "Куплено";

        plus.style.display = "";
        minus.style.display = "";
        remove.style.display = "";

        moveToRemaining(itemName, product.amount);
    }

}


function increaseAmount(e) {
    const item = e.target.closest(".items");
    const itemName = item.querySelector(".item-name").textContent.trim();
    const product = products.find(p => p.itemName.toLowerCase() === itemName.toLowerCase());

    const amountSpan = item.querySelector(".amount");
    const current = parseInt(amountSpan.textContent.trim(), 10);
    product.amount = current + 1;

    amountSpan.textContent = product.amount;

    const minusBtn = item.querySelector(".minus");
    if (product.amount > 1){
        minusBtn.disabled = false;
    }

    updateSidebar(product.itemName, product.amount);
}

function decreaseAmount(e) {
    const item = e.target.closest(".items");
    const itemName = item.querySelector(".item-name").textContent.trim();
    const product = products.find(p => p.itemName.toLowerCase() === itemName.toLowerCase());

    const amountSpan = item.querySelector(".amount");
    const current = parseInt(amountSpan.textContent.trim(), 10);

    if (current > 1) {
        product.amount = current - 1;
        amountSpan.textContent = product.amount;
    }

    const minusBtn = item.querySelector(".minus");
    minusBtn.disabled = product.amount <= 1;

    updateSidebar(product.itemName, product.amount);
}

function addToSidebar(product) {
    const remainingSection = document.querySelectorAll(".checkout-items")[0];
    const template = document.getElementById("checkoutItem");

    const clone = template.content.cloneNode(true);
    const item = clone.querySelector(".check-item");

    item.childNodes[0].textContent = product.itemName;
    item.querySelector(".check-amount").textContent = product.amount;

    remainingSection.appendChild(clone);
}


function updateSidebar(itemName, newAmount) {
    const checkItems = document.querySelectorAll(".check-item");

    for (const checkItem of checkItems) {
        const name = checkItem.childNodes[0].textContent.trim().toLowerCase();
        if (name === itemName.toLowerCase()) {
            const checkAmount = checkItem.querySelector(".check-amount");
            checkAmount.textContent = newAmount;
        }
    }
}

function updateSidebarStats() {
    const remainingSection = document.querySelectorAll(".checkout-items")[0];
    const boughtSection = document.querySelectorAll(".checkout-items")[1];

    remainingSection.innerHTML = '';
    boughtSection.innerHTML = '';

    for (const product of products) {
        const template = document.getElementById("checkoutItem");
        const clone = template.content.cloneNode(true);
        const newItem = clone.querySelector(".check-item");

        newItem.childNodes[0].textContent = product.itemName;
        newItem.querySelector(".check-amount").textContent = product.amount;

        if (product.bought) {
            boughtSection.appendChild(newItem);
        } else {
            remainingSection.appendChild(newItem);
        }
    }
}

function moveToBought(name, amount) {
    const boughtSection = document.querySelectorAll(".checkout-items")[1];
    moveSidebarItem(name, amount, boughtSection);
}

function moveToRemaining(name, amount) {
    const remainingSection = document.querySelectorAll(".checkout-items")[0];
    moveSidebarItem(name, amount, remainingSection);
}

function moveSidebarItem(name, amount, targetSection) {
    const allItems = document.querySelectorAll(".check-item");

    for (const item of allItems) {
        const itemName = item.childNodes[0].textContent.trim().toLowerCase();
        if (itemName === name.toLowerCase()) {
            item.remove();
        }
    }

    const template = document.getElementById("checkoutItem");
    const clone = template.content.cloneNode(true);
    const newItem = clone.querySelector(".check-item");

    newItem.childNodes[0].textContent = name;
    newItem.querySelector(".check-amount").textContent = amount;

    targetSection.appendChild(newItem);
}

function removeFromSidebar(itemName) {
    const checkItems = document.querySelectorAll(".check-item");
    for (const item of checkItems) {
        const name = item.childNodes[0].textContent.trim().toLowerCase();
        if (name === itemName.toLowerCase()) {
            item.remove();
            break;
        }
    }
}

function renderItem(product) {
    const itemsBlock = document.querySelector(".product-item");
    const template = document.getElementById("addedItem");
    const divider = document.createElement("div");
    divider.className = "divider";

    const clone = template.content.cloneNode(true);
    clone.querySelector(".item-name").textContent = product.itemName;
    clone.querySelector(".amount").textContent = product.amount;

    const minusBtn = clone.querySelector(".minus");
    if (product.amount <= 1) {
        minusBtn.disabled = true;
    } else {
        minusBtn.disabled = false;
    }

    itemsBlock.appendChild(divider);
    itemsBlock.appendChild(clone);
}

function enableItemNameEditing(nameDiv) {
    const oldName = nameDiv.textContent.trim();
    const product = products.find(products => products.itemName.toLowerCase() === oldName.toLowerCase());
    if (!product || product.bought) return;

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldName;
    input.className = "edit-name-input";

    let isEditing = true;

    const finishEdit = (save) => {
        if (!isEditing){
            return;
        }
        isEditing = false;

        const newName = input.value.trim();

        if (save) {
            if (!newName) {
                alert("Назва не може бути порожньою!");
                isEditing = true;
                input.focus();
                return;
            }

            const isDuplicate = products.some(p => p !== product && p.itemName.toLowerCase() === newName.toLowerCase());
            if (isDuplicate) {
                alert("Такий товар уже є у списку!!!");
                isEditing = true;
                input.focus();
                return;
            }

            product.itemName = newName;
            nameDiv.textContent = newName;

            const checkItems = document.querySelectorAll(".check-item");
            for (const checkItem of checkItems) {
                const name = checkItem.childNodes[0].textContent.trim().toLowerCase();
                if (name === oldName.toLowerCase()) {
                    checkItem.childNodes[0].textContent = newName;
                    break;
                }
            }
        }

        input.replaceWith(nameDiv);
    };

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            finishEdit(true);
        } else if (e.key === "Escape") {
            finishEdit(false);
        }
    });

    input.addEventListener("blur", () => {
        finishEdit(false);
    });

    nameDiv.replaceWith(input);
    input.focus();
}




