import { customer_db } from "../db/db.js";
import customerModel from "../model/customerModel.js";

$(document).ready(function () {
    clearCustomer();
    loadCustomers();
});

$("#customer-save").click(function () {
    let custId = nextCustomerId();
    $("#cusId").val(custId);
    let custName = $("#cusName").val().trim();
    let age = $("#age").val().trim();
    let contact = $("#contact").val().trim();
    let address = $("#address").val().trim();

    if (custName === '' || age === '' || contact === '' || address === '') {
        alert("Please enter all fields.");
        return;
    }

    let customer = new customerModel(custId, custName, age, contact, address);
    customer_db.push(customer);
    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });
    clearCustomer();
    loadCustomers();
    loadCustomerIds()
});

export function loadCustomers() {
    $("#customer-tbody").empty();
    customer_db.forEach(function (cust) {
        let row = `<tr>
            <td>${cust.custId}</td>
            <td>${cust.custName}</td>
            <td>${cust.age}</td>
            <td>${cust.contact}</td>
            <td>${cust.address}</td>
        </tr>`;
        $("#customer-tbody").append(row);
    });
}

export function clearCustomer() {
    $("#cusId").val(nextCustomerId());
    $("#cusName").val('');
    $("#age").val('');
    $("#contact").val('');
    $("#address").val('');
}

$("#customer-reset").click(function () {
    clearCustomer();
});

$("#customer-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let customer = customer_db[index];

    if (customer) {
        $("#cusId").val(customer.custId);
        $("#cusName").val(customer.custName);
        $("#age").val(customer.age);
        $("#contact").val(customer.contact);
        $("#address").val(customer.address);
    }
});

$("#customer-delete").click(function () {
    let custId = $("#cusId").val().trim();

    if (custId === '') {
        alert("Please select a customer to delete.");
        return;
    }

    let index = customer_db.findIndex(cust => cust.custId == custId);
    if (index !== -1) {
        customer_db.splice(index, 1);
        Swal.fire({
            title: "Deleted Successfully!",
            icon: "success"
        });
        clearCustomer();
        loadCustomers();
    } else {
        alert("Customer not found.");
    }
});

$("#customer-update").click(function () {
    let custId = $("#cusId").val().trim();
    let custName = $("#cusName").val().trim();
    let age = $("#age").val().trim();
    let contact = $("#contact").val().trim();
    let address = $("#address").val().trim();

    if (custName === '' || age === '' || contact === '' || address === '') {
        alert("Please enter all fields.");
        return;
    }

    let index = customer_db.findIndex(cust => cust.custId == custId);
    if (index !== -1) {
        customer_db[index] = new customerModel(custId, custName, age, contact, address);
        Swal.fire({
            title: "Updated Successfully!",
            icon: "success"
        });
        clearCustomer();
        loadCustomers();
    } else {
        alert("Customer not found.");
    }
});

function nextCustomerId() {
    if (customer_db.length === 0) return 2001;
    let lastId = Number(customer_db[customer_db.length - 1].custId);
    return lastId + 1;
}



function loadCustomerIds() {
    $('#cmbCustomerId').empty();
    $('#cmbCustomerId').append($('<option>', {
        value: '',
        text: 'Select Customer ID'
    }));
    console.log(customer_db);
    customer_db.forEach(customer => {
        $('#cmbCustomerId').append(
            $('<option>', {
                value: customer.custId,
                text: customer.custId
            })
        );
    });
}