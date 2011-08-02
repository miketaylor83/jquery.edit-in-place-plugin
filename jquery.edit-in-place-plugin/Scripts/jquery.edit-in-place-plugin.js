(function ($) {
    var count = 0;
    $.extend($.fn, {
        editInPlace: function (options) {
            $(this).each(function () {
                var settings = $.extend({
                    commitChangesStart: function () { },
                    commitChanges: function () { },
                    commitChangesComplete: function () { },
                    originalValue: ""
                }, options);

                var valueChanged = false;
                var elm = $(this);

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
                //Update the hover color.
                $(this).hover(function () {
                    originalBgColor = $(this).css("backgroundColor");
                    $(this).animate({ backgroundColor: "#d7d7d7" }, 100);
                },
                function () {
                    $(this).css("background-color", "transparent");
                });

                $(this).bind("eipCommitChangesStart", { "action": settings.commitChangesStart }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);
                });

                $(this).bind("eipCommitChanges", { "action": settings.commitChanges }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);
                });

                $(this).bind("eipCommitChangesComplete", { "action": settings.commitChangesComplete }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);
                });

                function initControl() {
                    $(elm).children().children(".eip_editor").keypress(function (event) {
                        if (event.which == 13) {
                            $(elm).trigger("eipCommitChangesStart", [null, $(elm)]);
                            $(elm).children(".eip-display").text($(this).val());
                            $(elm).children(".eip-editor-wrapper").hide();
                            $(elm).children(".eip-display").show();
                        } else {
                            if ($(this).val() != settings.originalValue) {
                                alert("value changed");
                            }
                        }
                    });
                }

                initControl();
            });
        },
        initializeEditors: function () {

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
    })
})(jQuery);