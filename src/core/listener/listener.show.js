/**
 * guy
 * 检测某个Widget的EventChange事件然后去show某个card
 * @type {*|void|Object}
 * @class BI.ShowListener
 * @extends BI.OB
 */
BI.ShowListener = BI.inherit(BI.OB, {
    _defaultConfig: function () {
        return BI.extend(BI.ShowListener.superclass._defaultConfig.apply(this, arguments), {
            eventObj: BI.createWidget(),
            cardLayout: null,
            cardNameCreator: function (v) {
                return v;
            },
            cardCreator: BI.emptyFn,
            afterCardCreated: BI.emptyFn,
            afterCardShow: BI.emptyFn
        });
    },

    _init: function () {
        BI.ShowListener.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        o.eventObj.on(BI.Controller.EVENT_CHANGE, function (type, v, ob) {
            if (type === BI.Events.CLICK) {
                v = v || o.eventObj.getValue();
                v = BI.isArray(v) ? (v.length > 1 ? v.toString() : v[0]) : v;
                if (BI.isNull(v)) {
                    throw new Error("value值不能为空");
                }
                var cardName = o.cardNameCreator(v);
                if (!o.cardLayout.isCardExisted(cardName)) {
                    var card = o.cardCreator(cardName);
                    o.cardLayout.addCardByName(cardName, card);
                    o.afterCardCreated(cardName);
                }
                o.cardLayout.showCardByName(cardName);
                BI.nextTick(function () {
                    o.afterCardShow(cardName);
                    self.fireEvent(BI.ShowListener.EVENT_CHANGE, cardName);
                });
            }
        })
    }
});
BI.ShowListener.EVENT_CHANGE = "ShowListener.EVENT_CHANGE";