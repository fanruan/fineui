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
        if (ob.columnSize && ob.columnSize.indexOf("") >= 0 && ob.columnSize.indexOf("fill") >= 0) {
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Stretch
            }, ob, {type: "bi.table_adapt"});
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
        return BI.extend({}, ob, {type: "bi.inline_horizontal_adapt"});
    });

    BI.Plugin.configWidget("bi.horizontal_fill", function (ob) {
        if (isSupportFlex()) {
            return BI.extend({
                horizontalAlign: BI.HorizontalAlign.Stretch,
                verticalAlign: BI.VerticalAlign.Stretch,
                scrollx: false
            }, ob, {type: "bi.flex_horizontal"});
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
        return BI.extend({}, ob, {type: "bi.vtape"});
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
            if (ob.hgap > 0 || ob.rgap > 0) {// flex中最后一个margin-right不生效
                return BI.extend({}, ob, {type: "bi.flex_scrollable_horizontal"});
            }
        }
    });
    BI.Plugin.configWidget("bi.flex_vertical", function (ob) {
        if (ob.scrollable === true || ob.scrollx === true) {
            if (ob.hgap > 0 || ob.rgap > 0) {// flex中最后一个margin-right不生效
                return BI.extend({}, ob, {type: "bi.flex_scrollable_vertical"});
            }
        }
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
