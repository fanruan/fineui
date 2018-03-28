/**
 * Created by Urthur on 2017/11/21.
 */
!(function () {
    var Expander = BI.inherit(BI.Widget, {
        props: {
            baseCls: "bi-filter-expander",
            el: {},
            popup: {}
        },

        render: function () {
            var self = this, o = this.options;
            return {
                type: "bi.filter_expander",
                el: o.el,
                popup: o.popup,
                id: o.id,
                value: o.value,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    }
                }],
                ref: function (_ref) {
                    self.expander = _ref;
                }
            };
        },

        populate: function () {
            this.expander.populate.apply(this.expander, arguments);
        },

        getValue: function () {
            var val = this.expander.getValue();
            return {
                filterType: val.type,
                filterValue: val.value,
                id: val.id
            };
        }
    });
    BI.shortcut("bi.and.or.filter.expander", Expander);
}());