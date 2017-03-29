/**
 * Created by windy on 2017/3/28.
 */
BI.FilterList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FilterList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-list",
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        })
    },

    render: function(){
        var self = this, o = this.options;
        this.group = null;
        return {
            type: "bi.virtual_group",
            ref: function(_ref){
                self.group = _ref;
            },
            items: BI.createItems(o.items, {
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE);
                    }
                }]
            }),
            layouts: [{
                type: "bi.vertical",
                scrolly: false
            }]
        }
    },

    populate: function (items) {
        var self = this;
        this.group.populate(BI.map(items, function(idx, item){
            return BI.extend(item, {
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    }
                }]
            });
        }));
    },

    setValue: function (v) {
        this.group.setValue(v);
    },

    getValue: function () {
        return this.group.getValue();
    }
});
BI.shortcut("bi.filter_list", BI.FilterList);