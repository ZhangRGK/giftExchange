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
        if ($("#share").text()=="") {
            window.location.href = "/login";
            return;
        }
        if($("#share").text() == $(".face").text()) {
            $().toastmessage("showWarningToast","别实现自己的愿望玩啊……");
            return;
        }
        $.post("/wishes/achieve", {"wishId": $(this).attr("objId")}, function (data) {
            if (data == -1 || data == "-1") {
                $().toastmessage("showWarningToast","这个愿望已经被别人实现了，请刷新一下再看看。");
            } else if(data == -2||data == "-2"){
                $().toastmessage("showWarningToast","正有别人在实现愿望呢，请等一小会再刷新看看。");
            } else if(data){
                window.location.reload();
            } else {
                $().toastmessage("showErrorToast","确认失败，如果现在是8-24点之间，请联系管理员。");
            }
        });
    });

    $("#firstBlood").on("click",function() {
        if ($("#share").text()=="") {
            window.location.href = "/login";
            return;
        }
        $.post("/wishes/first").done(function(data) {
            if (data) {
                window.location.reload();
            } else {
                $().toastmessage("showErrorToast","确认失败，如果现在是8-24点之间，请联系管理员。");
            }
        });
    });

    $(".packaged").on("dblclick",function() {
        window.open($(this).attr("link"));
    });
});