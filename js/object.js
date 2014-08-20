var Limz_Object = function(limz){
    "use strict";

    var _this = this;

    this.getArrayWithAttributes = function(object){
        var array = [];

        for(var attribute in object){
            if(object.hasOwnProperty(attribute)){
                array.push(attribute);
            }
        }

        return array;
    };

    this.attributeExists = function(object, path){
        var exists = true;

        for(var i = 0; i < path.length; i++){
            if(object.hasOwnProperty(path[i])){
                object = object[path[i]];
            } else {
                exists = false;
            }
        }

        return exists;
    };

    this.getAttribute = function(obj, path){
        var returnValue;

        if(_this.attributeExists(obj, path)){
            var object = obj;

            for(var i = 0; i < path.length; i++){
                object = object[path[i]];
            }
            returnValue = object;
        }

        return returnValue;
    };

    this.deleteAttribute = function(object, path){
        if(_this.attributeExists(object, path)){
            var key = path.pop(),
                subObject = _this.getAttribute(object, path);
            delete subObject[key];
        }
    };


    this.setAttribute = function(object, path, value){
        var attribute = path.pop();

        for(var i = 0; i < path.length; i++){
            if(! object.hasOwnProperty(path[i])){
                object[path[i]] = {};
            }
            object = object[path[i]];
        }

        object[attribute] = value;
    };

    this.removeUndefinedArrayElements = function(object){
        if(typeof object === 'object' && Object.prototype.toString.call(object) !== '[object Array]'){
            for(var key in object){
                if(object.hasOwnProperty(key)){
                    object[key] = _this.removeUndefinedArrayElements(object[key]);
                }
            }
        } else if(typeof object === 'object') {
            var newArray = [];
            for(var i = 0; i < object.length; i++){
                if(object[i] !== undefined){
                    newArray.push(object[i]);
                    object[i] =  _this.removeUndefinedArrayElements(object[i]);
                }
            }
            object = newArray;
        }

        return object;
    };


    this.merge = function(object, defaultObj){

        var defaultObject = jQuery.extend(true, {}, defaultObj);

        if(typeof(object) !== 'object'){
            object = {};
        }

        for(var key in defaultObject){
            if(defaultObject.hasOwnProperty(key)){
                if(! object.hasOwnProperty(key)){
                    object[key] = defaultObject[key];
                } else {
                    if(typeof defaultObject[key] === 'object' && Object.prototype.toString.call( defaultObject[key] ) !== '[object Array]'){
                        if(_this.countProperties(defaultObject[key]) > 0){
                            object[key] = _this.merge(object[key], defaultObject[key]);
                        }
                    }
                }
            }
        }
        return object;
    };

    this.countProperties = function(object){
        var count = 0;
        for(var property in object){
            if(object.hasOwnProperty(property)){
                count++;
            }
        }
        return count;
    };

};