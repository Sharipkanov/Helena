var allPrices = {},
    totalPrice = 0,
    itemPrice = 0,
    itemCalcPrice = 0,
    deliveryPrice = 0,
    buildPrice = 0;

$(document).ready(function () {
    $('.phone-input').mask('+7 (000) 000-0000');

    $('[data-uk-slideset]').on('show.uk.slideset', function(e){
        var sliderContainer = $(this).find('.uk-slideset'),
            slideHeight = sliderContainer.find('li.uk-active').outerHeight();

        sliderContainer.css('height', slideHeight);
    });

    var scrollSettings = getBrowserScrollSize();

    $('.uk-modal').on({

        'show.uk.modal': function(){
            $('.b_akcyi').css('padding-right', scrollSettings.width);
        },

        'hide.uk.modal': function(){
            $('.b_akcyi').css('padding-right', 0);
        }
    });

    $(window).scroll(function (e) {
        var headerHeight = $('.main-header').outerHeight(),
            documentScroll = $(document).scrollTop(),
            blockTopFix = $('.b_akcyi');


        if(documentScroll > headerHeight + 300) {
            blockTopFix.addClass('active');
        } else {
            blockTopFix.removeClass('active');
        }
    });

    $('.b_mForm').submit(function (e) {
        e.preventDefault();

        var that = $(this),
            form = e.target,
            serialized = serializeForm(form),
            url = '/mail.php';

        $.post(url, serialized, function(response) {
            console.log(typeof response);
            if(response === '1') {
                $('.uk-modal-close.uk-close').click();
            }
        });

        return false;
    });

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

        itemPrice = allPrices.items[dataAttr]['price'];
        totalPrice = itemPrice;
        updateTotalPrice(totalPrice);
        insertItemPrice(itemPrice);
        itemCalcPrice = itemPrice;
        updateCalcPrice(itemCalcPrice);

        $('.calcPriceInput').val(1);
        $('[name="product"]').val(allPrices.items[dataAttr]['name']);
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
    $('.price-base').text(allPrices.items.base.price);
    $('.price-le').text(allPrices.items.le.price);
    $('.price-xle').text(allPrices.items.xle.price);
}

function checkDelivery() {
    $('[data-btn-to-delivery]').each(function (e) {
        var that = $(this),
            data = that.data('btn-to-delivery'),
            delivery = $('#delivery-price'),
            input = $('[name="delivery"]');

        if(that.hasClass('active')) {
            if(data === 'yes') {
                delivery.text(allPrices.delivery);
                totalPrice += allPrices.delivery;
                deliveryPrice = allPrices.delivery;
                updateTotalPrice(totalPrice);
                input.val('Да');
            } else {
                delivery.text('0');
                totalPrice -= allPrices.delivery;
                deliveryPrice = 0;
                updateTotalPrice(totalPrice);
                input.val('Нет');
            }
        }
    });
}

function checkBuild() {
    $('[data-btn-to-build]').each(function (e) {
        var that = $(this),
            data = that.data('btn-to-build'),
            build = $('#build-price'),
            input = $('[name="build"]');

        if(that.hasClass('active')) {
            if(data === 'yes') {
                build.text(allPrices.build);
                totalPrice += allPrices.build;
                buildPrice = allPrices.build;
                updateTotalPrice(totalPrice);
                input.val('Да');
            } else {
                build.text('0');
                totalPrice -= allPrices.build;
                buildPrice = 0;
                updateTotalPrice(totalPrice);
                input.val('Нет');
            }
        }
    });
}

function updateTotalPrice($totalPrice) {
    $('#total-price').text($totalPrice);
    $('[name="totalPrice"]').val($totalPrice);
}

function insertItemPrice($price) {
    $('#item-price').text($price);
}

function updateCalcPrice($price) {
    $('#calc-price').text($price);
}

function getBrowserScrollSize(){

    var css = {
        "border":  "none",
        "height":  "200px",
        "margin":  "0",
        "padding": "0",
        "width":   "200px"
    };

    var inner = $("<div>").css($.extend({}, css));
    var outer = $("<div>").css($.extend({
        "left":       "-1000px",
        "overflow":   "scroll",
        "position":   "absolute",
        "top":        "-1000px"
    }, css)).append(inner).appendTo("body")
        .scrollLeft(1000)
        .scrollTop(1000);

    var scrollSize = {
        "height": (outer.offset().top - inner.offset().top) || 0,
        "width": (outer.offset().left - inner.offset().left) || 0
    };

    outer.remove();
    return scrollSize;
}

// Clear Form
function clearForm($form) {
    for(var i=0; i<$form.length - 1; i++) {
        if($form[i].type === 'checkbox') $form[i].checked = false;
        else $form[i].value = "";
    }

}

// Serialize Form
function serializeForm($form) {
    var returnObject = {},

        tempMeta = {}, hasMeta = false;

    for(var i=0; i<$form.length; i++) {

        if($form[i].type !== 'submit' && $form[i].name !== 'thumbnail' && $form[i].name !== '') {
            var tempName = $form[i].name.toString(),
                tempVal = $form[i].value;

            if(tempName.indexOf('meta') !== -1) {
                var meta = tempName.split('.');

                hasMeta = true;
                tempMeta[meta[1]] = tempVal;
            } else returnObject[tempName] = tempVal;

            if($form[i].type === 'checkbox') {
                if($form[i].checked === true) returnObject[tempName] = 1;
                else returnObject[tempName] = 0;
            }
        }
    }

    if(hasMeta) returnObject['meta'] = tempMeta;

    return returnObject;
}