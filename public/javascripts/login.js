$(function () {
    $().toastmessage({
        position:'middle-center'
    });

    $("#confirm").on("click", function () {
        if ($(this).attr("btype") == "pc") {
            var passCode = $("#pc").val();
            var userName = $("#login").val();
            if(!validatePassCode(passCode,userName)) {
                $("#pc").focus();
                return;
            }
            if(userName) {
                $.post('/checkPerson', {"userCode": userName}).done(
                    function (data) {
                        if(data) {
                            window.location.href = "/wishes";
                        } else {
                            $().toastmessage("showWarningToast","用户不存在");
                            return;
                        }
                    }).error(
                    function () {
                        $().toastmessage("showErrorToast","查询数据失败，如果现在是8-24点，请联系管理员。");
                    }
                );
                return;
            }
            $.post('/checkPassCode', {"passCode": passCode }).done(
                function (data) {
                    if (data) {
                        $("#passCode").addClass("hide");
                        $("#userCode").removeClass("hide");
                        $("#confirm").attr("btype", "uc");
                    } else {
                        $().toastmessage("showWarningToast","邀请码不存在");
                        return;
                    }
                }).error(
                function () {
                    $().toastmessage("showErrorToast","邀请码匹配失败，如果现在是8-24点，请联系管理员。");
                });
        } else if ($(this).attr("btype") == "uc") {
            var userCode = $("#uc").val();
            var pu = $("#pu").val();
            if(!validateUserCode(userCode)) {
                $("#uc").focus();
                return;
            }
            if(!validatePu(pu)) {
                $("#pu").focus();
                return;
            }
            $.post('/checkPerson', {"userCode": userCode}).done(
                function (data) {
                    if (!data) {
                        $("#userCode").addClass("hide");
                        $("#itemInfo").removeClass("hide");
                        $("#confirm").attr("btype", "item");
                    } else {
                        window.location.href = "/wishes";
                    }
                }).error(
                function () {
                    $().toastmessage("showErrorToast","查询数据失败，如果现在是8-24点，请联系管理员。");
                }
            );
        } else if ($(this).attr("btype") == "item") {
            if(!validateItemName($("#name").val())) {
                $("#name").focus();
                return;
            }
            if(!validateItemURL($("#url").val())) {
                $("#url").focus();
                return;
            }
            $("#itemInfo").addClass("hide");
            $("#wordsarea").removeClass("hide");
            $("#confirm").attr("btype", "words").text("完成");
        } else if ($(this).attr("btype") == "words") {
            if(!validateWords($("#words").val())) {
                $("#words").focus();
                return;
            }
            $.post('/addPerson',
                {"userCode": HTMLescape($("#uc").val()),
                    "passCode": HTMLescape($("#pc").val()),
                    "personUrl": HTMLescape($("#pu").val()),
                    "name": HTMLescape($("#name").val()),
                    "url": HTMLescape($("#url").val()),
                    "words": HTMLescape($("#words").val())
                }
            ).done(function () {
                    window.location.href = "/wishes";
                }).error(
                function () {
                    $().toastmessage("showErrorToast","提交数据失败，如果现在是8-24点，请联系管理员。");
                });
        }
    });
})
;

function validatePassCode(passCode,userName) {
    if(passCode || userName) {
        return true;
    }
    $().toastmessage("showWarningToast","邀请码或者用户名至少要填一项哦");
    return false;
}

function validateUserCode(userCode) {
    if(!userCode) {
        $().toastmessage("showWarningToast","用户名可不能不填啊");
        return false;
    }
    if(userCode.length > 20) {
        $().toastmessage("showWarningToast","用户名不能超过20个字符哦");
        return false;
    }
    return true;
}

function validatePu(pu) {
    if(!pu) {
        $().toastmessage("showWarningToast","个人主页地址不能为空哦");
        return false;
    }
    if(pu.indexOf("zhi")<0) {
        $().toastmessage("showWarningToast","还是要填知乎个人主页的地址才行啊");
        return false;
    }
    return true;
}

function validateItemName(name) {
    if(!name) {
        $().toastmessage("showWarningToast","物品名称不填就没人能看到你的愿望了哦");
        return false;
    }
    return true;
}

function validateItemURL(url) {
    if(!url) {
        $().toastmessage("showWarningToast","网购地址不填就没法给你实现愿望了哦");
        return false;
    }
    return true;
}

function validateWords(words) {
    if(!words) {
        $().toastmessage("showWarningToast","还是说点什么吧");
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