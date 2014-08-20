var Limz_Responsive = function(limz){
    "use strict";

    var _this = this;

    this.handleAllConfigs = function(){
        $('body').find('[data-limz-config]').each(function(){
            _this.handleConfig($(this));
        });
    };

    this.handleConfig = function(element){
        var config = _this.getConfig(element);

        console.log(config);
    };

    this.getConfig = function(element){
        var configString = element.attr('data-limz-responsive-config'),
            config = limz.helper.parseLimzJson(configString);

        return config;
    };
    this.setConfig = function(element, config){
        element.attr('data-limz-responsive-config', limz.helper.encodeLimzJson(config));
    };

    this.getResponsiveId = function(){
        var measureDiv = $('#limz_responsive_measurement'),
            width = measureDiv.width(),
            id = 'mob';

        if(width === 760){
            id = 'tab';
        } else if(width === 960){
            id = 'desk';
        }

        return id;
    };

    this.init =function(){
        setResizeListener();
    };

    function resized(responsiveId){
        console.log('resized: '+ responsiveId);
        window.Limz_TearDownFront();
        window.Limz_SetupFront(limz);
    }

    function checkResizing(oldResponsiveId){
        var responsiveId = _this.getResponsiveId();
        if(oldResponsiveId !== responsiveId){
            resized(responsiveId);
        }
    }

    function setResizeListener(){
        $(window).on("resize", function(){
            removeResizeListener();

            var oldResponsiveId = _this.getResponsiveId();
            setTimeout(function(){
                checkResizing(oldResponsiveId);
                setResizeListener();
            }, 1000);
        });
    }

    function removeResizeListener(){
        $(window).off("resize");
    }


};