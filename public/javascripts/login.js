$(function () {
    $().toastmessage({
        position: 'middle-center'
    });

    $("#confirm").on("click", function () {
        var userName = $("#un").val();
        if (!validateUserName(userName)) {
            $("#un").focus();
            return;
        }
        $.post('/checkPerson', {"userCode": userName}).done(
            function (data) {
                if (data) {
                    window.location.href = "/wishes";
                } else {
                    $().toastmessage("showWarningToast", "用户不存在");
                    return;
                }
            }).error(
            function () {
                $().toastmessage("showErrorToast", "查询数据失败，如果现在是8-24点，请联系管理员。");
            }
        );
    });

    $("#register").on("click", function() {
       window.location.href="/register";
    });

    function validateUserName(userName) {
        if (!userName) {
            $().toastmessage("showWarningToast", "用户名不填就没法登录了。");
            return false;
        }
        return true;
    }
});