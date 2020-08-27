// 工程配置
BI.prepares.push(function () {
    // 注册布局
    // adapt类布局优先级规则
    // 1、在非IE且支持flex的浏览器下使用flex布局
    // 2、IE或者不支持flex的浏览器下使用inline布局
    // 3、在2的情况下如果布局的items大于1的话使用display:table的布局
    // 4、在3的情况下如果IE版本低于8使用table标签布局
    var _isSupportFlex;
    var isSupportFlex = function () {
        if (_isSupportFlex == null) {
            _isSupportFlex = !!(BI.isSupportCss3 && BI.isSupportCss3("flex"));
        }
        return _isSupportFlex;
    };
    BI.Plugin.configWidget("bi.horizontal", function (ob) {
        var isIE = BI.isIE(), supportFlex = isSupportFlex(), isLessIE8 = isIE && BI.getIEVersion() < 8;
        if (isLessIE8) {
            return ob;
        }
        // 在横向自适应场景下我们需要使用table的自适应撑出滚动条的特性（flex处理不了这种情况）
        // 主要出现在center_adapt或者horizontal_adapt的场景，或者主动设置horizontalAlign的场景
        if (ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch) {
            return BI.extend(ob, {type: "bi.table_adapt"});
        }
        if (!IE && supportFlex) {
            return BI.extend(ob, {type: "bi.flex_horizontal"});
        }
        // 解决使用inline_vertical_adapt的顺序问题
        // 从右往左放置时，为了兼容，我们统一采用从右到左的放置方式
        if (ob.horizontalAlign === BI.HorizontalAlign.Right) {
            return BI.extend(ob, {type: "bi.inline_vertical_adapt", items: ob.items && ob.items.reverse()});
        }
        return BI.extend(ob, {type: "bi.table_adapt"});
    });
    BI.Plugin.configWidget("bi.center_adapt", function (ob) {
        var isIE = BI.isIE(), supportFlex = isSupportFlex(), justOneItem = (ob.items && ob.items.length <= 1);
        var isAdapt = !ob.horizontalAlign || ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch;
        if (!isIE && supportFlex) {
            if (!isAdapt || justOneItem) {
                return BI.extend(ob, {type: "bi.flex_center_adapt"});
            }
        }
        if (!isAdapt || justOneItem) {
            return BI.extend(ob, {type: "bi.inline_center_adapt"});
        }
        return ob;
    });
    BI.Plugin.configWidget("bi.vertical_adapt", function (ob) {
        var isIE = BI.isIE(), supportFlex = isSupportFlex(), justOneItem = (ob.items && ob.items.length <= 1);
        var isAdapt = ob.horizontalAlign === BI.HorizontalAlign.Center || ob.horizontalAlign === BI.HorizontalAlign.Stretch;
        if (!isIE && supportFlex) {
            if (!isAdapt || justOneItem) {
                return BI.extend(ob, {type: "bi.flex_vertical_center_adapt"});
            }
        }
        if (!isAdapt || justOneItem) {
            return BI.extend(ob, {type: "bi.inline_vertical_adapt"});
        }
        return ob;
    });
    BI.Plugin.configWidget("bi.horizontal_adapt", function (ob) {
        if (!ob.verticalAlign || ob.verticalAlign === BI.VerticalAlign.TOP) {
            if (ob.items && ob.items.length <= 1) {
                return BI.extend(ob, {type: "bi.horizontal_auto"});
            }
        }
        return ob;
    });
    BI.Plugin.configWidget("bi.horizontal_float", function (ob) {
        if (!BI.isIE() && isSupportFlex()) {
            return BI.extend(ob, {type: "bi.flex_horizontal_adapt"});
        }
        return BI.extend(ob, {type: "bi.inline_horizontal_adapt"});
    });

    BI.Plugin.configWidget("bi.flex_horizontal", function (ob) {
        if (ob.scrollable === true || ob.scrolly === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_horizontal"});
        }
    });
    BI.Plugin.configWidget("bi.flex_vertical", function (ob) {
        if (ob.scrollable === true || ob.scrollx === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_vertical"});
        }
    });
    BI.Plugin.configWidget("bi.flex_horizontal_adapt", function (ob) {
        if (ob.scrollable === true || ob.scrollx === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_horizontal_adapt"});
        }
    });
    BI.Plugin.configWidget("bi.flex_vertical_adapt", function (ob) {
        if (ob.scrollable === true || ob.scrolly === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_vertical_adapt"});
        }
    });
    BI.Plugin.configWidget("bi.flex_horizontal_center_adapt", function (ob) {
        if (ob.scrollable === true || ob.scrollx === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_horizontal_adapt"});
        }
    });
    BI.Plugin.configWidget("bi.flex_vertical_center_adapt", function (ob) {
        if (ob.scrollable === true || ob.scrolly === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_vertical_adapt"});
        }
    });
    BI.Plugin.configWidget("bi.flex_center_adapt", function (ob) {
        if (ob.scrollable === true || ob.scrolly === true || ob.scrollx === true) {
            return BI.extend(ob, {type: "bi.flex_scrollable_center_adapt"});
        }
    });

    BI.Plugin.configWidget("bi.radio", function (ob) {
        if (BI.isIE() && BI.getIEVersion() < 9) {
            return BI.extend(ob, {type: "bi.image_radio"});
        }
        return ob;
    });

    BI.Plugin.configWidget("bi.checkbox", function (ob) {
        if (BI.isIE() && BI.getIEVersion() < 9) {
            return BI.extend(ob, {type: "bi.image_checkbox"});
        }
        return ob;
    });

    BI.Plugin.configWidget("bi.half_icon_button", function (ob) {
        if (BI.isIE() && BI.getIEVersion() < 9) {
            return ob;
        }
        return BI.extend(ob, {type: "bi.half_button"});
    });
});
