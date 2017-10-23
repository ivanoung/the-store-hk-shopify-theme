$( document ).ready(function() {
    /*console.log($('nav.wsmenu ul.mega_menu li a').text()); 
    console.log('hello'); */
  
       $(".slick-slider").hover(function(){
     
          $(".slick-prev").toggleClass("arrow-animate-pre");
         $(".slick-next").toggleClass("arrow-animate-next");
        
        });
  
  
  $('nav.wsmenu ul.mega_menu li a').each(function( index ) {
    //console.log( index + ": " + $( this ).text() + ":"+ $( this ).text().length);

    var str = $( this ).text();
	str = str.split(" ");
    
    /*for (var i=0; i < str.length; str++) {
    	console.log(str[i]); 
      console.log('--------------'); 
    }*/
    
    /*if(/^[a-zA-Z0-9- ]*$/.test(str) == false) {
    	console.log('Illegal'); 
    } else {
   		console.log('not Illegal'); 
    }*/
    
    

         
    var i;
    for (i = 0; i < str.length; ++i) {
        // do something with `substr[i]`
      
      //console.log(str[i]);
    }
    
    //console.log('----------------------'); 
    
    
  });
  
//   $('body').on('click', '[name="checkout"], [name="goto_pp"], [name="goto_gc"]', function() {
//     if ($('.cart_agree').is(':checked')) {
//       $(this).submit();
//     }
//     else {
//       alert("By placing this order you agree to our terms and conditions.");
//       return false;
//     }
//   });
  
  $('.available_number_of_nav').each(function() {
    $(this).parents('.parent_sub_list').addClass('hide');
    
    if ($(this).val() == 3) {
      
      $(this).parents('.parent_sub_list').parent().find('.parent_sub_list').removeClass('col-lg-3 col-md-3 col-sm-3');
      $(this).parents('.parent_sub_list').parent().find('.parent_sub_list').addClass('col-lg-4 col-md-4 col-sm-4');
    	
    } else if ($(this).val() == 2) {
      $(this).parents('.parent_sub_list').parent().find('.parent_sub_list').removeClass('col-lg-3 col-md-3 col-sm-3');
      $(this).parents('.parent_sub_list').parent().find('.parent_sub_list').removeClass('col-lg-4 col-md-4 col-sm-4');
      
      $(this).parents('.parent_sub_list').parent().find('.parent_sub_list').addClass('col-lg-6 col-md-6 col-sm-6');
    }
  });
  
  $(".custom-toggle").click(function() {
    $('.custom-toggle-div').toggle();
  });
  $(".mobilemenu-close-b").on("click", function(){
    $(".wsmenucontainer").removeClass("wsoffcanvasopener");
    $('.mobilemenu-close-b').hide();
  });
  if($("#the-store-hong-kong").hasClass('template-index')){
    var __timer = setInterval(function(){
      if($(".gs-bar.gs-floating.gs-follow").length){
        $("<a href='/pages/contact-us' class='gs-mobile-phone noslimstat'><i class='social-buttons-phone'></i></a><a href='/pages/contact-us' class='gs-email noslimstat'><i class='social-buttons-email'></i></a>").insertBefore($(".gs-bar.gs-floating.gs-follow a:first"));
        clearInterval(__timer);
      }else if(typeof GSLoader !== undefined && GSLoader.loaded == true && $(".gs-bar.gs-floating.gs-follow").length == 0)
        clearInterval(__timer);
    }, 100);
  }
  
  if ($('#the-store-hong-kong .product_c').length) {
    
    $(window).resize(function() {
      initAccordion();
      resizeFooterColumns();
    });
  
  }else{
    $(window).resize(function() {
      resizeFooterColumns();
    });
  }
  
  $(".featured_image").elevateZoom();
  $(".featured_image").unbind("touchmove");
  $(".featured_image").unbind("end");
  
  var footer_container_row = $("#footer .f_mid .container .row"), footer_container_divs_width = 0;
  function resizeFooterColumns(){
    footer_container_divs_width = 0;
    $("#footer .f_mid .container .row > div:not(.medians)").each(function(k,i){
      footer_container_divs_width += $(i).outerWidth();
    });
    if($(window).width() >= 750){
    	$(".medians").width(((footer_container_row.width()-footer_container_divs_width)/3)+'px');
    }
  }
  
  function initAccordion(){
    if($('body').hasClass('template-product') || $('body').hasClass('template-collection') && $(".desc_blk").length){
      if($(window).width() <= 750){
        $('.desc_blk p:first-child').siblings('p').show();
        $(".desc_blk").accordion({
          collapsible: true,
          active: false,
          header: 'h5',
          heightStyle: 'content',
          beforeActivate: function(event, ui){
            if(ui.newHeader.length > 0 && $(".arrow-wrapper .wsmenu-arrow").hasClass("fa-angle-down")){
              $(".arrow-wrapper .wsmenu-arrow").removeClass("fa-angle-down");
              $(".arrow-wrapper .wsmenu-arrow").addClass("fa-angle-up");
            }else if(ui.newHeader.length == 0 && $(".arrow-wrapper .wsmenu-arrow").hasClass("fa-angle-up")){
              $(".arrow-wrapper .wsmenu-arrow").removeClass("fa-angle-up");
              $(".arrow-wrapper .wsmenu-arrow").addClass("fa-angle-down");
            }
          }
        });
        /*$('.desc_blk').on('show.bs.collapse', function () {
          console.log('hehe');
          if(!$(".wsmenu-click").hasClass("ws-activearrow"))
              $(".wsmenu-click").addClass("ws-activearrow");
        });
        $('.desc_blk').on('hide.bs.collapse', function () {
          console.log('haha');
         if($(".wsmenu-click").hasClass("ws-activearrow"))
              $(".wsmenu-click").removeClass("ws-activearrow");
        });*/
      }else{
        if($(".desc_blk").hasClass("ui-accordion"))
          $(".desc_blk").accordion("destroy");
        $('.desc_blk p:first-child').siblings('p').hide();
        $('.desc_blk .desc-wrapper .desc-readmore').off();
        $('.desc_blk .desc-wrapper .desc-readmore').on('click', function(e) {
          $(e.currentTarget).siblings('p:not(:first-child)').slideToggle(function(e){
            if($(this).is(":hidden")){
              $(this).siblings('.desc-readmore').find('.more').show();
              $(this).siblings('.desc-readmore').find('.less').hide();
            }else{
              $(this).siblings('.desc-readmore').find('.more').hide();
              $(this).siblings('.desc-readmore').find('.less').show();
            }
          });
        });
      }
    }
  }
  if($(".desc_blk").length){
  	$(window).resize(function() {
      initAccordion();
  	});
  	initAccordion();
  }
  resizeFooterColumns();
  
  function get_currency() {
  	if($( ".doubly-wrapper" ).length) {
      if ($(window).width() > 768) {
        $('ul.header_right').append($('.doubly-wrapper'));
      } else {
        $('ul.header_left_mobile').append($('.doubly-wrapper'));
      }
    }
  }
  
  $(window).load(function () {
    setTimeout(function () {
      get_currency();
      $( window ).resize(function() {
        get_currency();
      });
    }, 1000);
  });
  
});

