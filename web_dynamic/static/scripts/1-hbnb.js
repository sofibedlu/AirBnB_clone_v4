$(document).ready(function () {
  const amenitiesChecked = {};
  $('input[type="checkbox"]').on('change', function () {
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
});
