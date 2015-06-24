$(function () {
  // Copy text action
  $(".translations .copy").click(function (e) {
    e.preventDefault();

    var row = $(this).closest(".row")
      , original_text = row.find(".original textarea, .original input[type=text]").val();

    row.find(".translation textarea, .translation input[type=text]").val(original_text.trim()).trigger("change");
  });

  // avoid lose data
  $(".translations textarea").bind("keydown", function () {
    window.onbeforeunload = confirm;
  });

  $(".translations textarea").bind("change", function () {
    window.onbeforeunload = confirm;
  });

  $("input.save, input.apply").click(function () {
    window.onbeforeunload = null;
  });

  function confirm() {
    return "You are leaving this page with non-saved data. Are you sure you want to continue?";
  }

});
