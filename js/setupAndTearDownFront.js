var Limz_SetupFront = function(limz){
    "use strict";

    var _this = this,
        body = $('body');

    if(typeof(window.respond) === 'object') {
        $(window).resize();
        window.respond.update();
        setTimeout(setup, 1000);
    } else {
        setup();
    }



    function setup(){

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ youtubePopup
        $('.limz_linkPopup').on('click', function(event){
            event.preventDefault();

            var link = $(this),
                href = link.attr('href'),
                queryStart = '?v=',
                hrefArray = href.split(queryStart),
                videoId = hrefArray[hrefArray.length -1],
                videoContainer = createYouTubeContainer(videoId);

                openLimzPopup(videoContainer);
        });

        function createYouTubeContainer(src){
            var youtubeContainer = limz.helper.createDiv('limz_youtube'),
                embedUrl = '//www.youtube.com/embed/',
                defaultQueryString = '?rel=0&showinfo=0?autoplay=1';

            youtubeContainer.append('<iframe src="../Mash_files/'+ embedUrl + src + defaultQueryString +'" frameborder="0" width="560" height="315"></iframe>');

            return youtubeContainer;
        }

        function openLimzPopup(content){
            var popup = limz.helper.createDiv('limz_frontPopup'),
                outerContainer = limz.helper.createDiv('limz_frontPopup_outerContainer'),
                innerContainer = limz.helper.createDiv('limz_frontPopup_innerContainer'),
                mask = limz.helper.createDiv('limz_frontPopup_mask'),
                cancelButton = limz.helper.createDiv('mash_popup_cancel');


            cancelButton.append('X');

            innerContainer.append(content);
            innerContainer.append(cancelButton);
            outerContainer.append(innerContainer);
            popup.append(outerContainer);
            popup.append(mask);
            body.append(popup);

            mask.on('click', function(){
                closeLimzPopup(popup);
            });
            cancelButton.on('click', function(){
                closeLimzPopup(popup);
            });
        }

        function closeLimzPopup(popup){
            popup.remove();
        }


        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ subMenu
        var subMenu = $('#mashSubMenu'),
            placeholder = $('#mashSubMenuPlaceholder'),
            innerWrapper = subMenu.find('#mashSubMenuInnerWrapper');


        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ limz dialog

        body.on('click', '.limz_dialog_parent', function(event){
            var dialogParent = $(this),
                dialog = dialogParent.find('.limz_dialog');

            if(dialog.length > 0){
                event.stopPropagation();
                $('.limz_dialog').not(dialog).hide();

                dialog.show();

                dialog.find('input').focus();

                hideOnBodyClick(dialog);
            }

        });

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ search
        var searchBox = $('#searchBox');

        if(! searchBox.hasClass('limz_search_js')){
            var form = searchBox.find('form'),
                button = form.find('button'),
                searchDialogContainer = limz.helper.createDiv('limz_dialog'),
                searchDialog = limz.helper.createDiv('limz_dialog_content');

            searchDialogContainer.append(searchDialog);
            searchDialog.append(form);

            button.removeAttr('class');
            button.html('GO');

            searchBox.append(searchDialogContainer);
            searchBox.append('<span class="icon-search"></span>');
            searchBox.addClass('limz_dialog_parent');
            searchBox.addClass('limz_search_js');
        }

        function hideOnBodyClick(object){
            body.on('click', function(){
                object.hide();
            });
            body.on('touchend', function(event){
                if(object.has(event.target).length === 0){
                    searchDialogContainer.hide();
                }
            });
        }


        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ main_menu
        var mainMenu = $('#main_menu'),
            subMenuHover = false,
            subMenuVisible = false,
            subMenuItemToShow;

        body.on('touchend',function(){
            removeTouchTriggerLink();
        });

        function removeTouchTriggerLink(){
            body.find('.limz_touch_triggerLink').removeClass('limz_touch_triggerLink');
        }

        limz.helper.timeout(setMainMenuListeners, 2000);

        function setMainMenuListeners(){
            $('#main_menu > li').on('mouseenter', function(event){
                var parentLi = $(this),
                    subMenu = parentLi.find('.sub-menu-container');

                subMenuHover = true;
                subMenuItemToShow = subMenu;

                subMenu.hide();


                limz.helper.timeout(
                    function(){
                        if(subMenuVisible !== true){
                            subMenuVisible = true;

                            if(limz.config.browser.type === 'IE'){
                                subMenu.show();
                            } else {
                                subMenu.fadeIn('fast');
                            }

                        }
                    },
                    50
                );

            });

            $('#main_menu > li').on('mouseleave', function(){
                var subMenu = $(this).find('.sub-menu-container');

                subMenuHover = false;


                limz.helper.timeout(
                    function(){
                        if(subMenuHover === true){
                            subMenu.hide();
                            subMenuItemToShow.show();
                        } else {
                            subMenuVisible = false;

                            if(limz.config.browser.type === 'IE'){
                                subMenu.hide();
                            } else {
                                subMenu.fadeOut('fast');
                            }

                        }
                    },
                    300
                );
            });
        }


        $('#main_menu > li > a').on('touchend', function(event){
            var link = $(this);

            var body = $('body');
            if(! link.hasClass('limz_touch_triggerLink')){
                event.preventDefault();
                event.stopPropagation();

                removeTouchTriggerLink();
                link.addClass('limz_touch_triggerLink');
            }
        });

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ limz_sharing_preview
        $('.limz_sharing_preview').on('mouseenter', function(){
            var preview = $(this);
            if(! preview.hasClass('limz_rendered')){
                var url = preview.attr('data-limz-url');

                preview.addClass('limz_rendered');

                preview.html('' +
                    '<div class="mash_sharing_buttons">'+
                        '<div class="mash_sharing_button mash_sharing_twitter">'+
                            '<a href="https://twitter.com/share" class="twitter-share-button" data-via="mash" data-url="'+ url +'" data-counturl="'+ url +'" data-lang=""></a>'+
                        '</div>'+
                        '<div class="mash_sharing_button">'+
                            '<div class="g-plus"></div>'+
                        '</div>'+
                        '<div class="mash_sharing_button">'+
                            '<div class="fb-share-button" data-href="'+ url +'" data-type="button_count"></div>'+
                        '</div>'+
                        '<div class="mash_sharing_button">'+
                            '<script type="IN/Share" data-url="'+ url +'" data-counter="right" data-showzero="true"></script>'+
                        '</div>'+
                    '</div>'
                );


                facebookShareTimeout();
                linkedInShareTimeout();
                twitterShareTimeout();
                googleShareTimeout(preview.find('.g-plus')[0], url);

                var fbButton = preview.find('.fb-share-button');
                fbSizeTimeout(fbButton);

            }
        });
        function facebookShareTimeout(){
            limz.helper.timeout(function(){
                if('FB' in window){
                    window.FB.XFBML.parse();
                } else {
                    //console.log('fTimeout');
                    facebookShareTimeout();
                }
            },100);
        }

        function linkedInShareTimeout(){
            limz.helper.timeout(function(){
                if('IN' in window){
                    window.IN.parse();
                } else {
                    //console.log('lTimeout');
                    linkedInShareTimeout();
                }
            },100);
        }

        function twitterShareTimeout(){
            limz.helper.timeout(function(){
                if('twttr' in window){
                    window.twttr.widgets.load();
                } else {
                    //console.log('tTimeout');
                    twitterShareTimeout();
                }
            },100);
        }

        function googleShareTimeout(container, url){
            limz.helper.timeout(function(){
                if('gapi' in window){
                    window.gapi.plus.render(
                        container,
                        {action:'share', height:20, href:url, annotation:'bubble'}
                    );
                } else {
                    //console.log('gTimeout');
                    googleShareTimeout(container, url);
                }
            },100);
        }


        function fbSizeTimeout(fbButton){
            limz.helper.timeout(function(){
                if(fbButton.attr('fb-xfbml-state') === 'rendered'){
                    var iframe = fbButton.find('iframe');
                    iframe.width(iframe.width() + 1);
                } else {
                    fbSizeTimeout(fbButton);
                }
            },100);
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ tile_share


        $('.tile_share').on('click', function(event){
            event.preventDefault();

            var sharingBar = limz.helper.createDiv('tile_sharingBar'),
                twitter = $('<div class="limz_iconBack tile_sharingButton"><a class="icon-boxTwitter" target="_blank"></a></div>'),
                google = $('<div class="limz_iconBack tile_sharingButton"><a class="icon-boxGooglePlus" target="_blank"></a></div>'),
                facebook = $('<div class="limz_iconBack tile_sharingButton"><a class="icon-boxFacebook" target="_blank"></a></div>'),
                linkedIn = $('<div class="limz_iconBack tile_sharingButton"><a class="icon-boxLinkedin" target="_blank"></a></div>');



            var button = $(this),
                tile = button.parents('.limz_tile');

            var title = button.attr('data-limz-share-title'),
                url = button.attr('data-limz-share-url'),
                summary = button.attr('data-limz-share-summary');

            if(url !== undefined){
                twitter.find('a').attr('href', createTwitterLink(title, url));
                google.find('a').attr('href', createGooglePlusLink(url));
                facebook.find('a').attr('href', createFacebookLink(title, url, summary));
                linkedIn.find('a').attr('href', createLinkedInLink(title, url, summary));

                sharingBar.append(twitter).append(google).append(facebook).append(linkedIn);
            }

            if(limz.responsive.getResponsiveId() !== 'mob'){
                var content = tile.find('.limz_content');
                content.append(sharingBar);
                showShareBar(content, sharingBar);

                button.on('click.deactivate', function(){
                    button.off('click.deactivate');
                    hideShareBar(content, sharingBar);
                });
            } else {
                if(button.hasClass('limz_activated')){
                    var barToRemove = tile.find('.tile_sharingBar');
                    button.removeClass('limz_activated');
                    barToRemove.animate({top:'-40px'}, 200, function(){barToRemove.remove();});
                } else {
                    button.addClass('limz_activated');
                    tile.append(sharingBar);
                    sharingBar.animate({top:'0'}, 200);
                }
            }



        });

        function createTwitterLink(title, url){
            return 'http://twitter.com/home?status='+ encodeURIComponent(title) + encodeURIComponent(' ') + encodeURIComponent(url);
        }
        function createFacebookLink(title, url, summary){
            return 'http://www.facebook.com/sharer/sharer.php?s=100&p[url]='+ encodeURIComponent(url) +'&p[title]='+ encodeURIComponent(title) +'&p[summary]='+ encodeURIComponent(summary);
        }
        function createGooglePlusLink(url){
            return 'https://plus.google.com/share?url='+ encodeURIComponent(url);
        }
        function createLinkedInLink(title, url, summary){
            return 'http://www.linkedin.com/shareArticle?mini=true&url='+ encodeURIComponent(url) +'&title='+ encodeURIComponent(title) +'&summary='+ encodeURIComponent(summary);
        }

        function showShareBar(content, container){
            content.animate({left:'-40px'}, 200, function(){setLeaveListener(content, container);});
        }

        function hideShareBar(content, container){
            content.animate({left:'0px'}, 200, function(){container.remove();});
        }

        function setLeaveListener(content, container){
            container.on('mouseleave', function(){
                hideShareBar(content, container);
            });
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ accordion
        $.ui.accordion.prototype._keydown = function( event ) {

        };

        $( ".limz_accordion" ).accordion({
            header: ".limz_accordion_header",
            collapsible: true,
            active: false,
            animate:{duration:200}
        });

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ slider
        $('.limz_slider').each(function(){
            var slider = $(this),
                config = limz.responsive.getConfig(slider),
                responsiveId = limz.responsive.getResponsiveId(),
                doCycle = true;

            if(config.hasOwnProperty(responsiveId)){
                if(config[responsiveId].hasOwnProperty('slider')){
                    if(config[responsiveId].slider.hasOwnProperty('enable')){
                        if(config[responsiveId].slider.enable === false){
                            doCycle = false;
                        }
                    }
                }
            }

            if(doCycle === true){
                slider.cycle({log:false, swipe:true});
            }
        });



        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ subMenuShare
        var popup =  $('#mash_popup_sharing'),
            box = $('.mash_popup_box'),
            mask = $('.mash_popup_mask'),
            cancel = $('.mash_popup_cancel');

        subMenu.on('click.subMenu', '#mashSubMenu_share', function(){
            var durationMask = 300,
                topBox = 120,
                durationBox = 400;

            openPopup(durationMask, topBox, durationBox);
        });

        function openPopup(durationMask, topBox, durationBox){
            mask.on('click', function(){
                closePopup();
            });
            cancel.on('click', function(){
                closePopup();
            });

            popup.addClass('mash_visible');
            showPopup(durationMask, topBox, durationBox);
        }

        function closePopup(durationMask, durationBox){
            mask.off('click');
            cancel.off('click');
            hidePopup(durationMask, durationBox);

        }

        function showPopup(durationMask, topBox, durationBox){
            if(limz.responsive.getResponsiveId() !== 'mob'){
                var boxHeight = box.outerHeight();

                mask.hide();
                mask.fadeIn(durationMask);

                box.css('top', (boxHeight * -1) - 10);
                box.animate({top:topBox}, durationBox);
            } else {
                mask.show();
                box.css('top', '20px');
            }
        }

        function hidePopup(durationMask, durationBox){
            var boxHeight = box.outerHeight(),
                top = (boxHeight * -1) - 10;

            if(limz.responsive.getResponsiveId() !== 'mob'){
                mask.fadeOut(durationMask);
                box.animate({top:top}, durationBox, function(){popup.removeClass('mash_visible');});
            } else {
                box.css('top', 'top');
                mask.hide();
                popup.removeClass('mash_visible');
            }
        }
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ subMenuMobile
        subMenu.on('click.subMenu', '#mashSubMenuMobileButton', function(){
            var menuList = $('#mashSubMenuContent').find('ul'),
                button = $(this);

            if(button.hasClass('icon-downFull')){
                menuList.show('fast');
                button.removeClass('icon-downFull');
                button.addClass('icon-upFull');
            } else {
                menuList.hide('fast', function(){menuList.css('display', '');});
                button.addClass('icon-downFull');
                button.removeClass('icon-upFull');
            }

        });
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ subMenu
        if(subMenu.length > 0){
            var subMenuContent = subMenu.find('#mashSubMenuContent'),
                subMenuContentWidth = subMenuContent.width(),
                list = subMenu.find('.subMenu'),
                listWidth = list.width(),
                actions = subMenu.find('#actionsContainer'),
                actionsWidth = actions.width();

            if(listWidth + actionsWidth > subMenuContentWidth){
                subMenu.find('#mashSubMenu_share').hide();
            }

            $(window).on('scroll.subMenu', function(){


                if(subMenu.hasClass('mashSubMenuFixed')){
                    var placeholderTop = placeholder.offset().top,
                        placeholderDifWindowTop = placeholderTop -$(window).scrollTop();

                    if(placeholderDifWindowTop >= 0){
                        placeholder.height(0);
                        placeholder.css('margin-top', '0');
                        subMenu.removeClass('mashSubMenuFixed');
                        innerWrapper.removeClass('wrapper');
                    }
                } else {
                    var subMenuTop = subMenu.offset().top,
                        subMenuDifWindowTop = subMenuTop - $(window).scrollTop();

                    if(subMenuDifWindowTop <= 0){
                        placeholder.height(subMenu.outerHeight());
                        placeholder.css('margin-top', subMenu.css('margin-top'));
                        subMenu.addClass('mashSubMenuFixed');
                        innerWrapper.addClass('wrapper');
                    }
                }
            });
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ anchors
        if(location.hash !== ''){
            limz.helper.timeout(
                function(){
                    jumpToAnchor(location.hash.substr(1));
                },
                50
            );
        }

        body.on("click", "a", function(event){
            var link = $(this),
                url = link.attr('href');

            if(url !== undefined){
                var hashPosition = url.indexOf('#'),
                    hash = url.substring(hashPosition + 1),
                    baseUrl = link[0].hostname + link[0].pathname,
                    currentUrl = window.location.hostname + window.location.pathname;

                if(hashPosition !== -1){
                    if(hashPosition === 0 || currentUrl === baseUrl){
                        event.preventDefault();
                        jumpToAnchor(hash);
                    }
                }

            }

        });

        function jumpToAnchor(hash){
            var anchor = '#' + hash,
                object = $(anchor),
                marginTop = parseInt(object.css('margin-top'), 10),
                destination = object.offset().top;

            if(object.length > 0){
                if(subMenu.length > 0){
                    destination = destination - subMenu.height();
                }

                if(marginTop > 0){
                    destination = destination - marginTop;
                }

                $('html, body').scrollTop(destination);

                object.removeAttr('id');
                location.hash = anchor;
                object.attr('id', hash);
            }

        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ preText
        body.find('[data-limz-pretext]').each(function(){
            var input = $(this),
                preText = input.attr('data-limz-pretext');

            if(input.val() === ''){
                input.val(preText);
            }


            input.on("focus", function(){
                var value = $(this).val(),
                    preText = $(this).attr("data-limz-pretext");


                if(value === preText){
                    $(this).val("");
                }
            });

            input.on("blur", function(){
                var value = $(this).val(),
                    preText = $(this).attr("data-limz-pretext");

                if(value === ""){
                    $(this).val(preText);
                }
            });
        });

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ limz_form_inputContainer
        body.find('.limz_form_fakeDummy').each(function(){
            var dummy = $(this),
                container = dummy.parents('.limz_form_inputContainer'),
                input = container.find('.limz_form_fakeDummy_original');

            dummy.on('focus', function(){
                dummy.hide();
                input.show();
                input.focus();
            });


        })

    }
};

var Limz_TearDownFront = function(){
    "use strict";
    var _this = this,
        body = $('body');

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ linkPopup
    $('.limz_linkPopup').off('click');

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ cycle
    $('.limz_slider').cycle('destroy');

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ accordion
    $( ".limz_accordion" ).accordion('destroy');

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ subMenu
    var subMenu = $('#mashSubMenu');

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ preText
    body.find('[data-limz-pretext]').each(function(){
        var input = $(this);
        input.off("focus");
        input.off("blur");
    });

    $(window).off('scroll.subMenu');
    subMenu.off('click.subMenu');
    $('.tile_share').off('click');

};