/**
 * Created by Young's on 2016/8/30.
 */
BI.LoginTimeOut = BI.inherit(BI.BarPopoverSection, {
    _defaultConfig: function () {
        return BI.extend(BI.LoginTimeOut.superclass._defaultConfig.apply(this, arguments), {})
    },

    _init: function () {
        BI.LoginTimeOut.superclass._init.apply(this, arguments);
    },

    rebuildNorth: function (north) {
        BI.createWidget({
            type: "bi.label",
            element: north,
            text: BI.i18nText("BI-Login_Timeout"),
            height: 50,
            textAlign: "left"
        })
    },

    rebuildCenter: function (center) {
        var self = this, o = this.options;
        var userNameInput = BI.createWidget({
            type: "bi.editor",
            watermark: BI.i18nText("BI-Username"),
            cls: "login-input",
            allowBlank: true,
            width: 300,
            height: 30
        });
        var userNameMask = BI.createWidget({
            type: "bi.text_button",
            width: 330,
            height: 56,
            cls: "error-mask"
        });
        userNameMask.setVisible(false);
        userNameMask.on(BI.TextButton.EVENT_CHANGE, function () {
            userNameInput.focus();
            this.element.fadeOut();
        });

        var userNameWrapper = BI.createWidget({
            type: "bi.absolute",
            cls: "input-wrapper login-username-icon",
            items: [{
                el: {
                    type: "bi.icon",
                    width: 26,
                    height: 26
                },
                top: 10,
                left: 0
            }, {
                el: userNameInput,
                top: 8,
                left: 30
            }, {
                el: userNameMask,
                top: 0,
                left: 0
            }],
            width: 330,
            height: 56
        });


        var passwordInput = BI.createWidget({
            type: "bi.editor",
            inputType: "password",
            cls: "login-input",
            allowBlank: true,
            watermark: BI.i18nText("BI-Basic_Password"),
            width: 300,
            height: 30
        });
        var passwordMask = BI.createWidget({
            type: "bi.text_button",
            width: 330,
            height: 56,
            cls: "error-mask"
        });
        passwordMask.setVisible(false);
        passwordMask.on(BI.TextButton.EVENT_CHANGE, function () {
            passwordInput.focus();
            this.element.fadeOut();
        });

        var passwordWrapper = BI.createWidget({
            type: "bi.absolute",
            cls: "input-wrapper login-password-icon",
            items: [{
                el: {
                    type: "bi.icon",
                    width: 26,
                    height: 26
                },
                top: 10,
                left: 0
            }, {
                el: passwordInput,
                top: 8,
                left: 30
            }, {
                el: passwordMask,
                top: 0,
                left: 0
            }],
            width: 330,
            height: 56
        });

        var loginButton = BI.createWidget({
            type: "bi.text_button",
            text: BI.i18nText("BI-Basic_Login"),
            cls: "login-button",
            width: 330,
            height: 50
        });
        loginButton.on(BI.TextButton.EVENT_CHANGE, function () {
            if (BI.isEmptyString(userNameInput.getValue())) {
                self._showMes(userNameMask, BI.i18nText("BI-Username_Not_Null"));
                return;
            }
            if (BI.isEmptyString(passwordInput.getValue())) {
                self._showMes(passwordMask, BI.i18nText("BI-Password_Not_Null"));
                return;
            }

            //反正是登录直接用FR的登录了
            FR.ajax({
                url: FR.servletURL + '?op=fs_load&cmd=login',
                data: FR.cjkEncodeDO({
                    fr_username: encodeURIComponent(userNameInput.getValue()),
                    fr_password: encodeURIComponent(passwordInput.getValue()),
                    fr_remember: self.keepLoginState.isSelected()
                }),
                type: 'POST',
                async: false,
                error: function () {
                    BI.Msg.toast("Error!");
                },
                complete: function (res, status) {
                    if (BI.isEmptyString(res.responseText)) {
                        self._showMes(userNameMask, BI.i18nText("BI-Authentication_Failed"));
                        return;
                    }
                    var signResult = FR.jsonDecode(res.responseText);
                    if (signResult.fail) {
                        //用户名和密码不匹配
                        self._showMes(userNameMask, BI.i18nText("BI-Username_Password_Not_Correct"));
                    } else if (signResult.url) {
                        self.fireEvent(BI.LoginTimeOut.EVENT_LOGIN);
                    }
                }
            });
        });

        var logo;
        if (BI.isNotNull(window.top.FS)) {
            logo = window.top.FS.config.logoImageID4FS;
        }
        BI.createWidget({
            type: "bi.absolute",
            element: center,
            cls: "bi-login-timeout-center",
            items: [{
                el: {
                    type: "bi.center_adapt",
                    items: [{
                        type: "bi.img",
                        src: FR.servletURL + (logo ?
                            '?op=fr_attach&cmd=ah_image&id=' + logo + '&isAdjust=false' :
                            '?op=resource&resource=/com/fr/bi/web/images/login/bi_logo.png'),
                        width: 120,
                        height: 120
                    }],
                    width: 200,
                    height: 300
                },
                left: 0,
                top: 0
            }, {
                el: userNameWrapper,
                top: 30,
                left: 230
            }, {
                el: passwordWrapper,
                top: 100,
                left: 230
            }, {
                el: loginButton,
                top: 200,
                left: 230
            }]
        });
    },

    _showMes: function (widget, mes) {
        widget.setText(mes);
        widget.element.fadeIn();
        setTimeout(function () {
            if (widget.element.isVisible()) {
                widget.element.fadeOut();
            }
        }, 5000);
    },

    rebuildSouth: function (south) {
        this.keepLoginState = BI.createWidget({
            type: "bi.checkbox",
            width: 16,
            height: 16
        });
        BI.createWidget({
            type: "bi.absolute",
            element: south,
            cls: "bi-login-timeout-south",
            items: [{
                el: this.keepLoginState,
                top: 0,
                left: 230
            }, {
                el: {
                    type: "bi.label",
                    text: BI.i18nText("BI-Keep_Login_State"),
                    cls: "keep-state",
                    height: 30
                },
                top: -7,
                left: 260
            }]
        })
    }
});
BI.extend(BI.LoginTimeOut, {
    POPOVER_ID: "___popover__id___"
});
BI.LoginTimeOut.EVENT_LOGIN = "EVENT_LOGIN";
$.shortcut("bi.login_timeout", BI.LoginTimeOut);
