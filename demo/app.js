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
        path: "/",
        component: function () {
            return Promise.resolve({
                type: "demo.face"
            });
        }
    }, {
        name: "component",
        path: "/component/:componentId",
        component: function () {
            return Promise.resolve({
                type: "demo.router"
            });
        },
    }, {
        name: "user",
        path: "/user/:name",
        component: function () {
            return Promise.resolve({
                type: "bi.vtape",
                items: [{
                    type: "bi.label",
                    text: "user",
                    height: 50
                }, {
                    type: "bi.router_view",
                    deps: 1,
                    height: 100
                }, {
                    type: "bi.router_view",
                    name: 'tool-buttons',
                    deps: 1
                }]
            });
        },
        children: [{
            path: '',
            components: {
                default: function () {
                    return Promise.resolve({
                        type: "bi.label",
                        text: 'home'
                    });
                },
            }
        }, {
            name: 'dashboard',
            path: 'dashboard',
            component: function () {
                return Promise.resolve({
                    type: "bi.label",
                    text: 'dashboard'
                });
            }
        }, {
            name: 'tables',
            path: 'tables/:id',
            components: {
                default: function () {
                    return Promise.resolve({
                        type: "bi.label",
                        text: 'table-view'
                    });
                },
                "tool-buttons": function () {
                    return Promise.resolve({
                        type: "bi.label",
                        text: '预览按钮',
                    });
                },
            }
        }]
    }];

    // BI.Tree.traversal(tree, function (index, node) {
    //     if (!node.children || BI.isEmptyArray(node.children)) {
    //         routes.push({
    //             path: "/",
    //             component: function () {
    //                 return Promise.resolve({
    //                     type: node.value
    //                 });
    //             }
    //         });
    //     }
    // });

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
            };
        }
    });
});
