(function ($) {
    var count = 0;
    $.extend($.fn, {
        editInPlace: function (options) {
            $(this).each(function () {
                var settings = $.extend({
                    commitChangesStart: function () { },
                    commitChanges: function () { },
                    commitChangesComplete: function () { },
                    valueChanged: function () { },
                    cancelEdit: function () { },
                    originalValue: ""
                }, options);
                var data = {};
                var valueChanged = false;
                var elm = $(this);
                data.valueChanged = valueChanged;
                settings.originalValue = $(this).text().trim();
                $(this).html("");

                $(this).addClass("eip-wrapper");
                $(this).append("<span id='eip_display_" + count + "' class='eip-display'>" + settings.originalValue + "</span>");
                $(this).append("<div class='eip-editor-wrapper' style='display:none;'><form id='frm-eip_" + count + "' class='frm-eip'><input id='eip_" + count + "' class='eip_editor required' type='text' value='" + settings.originalValue + "' /><a href='javascript:void(0)' class='applyChanges'>Apply</a></form></div>");

                count++;

                $(this).bind("click", function (event) {
                    if (!$(event.target).is("input")) {
                        $(this).children(".eip-editor-wrapper").css("display", "inline-block");
                        $(this).children(".eip-display").hide();
                        $(this).children(".eip-editor-wrapper").children(".eip_editor").focus();
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

                $(this).bind("eipValueChanged", { "action": settings.valueChanged }, function (event, data) {
                    event.data.action(event, data);
                });

                $(this).bind("eipCancelEdit", { "action": settings.cancelEdit }, function (event, data) {
                    event.data.action(event, data);
                });

                $(this).children(".eip-editor-wrapper").children().children(".applyChanges").bind("click", { "action": settings.commitChangesStart }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);
                });

                function initControl() {
                    $(elm).children().children().children(".eip_editor").keypress(function (event) {

                        if (event.which == 13 && $(this).valid()) {
                            event.preventDefault();
                            $(elm).trigger("eipCommitChangesStart", [null, $(elm)]);
                            $(elm).children(".eip-display").text($(this).val());
                            $(elm).children(".eip-editor-wrapper").hide();
                            $(elm).children(".eip-display").show();
                        } else {
                            if ($(this).val() != settings.originalValue) {
                                data.valueChanged = true;
                                data.newValue = $(this).val();
                                data.originalValue = settings.originalValue;
                                $(elm).trigger("eipValueChanged", [data, $(elm)]);
                            }
                        }



                    });

                    var frm = $(elm).children().children(".frm-eip");

                    $(frm).children(".eip_editor").blur(function () {
                        $(this).valid();
                    });


                }

                initControl();
            });
        },
        initializeEditors: function () {

            $(".eip-editor-warapper").each(function () {
                $(this).hide();
            });

            //            $(document).click(function (event) {
            //                if ((!$(event.target).is(".eip-wrapper") && !$(event.target).closest(".eip-wrapper").length)) {
            //                    $(".eip-editor-wrapper").hide();
            //                    $(".eip-display").show();
            //                }
            //            });
        },
        hideEditor: function () {
            //alert($(this).children().length);
        }
    })
})(jQuery);