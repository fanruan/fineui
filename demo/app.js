Demo = {
    version: 1.0
};
BI.$(function () {
    var ref;

    BI.each(Demo.CONFIG, function (index, item) {
        !item.id && (item.id = item.value || item.text);
    });
    var tree = BI.Tree.transformToTreeFormat(Demo.CONFIG);

    var routes = [{
        path: '/',
        component: function(){
            return Promise.resolve({
                type: "demo.face"
            })
        }
    }];

    BI.Tree.traversal(tree, function (index, node) {
        if (!node.children || BI.isEmptyArray(node.children)) {
            routes.push({
                path: '/' + node.text,
                component: function(){
                    return Promise.resolve({
                        type: node.value
                    })
                }
            });
        }
    });

    // var AppRouter = BI.inherit(BI.Router, obj);
    // new AppRouter;
    // BI.history.start();

    BI.createWidget({
        type: "bi.router",
        ref: function (_ref) {
            BI.$router = _ref.$router;
        },
        element: "#wrapper",
        routes: routes,
        render: function () {
            return {
                type: "demo.main",
                ref: function (_ref) {
                    console.log(_ref);
                    ref = _ref;
                }
            }
        }
    });
});
