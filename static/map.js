function mapInit (useCountry=false) {
    var map = L.map('myMapDiv').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var markerGroup = new L.featureGroup()

    if (useCountry) {
        USE_COUNTRY_DATA = {useCountry:COUNTRY_DATA[useCountry]}
    } else {
        USE_COUNTRY_DATA = COUNTRY_DATA
    }

    for (const [country, locations] of Object.entries(USE_COUNTRY_DATA)) {
        for (const [loc_id, loc] of Object.entries(locations)) {
            var currentMarker = new L
                .marker(loc.latlng, {title:loc.name})
                .addTo(map)
                // Create a popup for the marker with the name
                .bindPopup(loc.name)
                // Open the popup when mouse is on the marker
                .on('mouseover',function(ev) {this.openPopup();})
                // Close the popup when mouse is not on the marker
                .on('mouseout', function(ev) {this.closePopup();})
                // Add map / carousel logic function
                .on('click', () => onMarkerClick(loc, country, loc_id));

            // Scale map to show all markers
            markerGroup.addLayer(currentMarker);
        };
    };
    map.fitBounds(markerGroup.getBounds());
};

function onMarkerClick (loc, country, loc_id){
    // Hide the fullsize map & country buttons
    $("#myMapDiv").hide()
    $("#countrySelector").hide()

    // Add info of the place
    $("#placeTitle").text(loc.name);
    // Set number of pictures
    var loc_picture_urls = COUNTRY_DATA[country][loc_id].pictures;
    $("#numPics").text("(" + loc_picture_urls.length + ")");
    $("#numPics").show()

    if (loc_picture_urls.length > 1) {
        $("#carouselPrevButton").show();
        $("#carouselNextButton").show();
    } else {
        $("#carouselPrevButton").hide();
        $("#carouselNextButton").hide();
    };

    // $("#divCarousel").show()
    $("#showMapButton").show()

    // Remove existing carousel (if applicable)
    $("#place_specific_carousel").remove();

    // Create new div with the carousel images
    var new_carousel = document.createElement("div");
    new_carousel.setAttribute("class", "carousel-inner");
    new_carousel.setAttribute("id", "place_specific_carousel");

    loc_picture_urls.forEach((pic_url, idx) => {
        var new_carousel_item = document.createElement("div");

        // Use 'active' for first image
        if (idx==0) {
            new_carousel_item.setAttribute("class", "carousel-item active");
        } else {
            new_carousel_item.setAttribute("class", "carousel-item");
        };

        // Create img element
        var current_img = document.createElement("img");
        current_img.setAttribute("class", "w-100");
        current_img.setAttribute("id", "carousel_pic_" + idx);
        current_img.src = pic_url;

        new_carousel_item.appendChild(current_img);
        new_carousel.appendChild(new_carousel_item);
    });

    document.getElementById("placeCarousel").appendChild(new_carousel);

    // Show carousel with pictures
    $("#outerCarouselDiv").show()
};

window.addEventListener('DOMContentLoaded', () => {
    var btn = document.getElementById("showMapButton");

    btn.addEventListener('click', function () {
        // This button
        $("#showMapButton").hide();
        // Show the map again
        $("#myMapDiv").show();
        // Show the country buttons again
        $("#countrySelector").show();
        // Revert title text
        $("#placeTitle").text("Select a place");

        // Remove existing carousel
        $("#place_specific_carousel").remove();
        // Hide entire carousel with pictures
        $("#outerCarouselDiv").hide();
        // Remove number that shows picture count
        $("#numPics").hide()
        // Make sure resize is reflected on the map
        $("#myMapDiv").invalidateSize(true);
    });
});

console.log("map loaded")