import { item_db } from "../db/db.js";
import itemModel from "../model/itemModel.js";

$(document).ready(function () {
    clear();
    loadItems();
});

$("#item-save").click(function () {
    let itemId = nextId();
    $("#itemId").val(itemId);
    let itemName = $("#itemName").val().trim();
    let qty = $("#qty").val().trim();
    let color = $("#color").val().trim();
    let price = $("#price").val().trim();

    if (itemId === '' || itemName === '' || qty === '' || color === '' || price === '') {
        alert("Please enter all fields.");
        return;
    }

    let item_data = new itemModel(itemId, itemName, qty, color, price);
    item_db.push(item_data);
    console.log(item_db);
    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });
    clear();
    loadItems();
    loadItemsId();
});

export function loadItems() {
    $("#item-tbody").empty();
    item_db.forEach(function (item) {
        let data = `<tr>
            <td>${item.itemId}</td>
            <td>${item.itemName}</td>
            <td>${item.qty}</td>
            <td>${item.color}</td>
            <td>${item.price}</td>
        </tr>`;
        $("#item-tbody").append(data);
    });
}

export function clear() {
    $("#itemId").val(nextId());
    $("#itemName").val('');
    $("#qty").val('');
    $("#color").val('');
    $("#price").val('');
}

$("#item-reset").click(function () {
    clear();
});

$("#item-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let item = item_db[index];

    if (item) {
        $("#itemId").val(item.itemId);
        $("#itemName").val(item.itemName);
        $("#qty").val(item.qty);
        $("#color").val(item.color);
        $("#price").val(item.price);
    }
});

$('#item-delete').click(function () {
    let itemId = $("#itemId").val().trim();

    if (itemId === '') {
        alert("Please select an item to delete.");
        return;
    }

    let index = item_db.findIndex(item => item.itemId == itemId);
    if (index !== -1) {
        item_db.splice(index, 1);
        Swal.fire({
            title: "Deleted Successfully!",
            icon: "success"
        });
        clear();
        loadItems();
    } else {
        alert("Item not found.");
    }
});

$('#item-update').click(function () {
    let itemId = $("#itemId").val().trim();
    let itemName = $("#itemName").val().trim();
    let qty = $("#qty").val().trim();
    let color = $("#color").val().trim();
    let price = $("#price").val().trim();

    if (itemId === '' || itemName === '' || qty === '' || color === '' || price === '') {
        alert("Please enter all fields.");
        return;
    }

    let index = item_db.findIndex(item => item.itemId == itemId);
    if (index !== -1) {
        item_db[index] = new itemModel(itemId, itemName, qty, color, price);
        Swal.fire({
            title: "Updated Successfully!",
            icon: "success"
        });
        clear();
        loadItems();
    } else {
        alert("Item not found.");
    }
});

function nextId() {
    if (item_db.length === 0) return 1001;
    let lastItem = Number(item_db[item_db.length - 1].itemId);
    return lastItem + 1;
}

export function loadItemsId() {
    $('#cmbItemCode').empty();
    $('#cmbItemCode').append($('<option>', {
        value: '',
        text: 'Select item ID'
    }));
    item_db.forEach(item => {
        $('#cmbItemCode').append(
            $('<option>', {
                value: item.itemId,
                text: item.itemId
            })
        );
    });
}