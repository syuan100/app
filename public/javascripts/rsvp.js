function additionalGuests(n) {
  var $guestBox = $(".additional-guests select");
  for(var i=0; i<(n + 1); i++){
    $guestBox.append("<option value='"+ i +"'>" + i + "</option>");
  }
  if($guestBox.find("option").length > 1)
    $(".additional-guests").show();
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function addRsvpForms(number) {
  $(".form.meal-selection").empty();
  for(var j=0; j < (number + 1); j++) {
    $(".form.meal-selection").append($mealForm);
  }
  for(var k=0; k < ($(".meal-form").length); k++) {
    $.each($($(".meal-form")[k]).find(".meal-selection-radio"), function(i,e){
      $(e).attr("name", "meal-selection-" + k);
    });
  }
}

function setRsvp(rsvp, additional_guests, meal_choices){
  $("input.attendance-choice[value='" + choice + "']").prop("checked", true);
  $(".additional-guests select option[value='" + additional_guests + "']").prop("selected", true);
  addRsvpForms(additional_guests);
  var mealPeople = meal_choices.split('&');

  for(var k=0; k < ($(".meal-form").length); k++) {
    var mealName = mealPeople[k].split("|")[0];
    var mealChoice = mealPeople[k].split("|")[1];
    $($(".meal-form")[k]).find(".meal-name").text();
    $($(".meal-form")[k]).find("selection[value='" + mealChoice + "'").prop("selected", true);
  }

}

$(document).ready(function() {
  var $mealForm = $(".meal-form")[0].outerHTML;
  $(".additional-guests select").change(function(){
    var additionalSelections = $(this).val();
    addRsvpForms(additionalSelections);
  });

  $(".rsvp-submit").click(function(){
    var error = false;
    $(".error-message").hide();

    if (!$("input[name='attendance']:checked").val()) {
      error = true;
    }

    var mealChoices = "";

    $.each($(".meal-form"), function(i, e) {
      if(!$($(e).find(".meal-name")).val()) {
        error = true;
      } else {
        mealChoices += $($(e).find(".meal-name")).val() + "|";
      }

      if(!$($(e).find("input.meal-selection-radio:checked")).val()) {
        error = true;
      } else {
        mealChoices += $($(e).find("input.meal-selection-radio:checked")).val() + "&";
      }
    });

    var rsvpData = {
      rsvp: $("input[name='attendance']:checked").val(),
      additional_guests: $(".additional-guests select").val(),
      meal_choices: mealChoices,
      email: base32.decode(getParameterByName("code")).split("|")[0]
    }

    if (error) {
      $(".error-message").show();
    } else {
      $.ajax({
        url: "/rsvp-submit/",
        method: "POST",
        data: rsvpData,
        success: function(data){
          console.log(data);
        },
        error: function(err) {
          console.log(err);
        }
      });
    }

  });

});