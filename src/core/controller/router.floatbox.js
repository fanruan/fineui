/**
 *
 * @class BI.FloatBoxRouter
 * @extends BI.WRouter
 */
BI.FloatBoxRouter = BI.inherit(BI.WRouter, {
    routes: {},

    _init: function () {
        this.store = {};
        this.views = {};
    },

    createView: function (url, modelData, viewData, context) {
        return BI.Factory.createView(url, this.get(url), modelData || {}, viewData || {}, context)
    },

    open: function (url, modelData, viewData, context, options) {
        var self = this, isValid = BI.isKey(modelData);
        options || (options = {});
        url = context.rootURL + "/" + url;
        var data = void 0;
        if (isValid) {
            modelData = modelData + "";//避免modelData是数字
            var keys = modelData.split('.');
            BI.each(keys, function (i, k) {
                if (i === 0) {
                    data = context.model.get(k) || {};
                } else {
                    data = data[k] || {};
                }
            });
            data.id = options.id || keys[keys.length - 1];
        } else {
            data = modelData;
        }
        BI.extend(data, options.data);
        if (!this.controller) {
            this.controller = new BI.FloatBoxController();
        }
        if (!this.store[url]) {
            this.store[url] = BI.createWidget({
                type: "bi.float_box"
            }, options);
            var view = this.createView(url, data, viewData, context);
            isValid && context.model.addChild(modelData, view.model);
            view.listenTo(view.model, "destroy", function () {
                self.remove(url);
            });
            this.store[url].populate(view);
            this.views[url] = view;
            this.controller.add(url, this.store[url]);
            context && context.on("end:" + view.cid, function () {
                BI.nextTick(function () {
                    self.close(url);
//                    view.end();
                    var t = void 0, isNew = false, keys;
                    if (isValid) {
                        keys = modelData.split('.');
                        BI.each(keys, function (i, k) {
                            if (i === 0) {
                                t = context.model.get(k) || (isNew = true);
                            } else {
                                t = t[k] || (isNew = true);
                            }
                        })
                    }
                    isNew && context.model.removeChild(modelData);
                    !isNew && (context.listenEnd.apply(context, isValid ? keys : [modelData]) !== false) && context.populate();
                }, 30)
            }).on("change:" + view.cid, _.bind(context.notifyParent, context))
        }
        this.controller.open(url);
        this.views[url].populate(data, options.force || true);
        return this;
    },

    close: function (url) {
        if (this.controller) {
            this.controller.close(url);
        }
        return this;
    },

    remove: function (url, context) {
        url = context.rootURL + "/" + url;
        if(this.controller){
            this.controller.remove(url);
            delete this.store[url];
            this.views[url] && this.views[url].destroy();
            delete this.views[url];
        }
        return this;
    }
});