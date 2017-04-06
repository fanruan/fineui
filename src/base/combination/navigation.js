/**
 * Created by GUY on 2015/6/26.
 */

BI.Navigation = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Navigation.superclass._defaultConfig.apply(this, arguments), {
            direction: "bottom",//top, bottom, left, right, custom
            logic: {
                dynamic: false
            },
            single: false,
            defaultShowIndex: false,
            tab: false,
            cardCreator: function (v) {
                return BI.createWidget();
            },

            afterCardCreated: BI.emptyFn,
            afterCardShow: BI.emptyFn
        })
    },

    render: function () {
        var self = this, o = this.options;
        this.tab = BI.createWidget(this.options.tab, {type: "bi.button_group"});
        this.cardMap = {};
        this.showIndex = 0;
        this.layout = BI.createWidget({
            type: "bi.card"
        });
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.tab, this.layout)
        }))));


        new BI.ShowListener({
            eventObj: this.tab,
            cardLayout: this.layout,
            cardNameCreator: function (v) {
                return self.showIndex + v;
            },
            cardCreator: function (v) {
                var card = o.cardCreator(v);
                self.cardMap[v] = card;
                return card;
            },
            afterCardCreated: BI.bind(this.afterCardCreated, this),
            afterCardShow: BI.bind(this.afterCardShow, this)
        });
    },

    mounted: function () {
        var o = this.options;
        if (o.defaultShowIndex !== false) {
            this.setSelect(o.defaultShowIndex);
        }
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

    afterCardCreated: function (v) {
        var self = this;
        this.cardMap[v].on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.Navigation.EVENT_CHANGE, obj);
            }
        });
        this.options.afterCardCreated.apply(this, arguments);
    },

    afterCardShow: function (v) {
        this.showIndex = v;
        this._deleteOtherCards(v);
        this.options.afterCardShow.apply(this, arguments);
    },

    populate: function () {
        var card = this.layout.getShowingCard();
        if (card) {
            return card.populate.apply(card, arguments);
        }
    },

    _assertCard: function (v) {
        if (!this.layout.isCardExisted(v)) {
            var card = this.options.cardCreator(v);
            this.cardMap[v] = card;
            this.layout.addCardByName(v, card);
            this.afterCardCreated(v);
        }
    },

    setSelect: function (v) {
        this._assertCard();
        this.layout.showCardByName(v);
        this._deleteOtherCards(v);
        if (this.showIndex !== v) {
            this.showIndex = v;
            BI.nextTick(BI.bind(this.afterCardShow, this, v));
        }
    },

    getSelect: function () {
        return this.showIndex;
    },

    getSelectedCard: function () {
        if (BI.isKey(this.showIndex)) {
            return this.cardMap[this.showIndex];
        }
    },

    /**
     * @override
     */
    setValue: function (v) {
        var card = this.layout.getShowingCard();
        if (card) {
            card.setValue(v);
        }
    },

    /**
     * @override
     */
    getValue: function () {
        var card = this.layout.getShowingCard();
        if (card) {
            return card.getValue();
        }
    },

    empty: function () {
        this.layout.deleteAllCard();
        this.cardMap = {};
    },

    destroy: function () {
        BI.Navigation.superclass.destroy.apply(this, arguments);
    }
});
BI.Navigation.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.navigation", BI.Navigation);