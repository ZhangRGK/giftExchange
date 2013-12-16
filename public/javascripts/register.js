$(function () {
    $().toastmessage({
        position: 'middle-center'
    });
    var actType = "add";
    $("#confirm").on("click", function () {
        var passCode = $("#pc").val();
        if (!validatePassCode(passCode)) {
            $("#pc").focus();
            return;
        }
        if ($(this).attr("btype") == "pc") {
            $.post('/checkPassCode', {"passCode": passCode }).done(
                function (data) {
                    if (data == false) {
                        $().toastmessage("showWarningToast", "邀请码不存在");
                        return;
                    }
                    if (data == "-1") {
                        actType = "edit";
                    }
                    $("#passCode").addClass("hide");
                    $("#userCode").removeClass("hide");
                    $("#confirm").attr("btype", "uc");
                }).error(
                function () {
                    $().toastmessage("showErrorToast", "邀请码匹配失败，如果现在是8-24点，请联系管理员。");
                });
        } else if ($(this).attr("btype") == "uc") {
            var userCode = $("#uc").val();
            var pu = $("#pu").val();
            if (!validateUserCode(userCode)) {
                $("#uc").focus();
                return;
            }
            $.post('/checkPerson', {"userCode": userCode, "passCode": passCode}).done(
                function (data) {
                    if (actType == "edit" && data == false) {
                        $().toastmessage("showWarningToast", "邀请码已经被使用喽，请刷新本页并尝试新的邀请码。");
                    } else {
                        $("#userCode").addClass("hide");
                        $("#itemInfo").removeClass("hide");
                        $("#confirm").attr("btype", "item");
                    }
                }).error(
                function () {
                    $().toastmessage("showErrorToast", "查询数据失败，如果现在是8-24点，请联系管理员。");
                }
            );
            if (!validatePu(pu)) {
                $("#pu").focus();
                return;
            }
        } else if ($(this).attr("btype") == "item") {
            if (!validateItemName($("#name").val())) {
                $("#name").focus();
                return;
            }
            if (!validateItemURL($("#url").val())) {
                $("#url").focus();
                return;
            }
            $("#itemInfo").addClass("hide");
            $("#wordsarea").removeClass("hide");
            $("#confirm").attr("btype", "words").text("完成");
        } else if ($(this).attr("btype") == "words") {
            if (!validateWords($("#words").val())) {
                $("#words").focus();
                return;
            }
            $.post('/checkPassCode', {"passCode": passCode }).done(
                function (data) {
                    if (data == "-1") {
                        actType = "edit";
                    }
                    $.post('/checkPerson', {"userCode": HTMLescape($("#uc").val()), "passCode": HTMLescape($("#pc").val())}).done(
                        function (data) {
                            if (actType == "edit" && data == false) {
                                $().toastmessage("showWarningToast", "这个激活码被人抢注了！刷新一下尝试新的激活码看看。");
                            } else {
                                $.post('/addPerson',
                                    {"userCode": HTMLescape($("#uc").val()),
                                        "passCode": HTMLescape($("#pc").val()),
                                        "personUrl": URLCheck($("#pu").val()),
                                        "name": HTMLescape($("#name").val()),
                                        "url": URLCheck($("#url").val()),
                                        "words": HTMLescape($("#words").val()),
                                        "made": false
                                    }
                                ).done(function (data) {
                                        window.location.href = "/wishes";
                                    }).error(
                                    function () {
                                        $().toastmessage("showErrorToast", "提交数据失败，如果现在是8-24点，请联系管理员。");
                                    });
                            }
                        }).error(
                        function () {
                            $().toastmessage("showErrorToast", "查询数据失败，如果现在是8-24点，请联系管理员。");
                        });
                }).error(
                function () {
                    $().toastmessage("showErrorToast", "邀请码匹配失败，如果现在是8-24点，请联系管理员。");
                });
        }
    });
})
;

function validatePassCode(passCode) {
    if (!passCode) {
        $().toastmessage("showWarningToast", "邀请码可不能不填哦");
        return false;
    }
    return true;
}

function validateUserCode(userCode) {
    if (!userCode) {
        $().toastmessage("showWarningToast", "用户名可不能不填啊");
        return false;
    }
    if (userCode.length > 20) {
        $().toastmessage("showWarningToast", "用户名不能超过20个字符哦");
        return false;
    }
    return true;
}

function validatePu(pu) {
    if (!pu) {
        $().toastmessage("showWarningToast", "个人主页地址不能为空哦");
        return false;
    }
    if (pu.indexOf("zhi") < 0) {
        $().toastmessage("showWarningToast", "还是要填知乎个人主页的地址才行啊");
        return false;
    }
    return true;
}

function validateItemName(name) {
    if (!name) {
        $().toastmessage("showWarningToast", "物品名称不填就没人能看到你的愿望了哦");
        return false;
    }
    return true;
}

function validateItemURL(url) {
    if (!url) {
        $().toastmessage("showWarningToast", "网购地址不填就没法给你实现愿望了哦");
        return false;
    }
    return true;
}

function validateWords(words) {
    if (!words) {
        $().toastmessage("showWarningToast", "还是说点什么吧");
        return false;
    }
    return true;
}

// escape html key char
function HTMLescape(text) {
    return text.replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/"/g, '&quot;').
        replace(/'/g, '&#039;');
}

function URLCheck(url) {
    if (url.indexOf("http://") < 0) {
        url = "http://" + url.trim();
    }
    return url;
}