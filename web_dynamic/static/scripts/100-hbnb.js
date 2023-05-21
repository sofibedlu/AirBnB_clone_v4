$(document).ready(function () {
  const statesChecked = {};
  const citiesChecked = {};
  const amenitiesChecked = {};
  $('input.chekedin').on('change', function () {
    const isChecked = $(this).is(':checked');
    const Id = $(this).data('id');
    const Name = $(this).data('name');

    if (isChecked) {
      if ($(this).attr('id') === 'statechek') {
        statesChecked[Id] = Name;
      } else {
        citiesChecked[Id] = Name;
      }
    } else {
      if ($(this).attr('id') === 'statechek') {
        delete statesChecked[Id];
      } else {
        delete citiesChecked[Id];
      }
    }

    const checkedStates = Object.values(statesChecked);
    const checkedCities = Object.values(citiesChecked);
    const statesList = checkedStates.join(', ');
    const citiesList = checkedCities.join(', ');
    const filter = statesList + ' ' + citiesList;
    $('#stateCity').text(filter);
  });

  $('input.amenitychek').on('change', function () {
    const isChecked = $(this).is(':checked');
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if (isChecked) {
      amenitiesChecked[amenityId] = amenityName;
    } else {
      delete amenitiesChecked[amenityId];
    }

    const checkedAmenities = Object.values(amenitiesChecked);
    const amenitiesList = checkedAmenities.join(', ');
    $('.amenities h4').text(amenitiesList);
  });

  $.get('http://localhost:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $('button').click(function () {
    if (Object.keys(amenitiesChecked).length !== 0 || 
        Object.keys(statesChecked).length !== 0 ||
        Object.keys(citiesChecked).length !== 0) {
      const data = {};
      const checkedAmenitiesId = Object.keys(amenitiesChecked);
      const checkedStatesId = Object.keys(statesChecked);
      const checkedCitiesId = Object.keys(citiesChecked);
      if (checkedAmenitiesId.length !== 0) {
        data.amenities = checkedAmenitiesId;
      }
      if (checkedStatesId.length !== 0) {
        data.states = checkedStatesId;
      }
      if (checkedCitiesId.length !== 0) {
        data.cities = checkedCitiesId;
      }
      filterPlaces(data);
    }
  });

  function filterPlaces (data) {
    $('.places').empty();
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (data) {
        for (const place of data) {
          console.log(place);
          const newArticle = $('<article>', {
            html: [
              $('<div>', {
                class: 'title_box',
                html: [
                  $('<h2>', {
                    text: place.name
                  }),
                  $('<div>', {
                    class: 'price_by_night',
                    text: place.price_by_night
                  })
                ]
              }),
              $('<div>', {
                class: 'information',
                html: [
                  $('<div>', {
                    class: 'max_guest',
                    text: place.max_guest + (place.max_guest !== 1 ? ' Guests' : ' Guest')
                  }),
                  $('<div>', {
                    class: 'number_rooms',
                    text: place.number_rooms + (place.number_rooms !== 1 ? ' Bedrooms' : ' Bedroom')
                  }),
                  $('<div>', {
                    class: 'number_bathrooms',
                    text: place.number_bathrooms + (place.number_bathrooms !== 1 ? ' Bathrooms' : ' Bathroom')
                  })
                ]
              }),
              $('<div>', {
                class: 'user',
	      html: $('<b>', {
		  text: 'Owner: '
	      }).add($('<span>', {
                  text: place.first_name + '  ' + place.last_name
                }))
	    }),
              $('<div>', {
                class: 'description',
                text: place.description
              })
            ]
          });
          $('.places').append(newArticle);
        }
      }

    });
  }
});
