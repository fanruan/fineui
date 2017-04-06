/**
 * Created by GUY on 2015/6/26.
 */

BI.Tab = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Tab.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tab",
            direction: "top",//top, bottom, left, right, custom
            single: false, //是不是单页面
            logic: {
                dynamic: false
            },
            defaultShowIndex: false,
            tab: false,
            cardCreator: function (v) {
                return BI.createWidget();
            }
        })
    },

    render: function () {
        var self = this, o = this.options;
        if (BI.isObject(o.tab)) {
            this.tab = BI.createWidget(this.options.tab, {type: "bi.button_group"});
            this.tab.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            })
        }
        this.cardMap = {};
        this.layout = BI.createWidget({
            type: "bi.card"
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.tab, this.layout)
        }))));

        var listener = new BI.ShowListener({
            eventObj: this.tab,
            cardLayout: this.layout,
            cardCreator: function (v) {
                var card = o.cardCreator.apply(self, arguments);
                self.cardMap[v] = card;
                return card;
            },
            afterCardShow: function (v) {
                self._deleteOtherCards(v);
                self.curr = v;
            }
        });
        listener.on(BI.ShowListener.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.Tab.EVENT_CHANGE, value, self);
        });
    },

    _deleteOtherCards: function (currCardName) {
        var self = this, o = this.options;
        if (o.single === true) {
            BI.each(this.cardMap, function (name, card) {
                if (name !== (currCardName + "")) {
                    self.layout.deleteCardByName(name);
                    delete self.cardMap[name];
                }
            });
        }
    },

    _assertCard: function (v) {
        if (!this.layout.isCardExisted(v)) {
            var card = this.options.cardCreator(v);
            this.cardMap[v] = card;
            this.layout.addCardByName(v, card);
        }
    },

    mounted: function () {
        var o = this.options;
        if (o.defaultShowIndex !== false) {
            this.setSelect(o.defaultShowIndex);
        }
    },

    setSelect: function (v) {
        this.tab && this.tab.setValue(v);
        this._assertCard(v);
        this.layout.showCardByName(v);
        this._deleteOtherCards(v);
        if (this.curr !== v) {
            this.curr = v;
        }
    },

    getSelect: function () {
        return this.curr;
    },

    getSelectedTab: function () {
        return this.layout.getShowingCard();
    },

    getTab: function (v) {
        this._assertCard(v);
        return this.layout.getCardByName(v);
    },

    setValue: function (v) {
        var card = this.layout.getShowingCard();
        if (card) {
            card.setValue(v);
        }
    },

    getValue: function () {
        var card = this.layout.getShowingCard();
        if (card) {
            return card.getValue();
        }
    },

    populate: function () {
        var card = this.layout.getShowingCard();
        if (card) {
            return card.populate && card.populate.apply(card, arguments);
        }
    },

    empty: function () {
        this.layout.deleteAllCard();
        this.cardMap = {};
    },

    destroy: function () {
        this.cardMap = {};
        BI.Tab.superclass.destroy.apply(this, arguments);
    }
});
BI.Tab.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.tab", BI.Tab);