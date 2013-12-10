$(function () {
    $().toastmessage({
       position:'middle-center'
    });

    $("#share").on("click", function () {
        $.get("/getPassCode", function (data) {
            var array = eval(data);
            $.each(array, function (index, item) {
                $("#pc" + index).val(item.passCode);
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
                $().toastmessage("showSuccessToast","已经确认，你的愿望会挂在末尾。")
            } else {
                $().toastmessage("showErrorToast","确认失败，如果现在是8-24点之间，请联系管理员。");
            }
        });
    });
});