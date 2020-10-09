(function ($) {
    "use strict";

    /**
     *  Variables
     */
    var body = $('body');
    var windowW = $(window).width();
    var clickEventType = ((document.ontouchstart !== null) ? 'click' : 'touchstart');

    /**
     * Detect Device Type
     */
    var isMobile;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
        $('html').addClass('mobile');
    } else {
        isMobile = false;
        $('html').addClass('desktop');
    }


    /**
     * Functions
     */
    function setWindowScrollAppear() {
        var $animate = $('.animate-up, .animate-down, .animate-left, .animate-right');

        if (!isMobile) {
            $animate.appear();
            $animate.on('appear', function (event, affected) {
                for (var i = 0; i < affected.length; i++) {
                    $(affected[i]).addClass('animated');
                }
            });
            $.force_appear();
        }
    }

    function setProgressBarsFill() {
        var $progress_bar = $('.progress-bar');

        if (!isMobile) {
            $progress_bar.appear();
            $progress_bar.on('appear', function (event, $affected) {
                setProgressBarsWidth($affected)
            });
            $.force_appear();
        } else {
            setProgressBarsWidth($progress_bar)
        }
    }

    function setProgressBarsWidth(bars) {
        for (var i = 0; i < bars.length; i++) {
            var $bar_fill = $(bars[i]).find('.bar-fill');

            $bar_fill.width($bar_fill.data('width'));
        }
    }

    function positioningInterestsTooltips() {
        var interests = $(".interests-list");
        var tooltips = interests.find('span');

        if (interests.length > 0) {
            for (var i = 0; i < tooltips.length; i++) {
                var tooltipW = $(tooltips[i]).outerWidth();
                var parentW = $(tooltips[i]).parent().outerWidth();
                var left = (parentW - tooltipW) / 2 - 1;

                $(tooltips[i]).css('left', left + 'px');
            }
        }
    }

    function positioningTimelineElements() {
        if ($(window).width() > 600) { // For large devices
            $('.timeline').each(function () {
                var tlineBar = $(this).find('.timeline-bar');
                var tlineBarH = 0;
                var tlineWrap = $(this).find('.timeline-inner');
                var tlineWrapH = 0;
                var tlineGutter = rsOptions.timeline.itemsSpace;

                var col1Top = 0;
                var col1TopPrev = 0;
                var col1LastElemH = 0;
                var col1Elems = $(this).find('.timeline-box-left');

                var col2Top = rsOptions.timeline.topSpace;;
                var col2TopPrev = 0;
                var col2LastElemH = 0;
                var col2Elems = $(this).find('.timeline-box-right');

                // Switch top params for RTL
                if (rsOptions.rtl) {
                    col1Top = col2Top;
                    col2Top = 0;
                }

                // Positioning first column elements
                for (var i = 0; i < col1Elems.length; i++) {
                    $(col1Elems[i]).css({ 'position': 'absolute', 'left': '0', 'top': col1Top + 'px' });
                    col1TopPrev = col1Top;
                    col1Top = col1Top + $(col1Elems[i]).height() + tlineGutter;
                    col1LastElemH = $(col1Elems[i]).height();
                }

                // Positioning second column elements               
                for (var i = 0; i < col2Elems.length; i++) {
                    $(col2Elems[i]).css({ 'position': 'absolute', 'right': '0', 'top': col2Top + 'px' });
                    col2TopPrev = col2Top;
                    col2Top = col2Top + $(col2Elems[i]).height() + tlineGutter;
                    col2LastElemH = $(col2Elems[i]).height();
                }

                // Set container & bar height's								
                if (col1Top > col2Top) {
                    tlineWrapH = col1Top - tlineGutter;
                } else {
                    tlineWrapH = col2Top - tlineGutter;
                }

                if (col1TopPrev > col2TopPrev) {
                    tlineBarH = col1TopPrev;
                } else {
                    tlineBarH = col2TopPrev;
                }

                tlineWrap.height(tlineWrapH);
                tlineBar.css({ 'top': '80px', 'height': tlineBarH + 'px' });
            });
        } else { // For small devices
            $('.timeline-bar').attr('style', '');
            $('.timeline-box').attr('style', '');
            $('.timeline-inner').attr('style', '');
        }
    }

    function filterBarLinePositioning(grid, button) {
        var filterValue = button.attr('data-filter');
        var buttonLeft = button.position().left;
        var buttonWidth = button.outerWidth();
        var filterLine = button.closest('.filter').find('.filter-bar-line');

        grid.isotope({ filter: filterValue });
        filterLine.css({ "left": buttonLeft + "px", "width": buttonWidth });
    }

    function windowSmoothScrollOnLoad() {
        if (window.location.hash && body.hasClass('home')) {
            $('html, body').animate({ scrollTop: ($(window.location.hash).offset().top) }, 0);
        }
    }

    function hideSitePreloader() {
        $('#preloader').remove();
        $('body').removeClass('loading');
    }

    function lockScroll() {
        var $html = $('html');
        var $body = $('body');

        var initWidth = $body.outerWidth();
        var initHeight = $body.outerHeight();

        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        ];
        $html.data('scroll-position', scrollPosition);
        $html.data('previous-overflow', $html.css('overflow'));
        $html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        var marginR = $body.outerWidth() - initWidth;
        var marginB = $body.outerHeight() - initHeight;
        $body.css({ 'margin-right': marginR, 'margin-bottom': marginB });
        $html.addClass('lock-scroll');
    }

    function unlockScroll() {
        var $html = $('html');
        var $body = $('body');

        $html.css('overflow', $html.data('previous-overflow'));
        var scrollPosition = $html.data('scroll-position');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        $body.css({ 'margin-right': 0, 'margin-bottom': 0 });
        $html.removeClass('lock-scroll');
    }

    function openMobileNav() {
        $('body').addClass('mobile-nav-opened');
        lockScroll();
    }

    function closeMobileNav() {
        $('body').removeClass('mobile-nav-opened');
        unlockScroll();
    }

    function openSidebar() {
        $('body').addClass('sidebar-opened');
        lockScroll();
    }

    function closeSidebar() {
        $('body').removeClass('sidebar-opened');
        unlockScroll();
    }

    function isValidEmail(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    function ripple(element, pageX, pageY) {
        var $rippleElement = $('<span class="ripple-effect" />');
        var xPos = parseInt(pageX, 10) - parseInt(element.offset().left, 10);
        var yPos = parseInt(pageY, 10) - parseInt(element.offset().top, 10);
        var size = Math.floor(Math.min(element.height(), element.width()) * 0.5);
        var animateSize = Math.floor(Math.max(element.width(), element.height()) * Math.PI);

        $rippleElement
            .css({
                top: yPos,
                left: xPos,
                width: size,
                height: size
            })
            .appendTo(element)
            .animate({
                width: animateSize,
                height: animateSize,
                opacity: 0
            }, 500, function () {
                $(this).remove();
            });
    }


    /**
     * Window Resize
     */
    $(window).resize(function () {
        windowW = $(window).width();

        positioningInterestsTooltips();
        positioningTimelineElements();
    });


    /**
     * Document Ready
     */
    $(function () {
        setWindowScrollAppear();
        setProgressBarsFill();
        positioningInterestsTooltips();

        // Header Navigation
        $('#nav>ul').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 500,
            scrollThreshold: 0.5,
            easing: 'swing'
        });

        // Add header navigation hover lines
        if ($('.nav-wrap .nav').length > 0) {
            $('.nav-wrap .nav > ul > li > a').append('<span></span>');
        }

        // Sticky Navigation
        var header = $('.header');
        var stickyNav = $('.head-bar');
        var stickyNavHeight = 0;
        var stickyNavigationAppear = function () {
            if (stickyNav.length > 0) {
                stickyNav.addClass('animated');
                if ($(window).width() > 767 && !isMobile) {
                    if (stickyNavHeight < stickyNav.outerHeight()) {
                        stickyNavHeight = stickyNav.outerHeight();
                        header.css('min-height', stickyNavHeight + 'px');
                    }

                    if ($(window).scrollTop() > stickyNav.outerHeight()) {
                        stickyNav.addClass('head-sticky');
                    } else {
                        stickyNav.removeClass('head-sticky');
                    }
                } else {
                    stickyNav.removeClass('head-sticky');
                    header.css('min-height', '0px');
                }

            }
        }

        stickyNavigationAppear();

        $(window).scroll(function () {
            stickyNavigationAppear();
        });

        $(window).scroll(function () {
            stickyNavigationAppear();
        });

        /** Mobile Navigation */
        // Mobile Navigation
        $('#mobile-nav>ul').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 500,
            scrollThreshold: 0.5,
            easing: 'swing',
            begin: function () {
                closeMobileNav();
            }
        });

        // open/close mobile navigation
        $(document).on(clickEventType, '.btn-mobile', function () {
            if ($('body').hasClass('mobile-nav-opened')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        // init mobile navigation custom scroll
        if ($('.mobile-nav').length > 0) {
            $(".mobile-nav-inner").mCustomScrollbar({
                theme: "dark"
            });
        }

        /** Material Inputs */
        var material_inputs = $('.input-field input, .input-field textarea');

        for (var i = 0; i < material_inputs.length; i++) {
            if ($(material_inputs[i]).val())
                $(material_inputs[i]).parent('.input-field').addClass('used');
            else
                $(material_inputs[i]).parent('.input-field').removeClass('used');
        }

        material_inputs.on('blur', function () {
            if ($(this).val())
                $(this).parent().addClass('used');
            else
                $(this).parent().removeClass('used');
        });

        material_inputs.on('focus', function () {
            $(this).parent().addClass('used');
        });

        /** Ripple:
         *  appears where clicked on the element */
        $(document).on(clickEventType, '.ripple', function (e) {
            ripple($(this), e.pageX, e.pageY);
        });


        /** Ripple Centered:
         *  appears from element center */
        $(document).on(clickEventType, '.ripple-centered', function () {
            var $rippleElement = $('<span class="ripple-effect" />'),
                $buttonElement = $(this),
                xPos = $buttonElement.width() / 2,
                yPos = $buttonElement.height() / 2,
                size = Math.floor(Math.min($buttonElement.height(), $buttonElement.width()) * 0.5),
                animateSize = Math.floor(Math.max($buttonElement.width(), $buttonElement.height()) * 1.5);
            $rippleElement
                .css({
                    top: yPos,
                    left: xPos,
                    width: size,
                    height: size,
                    backgroundColor: $buttonElement.data("ripple-color")
                })
                .appendTo($buttonElement)
                .animate({
                    width: animateSize,
                    height: animateSize,
                    opacity: 0
                }, 450, function () {
                    $(this).remove();
                });
        });

        /** Sidebar */

        // open/close sidebar
        $(document).on(clickEventType, '.btn-sidebar', function () {
            if ($('body').hasClass('sidebar-opened')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        // init sidebar custom scroll
        var sidebarFixed = $('.sidebar-fixed');
        if (sidebarFixed.length > 0) {
            var sidebarScrollArea = sidebarFixed.find('.widget-area');
            sidebarScrollArea.mCustomScrollbar({
                theme: "dark",
                updateOnContentResize: true,
                updateOnImageLoad: true
            });
        }

        /** Overlay:
         *  the same overlay is used for fixed sidebar and for mobile navigation */
        $(document).on(clickEventType, '#overlay', function () {
            if ($('body').hasClass('mobile-nav-opened')) closeMobileNav();

            if ($('body').hasClass('sidebar-opened')) closeSidebar();
        });


        /** Window Scroll Top Button */
        var $btnScrollTop = $('.btn-scroll-top');
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $btnScrollTop.fadeIn();
            } else {
                $btnScrollTop.fadeOut();
            }
        });

        $btnScrollTop.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });

        /** Contact Form */
        $('.rsFormSubmit').on('click', function (e) {
            var rsForm = $(this).closest('.rsForm');
            var rsFormErrors = false;
            var rsFormAction = rsForm.attr('action');
            var rsFormCaptcha = rsForm.data('captcha');
            var rsFormFields = rsForm.find('.input-field');
            var rsFormName = rsForm.find("[name='rsName']");
            var rsFormEmail = rsForm.find("[name='rsEmail']");
            var rsFormMessage = rsForm.find("[name='rsMessage']");

            // Button ripple effect
            ripple($(this).parent(), e.pageX, e.pageY);

            // Reset form errors
            rsFormFields.removeClass('error');
            rsFormErrors = false;

            // Validate form fields	
            if (!rsFormName.val()) {
                rsFormErrors = true;
                rsFormName.parent().addClass('error');
            }

            if (!rsFormEmail.val() || !isValidEmail(rsFormEmail.val())) {
                rsFormErrors = true;
                rsFormEmail.parent().addClass('error');
            }

            if (!rsFormMessage.val()) {
                rsFormErrors = true;
                rsFormMessage.parent().addClass('error');
            }

            if (rsFormErrors) {
                // if has errors - do nothing
                return false;
            } else {
                if (rsFormCaptcha === true) {
                    // if captcha - goto captcha page
                    return true;
                } else {
                    // if no captcha - make ajax request
                    $.post(rsFormAction,
                        rsForm.serialize(),
                        function (response) {
                            var data = jQuery.parseJSON(response);
                            if (data) {
                                rsForm.append('<div class="rsFormResponce"><strong>Bravo!</strong><br>Votre email a bien été envoyé!</div>');
                            } else {
                                rsForm.append('<div class="rsFormResponce"><strong>OOPS!</strong> une erreur est survenue.<br>Réessayez un peu plus tard.</div>');
                            }
                        }
                    );
                    return false;
                }
            }
        });
    });


    /**
     * Window Load
     */
    $(window).load(function () {
        /** Portfolio */
        var grid_seector = $('.grid');
        if (grid_seector.length > 0) {

            // Isotope Initialization
            var $grid = grid_seector.isotope({
                isOriginLeft: !rsOptions.rtl,
                itemSelector: '.grid .grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });

            $grid.imagesLoaded().progress(function () {
                $grid.isotope('layout');
            });


            // Portfolio fancybox
            var _player;
            $('.portfolioFancybox').fancybox({
                padding: 0,
                wrapCSS: 'fancybox-portfolio',
                maxWidth: '795px',
                maxHeight: '85%',
                minWidth: '250px',
                mouseWheel: 'true',
                scrolling: "no",
                autoCenter: true,
                beforeShow: function () {
                    // Get current popup
                    var currentID = $(this.element).attr("href");
                    var currentPopup = $('.fancybox-portfolio ' + currentID);

                    // Append current popup embed
                    var currentEmbed = currentPopup.find('.inline-embed');
                    if (currentEmbed.length > 0) {
                        var currentEmbedType = currentEmbed.data('embed-type');
                        var curentEmbedUrl = currentEmbed.data('embed-url');

                        switch (currentEmbedType) {
                            case "image":
                                currentEmbed.empty();
                                currentEmbed.addClass('inline-embed-image');
                                currentEmbed.append('<img src="' + curentEmbedUrl + '" />');
                                break;
                            case "iframe":
                                currentEmbed.empty();
                                currentEmbed.addClass('inline-embed-iframe');
                                currentEmbed.append('<iframe src="' + curentEmbedUrl + '" allowfullscreen></iframe>');
                                break;
                            case "video":
                                _player = ''; // reset player
                                currentEmbed.addClass('inline-embed-video');
                                var currentVideo = $('' + currentID + '').find('video');
                                if (currentVideo.length > 0) {
                                    new MediaElementPlayer(currentID + ' video', { // initialize player
                                        loop: false,
                                        defaultVideoWidth: 723,
                                        defaultVideoHeight: 405,
                                        videoWidth: -1,
                                        videoHeight: -1,
                                        startVolume: 0.7,
                                        enableAutosize: true,
                                        alwaysShowControls: true,
                                        success: function (mediaElement, domObject) {
                                            _player = mediaElement;
                                            _player.load();
                                        }
                                    });
                                }
                                break;
                        }
                    }
                },
                afterShow: function () {
                    // Get current popup
                    var currentID = $(this.element).attr("href");
                    var currentPopup = $('.fancybox-portfolio ' + currentID);

                    // Make current popup visible with css
                    currentPopup.addClass('opened');
                },
                beforeClose: function () {
                    // reset player
                    _player = '';
                }
            });
        }

        /** Timeline:
         *  positioning timeline elements */
        if (rsOptions.rtl) { // switch timeline box classes for RTL
            var tLineLeft = $('.timeline-box-left');
            var tLineRight = $('.timeline-box-right');

            tLineLeft.removeClass('timeline-box-left').addClass('timeline-box-right');
            tLineRight.removeClass('timeline-box-right').addClass('timeline-box-left');
            tLineLeft.find('.animate-right').removeClass('animate-right').addClass('animate-left');
            tLineRight.find('.animate-left').removeClass('animate-left').addClass('animate-right');
        }
        positioningTimelineElements();

        /** Clients Carousel */
        var clients_carousel = $(".clients-carousel");
        if (clients_carousel.length > 0) {
            for (var i = 0; i < clients_carousel.length; i++) {
                $(clients_carousel[i]).owlCarousel({
                    ...rsOptions.clientsSlider
                });
            }
        }

        /** Window smooth scroll to an anchor */
        windowSmoothScrollOnLoad();

        /** Preloader:
         *  site was successfully loaded, hide site pre-loader */
        hideSitePreloader();
    });

})(jQuery);