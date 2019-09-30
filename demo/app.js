Demo = {
    version: 1.0
};
BI.$(function () {
    var ref;

    BI.each(Demo.CONFIG, function (index, item) {
        !item.id && (item.id = item.value || item.text);
    });
    var tree = BI.Tree.transformToTreeFormat(Demo.CONFIG);

    var obj = {
        routes: {
            "": "index"
        },
        index: function () {
            Demo.showIndex = "demo.face";
        }
    };

    BI.Tree.traversal(tree, function (index, node) {
        if (!node.children || BI.isEmptyArray(node.children)) {
            obj.routes[node.text] = node.text;
            obj[node.text] = function () {
                Demo.showIndex = node.value;
            };
        }
    });

    var AppRouter = BI.inherit(BI.Router, obj);
    new AppRouter;
    BI.history.start();

    BI.createWidget({
        type: "demo.main",
        ref: function (_ref) {
            console.log(_ref);
            ref = _ref;
        },
        element: "#wrapper"
    });
});