$(function () {
    //init gift background
    var BGArray = ["grid", "leopard", "redPoint", "twill", "whitePoint"];
    var shock = [0, 0, 0, 0, 0];
    $(".packaged").each(function (index, element) {
        var objId = $(element).attr("objId");
        var i = objId.substr(objId.length-2, 1).charCodeAt();
        var r = i % 5;
        shock[r] = shock[r] + 1;
        r += shock[r];
        console.log(shock);
        $(element).addClass(BGArray[r % 5]);
    });

    $().toastmessage({
        position: 'middle-center'
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
        $().toastmessage("showWarningToast", "你来晚了，游戏结束了~可是双击礼物箱看看别人的礼物。");
        return;
        if ($("#share").text() == "") {
            window.location.href = "/login";
            return;
        }
        if ($("#share").text() == $("#face").text()) {
            console.log()
            $().toastmessage("showWarningToast", "别实现自己的愿望玩啊……");
            return;
        }
        if (!confirm("每个人只能实现一个愿望哦！你确定要实现的是这个愿望么？")) {
            return;
        }
        $.post("/wishes/achieve", {"wishId": $(this).attr("objId"), "wishOwner": $("#face").text()}, function (data) {
            if (data == -1 || data == "-1") {
                $().toastmessage("showWarningToast", "这个愿望已经被别人实现了，请刷新一下再看看。");
            } else if (data == -2 || data == "-2") {
                $().toastmessage("showWarningToast", "正有别人在实现愿望呢，请等一小会再刷新看看。");
            } else if (data == -3 || data == "-3") {
                $().toastmessage("showWarningToast", "你已经实现过别人的愿望了，等下次过节交换礼物再来吧。");
            } else if (data) {
                window.location.reload();
            } else {
                $().toastmessage("showErrorToast", "确认失败，如果现在是8-24点之间，请联系管理员。");
            }
        });
    });

    $("#firstBlood").on("click", function () {
        if ($("#share").text() == "") {
            window.location.href = "/login";
            return;
        }
        $.post("/wishes/first").done(function (data) {
            if (data) {
                window.location.reload();
            } else {
                $().toastmessage("showErrorToast", "确认失败，如果现在是8-24点之间，请联系管理员。");
            }
        });
    });

    $(".packaged").on("dblclick", function () {
        window.open($(this).attr("link"));
    });
});