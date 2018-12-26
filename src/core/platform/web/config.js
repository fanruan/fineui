// 工程配置
BI.prepares.push(function () {
    // 注册布局
    // adapt类布局优先级规则
    // 1、在非IE且支持flex的浏览器下使用flex布局
    // 2、IE或者不支持flex的浏览器下使用inline布局
    // 3、在2的情况下如果布局的items大于1的话使用display:table的布局
    // 4、在3的情况下如果IE版本低于8使用table标签布局
    var _isSupprtFlex;
    var isSupportFlex = function () {
        if (_isSupprtFlex == null) {
            _isSupprtFlex = !!(BI.isSupportCss3 && BI.isSupportCss3("flex"));
        }
        return _isSupprtFlex;
    };
    BI.Plugin.registerWidget("bi.horizontal", function (ob) {
        var isIE = BI.isIE(), supportFlex = isSupportFlex(), isLessIE8 = isIE && BI.getIEVersion() < 8;
        // center_adapt
        if (ob.verticalAlign === BI.VerticalAlign.Middle && ob.horizontalAlign === BI.HorizontalAlign.Center) {
            if (isLessIE8) {
                return ob;
            }
            return BI.extend(ob, {type: "bi.table_adapt"});
        }
        // vertical_adapt
        if (ob.verticalAlign === BI.VerticalAlign.Middle && ob.horizontalAlign === BI.HorizontalAlign.Left) {
            if (isLessIE8) {
                return ob;
            }
            return BI.extend(ob, {type: "bi.table_adapt"});
        }
        // horizontal_adapt
        if (ob.verticalAlign === BI.VerticalAlign.Top && ob.horizontalAlign === BI.HorizontalAlign.Center) {
            if (isLessIE8) {
                return ob;
            }
            return BI.extend(ob, {type: "bi.table_adapt"});
        }
        if(!isIE) {
            if(supportFlex) {
                return BI.extend(ob, {type: "bi.flex_horizontal"});
            }
            return BI.extend(ob, {type: "bi.table_adapt"});
        }
        return ob;
    });
    BI.Plugin.registerWidget("bi.center_adapt", function (ob) {
        var isIE = BI.isIE(), supportFlex = isSupportFlex(), justOneItem = (ob.items && ob.items.length <= 1);
        if (!isIE && supportFlex && justOneItem) {
            // 有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                // 不是IE用flex_wrapper_center布局
                return BI.extend(ob, {type: "bi.flex_wrapper_center"});
            }
            return BI.extend(ob, {type: "bi.flex_center"});
        }
        // 一个item的情况下inline布局睥睨天下
        if(justOneItem) {
            return BI.extend(ob, {type: "bi.inline_center_adapt"});
        }
        return ob;
    });
    BI.Plugin.registerWidget("bi.vertical_adapt", function (ob) {
        var isIE = BI.isIE(), supportFlex = isSupportFlex();
        if (!isIE && supportFlex) {
            // 有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                // 不是IE用flex_wrapper_center布局
                return BI.extend({}, ob, {type: "bi.flex_wrapper_vertical_center"});
            }
            return BI.extend(ob, {type: "bi.flex_vertical_center"});
        }
        return BI.extend(ob, {type: "bi.inline_vertical_adapt"});
    });
    BI.Plugin.registerWidget("bi.horizontal_adapt", function (ob) {
        if (ob.items && ob.items.length <= 1) {
            return BI.extend(ob, {type: "bi.horizontal_auto"});
        }
        return ob;
    });
    BI.Plugin.registerWidget("bi.float_center_adapt", function (ob) {
        if (!BI.isIE() && isSupportFlex()) {
            // 有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                // 不是IE用flex_wrapper_center布局
                return BI.extend({}, ob, {type: "bi.flex_wrapper_center"});
            }
            return BI.extend(ob, {type: "bi.flex_center"});
        }
        return BI.extend(ob, {type: "bi.inline_center_adapt"});
    });
});