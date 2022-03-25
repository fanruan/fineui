// 工程配置
BI.prepares.push(function () {
    // 注册布局
    // adapt类布局优先级规则
    // 1、支持flex的浏览器下使用flex布局
    // 2、不支持flex的浏览器下使用inline布局
    // 3、当列宽既需要自动列宽又需要自适应列宽时，inline布局也处理不了了。当横向出滚动条时使用table布局，不出滚动条时使用float布局
    var _isSupportFlex, _isSupportGrid;
    var isSupportFlex = function () {
        if (_isSupportFlex == null) {
            _isSupportFlex = !!(BI.isSupportCss3 && BI.isSupportCss3("flex"));
        }
        return _isSupportFlex;
    };
    var isSupportGrid = function () {
        if (_isSupportGrid == null) {
            _isSupportGrid = !!(BI.isSupportCss3 && BI.isSupportCss3("grid"));
        }
        return _isSupportGrid;
    };
    // 判断浏览器是否支持sticky 属性
    var isSupportSticky = (function () {
        var vendorList = ["", "-webkit-", "-ms-", "-moz-", "-o-"],
            vendorListLength = vendorList.length,
            stickyElement = document.createElement("div");
        for (var i = 0; i < vendorListLength; i++) {
            stickyElement.style.position = vendorList[i] + "sticky";
            if (stickyElement.style.position !== "") {
                return true;
            }
        }
        return false;
    })();
    BI.Plugin.configWidget("bi.horizontal", function (ob) {
        var supportFlex = isSupportFlex();
        // // 在横向自适应场景下我们需要使用table的自适应撑出滚动条的特性（flex处理不了这种情况）
        // // 主要出现在center_adapt或者horizontal_adapt的场景，或者主动设置horizontalAlign的场景
        // if (ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch) {
        //     return BI.extend({}, ob, {type: "bi.table_adapt"});
        // }
        if (supportFlex) {
            return BI.extend({}, ob, {type: "bi.flex_horizontal"});
        }
        return BI.extend({
            scrollx: true
        }, ob, {type: "bi.inline"});
    });
    BI.Plugin.configWidget("bi.inline", function (ob) {
        // 当列宽既需要自动列宽又需要自适应列宽时，inline布局也处理不了了，降级table处理吧
        var hasAutoAndFillColumnSize = false;
        if (ob.columnSize && ob.columnSize.length > 0) {
            if ((ob.columnSize.indexOf("") >= 0 || ob.columnSize.indexOf("auto") >= 0) && ob.columnSize.indexOf("fill") >= 0) {
                hasAutoAndFillColumnSize = true;
            }
        } else {
            var hasAuto = false, hasFill = false;
            BI.each(ob.items, function (i, item) {
                if (item.width === "fill") {
                    hasFill = true;
                } else if (BI.isNull(item.width) || item.width === "" || item.width === "auto") {
                    hasAuto = true;
                }
            });
            hasAutoAndFillColumnSize = hasAuto && hasFill;
        }

        if (hasAutoAndFillColumnSize) {
            // 宽度是不是受限
            if ((ob.scrollable !== true && ob.scrollx !== true) || ob.horizontalAlign === BI.HorizontalAlign.Stretch) {
                return BI.extend({
                    verticalAlign: BI.VerticalAlign.Top
                }, ob, {type: "bi.horizontal_float_fill"});
            }
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Stretch
            }, ob, {type: "bi.table_adapt"});
        }
        if (BI.Providers.getProvider("bi.provider.system").getResponsiveMode()) {
            return BI.extend({}, ob, {type: "bi.responsive_inline"});
        }
        return ob;
    });
    BI.Plugin.configWidget("bi.center_adapt", function (ob) {
        var supportFlex = isSupportFlex();
        // var isAdapt = !ob.horizontalAlign || ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch;
        // if (!isAdapt || justOneItem) {
        if (supportFlex) {
            return BI.extend({}, ob, {type: "bi.flex_center_adapt"});
        }
        return BI.extend({}, ob, {type: "bi.inline_center_adapt"});
        // }
        // return ob;
    });
    BI.Plugin.configWidget("bi.vertical_adapt", function (ob) {
        var supportFlex = isSupportFlex();
        // var isAdapt = ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch;
        // if (!isAdapt || justOneItem) {
        if (supportFlex) {
            return BI.extend({}, ob, {type: "bi.flex_vertical_center_adapt"});
        }
        return BI.extend({}, ob, {type: "bi.inline_vertical_adapt"});
        // }
        // return ob;
    });
    BI.Plugin.configWidget("bi.horizontal_adapt", function (ob) {
        var justOneItem = (ob.items && ob.items.length <= 1);
        var isAdapt = !ob.horizontalAlign || ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch;
        var verticalAlignTop = !ob.verticalAlign || ob.verticalAlign === BI.VerticalAlign.TOP;
        if (verticalAlignTop && justOneItem) {
            return BI.extend({}, ob, {type: "bi.horizontal_auto"});
        }
        var supportFlex = isSupportFlex();
        // 在横向自适应场景下我们需要使用table的自适应撑出滚动条的特性（flex处理不了这种情况）
        // 主要出现在center_adapt或者horizontal_adapt的场景，或者主动设置horizontalAlign的场景
        if (isAdapt) {
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Center
            }, ob, {type: "bi.table_adapt"});
        }
        if (supportFlex) {
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Center,
                scrollx: false
            }, ob, {type: "bi.flex_horizontal"});
        }
        return BI.extend({
            horizontalAlign: BI.HorizontalAlign.Center
        }, ob, {type: "bi.table_adapt"});
    });
    BI.Plugin.configWidget("bi.horizontal_float", function (ob) {
        if (isSupportFlex()) {
            return BI.extend({}, ob, {type: "bi.flex_horizontal_adapt"});
        }
        if (ob.items && ob.items.length <= 1) {
            return BI.extend({}, ob, {type: "bi.inline_horizontal_adapt"});
        }
        return ob;
    });

    BI.Plugin.configWidget("bi.horizontal_fill", function (ob) {
        if (isSupportFlex()) {
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Stretch,
                verticalAlign: BI.VerticalAlign.Stretch,
                scrollx: false
            }, ob, {type: "bi.flex_horizontal"});
        }
        if ((ob.horizontalAlign && ob.horizontalAlign !== BI.HorizontalAlign.Stretch) || (ob.scrollable === true || ob.scrollx === true)) {
            // 宽度不受限，要用table布局
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Stretch,
                verticalAlign: BI.VerticalAlign.Stretch
            }, ob, {type: "bi.table_adapt"});
        }
        return BI.extend({}, ob, {type: "bi.horizontal_float_fill"});
    });
    BI.Plugin.configWidget("bi.vertical_fill", function (ob) {
        if (isSupportFlex()) {
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Stretch,
                verticalAlign: BI.VerticalAlign.Stretch,
                scrolly: false
            }, ob, {type: "bi.flex_vertical"});
        }
        if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
            // 有滚动条，降级到table布局处理
            return BI.extend({}, ob, {
                type: "bi.td",
                items: BI.map(ob.items, function (i, item) {
                    return [item];
                })
            });
        }
        var hasAuto = false;
        if (ob.rowSize && ob.rowSize.length > 0) {
            if (ob.rowSize.indexOf("") >= 0 || ob.rowSize.indexOf("auto") >= 0) {
                hasAuto = true;
            }
        } else {
            BI.each(ob.items, function (i, item) {
                if (BI.isNull(item.height) || item.height === "") {
                    hasAuto = true;
                }
            });
        }
        if (hasAuto) {
            // 有自动高的时候
            return BI.extend({}, ob, {type: "bi.vtape_auto"});
        }
        return BI.extend({}, ob, {type: "bi.vtape"});
    });
    BI.Plugin.configWidget("bi.horizontal_sticky", function (ob) {
        if (!isSupportSticky) {
            return BI.extend({}, ob, {type: "bi.horizontal_fill"});
        }
    });
    BI.Plugin.configWidget("bi.vertical_sticky", function (ob) {
        if (!isSupportSticky) {
            return BI.extend({}, ob, {type: "bi.vertical_fill"});
        }
    });

    BI.Plugin.configWidget("bi.left_right_vertical_adapt", function (ob) {
        if (isSupportFlex()) {
            // IE下其实也是可以使用flex布局的，只要排除掉出现滚动条的情况
            // if (!BI.isIE() || (ob.scrollable !== true && ob.scrolly !== true)) {
            return BI.extend({}, ob, {type: "bi.flex_left_right_vertical_adapt"});
            // }
        }
        return ob;
    });
    BI.Plugin.configWidget("bi.flex_horizontal", function (ob) {
        if (ob.scrollable === true || ob.scrollx !== false) {
            if (ob.hgap > 0 || ob.lgap > 0 || ob.rgap > 0) {
                if (BI.Providers.getProvider("bi.provider.system").getResponsiveMode()) {
                    return BI.extend({}, ob, {type: "bi.responsive_flex_scrollable_horizontal"});
                }
                return BI.extend({}, ob, {type: "bi.flex_scrollable_horizontal"});
            }
        }
        if (BI.Providers.getProvider("bi.provider.system").getResponsiveMode()) {
            return BI.extend({}, ob, {type: "bi.responsive_flex_horizontal"});
        }
    });
    BI.Plugin.configWidget("bi.flex_vertical", function (ob) {
        if (ob.scrollable === true || ob.scrollx === true) {
            if (ob.hgap > 0 || ob.lgap > 0 || ob.rgap > 0) {
                return BI.extend({}, ob, {type: "bi.flex_scrollable_vertical"});
            }
        }
    });

    BI.Plugin.configWidget("bi.table", function (ob) {
        if (!isSupportGrid()) {
            return BI.extend({}, ob, {type: "bi.td"});
        }
        return ob;
    });

    BI.Plugin.configWidget("bi.radio", function (ob) {
        if (BI.isIE() && BI.getIEVersion() <= 9) {
            return BI.extend({}, ob, {type: "bi.image_radio"});
        }
        return ob;
    });

    BI.Plugin.configWidget("bi.checkbox", function (ob) {
        if (BI.isIE() && BI.getIEVersion() <= 9) {
            return BI.extend({}, ob, {type: "bi.image_checkbox"});
        }
        return ob;
    });

    BI.Plugin.configWidget("bi.half_icon_button", function (ob) {
        if (BI.isIE() && BI.getIEVersion() < 9) {
            return ob;
        }
        return BI.extend({}, ob, {type: "bi.half_button"});
    });
});
