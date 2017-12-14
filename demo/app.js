$(function () {
    var ref;
    var AppRouter = BI.inherit(BI.Router, {
        routes: {
            "": "index"
        },
        index: function () {
            BI.createWidget({
                type: "demo.main",
                ref: function (_ref) {
                    console.log(_ref);
                    ref = _ref;
                },
                element: "#wrapper"
            });
        }
    });
    new AppRouter;
    BI.history.start();
});