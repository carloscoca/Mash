var Limz_Helper = function(limz){
    "use strict";

    var _this = this;


    this.createCompleteManagerRow = function(label, content, classes){
        var row = _this.createManagerRow(classes),
            rowContent = _this.createManagerRowContent();

        if(label !== false){
            row.append(_this.createManagerRowLabel(label));
        }
        rowContent.append(content);
        row.append(rowContent);

        return row;
    };

    this.createManagerRow = function(classes){
        var row = $('<div class="limz_popup_row"></div>');
        if(typeof(classes) === 'object'){
            for(var i = 0; i < classes.length; i++){
                row.addClass(classes[i]);
            }
        }
        return row;
    };
    this.createManagerRowLabel = function(label){
        return $('<div class="limz_popup_row_label">'+ label +'</div>');
    };
    this.createManagerRowContent = function(){
        return $('<div class="limz_popup_row_content"></div>');
    };







    this.createCallback = function(callback, parameters, config){
        var newCallback = {
            callback:callback
        };

        if(typeof(parameters) === 'object' || typeof(parameters) === 'string'){
            newCallback.parameters = parameters;
        } else {
            newCallback.parameters = {};
        }

        if(typeof(config) === 'object'){
            newCallback.config = config;
        } else {
            newCallback.config = {};
        }

        return newCallback;
    };

    this.setLinkedFolder = function(folder){
        var postId = limz.config.postId;


        limz.linkedFolder = folder;

        $('.limz').each(function(){
            var block = $(this),
                config = limz.block.getConfig(block);

            if(parseInt(config.block.postId, 10) === parseInt(postId, 10)){
                config.block.linkedFolder = folder;
                _this.setConfig(block, config);
            }

        });
    };


    this.convertRgbToHex = function(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    };

    this.mixinElementConfig = function(element, config){
        var elementConfig = element.attr('data-limz-config');

        elementConfig = _this.parseLimzJson(elementConfig);

        config = _this.mergeConfigs(config, elementConfig);

        _this.setConfig(element, config);
    };

    this.createConfig = function(container, defaultConfig){
        var config;

        if(container.attr('data-limz-config')){
            config = container.attr('data-limz-config');
            config = limz.helper.parseLimzJson(config);

            if(config.hasOwnProperty('moduleReference')){
                var referencedConfig = config.moduleReference,
                    module = _this.getParentModule(container),
                    moduleType = _this.getModuleType(module),
                    moduleConfig;

                if(limz.modules[moduleType].hasOwnProperty('config')){
                    if(limz.modules[moduleType].config.hasOwnProperty(referencedConfig)){
                        moduleConfig = limz.modules[moduleType].config[referencedConfig];
                        config = _this.mergeConfigs(config, moduleConfig);
                    }
                }
            }

            if(config.hasOwnProperty('objectReference')){
                config = mixinObjectReferenceConfig(config);
            }

            _this.mergeConfigs(config, defaultConfig);
        } else {
            config = defaultConfig;
        }

        return config;
    };

    function mixinObjectReferenceConfig(config){
        var referencedConfigString = config.objectReference,
            referencedConfigPathArray = referencedConfigString.split('.'),
            referencedConfig = limz.settings.objects;

        for(var i = 0; i < referencedConfigPathArray.length; i++){
            referencedConfig = referencedConfig[referencedConfigPathArray[i]];
        }

        return _this.mergeConfigs(config, referencedConfig);
    }

    this.setConfig = function(element, config){
        var configString = _this.encodeLimzJson(config);
        element.attr('data-limz-config', configString);
    };

    this.getParentModuleClass = function(element){
        var module = limz.helper.getParentModule(element),
            moduleType = limz.helper.getModuleType(module),
            moduleClass = limz.modules[moduleType];

        return moduleClass;
    };

    this.getParentModule = function(element){
        var module;

        element = $(element);

        if(element.hasClass('limz_module')){
            module = element;
        } else {
            module = element.parents('.limz_module');
        }

        return module;
    };

    this.getModuleType = function(module){
        return module.attr('data-limz-module-type');
    };

    this.mergeConfigs = function(config, defaultConfig){
        for(var configKey in defaultConfig){
            if(defaultConfig.hasOwnProperty(configKey)){
                if(! config.hasOwnProperty(configKey)){
                    config[configKey] = defaultConfig[configKey];
                }
            }
        }
        return config;
    };

    this.selectLabel = function(label){
        var language = limz.config.language;

        if(typeof(label) === 'object'){
            if(typeof(label[language]) === 'string'){
                label = label[limz.config.language];
            } else if(typeof(label.en) === 'string'){
                label = label.en;
            }else {
                for (var key in label){
                    if(label.hasOwnProperty(key)){
                        label = label[key];
                        break;
                    }
                }
            }
        } else if(typeof(label) !== 'string'){
            label = 'Label Error';
        }
        return label;
    };

    this.timeout = function(action, time, parameters){

        setTimeout(execute, time);

        function execute(){
            action(parameters);
        }
    };

    this.createDiv = function(classes){
        var div = $('<div></div>');

        if(typeof(classes) === 'string'){
            div.addClass(classes);
        } else if(typeof(classes) === 'object'){
            for(var i = 0; i < classes.length; i++){
                div.addClass(classes[i]);
            }
        }

        return div;
    };

    this.parseLimzJson = function(string){
        if(typeof(string) !== 'string'){
            string = '{}';
        }
        return _this.parseJson(string.replace(/'/g, '"'));
    };

    this.parseJson = function(string){
        var data = {};

        if(typeof JSON !== "undefined"){
            data = JSON.parse(string);
        } else {
            eval("data =" + string +";");
        }

        return data;
    };

    this.encodeLimzJson = function(json){
        var string = JSON.stringify(json);
        return string.replace(/"/g, "'");
    };

    this.addClasses = function(element, classes){
        if(typeof(classes) === 'object'){
            for(var i = 0; i < classes.length; i++){
                element.addClass(classes[i]);
            }
        }else if(typeof(classes === 'string')){
            element.addClass(classes);
        }
    };

    this.removeClasses = function(classes, target){
        for(var i = 0; i < classes.length; i++){
            var myClass = classes[i].className;
            target.removeClass(myClass);
        }
    };

    this.getUsedClasses = function(classes, target){
        var assignedClassesString = target.attr('class'),
            usedClasses = [];

        if(assignedClassesString !== undefined){
            var assignedClassesArray = assignedClassesString.split(' '),

                classesOfInterest = _this.limzClassesToArray(classes);



            for(var i = 0; i < assignedClassesArray.length; i++){
                if(classesOfInterest.indexOf(assignedClassesArray[i]) !== -1){
                    usedClasses.push(assignedClassesArray[i]);
                }
            }
        }

        return usedClasses;
    };

    this.limzClassesToArray = function(classes){
        var classNames = [];

        for(var i = 0; i < classes.length; i++){
            classNames.push(classes[i].className);
        }

        return classNames;
    };

    this.executeCallbackValidations = function(callbacks){
        var errors = [];
        if(typeof(callbacks) === 'object'){
            for( var i = 0; i < callbacks.length; i++){
                var callback = callbacks[i];

                if(typeof(callback) === 'object'){
                    if(typeof(callback.config) === 'object'){
                        if(typeof(callback.config.validation) === 'object'){
                            var fieldErrors = limz.validation.callbackValidation(callback.config.validation);
                            if(fieldErrors.length > 0){
                                errors.push(fieldErrors);
                            }
                        }
                    }
                }
            }
        }
        return errors;
    };


    this.executeCallbacks = function(callbacks){
        if(typeof(callbacks) === 'function'){
            callbacks();
        } else {
            for( var i = 0; i < callbacks.length; i++){
                var callback = callbacks[i];

                if(typeof(callback) === 'object'){
                    if(typeof(callback.parameters) === 'object'){
                        callback.callback(callback.parameters);
                    } else if(typeof(callback.parameters) === 'string'){
                        callback.callback(callback.parameters);
                    }else {
                        callback();
                    }
                } else {
                    callback();
                }
            }
        }
    };

    this.createRow = function(content, label){
        var row = limz.helper.createDiv('limz_row'),
            labelContainer = limz.helper.createDiv('limz_label'),
            contentContainer = limz.helper.createDiv('limz_content');

        labelContainer.append(label);
        contentContainer.append(content);

        row.append(labelContainer);
        row.append(contentContainer);

        return row;
    };

    this.openContext = function(event){
        event.preventDefault();
        event.stopPropagation();

        var contextMenu = new limz.context(limz, event);
        contextMenu.open();
    };


};