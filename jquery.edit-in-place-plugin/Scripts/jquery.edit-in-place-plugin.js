(function ($) {
    var count = 0;
    $.extend($.fn, {
        editInPlace: function (options) {
            $(this).each(function () {
                var settings = $.extend({
                    onDoneEditing: function () { },
                    onUpdateDisplay: function () { },
                    originalValue: ""
                }, options);

                settings.originalValue = $(this).text().trim();
                $(this).html("");

                $(this).addClass("eip-wrapper");
                $(this).append("<span id='eip_display_" + count + "' class='eip-display'>" + settings.originalValue + "</span>");
                $(this).append("<div class='eip-editor-wrapper' style='display:none;'><input id='eip_" + count + "' class='eip_editor' type='text' value='" + settings.originalValue + "' /></div>");

                count++;

                $(this).bind("click", function (event) {
                    if (!$(event.target).is("input")) {
                        $(this).children(".eip-editor-wrapper").css("display", "inline-block");
                        $(this).children(".eip-display").hide();
                    }
                });



                var originalBgColor;
                $(this).hover(function () {
                    originalBgColor = $(this).css("backgroundColor");
                    //alert(originalBgColor);
                    $(this).animate({ backgroundColor: "#d7d7d7" }, 100);
                },
                   function () {
                       //alert(originalBgColor);
                       //$(this).animate({ backgroundColor: ""}, 100);
                       $(this).css("background-color", "transparent");
                   }
                   );

                $(this).bind("eipDoneEditing", { "action": settings.onDoneEditing }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);
                });

                $(this).bind("eipUpdateDisplay", { "action": settings.onUpdateDisplay }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);
                });





            });
        },
        initializeEditors: function () {
            $(".eip_editor").live("keypress", function (event) {
                if (event.which == "13") {
                    //alert("Enter on editor textbox " + $(this).attr("id"));
                    //Send back the parent which is the plugin element.
                    $(this).parent().parent().trigger("eipDoneEditing", [null, $(this).parent()]);
                    $(this).parent().prev().text($(this).val());
                    $(".eip-editor-wrapper").hide();
                    $(".eip-display").show();
                }
            });

            $(".eip-editor-warapper").each(function () {
                $(this).hide();
            });

            $(document).click(function (event) {
                if ((!$(event.target).is(".eip-wrapper") && !$(event.target).closest(".eip-wrapper").length)) {
                    $(".eip-editor-wrapper").hide();
                    $(".eip-display").show();
                }
            });
        }
    });
})(jQuery);