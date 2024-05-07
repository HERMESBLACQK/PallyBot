/* ===================================================================

  Minimizing Menu Bar 

  =================================================================== */

  $(document).ready(function() {

  "use strict";

  $(window).on('scroll', function() {

    if($(document).scrollTop()>100) {
      $('#navbar-container').addClass('minimize-navbar');
    }
    else {
      $('#navbar-container').removeClass('minimize-navbar');
    }

  });

});



/* ===================================================================

   PAGE LOADER EFFECT 

   =================================================================== */
	$(window).on("load", function(e) {
		$("#global-loader").fadeOut("slow");
	})


/* ===================================================================

   SCROLL TO TOP BUTTON

   =================================================================== */
	$(window).on("scroll", function(e) {
    	if ($(this).scrollTop() > 0) {
            $('#back-to-top').fadeIn('slow');
        } else {
            $('#back-to-top').fadeOut('slow');
        }
    });
    $("#back-to-top").on("click", function(e){
        $("html, body").animate({
            scrollTop: 0
        }, 300);
        return false;
    });


/* ===================================================================

   NOFICATION ALERTS

   =================================================================== */
    window.setTimeout(function() {
		$(".alert").fadeTo(500, 0).slideUp(4000, function(){
			$(this).remove(); 
		});
	}, 7000);


        
/* ===================================================================

   CASES

   =================================================================== */    
    let swiper = new Swiper('.blog-slider', {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        mousewheel: {
          invert: false,
        },
        pagination: {
          el: '.blog-slider__pagination',
          clickable: true,
        }
      });



/* ===================================================================

    Feedbacks Section Image Slider 

   =================================================================== */

   $(document).ready(function()  {

    "use strict";
  
    $('#feedbacks').slick({
       slidesToShow: 3,
       slidesToScroll: 1,
       dots: true,
       arrows: true,
       nextArrow: $('.offers-next'),
       prevArrow: $('.offers-prev'),
       autoplay: false,
       autoplaySpeed: 2000, 
       speed: 1000,
       infinite: true,
       responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,         
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          }
        },
      ]
    });
  
  });



/* ===================================================================

    Blogs Section Image Slider 

   =================================================================== */

   $(document).ready(function()  {

    "use strict";
  
    $('#blogs').slick({
       slidesToShow: 3,
       slidesToScroll: 1,
       dots: true,
       arrows: true,
       nextArrow: $('.blogs-next'),
       prevArrow: $('.blogs-prev'),
       autoplay: false,
       autoplaySpeed: 2000, 
       speed: 1000,
       infinite: true,
       responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,         
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          }
        },
      ]
    });
  
  });