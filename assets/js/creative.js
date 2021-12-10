/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict
    var topOffset = 60;

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - topOffset) 
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '#mainNav',
        offset: $(window).height()/2
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    $(document).ready(function () {
      $(window).scroll(setAffix);
        setAffix();
    });

    //Animate scroll to FeaturesMenu when switching sticky menu
    $('a[data-toggle="pill"]').on('show.bs.tab', function (e) {
      
      const offset = -40;
      const target = $("#Features").offset().top + offset;
      
      $('html, body').animate({
        scrollTop: (target) 
      }, 1000, "easeOutExpo");
    })

    function setAffix()
    {
      if ($(document).scrollTop() > 100) {
        $("nav").addClass("affix");
      } else {
        $("nav").removeClass("affix");
      }
    }

    //Swiper slider
    const swiper = new Swiper('.swiper', {
      loop: true,
      slidesPerView: 1,
      centeredSlides: false,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },

      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      },
    
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    

})(jQuery); // End of use strict
