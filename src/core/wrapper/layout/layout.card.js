/**
 * 卡片布局，可以做到当前只显示一个组件，其他的都隐藏
 * @class BI.CardLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {String} options.defaultShowName 默认展示的子组件名
 */
BI.CardLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.CardLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-card-layout",
            items: []
        });
    },

    render: function () {
        BI.CardLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.showIndex = void 0;
        BI.each(items, function (i, item) {
            if (item) {
                if (!self.hasWidget(item.cardName)) {
                    var w = BI._lazyCreateWidget(item);
                    w.on(BI.Events.DESTROY, function () {
                        var index = BI.findIndex(o.items, function (i, tItem) {
                            return tItem.cardName == item.cardName;
                        });
                        if (index > -1) {
                            o.items.splice(index, 1);
                        }
                    });
                    self.addWidget(self._getChildName(item.cardName), w);
                } else {
                    var w = self.getWidgetByName(self._getChildName(item.cardName));
                }
                w.element.css({
                    position: "relative",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%"
                });
                w.setVisible(false);
            }
        });
    },

    resize: function () {
        // console.log("Card布局不需要resize");
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    empty: function () {
        BI.CardLayout.superclass.empty.apply(this, arguments);
        this.options.items = [];
    },

    populate: function (items) {
        BI.CardLayout.superclass.populate.apply(this, arguments);
        this._mount();
        this.options.defaultShowName && this.showCardByName(this.options.defaultShowName);
    },

    isCardExisted: function (cardName) {
        return BI.some(this.options.items, function (i, item) {
            return item.cardName == cardName && item.el;
        });
    },

    getCardByName: function (cardName) {
        if (!this.isCardExisted(cardName)) {
            throw new Error("cardName不存在", cardName);
        }
        return this._children[this._getChildName(cardName)];
    },

    _deleteCardByName: function (cardName) {
        delete this._children[this._getChildName(cardName)];
        var index = BI.findIndex(this.options.items, function (i, item) {
            return item.cardName == cardName;
        });
        if (index > -1) {
            this.options.items.splice(index, 1);
        }
    },

    deleteCardByName: function (cardName) {
        if (!this.isCardExisted(cardName)) {
            throw new Error("cardName不存在", cardName);
        }

        var child = this._children[this._getChildName(cardName)];
        this._deleteCardByName(cardName);
        child && child._destroy();
    },

    addCardByName: function (cardName, cardItem) {
        if (this.isCardExisted(cardName)) {
            throw new Error("cardName 已存在", cardName);
        }
        var widget = BI._lazyCreateWidget(cardItem, this);
        widget.element.css({
            position: "relative",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%"
        }).appendTo(this.element);
        widget.invisible();
        this.addWidget(this._getChildName(cardName), widget);
        this.options.items.push({el: cardItem, cardName: cardName});
        return widget;
    },

    showCardByName: function (name, action, callback) {
        var self = this;
        // name不存在的时候全部隐藏
        var exist = this.isCardExisted(name);
        if (this.showIndex != null) {
            this.lastShowIndex = this.showIndex;
        }
        this.showIndex = name;
        var flag = false;
        BI.each(this.options.items, function (i, item) {
            var el = self._children[self._getChildName(item.cardName)];
            if (el) {
                if (name != item.cardName) {
                    // 动画效果只有在全部都隐藏的时候才有意义,且只要执行一次动画操作就够了
                    !flag && !exist && (BI.Action && action instanceof BI.Action) ? (action.actionBack(el), flag = true) : el.invisible();
                } else {
                    (BI.Action && action instanceof BI.Action) ? action.actionPerformed(void 0, el, callback) : (el.visible(), callback && callback());
                }
            }
        });
    },

    showLastCard: function () {
        var self = this;
        this.showIndex = this.lastShowIndex;
        BI.each(this.options.items, function (i, item) {
            self._children[self._getChildName(item.cardName)].setVisible(self.showIndex == i);
        });
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
        });
    },

    getShowingCard: function () {
        if (!BI.isKey(this.showIndex)) {
            return void 0;
        }
        return this.getWidgetByName(this._getChildName(this.showIndex));
    },

    deleteAllCard: function () {
        var self = this;
        BI.each(this.getAllCardNames(), function (i, name) {
            self.deleteCardByName(name);
        });
    },

    hideAllCard: function () {
        var self = this;
        BI.each(this.options.items, function (i, item) {
            self._children[self._getChildName(item.cardName)].invisible();
        });
    },

    isAllCardHide: function () {
        var self = this;
        var flag = true;
        BI.some(this.options.items, function (i, item) {
            if (self._children[self._getChildName(item.cardName)].isVisible()) {
                flag = false;
                return false;
            }
        });
        return flag;
    },

    removeWidget: function (nameOrWidget) {
        var removeName, self = this;
        if (BI.isWidget(nameOrWidget)) {
            BI.each(this._children, function (name, child) {
                if (child === nameOrWidget) {
                    removeName = name;
                }
            });
        } else {
            removeName = nameOrWidget;
        }
        if (removeName) {
            this._deleteCardByName(removeName);
        }
    }
});
BI.shortcut("bi.card", BI.CardLayout);
