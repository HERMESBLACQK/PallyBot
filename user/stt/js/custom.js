(function($) {
	
    "use strict";

	/*===========================================================================
      *
      *  FULL SCREEN TOGGLE BUTTON
      *
      *============================================================================*/
	$("#fullscreen-button").on("click", function toggleFullScreen() {
      if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
		  $('#fullscreen-icon').removeClass('mdi-arrow-expand-all');
		  $('#fullscreen-icon').addClass('mdi-arrow-collapse-all');
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }

      } else {

		$('#fullscreen-icon').addClass('mdi-arrow-expand-all');
		$('#fullscreen-icon').removeClass('mdi-arrow-collapse-all');
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    })


	
	/*===========================================================================
      *
      *  ENABLE TOOLTIPS
      *
      *============================================================================*/
	$('[data-toggle="tooltip"]').tooltip();



	/*===========================================================================
      *
      *  PAGE LOADING EFFECT
      *
      *============================================================================*/
	$(window).on("load", function(e) {
		$("#global-loader").fadeOut("slow");
	})



	/*===========================================================================
      *
      *  SCROLL TO TOP BUTTON
      *
      *============================================================================*/
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
        }, 600);
        return false;
    });



	/*===========================================================================
      *
      *  GLOBAL SEARCH
      *
      *============================================================================*/
	$(document).on("click", "[data-toggle='search']", function(e) {
		let body = $("body");

		if(body.hasClass('search-gone')) {
			body.addClass('search-gone');
			body.removeClass('search-show');
		}else{
			body.removeClass('search-gone');
			body.addClass('search-show');
		}
	});
	let toggleSidebar = function() {
		let w = $(window);
		if(w.outerWidth() <= 1024) {
			$("body").addClass("sidebar-gone");
			$(document).off("click", "body").on("click", "body", function(e) {
				if($(e.target).hasClass('sidebar-show') || $(e.target).hasClass('search-show')) {
					$("body").removeClass("sidebar-show");
					$("body").addClass("sidebar-gone");
					$("body").removeClass("search-show");
				}
			});
		}else{
			$("body").removeClass("sidebar-gone");
		}
	}
	toggleSidebar();
	$(window).resize(toggleSidebar);



	/*===========================================================================
      *
      *  NOTIFICATION ALERTS
      *
      *============================================================================*/
	window.setTimeout(function() {
		$(".alert").fadeTo(500, 0).slideUp(4000, function(){
			$(this).remove(); 
		});
	}, 7000);



	/*===========================================================================
      *
      *  SIMPLEBAR INITIALIZATION
      *
      *============================================================================*/
	$(document).ready(function(){
		
		if (document.getElementById('scrollbar')) {
			let scrollbar = document.getElementById('scrollbar');
			new SimpleBar(scrollbar);
		  }
		
	});

})(jQuery);


