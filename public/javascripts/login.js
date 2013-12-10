$(function () {
    $("#confirm").on("click", function () {
        if ($(this).attr("btype") == "uc") {
            var userCode = $("#uc").val();
            $.post('/checkPerson', {"userCode": userCode}).done(
                function (data) {
                    if (!data) {
                        $("#userCode").addClass("hide");
                        $("#passCode").removeClass("hide");
                        $("#confirm").attr("btype", "pc");
                    } else {
                        window.location.href = "/wishes";
                    }
                }).error(
                function () {
                    //TODO prompt error message
                }
            );
        } else if ($(this).attr("btype") == "pc") {
            var passCode = $("#pc").val();
            $.post('/checkPassCode', {"passCode": passCode }).done(
                function (data) {
                    if (data) {
                        $("#passCode").addClass("hide");
                        $("#itemInfo").removeClass("hide");
                        $("#confirm").attr("btype", "item");
                    } else {
                        //TODO prompt passCode invalid message
                    }
                }).error(
                function () {
                    //TODO prompt error message
                });
        } else if ($(this).attr("btype") == "item") {
            $("#itemInfo").addClass("hide");
            $("#wordsarea").removeClass("hide");
            $("#confirm").attr("btype", "words");
        } else if ($(this).attr("btype") == "words") {
            $.post('/addPerson',
                {"userCode": $("#uc").val(),
                    "passCode": $("#pc").val(),
                    "name": $("#name").val(),
                    "url": $("#url").val(),
                    "words": $("#words").val()
                }
            ).done(function () {
                    window.location.href = "/wishes";
                }).error(
                function () {
                    //TODO prompt error message
                });
        }
    });
})
;

//TODO validate those inputs