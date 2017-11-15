//定义Model路由
var modelRouter = new (BI.inherit(BI.WRouter, {
    routes: {
        "": "index"
    },

    index: function () {
        return {};
    }
}));
//定义View路由
var viewRouter = new (BI.inherit(BI.WRouter, {
    routes: {
        "": "TestView",
        "/setget": "SetGetView",
        "/local": "LocalView",
        "/skipTo": "SkipToView",
        "/skipTo/:child": "getSkipToView",
        "/change": "ChangeView",
        "/change/inner": "ChangeInnerView",
        "/static": "StaticView",
        "/event": "EventView",
        "/layer": "LayerView",
        "/masker": "MaskerView",
        "/floatbox": "FloatBoxView",

        "/spliceDuplicate": "SpliceDuplicateView",
        "/spliceDuplicate/sdSub": "SDSubView",

        "/tmp": "TmpView",
        "/tmp/child": "TmpChildView",
        "/tmp/child/child": "TmpChildChildView"
    },

    getSkipToView: function (v) {
        switch (v) {
            case "red":
                return "SkipToRedView";
            case "blue":
                return "SkipToBlueView";
            case "green":
                return "SkipToGreenView";
            case "yellow":
                return "SkipToYellowView";
            default :
                return "SkipToRedView";
        }

    }
}));

//注册路由
BI.View.registerVMRouter(viewRouter, modelRouter);


Demo.FIX_CONFIG = [{
    id: 6,
    text: "数据流框架fix-1.0"
}, {
    pId: 6,
    text: "set,get方法",
    value: "demo.setget"
}, {
    pId: 6,
    text: "local函数",
    value: "demo.local"
}, {
    pId: 6,
    text: "skipTo函数",
    value: "demo.skipTo"
}, {
    pId: 6,
    text: "change函数",
    value: "demo.change"
}, {
    pId: 6,
    text: "splice和duplicate函数",
    value: "demo.spliceDuplicate"
}, {
    pId: 6,
    text: "tmp方法",
    value: "demo.tmp"
}, {
    id: 7,
    text: "数据流框架fix-2.0"
}, {
    id: 71,
    pId: 7,
    text: "定义响应式数据",
    value: "demo.fix1"
}, {
    id: 72,
    pId: 7,
    text: "state属性",
    value: "demo.fix6"
}, {
    id: 78,
    pId: 7,
    text: "计算属性",
    value: "demo.fix2"
}, {
    id: 73,
    pId: 7,
    text: "store",
    value: "demo.fix3"
}, {
    id: 74,
    pId: 7,
    text: "watcher且或表达式",
    value: "demo.fix4"
}, {
    id: 75,
    pId: 7,
    text: "watcher星号表达式",
    value: "demo.fix5"
}, {
    id: 76,
    pId: 7,
    text: "一个混合的例子",
    value: "demo.fix"
}, {
    id: 77,
    pId: 7,
    text: "场景",
    value: "demo.fix_scene"
}];