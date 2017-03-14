/**
 * 卡片布局，可以做到当前只显示一个组件，其他的都隐藏
 * @class BI.CardLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {String} options.defaultShowName 默认展示的子组件名
 */
BI.CardLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.CardLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-card-layout",
            items: []
        });
    },
    _init: function () {
        BI.CardLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getCardName: function (cardName) {
        return this.getName() + cardName;
    },

    resize: function () {
        // console.log("default布局不需要resize");
    },

    stroke: function (items) {
        var self = this;
        this.clear();
        this.showIndex = void 0;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!self.hasWidget(self._getCardName(item.cardName))) {
                    var w = BI.createWidget(item);
                    self.addWidget(self._getCardName(item.cardName), w);
                } else {
                    var w = self.getWidgetByName(self._getCardName(item.cardName));
                }
                w.element.css({"position": "absolute", "top": "0", "right": "0", "bottom": "0", "left": "0"});
                w.invisible();
            }
        });
    },

    populate: function (items) {
        BI.CardLayout.superclass.populate.apply(this, arguments);
        this.render();
        this.options.defaultShowName && this.showCardByName(this.options.defaultShowName);
    },

    isCardExisted: function (cardName) {
        return this.hasWidget(this._getCardName(cardName))
            && $(this.getWidgetByName(this._getCardName(cardName)).element).length !== 0;
    },

    getCardByName: function (cardName) {
        if (!this.hasWidget(this._getCardName(cardName))) {
            throw new Error("cardName不存在，无法获取");
        }
        return this.widgets[this._getCardName(cardName)];
    },

    deleteCardByName: function (cardName) {
        if (!this.hasWidget(this._getCardName(cardName))) {
            throw new Error("cardName不存在，无法删除");
        }
        this.getWidgetByName(this._getCardName(cardName)).destroy();
        var index = BI.findKey(this.options.items, function (i, item) {
            return item.cardName == cardName;
        });
        this.options.items.splice(index, 1);
        delete this.widgets[this._getCardName(cardName)];
    },

    addCardByName: function (cardName, cardItem) {
        if (this.hasWidget(this._getCardName(cardName))) {
            throw new Error("cardName已经存在了");
        }
        this.options.items.push({el: cardItem, cardName: cardName});
        var widget = BI.createWidget(cardItem);
        widget.element.css({"position": "relative", "top": "0", "left": "0", "width": "100%", "height": "100%"})
            .appendTo(this.element);
        widget.invisible();
        this.addWidget(this._getCardName(cardName), widget);
        return widget;
    },

    showCardByName: function (name, action, callback) {
        var self = this;
        //name不存在的时候全部隐藏
        var exist = this.hasWidget(this._getCardName(name));
        if (this.showIndex != null) {
            this.lastShowIndex = this.showIndex;
        }
        this.showIndex = this._getCardName(name);
        var flag = false;
        BI.each(this.widgets, function (i, el) {
            if (self._getCardName(name) != i) {
                //动画效果只有在全部都隐藏的时候才有意义,且只要执行一次动画操作就够了
                !flag && !exist && (BI.Action && action instanceof BI.Action) ? (action.actionBack(el), flag = true) : el.element.hide();
            } else {
                (BI.Action && action instanceof BI.Action) ? action.actionPerformed(void 0, el, callback) : el.element.show(0, callback);
            }
        });
    },

    showLastCard: function () {
        var self = this;
        this.showIndex = this.lastShowIndex;
        BI.each(this.widgets, function (i, el) {
            if (self.showIndex != i) {
                el.element.hide();
            } else {
                el.element.show();
            }
        })
    },

    setDefaultShowName: function (name) {
        this.options.defaultShowName = name;
        return this;
    },

    getDefaultShowName: function () {
        return this.options.defaultShowName;
    },

    getAllCardNames: function () {
        return BI.map(this.options.items, function (i, item) {
            return item.cardName;
        })
    },

    getShowingCard: function () {
        if (!BI.isKey(this.showIndex)) {
            return void 0;
        }
        return this.getWidgetByName(this.showIndex);
    },

    deleteAllCard: function () {
        var self = this;
        BI.each(this.getAllCardNames(), function (i, name) {
            self.deleteCardByName(name);
        })
    },

    hideAllCard: function () {
        BI.each(this.widgets, function (i, el) {
            el.invisible();
        });
    },

    isAllCardHide: function () {
        var flag = true;
        BI.each(this.widgets, function (i, el) {
            if (el.isVisible()) {
                flag = true;
                return false;
            }
        });
        return flag;
    },

    empty: function () {
        BI.CardLayout.superclass.empty.apply(this, arguments);
        this.showIndex = void 0;
    }
});
$.shortcut('bi.card', BI.CardLayout);