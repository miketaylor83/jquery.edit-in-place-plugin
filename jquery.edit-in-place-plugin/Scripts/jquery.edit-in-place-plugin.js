(function ($) {
    //the counter is established up here to keep track of all the editors
    //
    var count = 0;
    $.extend($.fn, {
        editInPlace: function (options) {
            $(this).each(function () {
                var settings = $.extend({
                    commitChangesStart: function () { },
                    commitChangesComplete: function () { },
                    cancelChanges: function () { },
                    valueChanged: function () { },
                    cancelEdit: function () { },
                    overElement: function () { },
                    originalValue: "",
                    required: true,
                    hideOnChangesComplete: true,
                    hideOnCancelChanges: true,
                    setHtmlOnChangesStart: true,
                    domIdPrefix: "eip"
                }, options);
                var data = {};
                var valueChanged = false;
                var elm = $(this);
                data.valueChanged = valueChanged;


                ///DON'T CHANGE THIS UNLESS YOU ARE HACKING THE WHOLE PLUGIN////
                ///BE CAREFUL, REMEMBER YOUR CHANGES SO YOU CAN MAKE SURE TO ADJUST FURTHER DOWN///
                settings.originalValue = $(this).text().trim();
                $(this).html("");

                $(this).addClass("eip-wrapper");
                $(this).append("<span id='eip_display_" + count + "' class='eip-display'>" + settings.originalValue + "</span>");
                $(this).append("<div class='eip-editor-wrapper' style='display:none;'><form id='frm-eip_" + count + "' class='frm-eip'>" +
                    "<input id='eip_" + count + "' class='eip_editor required' type='text' value='" + settings.originalValue + "' />" +
                    "<input id='eip_currentValue_" + count + "' class='eip-currentValue' type='hidden' />" +
                    "<a href='javascript:void(0)' class='applyChanges'>Apply</a></form></div>");

                //Counter to gurantee that we will have a unique editor
                count++;

                //Bind the top level element the original DOM that you set up the plugin for
                //this = the object within the each iterator
                //On click of the DOM element hide the display and show the editor
                //be careful about changing any classes all references to classes are inside this
                //"BE CAREFUL" code. Except for the methods below where some references exist.
                $(this).bind("click", function (event) {
                    if (!$(event.target).is("input")) {
                        $(this).children(".eip-editor-wrapper").css("display", "inline-block");
                        $(this).children(".eip-display").hide();
                        $(this).children(".eip-editor-wrapper").children().children(".eip_editor").focus();
                        data.valueChanged = false;
                        data.originalValue = $(this).children(".eip-editor-wrapper").children().children(".eip_editor").val();
                    }
                });

                //For the apply changes link, we want to have that click event also trigger the Commit Changes Start event.
                $(this).children(".eip-editor-wrapper").children().children("a.applyChanges").click(function () {

                    //Trigger the changes start event. All submission stuff should filter
                    //through to the Changes Start event.
                    $(elm).trigger("eipCommitChangesStart", [data, $(elm)]);

                    //Preventing the underlying elements (ascendents) from getting
                    //their click events triggered
                    event.stopPropagation();
                });

                //Key up event on the textbox.
                $(elm).children().children().children(".eip_editor").keyup(function (event) {

                    if (event.which == 13 && $(this).valid()) {
                        event.preventDefault();
                        data.newValue = $(this).val();
                        $(elm).trigger("eipCommitChangesStart", [data, $(elm)]);


                    } else {
                        if ($(this).val() != settings.originalValue) {
                            //The value has changed from original value.
                            data.valueChanged = true;
                            data.newValue = $(this).val();
                            data.originalValue = settings.originalValue;

                            //Set the hidden element to the current value within the text box.
                            $(elm).children(".eip-editor-wrapper").children().children("input.eip-currentValue").val($(this).val());

                            $(elm).trigger("eipValueChanged", [data, $(elm)]);
                        }
                    }

                });

                //We don't want to do a postback or get when enter is triggered.
                var frm = $(elm).children().children(".frm-eip");

                //Set up validate on the form container, since we have
                //the textbox set to required.
                $(frm).validate();

                //On blur of the textbox, check its validity.
                $(frm).children(".eip_editor").blur(function () {
                    $(this).valid();
                });

                ////END THE "BE CAREFUL" CODE//////


                //Event to start sending the changes to the client.
                $(this).bind("eipCommitChangesStart", { "action": settings.commitChangesStart }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);

                    //setHtmlOnChanges start is in the options and is defaulted to true.
                    if (settings.setHtmlOnChangesStart == true) {
                        $(elm).setText(data.newValue);
                    }

                    //Need to run the changes complete after the client side is done with this event.
                    $(elm).trigger("eipCommitChangesComplete", [data, $(elm)]);
                });

                $(this).bind("eipCommitChangesComplete", { "action": settings.commitChangesComplete }, function (event, data, clicked) {
                    event.data.action(event, data, clicked);

                    //Check to see if the setting has been overridden.
                    if (settings.hideOnChangesComplete == true) {
                        $(elm).hideEditor();
                    }
                });

                //The editor listens to the key up event, so when the value is changed from the
                //original value we trigger this event, just in case you want to do a look up or something of the
                $(this).bind("eipValueChanged", { "action": settings.valueChanged }, function (event, data) {
                    event.data.action(event, data);
                });

                //Cancel will remove any changes and clean the element up, up to you to hide the editor.
                $(this).bind("eipCancelEdit", { "action": settings.cancelEdit }, function (event, data) {
                    event.data.action(event, data);
                    if (settings.hideOnCancelChanges == true) {
                        $(elm).hideEditor();
                    }
                });

            });
        },
        initializeEditors: function () {

            //            $(document).click(function (event) {
            //                if ((!$(event.target).is(".eip-wrapper") && !$(event.target).closest(".eip-wrapper").length)) {
            //                    $(".eip-editor-wrapper").hide();
            //                    $(".eip-display").show();
            //                }
            //            });
        },
        hideEditor: function () {
            ///call this on the element that you want to hide the editor and show the display.

            $(this).children(".eip-editor-wrapper").hide();
            $(this).children(".eip-display").show();
        },
        setText: function (t) {
            //call this to set the text of the display element to whatever text
            //you want to set it to.
            $(this).children(".eip-display").text(t);
        }
    })
})(jQuery);