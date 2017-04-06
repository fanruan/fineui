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
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("default布局不需要resize");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.showIndex = void 0;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!self.hasWidget(item.cardName)) {
                    var w = BI.createWidget(item);
                    w.on(BI.Events.DESTROY, function () {
                        var index = BI.findIndex(o.items, function (i, tItem) {
                            return tItem.cardName == item.cardName;
                        });
                        if (index > -1) {
                            o.items.splice(index, 1);
                        }
                    });
                    self.addWidget(item.cardName, w);
                } else {
                    var w = self.getWidgetByName(item.cardName);
                }
                w.element.css({"position": "absolute", "top": "0", "right": "0", "bottom": "0", "left": "0"});
                w.setVisible(false);
            }
        });
    },

    update: function () {
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
            throw new Error("cardName is not exist");
        }
        return this._children[cardName];
    },

    _deleteCardByName: function (cardName) {
        delete this._children[cardName];
        var index = BI.findIndex(this.options.items, function (i, item) {
            return item.cardName == cardName;
        });
        if (index > -1) {
            this.options.items.splice(index, 1);
        }
    },

    deleteCardByName: function (cardName) {
        if (!this.isCardExisted(cardName)) {
            throw new Error("cardName is not exist");
        }

        var child = this._children[cardName];
        this._deleteCardByName(cardName);
        child && child.destroy();
    },

    addCardByName: function (cardName, cardItem) {
        if (this.isCardExisted(cardName)) {
            throw new Error("cardName is already exist");
        }
        var widget = BI.createWidget(cardItem);
        widget.element.css({
            "position": "relative",
            "top": "0",
            "left": "0",
            "width": "100%",
            "height": "100%"
        }).appendTo(this.element);
        widget.invisible();
        this.addWidget(cardName, widget);
        this.options.items.push({el: cardItem, cardName: cardName});
        return widget;
    },

    showCardByName: function (name, action, callback) {
        var self = this;
        //name不存在的时候全部隐藏
        var exist = this.isCardExisted(name);
        if (this.showIndex != null) {
            this.lastShowIndex = this.showIndex;
        }
        this.showIndex = name;
        var flag = false;
        BI.each(this.options.items, function (i, item) {
            var el = self._children[item.cardName];
            if (el) {
                if (name != item.cardName) {
                    //动画效果只有在全部都隐藏的时候才有意义,且只要执行一次动画操作就够了
                    !flag && !exist && (BI.Action && action instanceof BI.Action) ? (action.actionBack(el), flag = true) : el.invisible();
                } else {
                    (BI.Action && action instanceof BI.Action) ? action.actionPerformed(void 0, el, callback) : (el.visible(), callback && callback())
                }
            }
        });
    },

    showLastCard: function () {
        var self = this;
        this.showIndex = this.lastShowIndex;
        BI.each(this.options.items, function (i, item) {
            self._children[item.cardName].setVisible(self.showIndex == i);
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
        var self = this;
        BI.each(this.options.items, function (i, item) {
            self._children[item.cardName].invisible();
        });
    },

    isAllCardHide: function () {
        var self = this;
        var flag = true;
        BI.some(this.options.items, function (i, item) {
            if (self._children[item.cardName].isVisible()) {
                flag = false;
                return false;
            }
        });
        return flag;
    },

    removeWidget: function (nameOrWidget) {
        var removeName;
        if (BI.isWidget(nameOrWidget)) {
            BI.each(this._children, function (name, child) {
                if (child === nameOrWidget) {
                    removeName = name;
                }
            })
        } else {
            removeName = nameOrWidget;
        }
        if (removeName) {
            this._deleteCardByName(removeName);
        }
    }
});
BI.shortcut('bi.card', BI.CardLayout);