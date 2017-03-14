/**
 * @class BI.View
 * @extends BI.V
 * @type {*|void|Object}
 */
BI.View = BI.inherit(BI.V, {

    _init: function () {
        BI.View.superclass._init.apply(this, arguments);
        var self = this;
        this.listenTo(this.model, "change:current", function (obj, val) {
            if (BI.isNotNull(val) && val.length > 0) {
                this.refresh(val);
            }
        }).listenTo(this.model, "change", function (changed) {
            this.delegateEvents();
        }).listenTo(this.model, "changed", function (changed, prev, context, options) {
            if (BI.has(changed, "current") && BI.size(changed) > 1) {
                throw new Error("refresh操作不能调用set操作");
            }
            var notLocal = !BI.has(changed, "current") && !this.local() && this.notifyParent().notify();
            this.model.actionEnd() && this.actionEnd();
            this.model._changing_ = true;
            notLocal && !BI.isEmpty(changed) && this.change(changed, prev, context, options);
            this.model._changing_ = false;
            this.model.actionEnd() && this.actionEnd();
        }).listenTo(this.model, "destroy", function () {
            this.destroy();
        }).listenTo(this.model, "unset", function () {
            this.destroy();
        }).listenTo(this.model, "splice", function (arg) {
            this.splice.apply(this, arg);
        }).listenTo(this.model, "duplicate", function (arg) {
            this.duplicate.apply(this, arg);
        });
        this._F = [];
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.prototype, function (key) {
            if (flatten[key]) {
                return;
            }
            var f = self[key];
            if (BI.isFunction(f)) {
                self[key] = BI.bind(function () {
                    if (this.model._start === true) {
                        this._F.push({f: f, arg: arguments});
                        return;
                    }
                    return f.apply(this, arguments);
                }, self);
            }
        })
    },

    change: function (changed, prev) {

    },

    actionEnd: function () {
        var self = this;
        var _F = this._F.slice(0);
        this._F = [];
        BI.each(_F, function (i, f) {
            f.f.apply(self, f.arg);
        });
        return this;
    },

    delegateEvents: function (events) {
        if (!(events || (events = BI.deepClone(_.result(this, 'events'))))) return this;
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;
        for (var key in events) {
            var method = events[key];
            if (!_.isFunction(method)) method = this[events[key]];
            if (!method) continue;
            var match = key.match(delegateEventSplitter);
            var ev = true;
            switch (match[1]) {
                case "draggable":
                    break;
                case "droppable":
                    break;
                case "sortable":
                    break;
                case "resizable":
                    break;
                case "hover":
                    break;
                default :
                    ev = false;
                    break;
            }

            var off = new BI.OffList({
                event: match[1] + '.delegateEvents' + this.cid
            });

            var keys = match[2].split('.');
            var handle = keys[1];
            var bind = ev ? new BI.EventList({
                event: match[1],
                handle: handle,
                callback: BI.bind(method, this)
            }) : new BI.ListenerList({
                event: match[1] + '.delegateEvents' + this.cid,
                handle: handle,
                callback: BI.bind(method, this),
                context: this
            });

            var list = [];
            if (this[keys[0]] && (this[keys[0]] instanceof $ || this[keys[0]].element instanceof $)) {
                list = [this[keys[0]]]
                delete events[key];
            } else if (BI.isArray(this[keys[0]]) || BI.isPlainObject(this[keys[0]])) {
                list = this[keys[0]]
                delete events[key];
            }
            off.populate(list);
            bind.populate(list);
        }
        return BI.View.superclass.delegateEvents.apply(this, [events]);
    },

    _vessel: function () {
        this._cardLayouts = {};
        this._cardLayouts[this.getName()] = new BI.CardLayout({
            element: this.element
        });
        var vessel = BI.createWidget();
        this._cardLayouts[this.getName()].addCardByName(this.getName(), vessel);
        return vessel.element;
    },

    _render: function (vessel) {
        return this;
    },

    /**
     * 创建儿子所在容器
     * @param key
     * @param vessel
     * @param options  isLayer:是否是弹出层, defaultShowName:默认显示项
     * @returns {BI.View}
     */
    addSubVessel: function (key, vessel, options) {
        options || (options = {});
        this._cardLayouts || (this._cardLayouts = {});
        var id = key + this.cid;
        options.isLayer && (vessel = BI.Layers.has(id) ? BI.Layers.get(id) : BI.Layers.create(id, vessel));
        if (this._cardLayouts[key]) {
            options.defaultShowName && this._cardLayouts[key].setDefaultShowName(options.defaultShowName);
            this._cardLayouts[key].setElement(vessel) && this._cardLayouts[key].resize();
            return this;
        }
        this._cardLayouts[key] = BI.createWidget({
            type: "bi.card",
            element: vessel,
            defaultShowName: options.defaultShowName
        });
        return this;
    },

    removeSubVessel: function (key) {
        var self = this, id = key + this.cid;
        BI.Layers.remove(id);
        var cardNames = this._cardLayouts[key] && this._cardLayouts[key].getAllCardNames();
        BI.each(cardNames, function (i, name) {
            delete self._cards[name];
        });
        this._cardLayouts[key] && this._cardLayouts[key].destroy();
        return this;
    },

    createView: function (url, modelData, viewData) {
        return BI.Factory.createView(url, this.get(url), modelData, viewData);
    },

    /**
     * 跳转到指定的card
     * @param cardName
     */
    skipTo: function (cardName, layout, modelData, viewData, options) {
        if (this.model._start === true || this._changing_ === true) {
            this._F.push({f: this.skipTo, arg: arguments});
            return this;
        }
        var self = this, isValid = BI.isKey(modelData), data = void 0;
        BI.isKey(layout) && (layout = layout + "");
        layout = layout || this.getName();
        options || (options = {});
        if (isValid) {
            modelData = modelData + "";//避免modelData是数字
            var keys = modelData.split('.');
            BI.each(keys, function (i, k) {
                if (i === 0) {
                    data = self.model.get(k) || {};
                } else {
                    data = data[k] || {};
                }
            });
            data.id = options.id || keys[keys.length - 1];
        } else {
            data = modelData;
        }
        BI.extend(data, options.data);
        var action = options.action || new BI.ShowAction();
        var cardLayout = this._cardLayouts[layout];
        if (!cardLayout) {
            return this;
        }
        cardLayout.setVisible(true);
        if (BI.isKey(cardName) && !cardLayout.isCardExisted(cardName)) {
            var view = this.createView(this.rootURL + "/" + cardName, data, viewData);
            isValid && this.model.addChild(modelData, view.model);
            view.listenTo(view.model, "destroy", function () {
                delete self._cards[cardName];
                cardLayout.deleteCardByName(cardName);
                if (cardLayout.isAllCardHide()) {
                    cardLayout.setVisible(false);
                    BI.Layers.hide(layout + self.cid);
                }
            }).listenTo(view.model, "unset", function () {
                delete self._cards[cardName];
                cardLayout.deleteCardByName(cardName);
            });
            cardLayout.addCardByName(cardName, view);
            this._cards || (this._cards = {});
            this._cards[cardName] = view;
            data = {};
            this.on("end:" + view.cid, function () {
                var isNew = false, t, keys;
                if (isValid) {
                    keys = modelData.split('.');
                    BI.each(keys, function (i, k) {
                        if (i === 0) {
                            t = self.model.get(k) || (isNew = true);
                        } else {
                            t = t[k] || (isNew = true);
                        }
                    });
                }
                if (isNew) {
                    delete self._cards[cardName];
                    self.model.removeChild(modelData, view.model);
                    cardLayout.deleteCardByName(cardName);
                    view.destroy();
                    cardLayout.setVisible(false);
                }
                action.actionBack(view, null, function () {
                    if (cardLayout.isAllCardHide()) {
                        cardLayout.setVisible(false);
                        BI.Layers.hide(layout + self.cid);
                    }
                    !isNew && (self.listenEnd.apply(self, isValid ? keys : [modelData]) !== false) && self.populate();
                })
            }).on("change:" + view.cid, _.bind(this.notifyParent, this));
        }
        BI.isKey(cardName) && BI.Layers.show(layout + this.cid);
        cardLayout.showCardByName(cardName, action, function () {
            BI.isKey(cardName) && self._cards[cardName].populate(data, options);
        });
        !BI.isKey(cardName) && BI.Layers.hide(layout + this.cid);
        return this._cards[cardName];
    },

    listenEnd: function (key1, key2, key3) {
        return this;
    },

    /**
     * 告诉父亲我的操作结束了，后面的事情任由父亲处置
     * @param force 强制下次再次进入该节点时不进行刷新操作， 默认执行刷新
     * @returns {BI.View}
     */
    notifyParentEnd: function (force) {
        this.parent && this.parent.trigger("end:" + this.cid);
        this.trigger("end");
        !force && this.notify();
        return this;
    },

    /**
     * 通知父亲我的数据发生了变化
     */
    notifyParent: function () {
        this.parent && this.parent.notify().trigger("change:" + this.cid);
        return this;
    },

    /**
     * 告诉Model数据改变了
     */
    notify: function () {
        this.model.unset("current", {silent: true});
        return this;
    },

    getName: function () {
        return "VIEW"
    },

    /**
     * 全局刷新
     * @param current
     */
    refresh: function (current) {
    },
    /**
     * 局部刷新
     */
    local: function () {
        return false;
    },

    load: function (data) {

    },

    readData: function (force, options) {
        options || (options = {});
        var self = this;
        var args = [].slice.call(arguments, 2);
        if (!force && this._readed === true) {//只从后台获取一次数据
            callback(this.model.toJSON());
            return;
        }
        //采用静默方式读数据,该数据变化不引起data的change事件触发
        var success = options.success;
        this.read(BI.extend({
            silent: true
        }, options, {
            success: function (data, model) {
                callback(data);
                !force && (self._readed = true);
                self.delegateEvents();
                success && success(data, model);
            }
        }));
        function callback(data) {
            self.model.load(data);
            self.load(data);
            BI.each(args, function (i, arg) {
                if (BI.isFunction(arg)) {
                    arg.apply(self, [data]);
                }
            })
        }
    },

    //处理model的通用方法
    cat: function () {
        return this.model.cat.apply(this.model, arguments);
    },

    get: function () {
        return this.model.get.apply(this.model, arguments);
    },

    set: function () {
        return this.model.set.apply(this.model, arguments);
    },

    has: function () {
        return this.model.has.apply(this.model, arguments);
    },

    getEditing: function () {
        return this.model.getEditing();
    },

    read: function (options) {
        this.model.read(options)
    },

    update: function (options) {
        this.model.update(options);
    },

    patch: function (options) {
        this.model.patch(options);
    },

    reading: function (options) {
        var self = this;
        var name = BI.UUID();
        this.read(BI.extend({}, options, {
            beforeSend: function () {
                var loading = BI.createWidget({
                    type: 'bi.vertical',
                    items: [{
                        type: "bi.layout",
                        height: 30,
                        cls: "loading-background"
                    }],
                    element: BI.Maskers.make(name, self)
                });
                loading.setVisible(true);
            },
            complete: function (data) {
                options.complete && options.complete(data);
                BI.Maskers.remove(name);
            }
        }));
    },

    updating: function (options) {
        var self = this;
        var name = BI.UUID();
        this.update(BI.extend({}, options, {
            noset: true,
            beforeSend: function () {
                var loading = BI.createWidget({
                    type: 'bi.vertical',
                    items: [{
                        type: "bi.layout",
                        height: 30,
                        cls: "loading-background"
                    }],
                    element: BI.Maskers.make(name, self)
                });
                loading.setVisible(true);
            },
            complete: function (data) {
                options.complete && options.complete(data);
                BI.Maskers.remove(name);
            }
        }));
    },

    patching: function (options) {
        var self = this;
        var name = BI.UUID();
        this.patch(BI.extend({}, options, {
            noset: true,
            beforeSend: function () {
                var loading = BI.createWidget({
                    type: 'bi.vertical',
                    items: [{
                        type: "bi.layout",
                        height: 30,
                        cls: "loading-background"
                    }],
                    element: BI.Maskers.make(name, self)
                });
                loading.setVisible(true);
            },
            complete: function (data) {
                options.complete && options.complete(data);
                BI.Maskers.remove(name);
            }
        }));
    },

    populate: function (modelData, options) {
        var self = this;
        options || (options = {});
        if (options.force === true) {
            this.notify();
        }
        if (this._cardLayouts && this._cardLayouts[this.getName()]) {
            this._cardLayouts[this.getName()].showCardByName(this.getName());
        }
        //BI.each(this._cardLayouts, function (key, layout) {
        //    layout.showCardByName(layout.getDefaultShowName() || self.getName());
        //});
        //BI.each(this._cards, function (i, card) {
        //    card.notify && card.notify();
        //});
        if (this._F.length > 0) {
            throw new Error("流程错误");
        }
        if (options.force === true) {
            this.model.set(modelData, options).set({current: this.model.get("default")});
            return;
        }
        if (options.force === false) {
            this.model.set(modelData);
            return;
        }
        var filter = BI.clone(modelData || {});
        delete filter.id;
        var contains = BI.has(this.model.toJSON(), _.keys(filter));
        var match = BI.isEmpty(filter) || (contains && this.model.matches(modelData));
        if (match === true) {
            this.model.set({current: this.model.get("default")});
        } else if (contains === false) {
            this.model.set(modelData);
        } else {
            this.model.set(modelData, options).set({current: this.model.get("default")});
        }
    },

    //删除子节点触发
    splice: function (old, key1, key2, key3) {

    },

    //复制子节点触发
    duplicate: function (copy, key1, key2, key3) {

    },

    destroy: function () {
        BI.each(this._cardLayouts, function (name, card) {
            card && card.destroy();
        });
        delete this._cardLayouts;
        delete this._cards;
        this.remove();
        this.destroyed();
    },

    destroyed: function () {

    }
});