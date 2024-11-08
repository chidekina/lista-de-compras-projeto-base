let itemsList = [];
let itemToBeEdited;

const form = document.getElementById('form-itens');
const inputItems = document.getElementById('receber-item');
const ulItems = document.getElementById('lista-de-itens');
const ulBoughtItens = document.getElementById('itens-comprados');
const recoveredList = localStorage.getItem('itemsList');

function updateLocalStorage() {
    localStorage.setItem('itemsList', JSON.stringify(itemsList));
}

if (recoveredList) {
    itemsList = JSON.parse(recoveredList);
    showItems();
} else {
    itemsList = [];
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveItem();
    showItems();
    inputItems.focus();
})

function saveItem() {
    const buyingItem = inputItems.value;
    const checkDuplicates = itemsList.some((element) => element.item.toUpperCase() === buyingItem.toUpperCase())

    if (checkDuplicates) {
        alert('Item ja inserido.')
    } else {
        itemsList.push({
            item: buyingItem,
            check: false
        })
    }

    inputItems.value = '';
}

function showItems() {
    ulItems.innerHTML = '';
    ulBoughtItens.innerHTML = '';

    itemsList.forEach((element, index) => {
        if (element.check) {
            ulBoughtItens.innerHTML += `
             <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />  
            <span class="itens-comprados is-size-5">${element.item}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>`
        } else {
            ulItems.innerHTML += `
         <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" class="is-clickable" />
            <input type="text" class="is-size-5" value="${element.item}" ${index !== Number(itemToBeEdited) ? 'disabled' : ''}></input>
        </div>
        <div>
            ${ index === Number(itemToBeEdited) ? '<button onclick="saveEdition()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>`
        }
    })

    const inputCheck = document.querySelectorAll('input[type="checkbox"]');

    inputCheck.forEach(i => {
        i.addEventListener('click', (event) => {
            const elementValue = event.target.parentElement.parentElement.getAttribute('data-value');
            itemsList[elementValue].check = event.target.checked;
            showItems();
        })
    })

    const deleteObj = document.querySelectorAll('.deletar');

    deleteObj.forEach(i => {
        i.addEventListener('click', (event) => {
            const elementValue = event.target.parentElement.parentElement.getAttribute('data-value');
            itemsList.splice(elementValue, 1);
            showItems();
        })
    })

    const editItems = document.querySelectorAll('.editar');

    editItems.forEach(i => {
        i.addEventListener('click', (event) => {
            itemToBeEdited = event.target.parentElement.parentElement.getAttribute('data-value');
            showItems();
        })
    })

    updateLocalStorage();
}


function saveEdition() {
    const editedItem = document.querySelector(`[data-value="${itemToBeEdited}"] input[type="text"]`);
    itemsList[itemToBeEdited].item = editedItem.value;
    console.log(itemsList);
    itemToBeEdited = -1;
    showItems();
}