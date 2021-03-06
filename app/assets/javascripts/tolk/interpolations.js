$(function () {

  var interpolation = new RegExp("%{\\w+}", "g");

  $(".translations textarea, .translations input[type=text]").bind("change", function () {
      var row = $(this).closest(".row")
        , original_text = row.find(".original textarea, .original input[type=text]").val()
        , translated_text = $(this).val()
        , original_interpolations = original_text.match(interpolation) || []
        , translated_interpolations = translated_text.match(interpolation) || []
        , not_match;

      not_match = translated_text.length > 0 &&
                  ($(original_interpolations).not(translated_interpolations).length !== 0 ||
                   $(translated_interpolations).not(original_interpolations).length !== 0);

      row.find(".warning").toggle(not_match);

    });

});
