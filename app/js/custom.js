var allPrices = {},
    totalPrice = 0,
    itemPrice = 0,
    itemCalcPrice = 0,
    deliveryPrice = 0,
    buildPrice = 0;

$(document).ready(function () {
    $.get('/prices.json', function (data) {
        allPrices = data;

        appendPrices();
    });

    $('.calcPriceInput').keyup(function (e) {
        var that = $(this),
            val = that.val();

        if(val > -1 && val !== '') {
            totalPrice = 0;
            itemCalcPrice = itemPrice * val;
            totalPrice = itemCalcPrice + deliveryPrice + buildPrice;

            updateCalcPrice(itemCalcPrice);
            updateTotalPrice(totalPrice);
        }
    });

    $('[data-buy]').click(function (e) {

        var dataAttr = this.dataset.buy;

        itemPrice = allPrices.items[dataAttr];
        totalPrice = itemPrice;
        updateTotalPrice(totalPrice);
        insertItemPrice(itemPrice);
        itemCalcPrice = allPrices.items[dataAttr];
        updateCalcPrice(itemCalcPrice);
    });

    $('[data-btn-to-delivery]').click(function (e) {
        e.preventDefault();

        var that = $(this),
            data = that.data('btn-to-delivery'),
            allBtns = $('[data-btn-to-delivery]');

        allBtns.removeClass('active');
        that.addClass('active');
        
        checkDelivery(allBtns);

        return false;
    });

    $('[data-btn-to-build]').click(function (e) {
        e.preventDefault();

        var that = $(this),
            data = that.data('btn-to-build'),
            allBtns = $('[data-btn-to-build]');

        allBtns.removeClass('active');
        that.addClass('active');

        checkBuild(allBtns);

        return false;
    });
});

function appendPrices() {
    $('.price-delivery').text(allPrices.delivery);
    $('.price-build').text(allPrices.build);
    $('.price-base').text(allPrices.items.base);
    $('.price-le').text(allPrices.items.le);
    $('.price-xle').text(allPrices.items.xle);
}

function checkDelivery() {
    $('[data-btn-to-delivery]').each(function (e) {
        var that = $(this),
            data = that.data('btn-to-delivery'),
            delivery = $('#delivery-price');

         if(that.hasClass('active')) {
             if(data === 'yes') {
                 delivery.text(allPrices.delivery);
                 totalPrice += allPrices.delivery;
                 deliveryPrice = allPrices.delivery;
                 updateTotalPrice(totalPrice);
             } else {
                 delivery.text('0');
                 totalPrice -= allPrices.delivery;
                 deliveryPrice = 0;
                 updateTotalPrice(totalPrice);
             }
         }
    });
}

function checkBuild() {
    $('[data-btn-to-build]').each(function (e) {
        var that = $(this),
            data = that.data('btn-to-build'),
            build = $('#build-price');

        if(that.hasClass('active')) {
            if(data === 'yes') {
                build.text(allPrices.build);
                totalPrice += allPrices.build;
                buildPrice = allPrices.build;
                updateTotalPrice(totalPrice);
            } else {
                build.text('0');
                totalPrice -= allPrices.build;
                buildPrice = 0;
                updateTotalPrice(totalPrice);
            }
        }
    });
}

function updateTotalPrice($totalPrice) {
    $('#total-price').text($totalPrice)
}

function insertItemPrice($price) {
    $('#item-price').text($price)
}

function updateCalcPrice($price) {
    $('#calc-price').text($price)
}