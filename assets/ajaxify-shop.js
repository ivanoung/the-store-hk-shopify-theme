/**
 * Shopify Ajaxify Shop. 
 * 
 * @uses Modified Shopify jQuery API (link to it)
 *
 */

// Binding events every time when open modal window with cart
var  bindEventsInCart = function(){

  $(".cart_menu").on("click",".remove_item_button", function(e){
    e.preventDefault();

    var el = $(this),
        id = el.data('id') || null;

    Shopify.removeItem(id, function(cart){
      Shopify.updateQuickCart(cart);
    });
  });

  /////////////////////////////////////
  // Qty for cart modal
  /////////////////////////////////////
  jQuery(".cart_menu").on("click", ".minus_btn", function () {
    var inputEl = jQuery(this).parent().find("input");
    var qty = inputEl.val();
    if (jQuery(this).parent().hasClass("minus_btn"))
      qty++;
    else
      qty--;
    if (qty < 0)
      qty = 0;
    inputEl.val(qty);

    var quantity = qty,
        id = inputEl.data("id");
    if(quantity != 0){
      Shopify.changeItem(id, quantity, function(cart){
        Shopify.updateQuickCart(cart);
      });
    }
    else{
      Shopify.removeItem(id, function(cart){
        Shopify.updateQuickCart(cart);
      });
    }
  })


  jQuery(".cart_menu").on("click",".plus_btn", function () {
    var inputEl = jQuery(this).parent().find("input");
    var qty = inputEl.val();

    if (jQuery(this).hasClass("plus_btn"))
      qty++;
    else
      qty--;
    if (qty < 0)
      qty = 0;


    var quantity = qty,
        id = inputEl.data("id");


    Shopify.changeItem(id, quantity, function(cart){
      var updatedItem = cart.items.filter(function(item){ return item.variant_id == id });
      if(updatedItem.length && updatedItem[0].quantity == quantity){
        Shopify.updateQuickCart(cart);
        inputEl.val(quantity);
      }
      else{
        jQuery('.ajaxcart__item__' + id + '__errors').show().delay(2000).fadeOut();
      }
    });

  })

  /// Save cart note///
  $(".cart_menu").on("focusout","textarea", function(){
    var note = $(this).val(),
        textareas = $(".div.cart_menu").find("textarea").add($(".cart_tbl textarea"));

    Shopify.updateCartNote(note, function(){
      $(textareas).each(function () {
        $(this).val(note);
        $(this).text(note);
      });
    });
  });

  /// Closing modal///
  $(".cart_menu").on("click",".info_btn", function(){
    var magnificPopup = $.magnificPopup.instance;
    if(typeof magnificPopup !== 'undefined'){
      magnificPopup.close();
    }
  });
  $(".cart_menu").on("click",".btn_close", function(){
    var magnificPopup = $.magnificPopup.instance;
    if(typeof magnificPopup !== 'undefined'){
      magnificPopup.close();
    }
  });
}

jQuery(document).ready(function() { 
  //Begin Wrapper

  var jQ = jQuery;

  /**
 * Collection of Selectors for various pieces on the page we need to update 
 *
 * I've tried to keep these as general and flexible as possible, but 
 * if you are doing your own markup, you may find you need to change some of these.
 *
 */
  var selectors = {
    // Any elements(s) with this selector will have the total item count put there on add to cart.
    TOTAL_ITEMS: '.count', 
    TOTAL_PRICE: '.cart-total-price',
    SUBMIT_ADD_TO_CART: 'input[type=image], input.submit-add-to-cart',
    FORM_ADD_TO_CART: 'form[action*="/cart/add"]',
    FORM_UPDATE_CART: 'form[name=cartform]',
    //The actual Update Button
    FORM_UPDATE_CART_BUTTON: 'form[name=cartform] input[name=update]',
    //All the buttons on the form
    FORM_UPDATE_CART_BUTTONS: 'input[type=image], input.button-update-cart',
    LINE_ITEM_ROW: '.cart-line-item',
    LINE_ITEM_QUANTITY_PREFIX: 'input#updates_',
    LINE_ITEM_PRICE_PREFIX: '.cart-line-item-price-',
    LINE_ITEM_REMOVE: '.remove a',
    EMPTY_CART_MESSAGE: '#empty',
    QUICK_CART_MENU: 'div.cart_menu',
    CART_PAGE_MENU: '.cart_tbl'
  };

  /**
 * Collection of text strings. This is where you would change for a diff language, for example. 
 *
 */
  var text = {
    ITEM: 'Item', 
    ITEMS: 'Items'
  };

  //Convenience method to format money. 
  //Can just transform the amount here if needed
  window.formatMoney = function(price) {
    return Shopify.formatMoney(price, app.data.money_format);
  };

  //We only want to interrupt the UPDATE, not the CHECKOUT process
  jQ(selectors.FORM_UPDATE_CART_BUTTON).click(function(e) {
    e.preventDefault();
    jQ(e.target.form).find(selectors.FORM_UPDATE_CART_BUTTONS).attr('disabled', true).addClass('disabled');
    Shopify.updateCartFromForm(e.target.form);
  });

  //Delegate the Remove Link functionality on the cart page.
  jQ(selectors.FORM_UPDATE_CART).delegate(selectors.LINE_ITEM_REMOVE, 'click', function(e) {
    e.preventDefault();
    //Get the variant ID from the URL
    var vid = this.href.split('/').pop().split('?').shift();
    Shopify.removeItem(vid);
    jQ(this).parents(selectors.LINE_ITEM_ROW).remove();
  });

  /**
 * Shopify.showModal
 * 
 * @param string contents
 * @param integer hideDelay
 */
  Shopify.modalTimer = false;
  Shopify.showModal = function(contents,hideDelay) {
    $("html").css("overflow-y","hidden");

    //Ensure the plugin is loaded
    if(typeof $().magnificPopup !== 'function'){ return }

    //Check the function vars have been sent
    if(typeof contents === 'undefined'){ return }
    //if(typeof hideDelay === 'undefined'){ var hideDelay = 7000 /* default */ }

    //Open the modal
    $.magnificPopup.open({
      items: {
        src: '<div class="mfp-with-anim modal-popup">'+contents+'</div>',
        type: 'inline'
      },
      mainClass: 'mfp-move-from-top',
      removalDelay: 1000,
      callbacks: {
        close: function() {
          $("html").css("overflow-y","auto");
        }
      }
    });

    bindEventsInCart();
  };

  
  Shopify.addImageSize = function(src,size){
    if(typeof size === 'undefined'){ return src; }

    if(src === null){ return "\/\/cdn.shopify.com\/s\/files\/1\/1771\/9349\/t\/24\/assets\/no-image.gif?14358554982088913774" }

    size = '_' + size + '.';
    return src.replace(/.([^.]*)$/,size+'$1');
  };

  
  Shopify.updateQuickCart = function(cart){
    
    var t = jQ(selectors.QUICK_CART_MENU),
        c = jQ(selectors.CART_PAGE_MENU);
    if(t.length){

      if(cart.items.length){

        var toAppend = [],
            tableHeader = '<ul><li>Photo</li>'+
        '<li>Name</li>'+
        '<li>Price</li>'+
        '<li>Quantity</li>'+
        '<li>Total</li></ul>';

        for (var i = 0; i < cart.items.length; i++) {
          var itemPrice = cart.items[i].price,
              totalPrice = cart.total_price,
              linePrice = cart.items[i].line_price,
              title = cart.items[i].variant_title,
              cartNote = cart.note;

          if(title == null){
            title = "";
          }
          if(cartNote == null){
            cartNote = "";
          }

          //convert prices
          var itemPriceConverted = Shopify.formatMoney(itemPrice,app.data.money_format),
              totalPriceConverted = Shopify.formatMoney(totalPrice,app.data.money_format),
              linePriceConverted = Shopify.formatMoney(linePrice,app.data.money_format);                  
          
          
          if(typeof Currency !== 'undefined' && shopCurrency && cookieCurrency){
            
            var convertedPrice = Currency.convert(itemPrice,shopCurrency,cookieCurrency);
            itemPriceConverted = Shopify.formatMoney(convertedPrice, Currency.moneyFormats[cookieCurrency].money_with_currency_format);
            var totalConvertedPrice = Currency.convert(totalPrice,shopCurrency,cookieCurrency);
            totalPriceConverted = Shopify.formatMoney(totalConvertedPrice, Currency.moneyFormats[cookieCurrency].money_with_currency_format);
            var lineConvertedPrice = Currency.convert(linePrice,shopCurrency,cookieCurrency);
            linePriceConverted = Shopify.formatMoney(lineConvertedPrice, Currency.moneyFormats[cookieCurrency].money_with_currency_format);
          }
          

          var row = '<ul><li><div class="thumb"><a href="' + cart.items[i].url + 
              '"><img src="' + Shopify.addImageSize(cart.items[i].image,'small') + '" alt="' + cart.items[i].title + 
              '"></a></div></li><li><h5><a href="' + cart.items[i].url + 
              '" class="item-name">' + cart.items[i].product_title + 
              '</a></h5><p class="product-type">'+title+'</p><a href="#" data-id="'+cart.items[i].id+'" class="remove_item_button">REMOVE</a></li>'+
              '<li><p class="mobile-label-price">Price</p><span class="money price">'+itemPriceConverted+'</span></li>'+
              '<li><p class="mobile-label-quantity">Quantity</p><a class="minus_btn"></a><input type="text" name="updates[]" class="txtbox" min="0" id="updates_'+cart.items[i].id+'" data-id="'+cart.items[i].id+'" value="'+cart.items[i].quantity+'" /><a class="plus_btn"></a>'+
              '<div class="ajaxcart__errors text-center ajaxcart__item__'+cart.items[i].id+'__errors">All available stock is in cart</div></li>'+    
              '<li><p class="mobile-label-total">Total</p><span class="money price">'+ linePriceConverted +'</span>'+
              '</li></ul>';
          toAppend.push(row);
        };

        var checkoutRow = t.find('div.checkout_row'),
            subtotalRow = t.find('span.total-price'),
            subtotalRowCartPage = c.find("span.total-price");
        if(checkoutRow.length){ /* we have existing items in the quick cart */
          t.find('div.cart_row').html(toAppend.join(''));
          t.find('div.cart_row').prepend(tableHeader);
          c.find(".con_row").html(toAppend.join(''));
          subtotalRowCartPage.html(totalPriceConverted);
          subtotalRow.html(totalPriceConverted);
        }else{
          checkoutRow = '<div class="checkout_row clearfix"><button type="submit" name="checkout" value="Check Out" class="btn_c">Check Out</button> <a href="javascript:void(0)" class="info_btn"><span class="fa fa-chevron-left"></span>Continue Shopping</a></div>';
          subtotalRow = '<div class="total_row clearfix"><ul><li><span class="total_val">Subtotal:</span><span class="money total-price">'+totalPriceConverted+'</span></li></ul></div>';
          var form = jQ('<form />',{
            'action':'/cart',
            'method':'post',
            'novalidate':'novalidate'
          })
              
              var currencyNote = '<p><strong>Note:</strong>  processes all orders in . While the content of your cart may be displayed in another currency, you will checkout using  at the most current exchange rate.</p>';
              
              if(true){
                var notesRow='<div class="clearfix order_notes">'+
                    '<label for="cartSpecialInstructions" class="sr-only">Preferred delivery time and special delivery instructions:</label>'+
                    '<textarea name="note" id="cartSpecialInstructionsFromPopup" class="note_text" placeholder="Preferred delivery time and special delivery instructions">'+ cartNote +'</textarea></div>';
              }
          else{
            var notesRow='';
          }
         // var terms_conditions = "<div><p style='float: none; text-align: right; clear: both; margin: 10px 0;'>"+
          						 //"<input style='float:none; vertical-align: middle;' type='checkbox' id='agree' class='cart_agree' />"+
        						 //"<label style='display:inline; float:none' for='agree'>"+
          						 //"I agree with the <a href='/pages/terms-conditions'>terms and conditions</a>.</label></p></div>";
          form.append($("div.cart_row"));
          form.find("div.cart_row").html(toAppend.join(''));
          form.find('div.cart_row').prepend(tableHeader);
          form.append(subtotalRow);
          form.append(notesRow);
          
          form.append(currencyNote);
          
          //form.append(terms_conditions);
          form.append(checkoutRow);
          form.append($additionalCheckout);
          t.append(form);
   
        }

      }
      else{
        t.html('<div class="menu_title clearfix"><h4>Shopping Cart</h4> </div><div class="cart_row"><div class="empty-cart">Your cart is currently empty.</div><p><a href="javascript:void(0)" class="btn_c btn_close">Continue Shopping</a></p></div>'); 
        c.html('<div class="empty-cart-message"><p>Your cart is currently empty.</p><p><a href="/collections/all" class="btn_c">Continue Shopping</a></p></div');
       }  
      } 
        if(!$(selectors.CART_PAGE_MENU).length){
          setTimeout(function(){        
            Shopify.showModal($(selectors.QUICK_CART_MENU).wrap('<p>').parent().html());
          }, 500);
        }
        Shopify.onCartUpdate(cart);         
      
      };
      /**
 * This updates the N item/items left in your cart
 * 
 * It's setup to match the HTML used to display the Cart Count on Load. If you change that (in your theme.liquid) 
 * you will probably want to change the message html here. 
 * This will update the HTML in ANY element with the class defined in selectors.TOTAL_ITEMS
 *
 * @param object the cart object. 
 * @param HTMLElement form. If included, we know its an Update of the CART FORM, which will trigger additional behaviour. 
 */
      Shopify.onCartUpdate = function(cart, form) {

        // Total Items Update
        var message = cart.item_count;
        if(cart.item_count > 0){
          jQ(selectors.TOTAL_ITEMS).text(message).removeClass('hidden');
        }else{
          jQ(selectors.TOTAL_ITEMS).text('').addClass('hidden');
        }
      };

      Shopify.onError = function(XMLHttpRequest, textStatus) {
        var response = jQuery.parseJSON(XMLHttpRequest.responseText);
        var error = response.description;

        if(typeof $().magnificPopup !== 'function'){ 
          alert(error) ;
        }else{
          $.magnificPopup.open({
            items: {
              src: '<div class="mfp-with-anim modal-popup error"><h3>Error</h3>'+error+'</div>',
              type: 'inline'
            },
            mainClass: 'mfp-move-from-top',
            removalDelay: 1000
          });
        }
      };

      // Changes for cart page ///
/// Add Additional Checkout button to modal ///   
    setTimeout(function(){
         $additionalCheckout = $(".addCheckOut").clone().css("display","block"); 
      }, 1000);
      
      $(".cart_tbl").on("focusout","textarea", function(){
        var note = $(this).val(),
            textareas = jQ(selectors.QUICK_CART_MENU).find("textarea");

        Shopify.updateCartNote(note);
      });

      jQuery(".cart_tbl").on("click",".plus_btn", function () {
        var inputEl = jQuery(this).parent().find("input");
        var qty = inputEl.val();

        if (jQuery(this).hasClass("plus_btn"))
          qty++;
        else
          qty--;
        if (qty < 0)
          qty = 0;

        var quantity = qty,
            id = inputEl.data("id");

        Shopify.changeItem(id, quantity, function(cart){
          var updatedItem = cart.items.filter(function(item){ return item.variant_id == id });
          if(updatedItem.length && updatedItem[0].quantity == quantity){
            Shopify.updateQuickCart(cart);
            inputEl.val(quantity);
          }
          else{
            jQuery('.ajaxcart__item__' + id + '__errors').show().delay(3000).fadeOut();
          }
        });

      })

      jQuery(".cart_tbl").on("click", ".minus_btn", function () {
        var inputEl = jQuery(this).parent().find("input");
        var qty = inputEl.val();
        if (jQuery(this).parent().hasClass("minus_btn"))
          qty++;
        else
          qty--;
        if (qty < 0)
          qty = 0;
        inputEl.val(qty);

        var quantity = qty,
            id = inputEl.data("id");
        if(quantity != 0){
          Shopify.changeItem(id, quantity, function(cart){
            Shopify.updateQuickCart(cart);
          });
        }
        else{
          Shopify.removeItem(id, function(cart){
            Shopify.updateQuickCart(cart);
          });
        }
      });

      $(".cart_tbl").on("click",".remove_item_button", function(e){
        e.preventDefault();

        var el = $(this),
            id = el.data('id') || null;

        Shopify.removeItem(id, function(cart){
          Shopify.updateQuickCart(cart);
        });
      });
      /// End  Changes for cart page  ///

      //End Wrapper    
    });