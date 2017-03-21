BI.TreeLabelView = BI.inherit(BI.Widget, {
    _constant: {
        LIST_LABEL_HEIGHT: 40,
        DEFAULT_LEFT_GAP: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.TreeLabelView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-label-view",
            titleWidth: 60,
            titles: [],
            items: []
        })
    },

    _init: function () {
        BI.TreeLabelView.superclass._init.apply(this, arguments);
        this.items = [];
        this._initView();
    },

    _initView: function () {
        var self = this, o = this.options;
        this.title = BI.createWidget({
            type: "bi.button_group",
            height: this._constant.LIST_LABEL_HEIGHT * o.titles.length,
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.right = BI.createWidget({
            type: "bi.button_group",
            cls: "list-label-group",
            height: this._constant.LIST_LABEL_HEIGHT * this.items.length,
            layouts: [{
                type: "bi.horizontal"
            }]
        });
        this._setTitles(o.titles);
        this._setItems(o.items);
        BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: this.title,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: 60
            }, {
                el: this.right,
                left: 65,
                right: 0,
                top: 0,
                bottom: 0
            }],
            element: this
        });
    },

    _setItems: function (items) {
        var self = this;
        var length = this.right.getAllButtons().length;
        var deletes = [];
        for (var i = 0; i < length; i++) {
            deletes.push(i);
        }
        this.right.removeItemAt(deletes);
        self.items = [];
        BI.each(items, function (idx, values) {
            var labelItems = [];
            BI.each(values, function (idx, value) {
                labelItems.push({
                    title: value,
                    text: value,
                    value: value
                })
            });
            var temp = BI.createWidget({
                type: "bi.list_label",
                items: labelItems,
                showTitle: false
            });
            temp.on(BI.ListLabel.EVENT_CHANGE, function () {
                self.fireEvent(BI.TreeLabelView.EVENT_CHANGE, idx);
            });
            self.items.push(temp);
        });
        var temp = BI.createWidget({
            type: "bi.default",
            items: self.items
        });
        this.right.addItems([temp]);
        this.right.setHeight(self.items.length * this._constant.LIST_LABEL_HEIGHT);
    },

    _setTitles: function (titles) {
        var length = this.title.getAllButtons().length;
        var deletes = [], titleItems = [];
        for (var i = 0; i < length; i++) {
            deletes.push(i);
        }
        BI.each(titles, function (idx, title) {
           titleItems.push({
               text: title,
               value: title,
               title: title
           });
        });
        this.title.removeItemAt(deletes);
        this.title.addItems(BI.createItems(titleItems, {
            type: "bi.label",
            height: this._constant.LIST_LABEL_HEIGHT,
            width: this.options.titleWidth
        }));
        this.title.setHeight(titles.length * this._constant.LIST_LABEL_HEIGHT);
    },

    _setValue: function (values) {
        BI.each(this.items, function (idx, item) {
            values[idx] && item.setValue(values[idx]);
        })
    },

    populate: function(v) {
        v.titles && this._setTitles(v.titles);
        v.items && this._setItems(v.items);
        v.values && this._setValue(v.values);
    },

    getMaxFloor: function () {
        return this.items.length || 0;
    },

    getValue: function () {
        var result = [];
        BI.each(this.items, function (idx, item) {
            result.push(item.getValue());
        });
        return result;
    }
});
BI.TreeLabelView.EVENT_CHANGE = "BI.TreeLabelView.EVENT_CHANGE";
$.shortcut('bi.tree_label_view', BI.TreeLabelView);