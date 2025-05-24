export default class orderModel {
    constructor(orderId, date, customerId, customerFname,customerLname, customerAddress, itemCode, itemName, ItemPrice, itemQty, OrderQty, subTotal) {
        this._orderId = orderId;
        this._date = date;
        this._customerId = customerId;
        this._customerFname = customerFname;
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._itemPrice = ItemPrice;
        this._itemQty = itemQty;
        this._OrderQty = OrderQty;
        this._subTotal = subTotal;
        this._customerLname = customerLname;
        this._customerAddress = customerAddress;
        this._ItemPrice = ItemPrice;

    }

    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        this._customerId = value;
    }

    get customerFname() {
        return this._customerFname;
    }

    set customerFname(value) {
        this._customerFname = value;
    }

    get customerLname() {
        return this._customerLname;
    }

    set customerLname(value) {
        this._customerLname = value;
    }

    get customerAddress() {
        return this._customerAddress;
    }

    set customerAddress(value) {
        this._customerAddress = value;
    }

    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get ItemPrice() {
        return this._ItemPrice;
    }

    set ItemPrice(value) {
        this._ItemPrice = value;
    }

    get itemQty() {
        return this._itemQty;
    }

    set itemQty(value) {
        this._itemQty = value;
    }

    get OrderQty() {
        return this._OrderQty;
    }

    set OrderQty(value) {
        this._OrderQty = value;
    }

    get subTotal() {
        return this._subTotal;
    }

    set subTotal(value) {
        this._subTotal = value;
    }
}