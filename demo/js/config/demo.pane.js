/**
 * author: young
 * createdDate: 2018/11/30
 * description:
 */
!(function () {
    var Pane = BI.inherit(BI.LoadingPane, {
        props: {

        },

        render: function () {
            return {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.label",
                    text: "this is pane center"
                }]
            };
        },

        beforeInit: function (callback) {
            setTimeout(function () {
                callback();
            }, 3000);
        }
    });
    BI.shortcut("demo.pane", Pane);
})();