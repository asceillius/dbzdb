$(document).ready(function () {
  $('.saveButton').click(function (e) {
    e.preventDefault();
    var formData = {
      "name"     : $('input[name=name]').val(),
      "rarity"   : $('select[name=rarity]').val(),
      "setName"  : $('select[name=setName]').val(),
      "setNumber": $('input[name=setNumber]').val(),
      "type"     : $('select[name=type]').val(),
      "color"    : $('select[name=color]').val(),
      "alignment": $('select[name=alignment]').val(),
      "text"     : $('textarea[name=text]').val(),
      "endurance": $('input[name=endurance]').val()
    }

    var dataString = '';
    for (var key in formData) {
      dataString += '&' + key + '=' + formData[key];
    }
    dataString = dataString.slice(1);
    
    $.ajax({
      type: "POST",
      url: "/save",
      data: formData,
      success: function() {
        history.back();
      }
    });
  });
});
