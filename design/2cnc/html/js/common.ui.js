(function () {
    // console.log('jQuery Ver : ' + $.fn.jquery);
    // http://benalman.com/projects/jquery-hashchange-plugin/


    var $animation_elements = $('.hello');
    var $window = $(window);

    function check_if_in_view() {
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);
    
    $.each($animation_elements, function() {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);
    
        //check to see if this current container is within viewport
        if ((element_bottom_position >= window_top_position) &&
            (element_top_position <= window_bottom_position)) {
        $element.addClass('in-view');
        } 
    });
    }

    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');







    !window.xeno && $(function() {
        var $window = $(window),
            $html = $('html'),
            $body = $('body'),

            $wrap = $('#wrap'),
            $header = $('#header'),

            $video = $('#visual_video'),

            
            areaheight = 0,
            //spaceHeight = parseInt($header[0].offsetHeight),
            spaceHeight = 0,

            isMobile = document.ontouchstart !== undefined,
            _hashData = [],
            _currentpage = 0,
            solutionSlider = null;


        function headercontrol() {

            var $navbox = $header.find('.nav'),
                $navlinks = $navbox.find('a:not(".none")');

            $navlinks.on('click', changenav);

            $.each($navlinks, function (index, item) {
                // _hashData.push(item.getAttribute('href').replace( /^#/, '' ));
                _hashData[index] = item.getAttribute('href').split('#')[1];
            });

            focusnav(0);

            function changenav(e) {
                 togglenav();
                // $window.location.replace('' + _hashData[_currentpage]);
                pagecontrol.moveto($navlinks.index(this));
                e.preventDefault && e.preventDefault();
            }

            function focusnav(index) {
                // $window[0].location.replace('/#' + _hashData[index]);
                $navlinks.removeClass('on').eq(index).addClass('on');
            }

            function scroll(scrolltop) {
                if (scrolltop > 0 && !$wrap.hasClass('fixed')) {
                    $wrap.addClass('fixed');
                } else if (5 > scrolltop && $wrap.hasClass('fixed')) {
                    $wrap.removeClass('fixed');
                }
            }

     

            return {
                focusnav: focusnav,
                scroll: scroll
            };

        }

    
        // Nav Toggle
        (function (){
            var $navToggle = $header.find('.m-nav-open');
            $navToggle.on('click', togglenav);
        })();

        function togglenav(e) {
            $header[0].classList.toggle('open_nav');
        }

        // open heatmap
        (function (){
            var $heatmapToggle = $header.find('.open_heatmap');
            $heatmapToggle.on('click', toggleheatmap);
        })();

        function toggleheatmap(e) {
          
            $header[0].classList.toggle('open');
        }
       




        function pagecontrol() {

            var $contents = $('#contents'),
                $articles = $contents.find('> .js-section'),

                currentpage = 0,
                numarticles = $articles.length;

            $articles.each(function(i) {
                $articles[i] = $(this);
            });

            function setvisible($article, visibility, show) {
                if (visibility && !$article.hasClass('visible')) {
                    $article.addClass('visible').trigger('visible');
                } else if (!visibility && $article.hasClass('show')) {
                    $article.removeClass('visible').removeClass('show').trigger('invisible');
                }
                if (show && !$article.hasClass('show')) {
                    $article.addClass('show').trigger('show');
                }
            }

            function scroll(scrolltop) {

                var blocktop, blockheight, blockFirstHeight,
                    visiblepercent, visibleheight, visiblebase,
                    i = 0;

                for (; i < numarticles; i++) {

                    blockFirstHeight = $articles[0][0].offsetHeight;
                    blockheight = $articles[i][0].offsetHeight;

                    if (i == 0) {
                        blocktop = $articles[i][0].offsetTop-scrolltop;
                        visiblepercent = 1-((blockheight+blocktop)/blockheight);
                    } else {
                        blocktop = $articles[i][0].getBoundingClientRect().top;
                        // console.log(i, blocktop, spaceHeight);
                        visiblepercent = -(blocktop-areaheight)/(areaheight+blockheight);
                    }
                    if (areaheight/2 > blocktop) {
                        _currentpage = i;
                    }
                    if (0 >= blocktop) {
                        toparticleindex = i;
                    }

                    visiblebase = Math.min(blockheight*0.33, areaheight*0.33);
                    visibleheight = Math.min(areaheight, 0 >= blocktop ? blockheight+blocktop : Math.min(blockheight, areaheight-blocktop));
                    setvisible($articles[i], ((i == 0 && visiblepercent >= 0) || visiblepercent > 0) && 1 > visiblepercent, visibleheight >= visiblebase);

                }

                // if (currentpage != _currentpage) {
                    currentpage = (blockFirstHeight >= (scrolltop + spaceHeight+1)) ? 0 : _currentpage;
                    headercontrol.focusnav(currentpage);
                // }

            }

            return {
                moveto: function(index) {
                    smoothscrolltop($articles[index][0].offsetTop - spaceHeight);
                },
                scroll: scroll
            }

        }


        function getscrolltop() {
            return $html[0].scrollTop || $body[0].scrollTop || 0;
        }

        function smoothscrolltop(v, time, callback) {
            $('html, body')._animate({scrollTop: v}, {queue: false, duration: time || 1000, easing: 'easeInOutQuart', complete: callback || function() {}});
        }

        function scroll() {
            var scrolltop = getscrolltop();
            headercontrol.scroll && headercontrol.scroll(scrolltop);
            pagecontrol.scroll && pagecontrol.scroll(scrolltop);
        }

        function resize(isinitialize) {
            areaheight = window.innerHeight;
            scroll();
        }

        function init(){
            headercontrol = headercontrol();
            pagecontrol = pagecontrol();
            $window.on({
                scroll: scroll,
                resize: resize,
                hashchange: function () {
                    // var moveIndex = _hashData.indexOf(location.href.split('#')[1]);
                }
            });


            // $window.hashchange(function () {
            //     console.log(location.hash);

            // var hash = location.hash;
            // var moveIndex = _hashData.indexOf(hash.replace( /^#/, '' ));
            // console.log(moveIndex);
            // pagecontrol.moveto(moveIndex);
            // console.log(hash.replace(/^#/, '' ));

            // Set the page title based on the hash.
            // document.title = 'The hash is ' + ( hash.replace( /^#/, '' ) || '' );

            // $('#nav a').each(function(){
            //     var that = $(this);
            //     that[ that.attr( 'href' ) === hash ? 'addClass' : 'removeClass' ]( 'selected' );
            // });

            // });
            resize();

            // LOGO Click
            (function(){
                $('.logo a').on('click', function(e) {
                    smoothscrolltop(0);
                    e.preventDefault();
                });
            })();
            
            // WORK
            (function () {
                var $tabLinks = $('.tab-nav a');
                var $articleGroups = $('.article-group');
                var $workItemLinks = $('.work-list .linked h3');

                var currentIndex = 0;
                var addTabSelected = function(idx){
                    $tabLinks.eq(idx).addClass('on');
                    $articleGroups.eq(idx).addClass('on');
                };
                var removeTabSelected = function(idx){
                    $tabLinks.eq(idx).removeClass('on');
                    $articleGroups.eq(idx).removeClass('on');
                };

                $tabLinks.on('click', function(e) {
                    removeTabSelected(currentIndex);
                    currentIndex = $tabLinks.index(this);
                    addTabSelected(currentIndex);
                    
                    e.preventDefault();
                });
                $workItemLinks.on('click', function(e) {
                    $(e.currentTarget).closest('.linked').toggleClass('selected');
                    e.preventDefault();
                });
                addTabSelected(currentIndex);
            })();

            // SLIDER
            (function() {
                solutionSlider = new Swiper('.solution-slider .swiper-container', {
                    slidesPerView:'auto',
                    spaceBetween:60,
                    grabCursor: true,
                   
                    loop: true,
                    loopFillGroupWithBlank: true,
                    // mousewheel:{
                    //     invert:false
                    // },

                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        renderBullet: function (index, className) {
                          return '<span class="' + className + '">' + (index + 1) + '</span>';
                        },
                      },

                      


                    // breakpoints:{
                    //     320:{
                    //         spaceBetween:10
                    //     },
                    //     480:{
                    //         spaceBetween:20
                    //     },
                    //     640:{
                    //         spaceBetween:30
                    //     },
                    //     768:{
                    //         spaceBetween:40
                    //     },
                    //     960:{
                    //         spaceBetween:50
                    //     },
                    //     1024:{
                    //         spaceBetween:60
                    //     }
                    // }
                });
                console.log();
            })();

            // visual.js
            // visualinit();
            
        };

        window.xeno = {
            init : init
        };

        
        xeno.init();
    });

})();