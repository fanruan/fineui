//工程配置
$(function () {
    //注册布局
    var isSupportFlex = BI.isSupportCss3("flex");
    BI.Plugin.registerWidget("bi.horizontal", function (ob) {
        if (isSupportFlex) {
            return BI.extend(ob, {type: "bi.flex_horizontal"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.center_adapt", function (ob) {
        if (isSupportFlex && ob.items && ob.items.length <= 1) {
            //有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                //不是IE用flex_wrapper_center布局
                if (!BI.isIE()) {
                    return BI.extend(ob, {type: "bi.flex_wrapper_center"});
                }
                return ob;
            }
            return BI.extend(ob, {type: "bi.flex_center"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.vertical_adapt", function (ob) {
        if (isSupportFlex) {
            //有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                //不是IE用flex_wrapper_center布局
                if (!BI.isIE()) {
                    return BI.extend({}, ob, {type: "bi.flex_wrapper_vertical_center"});
                }
                return ob;
            }
            return BI.extend(ob, {type: "bi.flex_vertical_center"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.float_center_adapt", function (ob) {
        if (isSupportFlex) {
            //有滚动条的情况下需要用到flex_wrapper_center布局
            if (ob.scrollable === true || ob.scrollx === true || ob.scrolly === true) {
                //不是IE用flex_wrapper_center布局
                if (!BI.isIE()) {
                    return BI.extend({}, ob, {type: "bi.flex_wrapper_center"});
                }
                return ob;
            }
            return BI.extend(ob, {type: "bi.flex_center"});
        } else {
            return ob;
        }
    });

    //注册控件
    BI.Plugin.registerWidget("bi.grid_table", function (ob) {
        //IE下滚动条滑动效果不好，禁止掉
        if (BI.isIE() || BI.isFireFox()) {
            return BI.extend(ob, {type: "bi.quick_grid_table"});
        } else {
            return ob;
        }
    });
    BI.Plugin.registerWidget("bi.collection_table", function (ob) {
        //IE下滚动条滑动效果不好，禁止掉
        if (BI.isIE() || BI.isFireFox()) {
            return BI.extend(ob, {type: "bi.quick_collection_table"});
        } else {
            return ob;
        }
    });
});