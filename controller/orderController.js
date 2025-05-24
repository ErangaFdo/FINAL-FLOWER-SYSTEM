import {customer_db, item_db,order_db} from "../db/db.js";
import orderDetailsModel from "../model/orderDetailsModel.js";
import orderModel from "../model/orderModel.js";

let cart_db =[]
let CartSubTotal = 0;

$(document).ready(function() {
    clearCart();
});


$('#cmbCustomerId').change(function () {
    var selectedValue = $(this).val();
    customer_db.map(function (Customer) {
        if (selectedValue.toString() === Customer.custId.toString()) {
            $('#custFName').val(Customer.custName);
            $('#custLname').val(Customer.contact);
            $('#custAddress').val(Customer.address);
        }
    });
});

$('#cmbItemCode').change(function () {
    var selectedValue = $(this).val();
    item_db.map(function (Item) {
        if (selectedValue.toString() === Item.itemId.toString()) {
            $('#orderItemName').val(Item.itemName);
            $('#orderItemPrice').val(Item.price);
            $('#orderItemQty').val(Item.qty);

        }
    });
});

function nextId() {
    if (order_db.length === 0) return "O001";

    let lastOrderId = order_db[order_db.length - 1].orderId;
    let number = parseInt(lastOrderId.slice(1), 10);
    let nextNumber = number + 1;
    return "O" + nextNumber.toString().padStart(3, '0');
}

let subTotal = 0;
let discountRate = 0;
let discount = 0;
let total = 0;

$('#addToCard').on('click', function () {
    let itemId = $('#cmbItemCode').val();
    let itemName = $('#orderItemName').val();
    let itemPrice = parseFloat($('#orderItemPrice').val());
    let itemStock = parseInt($('#orderItemQty').val());
    let orderedQty = parseInt($('#ordersQty').val());

    if (!itemId || !itemName || isNaN(itemPrice) || isNaN(itemStock) || isNaN(orderedQty)) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please fill in all fields correctly.',
        });
        return;
    }

    if (orderedQty > itemStock) {
        Swal.fire({
            icon: 'warning',
            title: 'Quantity Unavailable',
            text: "Not enough quantity available.",
        });
        return;
    }

    let total = itemPrice * orderedQty;

    for (let i = 0; i < item_db.length; i++) {
        if (item_db[i].itemId === itemId) {
            item_db[i].itemQuantity -= orderedQty;
            break;
        }
    }

    cart_db.push({
        itemId,
        itemName,
        orderedQty,
        itemPrice,
        total
    });

    let index = cart_db.length - 1;

    $('#cart-tBody').append(`
        <tr data-index="${index}">
            <td>${itemId}</td>
            <td>${itemName}</td>
            <td>${itemPrice.toFixed(2)}</td>
            <td>${orderedQty}</td>
            <td>${total.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm remove-cart-item" data-index="${index}">Remove</button></td>
        </tr>
    `);

    calculateTotal();

    Swal.fire({
        icon: 'success',
        title: 'Item Added',
        text: 'Item successfully added to cart.',
    });
});



$('#cart-tBody').on('click', '.remove-cart-item', function () {
    let index = $(this).data('index');

    cart_db.splice(index, 1);

    $('#cart-tBody').empty();
    cart_db.forEach((item, i) => {
        $('#cart-tBody').append(`
            <tr data-index="${i}">
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.itemPrice.toFixed(2)}</td>
                <td>${item.itemQty}</td>
                <td>${item.total}</td>
                <td><button class="btn btn-danger btn-sm remove-cart-item" data-index="${i}">Remove</button></td>
            </tr>
        `);
    });

    calculateTotal();
    updateCalculation();
});


function updateCalculation() {
    console.log(CartSubTotal);

    discountRate = parseFloat($('#rate').val()) || 0;
    discount = (CartSubTotal * discountRate) / 100;
    total = CartSubTotal - discount;

    $('#discount').text(`Discount : ${discount.toFixed(2)}`);
    $('#total').text(`Total : ${total.toFixed(2)}`);

    let cash = parseFloat($('#cash').val()) || 0;
    let balance = cash - total;
    $('#balance').text(`Balance : ${balance.toFixed(2)}`);
}

function calculateTotal() {
    let total = 0;

    cart_db.forEach((item) => {
        total += item.total;
    })

    console.log(total);
    $('#subTotal').text("Sub total :" + total.toFixed(2));
    CartSubTotal = total;
}

$('#rate').on('input', function (){
    updateCalculation();
})
$('#cash').on('input', function (){
    updateCalculation();
})


const updateItemTable = () => {
    $('#itemTbody').empty();
    item_db.slice(0, 5).forEach((item) => {
        let data = `<tr>
                            <td>${item.itemId}</td>
                            <td>${item.itemName}</td>
                            <td>${item.itemPrice}</td>
                            <td>${item.itemQuantity}</td>
                            </tr>`
        $('#itemTbody').append(data);
    });
}

$('#purchase').click(function () {
    let orderId = nextId();
    let orderDate = $('#orderDate').val();
    let cusId = $('#cmbCustomerId').val();
    let orderQty = $('#ordersQty').val();
    let discountRate = parseFloat($('#rate').val()) || 0;
    let total = parseFloat(CartSubTotal) || 0;

    let order = {
        orderId,
        orderDate,
        customerId: cusId,
        orderQty,
        discountRate,
        cart: [...cart_db],
        total
    };

    order_db.push(order);

    Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'The order has been successfully placed.',
    });

    loadOrderData();
    clearCart();

    for (let i = 0; i < order_db.length; i++) {
        let orderItem = order_db[i];
        $('#sales-tbody').append(`
            <tr>
                <td>${orderId}</td>
                <td>${cusId}</td>
                <td>${orderDate}</td>
                <td>${total}</td>
            </tr>
        `);
    }

});

function loadOrderData() {
    $('#OrderDetails-tbody').empty();

    order_db.forEach((order, index) => {
        $('#OrderDetails-tbody').append(`
            <tr>
                <td>${order.orderId}</td>
                <td>${order.orderDate}</td>
                <td>${order.customerId}</td>
                <td>${order.orderQty}</td>
                <td>${order.discountRate}%</td>
                <td>${order.total.toFixed(2)}</td>
            </tr>
        `);
    });
}

function clearCart() {
    cart_db = [];
    $('#orderId').val(nextId());
    $('#cart-tBody').empty();
    $('#subTotal').text("Sub Total : 0.00");
    $('#discount').text("Discount : 0.00");
    $('#total').text("Total : 0.00");
    $('#cash').val('');
    $('#balance').text("Balance : 0.00");
    CartSubTotal = 0;
}



function searchOderById(orderId) {
    let order = order_db.find(o => o._orderId === orderId);

    if (!order) {
        Swal.fire({
            title: "Not Found!",
            text: "No Order found with ID: " + orderId,
            icon: "warning"
        });
        return;
    }
}


$('#searchOrderButton').on('click', function () {
    let searchId = $('#searchOrderId').val().trim();
    if (searchId === '') {
        Swal.fire({
            title: "Order Is Not Found",
            text: "Unsuccessful Customer Search",
            icon: "error"
        });
    } else {
        Swal.fire({
            title: "Order is Find",
            text: "Successfully Customer Search",
            icon: "success"
        });
        searchOderById(searchId);
    }
});