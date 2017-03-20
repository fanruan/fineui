$(function () {
    var ref;
    BI.createWidget({
        type: "demo.main",
        ref: function (_ref) {
            console.log(_ref);
            ref = _ref;
        },
        element: '#wrapper'
    });
    // ref.destroy();
});