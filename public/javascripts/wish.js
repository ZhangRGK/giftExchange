$(function () {
    $("#share").on("click", function () {
        $.get("/getPassCode", function (data) {
            var array = eval(data);
            $.each(array, function (index, passcode) {
                $("pc" + index).val(passcode);
            });
            $("#codeView").removeClass("hide");
        });
    });

    $("#codePanel").on("click", function () {
        return false;
    })

    $("#codeView").on("click", function () {
        $(this).addClass("hide");
    });

    $("#signIn").on("click", function () {
        window.location.href = "/login";
    });

    $("#ido").on("click", function () {
        if (!$("#share")) {
            window.location.href = "/login";
        }
        $.post("/wishes/achieve", {"wishId": $(this).attr("objId")}, function (data) {
            if (data) {
                //TODO prompt achieve success
            } else {
                //TODO prompt achieve fault
            }
        });
    });
});