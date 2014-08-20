var Limz_GoogleMaps = function(limz){
    "use strict";

    var _this = this;

    this.map = false;
    this.locations = {};

    this.createMap = function(config){
        _this.locations = config.locations;
        _this.map = new google.maps.Map(document.getElementById(config.id), config.mapOptions);
        _this.placesService = new google.maps.places.PlacesService(_this.map);

        _this.setCenter(config.center);
        codeAddresses();
    };

    this.setCenter = function(locationKey){
        var geoLocation = _this.locations[locationKey].geoLocation;

        if(typeof(geoLocation) === 'object'){
            _this.map.setCenter(geoLocation);
        } else {
            limz.helper.timeout(_this.setCenter, 10, locationKey);
        }
    };

    function setCenterTimeout(locationKey){
        if(typeof(_this.locations[locationKey].geoLocation === 'object')){
            _this.map.setCenter(_this.locations[locationKey].geoLocation);
        }
    }

    function codeAddresses(){
        for(var i = 0; i < _this.locations.length; i++){
            codeAddress(i);
        }
    }

    function codePlace(locationKey){
        var request = {location:_this.locations[locationKey].geoLocation, radius:'500', query:_this.locations[locationKey].office};
        _this.placesService.textSearch(request, function(results, status){
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                _this.locations[locationKey].geoLocation = results[0].geometry.location;
                setMarker(locationKey);
            }
        });
    }

    function codeAddress(locationKey){
        var location = _this.locations[locationKey],
            address = '',
            geoCoder = new google.maps.Geocoder();

        if(typeof(location.office) === 'string'){
            if(location.office !== ''){
                address += location.office + ', ';
            }
        }

        if(typeof(location.location) === 'string'){
            if(location.location !== ''){
                address += location.location + ', ';
            }
        }

        if(typeof(location.street) === 'string'){
            if(location.street !== ''){
                address += location.street;
            }
        }

        if(typeof(location.street2) === 'string'){
            if(location.street2 !== ''){
                address += ' ' + location.street2;
            }
        }

        if(typeof(location.street3) === 'string'){
            if(location.street3 !== ''){
                address += ' ' + location.street3;
            }
        }

        if(typeof(location.state) === 'string'){
            if(location.state !== ''){
                address += ', '+ location.state;
            }
        }

        if(typeof(location.zip) === 'string'){
            address += ', '+ location.zip;
        }

        if(typeof(location.country) === 'string'){
            address += ', '+ location.country;
        }

        if(typeof(location.longitude) === 'number' && typeof(location.latitude) === 'number'){
            _this.locations[locationKey].geoLocation = new google.maps.LatLng(location.latitude, location.longitude);
            setMarker(locationKey);
        } else {
            geoCoder.geocode( {'address': address, 'region': 'de'}, function(results, status){
                if (status === google.maps.GeocoderStatus.OK) {
                    _this.locations[locationKey].geoLocation = results[0].geometry.location;

                    if(typeof(_this.locations[locationKey].type) === 'string'){
                        codePlace(locationKey);
                    } else {
                        setMarker(locationKey);
                    }


                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }


    }

    function setMarker(locationKey){
        _this.locations[locationKey].marker = new google.maps.Marker({
            map: _this.map,
            title: _this.locations[locationKey].title,
            position: _this.locations[locationKey].geoLocation
        });
    }




    function bubble(config, map, geoMarker){
        if(config.bubble === true){
            bubble(config, map, geoMarker);
        }

        var bubbleContent = '<h3>'+ config.location.name +'</h3>'+ config.markup.paragraph + config.markup.routeButton;

        var infoWindow = new google.maps.InfoWindow({
            content: bubbleContent
        });

        google.maps.event.addListener(geoMarker, 'click', function() {
            infoWindow.open(map, geoMarker);
        });
    }
};