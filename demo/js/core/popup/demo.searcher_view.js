/**
 * Created by Windy on 2017/12/13.
 */
Demo.Func = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-func"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.searcher_view",
                    ref: function () {
                        self.searcherView = this;
                    }
                },
                left: 100,
                top: 20,
                width: 230
            }]
        };
    },

    mounted: function () {
        this.searcherView.populate(BI.createItems([{
            text: 2012
        }, {
            text: 2013
        }, {
            text: 2014
        }, {
            text: 2015
        }], {
            type: "bi.label",
            textHeight: 24,
            height: 24
        }), [{
            text: 2
        }], "2");
    }
});
BI.shortcut("demo.searcher_view", Demo.Func);