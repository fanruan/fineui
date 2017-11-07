/**
 *
 *
 * 查看已选弹出层的展示面板
 * @class BI.DisplaySelectedList
 * @extends BI.Widget
 */
BI.DisplaySelectedList = BI.inherit(BI.Pane, {

    constants: {
        height: 25,
        lgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.DisplaySelectedList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-display-list",
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.DisplaySelectedList.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.list_pane",
            element: this,
            el: {
                type: "bi.loader",
                isDefaultInit: false,
                logic: {
                    dynamic: true,
                    scrolly: true
                },
                items: this._createItems(opts.items),
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical",
                    lgap: 10
                }]
            },
            itemsCreator: function (options, callback) {

                opts.itemsCreator(options, function (ob) {
                    self.hasNext = !!ob.hasNext;
                    callback(self._createItems(ob.items));
                })
            },
            hasNext: function () {
                return self.hasNext;
            }
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: 'bi.icon_text_item',
            cls: 'cursor-default check-font display-list-item bi-tips',
            once: true,
            invalid: true,
            selected: true,
            height: this.constants.height,
            logic: {
                dynamic: true
            }
        });
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        if (arguments.length === 0) {
            this.button_group.populate();
        } else {
            this.button_group.populate(this._createItems(items));
        }
    }
});

BI.shortcut('bi.display_selected_list', BI.DisplaySelectedList);