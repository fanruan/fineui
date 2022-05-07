/**
 * author: young
 * createdDate: 2018/11/30
 * description:
 */
!(function () {
    var Pane = BI.inherit(BI.Pane, {
        props: {

        },

        mounted: function () {
            console.log('loading pane mounted');
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

        beforeRender: function (callback) {
            var self = this;
            this.loading();
            setTimeout(function () {
                self.loaded();
                callback();
            }, 3000);
        }
    });
    BI.shortcut("demo.pane", Pane);
})();
