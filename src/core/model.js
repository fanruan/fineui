BI.Model = BI.inherit(BI.M, {
    _defaultConfig: function () {
        return {
            "default": "just a default",
            "current": void 0
        }
    },

    _static: function () {
        return {};
    },

    _init: function () {
        BI.Model.superclass._init.apply(this, arguments);
        this.on("change:current", function (obj, val) {
            BI.isNotNull(val) && this.refresh(val);
        }).on("change", function (changed, prev, context, options) {
            if (this._start === true || BI.has(changed, "current")) {
                return;
            }
            this.actionStart();
            if (!this.local()) {
                !BI.has(this._tmp, BI.keys(changed)) && this.parent && this.parent._change(this);
                this._changing_ = true;
                this.change(changed, prev, context, options);
                this._changing_ = false;
            }
        });

        this._tmp = {};//过渡属性

        this._hass = {};
        this._gets = [];//记录交互行为
        this._start = false;
        this._changing_ = false;

        this._read = BI.debounce(BI.bind(this.fetch, this), 30);
        this._save = BI.debounce(BI.bind(this.save, this), 30);
        this._F = [];
    },

    toJSON: function () {
        var json = BI.Model.superclass.toJSON.apply(this, arguments);
        delete json["baseCls"];
        delete json["current"];
        delete json["default"];
        delete json["parent"];
        delete json["rootURL"];
        delete json["id"];
        delete json["tag"];
        BI.each(this._gets, function (i, action) {
            delete json[action];
        });
        return json;
    },

    copy: function () {
        if (this._start === true || this._changing_ === true) {
            this._F.push({f: this.copy, arg: arguments});
            return;
        }
        this.trigger("copy");
    },
    //子节点的一个类似副本
    similar: function (value, key1, key2, key3) {
        return value;
    },

    _map: function (child) {
        var self = this;
        var map = {}, current = {};
        var mapping = function (key, ch) {
            key = key + "";
            if (key === "") {
                return;
            }
            var keys = key.split('.');
            if (!map[keys[0]]) {
                map[keys[0]] = self.get(keys[0]);
            }
            var parent = map, last = void 0;
            BI.each(keys, function (i, k) {
                last && (parent = parent[last] || (parent[last] = {}));
                last = k;
            });
            parent[last] = ch.toJSON();
        };
        BI.each(this._childs, function (key, chs) {
            if (!BI.isArray(chs)) {
                chs = [chs];
            }
            BI.each(chs, function (i, ch) {
                if (ch === child) {
                    current[key] = child;
                    return;
                }
                //mapping(key, ch);
            })
        });
        BI.each(current, function (key, ch) {
            mapping(key, ch);
        });
        var tmp = {};
        BI.each(this._tmp, function (k) {
            if (map[k]) {
                tmp[k] = map[k];
                delete map[k];
            }
        });
        this.tmp(tmp);
        return map;
    },

    _change: function (child) {
        this.set(this._map(child));
        return this;
    },

    splice: function (old, key1, key2, key3) {

    },

    duplicate: function (copy, key1, key2, key3) {

    },

    change: function (changed, prev) {

    },

    actionStart: function () {
        this._start = true;
        return this;
    },

    actionEnd: function () {
        var self = this;
        this._start = false;
        var _gets = this._gets.slice(0), _F = this._F.slice(0);
        this._gets = [];
        this._hass = {};
        this._F = [];
        BI.each(_gets, function (i, action) {
            self.unset(action, {silent: true});
        });
        BI.each(_F, function (i, fn) {
            fn.f.apply(self, fn.arg);
        });
        return this;
    },

    addChild: function (name, child) {
        name = name + "";
        var self = this;
        this._childs || (this._childs = {});
        if (this._childs[name]) {
            if (BI.isArray(this._childs[name])) {
                this._childs[name].push(child);
            } else {
                this._childs[name] = [this._childs[name]].concat(child)
            }
        } else {
            this._childs[name] = child;
        }
        child && child.on("destroy", function () {
            var keys = name.split('.');
            var g = self.get(keys[0]), p, c;
            var sset = !!self._tmp[keys[0]] ? "tmp" : "set", unset = "un" + sset;

            BI.each(keys, function (i, k) {
                if (i === 0) {
                    c = g;
                    return;
                }
                p = c;
                c = c[k];
            });
            self.removeChild(name, child);
            var newKeys = BI.clone(keys);
            keys.length > 1 ? newKeys.unshift(BI.deepClone(p[keys[keys.length - 1]])) : newKeys.unshift(BI.deepClone(g));
            keys.length > 1 ? (delete p[keys[keys.length - 1]], self[sset](keys[0], g, {silent: true})) : self[unset](name, {silent: true});
            !BI.has(self._tmp, keys[0]) && self.parent && self.parent._change(self);
            self.splice.apply(self, newKeys);
            self.trigger("splice", newKeys);
        }).on("copy", function () {
            var keys = name.split('.');
            var g = self.get(keys[0]), p, c;
            var sset = !!self._tmp[keys[0]] ? "tmp" : "set";
            BI.each(keys, function (i, k) {
                if (i === 0) {
                    c = g;
                    return;
                }
                p = c;
                c = c[k];
            });
            var copy = BI.UUID(), newKeys = BI.clone(keys);
            keys.length > 1 ? newKeys.unshift(BI.deepClone(p[keys[keys.length - 1]])) : newKeys.unshift(BI.deepClone(g));
            var backup = self.similar.apply(self, newKeys);
            keys.length > 1 ? (p[copy] = backup, self[sset](keys[0], g, {silent: true})) : self[sset](copy, backup, {silent: true});
            keys.unshift(copy);
            !BI.has(self._tmp, keys[0]) && self.parent && self.parent._change(self);
            self.duplicate.apply(self, keys);
            self.trigger("duplicate", keys);
        });
    },

    removeChild: function (name, child) {
        if (BI.isArray(this._childs[name])) {
            BI.remove(this._childs[name], child);
            if (BI.isEmpty(this._childs[name])) {
                delete this._childs[name];
            }
            return;
        }
        delete this._childs[name];
    },

    has: function (attr, istemp) {
        if (istemp === true) {
            return _.has(this.tmp, attr);
        }
        if (this._start === true && this._changing_ === false) {
            this._hass[attr] = true;
        }
        return BI.Model.superclass.has.apply(this, arguments);
    },

    cat: function (attr) {
        if (_.has(this._tmp, attr)) {
            return this._tmp[attr];
        }
        if (this._start === true && this._hass[attr]) {
            delete this._hass[attr];
            switch (attr) {
                case "default":
                    break;
                case "current":
                    break;
                default :
                    this._gets.push(attr);
                    break;
            }
        }
        if (_.has(this.attributes, attr)) {
            return this.attributes[attr];
        }
        var sta = _.result(this, "_static");
        return BI.isFunction(sta[attr]) ? sta[attr].apply(this, BI.values(arguments).slice(1)) : sta[attr];
    },

    get: function () {
        return BI.deepClone(this.cat.apply(this, arguments));
    },

    set: function (key, val, options) {
        if (this._start === true || this._changing_ === true) {
            this._F.push({f: this.set, arg: arguments});
            return this;
        }
        return BI.Model.superclass.set.apply(this, arguments);
    },

    unset: function (attr, options) {
        var self = this;
        BI.each(this._childs, function (key, model) {
            key = key + "";
            var keys = key.split('.');
            if (_.isEqual(attr, keys[0])) {
                delete self._childs[attr];
                if (!BI.isArray(model)) {
                    model = [model];
                }
                BI.each(model, function (i, m) {
                    m.trigger("unset");
                });
            }
        });
        return BI.Model.superclass.unset.apply(this, arguments);
    },

    tmp: function (key, val, options) {
        if (this._start === true || this._changing_ === true) {
            this._F.push({f: this.tmp, arg: arguments});
            return this;
        }
        var attr, attrs, unset, changes, silent, changing, changed, prev, current;
        if (key == null) return this;
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }
        options || (options = {});

        unset = options.unset;
        silent = options.silent;
        changes = [];
        changing = this._changingTmp;
        this._changingTmp = true;

        if (!changing) {
            this._previousTmp = _.clone(this._tmp);
            this.changedTmp = {};
        }
        if (!this._previousTmp) {
            this._previousTmp = _.clone(this._tmp);
        }
        current = this._tmp, prev = this._previousTmp;

        for (attr in attrs) {
            val = attrs[attr];
            if (!_.isEqual(current[attr], val)) changes.push(attr);
            if (!_.isEqual(prev[attr], val)) {
                this.changedTmp[attr] = val;
            } else {
                delete this.changedTmp[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
        }

        if (!silent) {
            if (changes.length) this._pendingTmp = options;
            for (var i = 0, length = changes.length; i < length; i++) {
                this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
        }

        if (changing) return this;
        changed = BI.clone(this.changedTmp);
        if (!silent) {
            while (this._pendingTmp) {
                options = this._pendingTmp;
                this._pendingTmp = false;
                this.trigger('change', changed, prev, this, options);
            }
        }
        this._pendingTmp = false;
        this._changingTmp = false;
        if (!silent && changes.length) this.trigger("changed", changed, prev, this, options);
        return this;
    },

    untmp: function (attr, options) {
        var self = this;
        BI.each(this._childs, function (key, model) {
            key = key + "";
            var keys = key.split('.');
            if (_.isEqual(attr, keys[0])) {
                delete self._childs[attr];
                if (!BI.isArray(model)) {
                    model = [model];
                }
                BI.each(model, function (i, m) {
                    m.trigger("unset");
                });
            }
        });
        return this.tmp(attr, void 0, _.extend({}, options, {unset: true}));
    },

    cancel: function (options) {
        var self = this;
        var tmp = BI.clone(this._tmp);
        this._tmp = {};
        BI.each(tmp, function (k) {
            self.untmp(k, options);
        });
    },

    submit: function () {
        var tmp = BI.clone(this._tmp);
        this._tmp = {};
        this.set(tmp);
        return this;
    },

    urlRoot: function () {
        return FR.servletURL;
    },

    parse: function (data) {
        return data;
    },

    setEditing: function (edit) {
        this._editing = edit;
    },

    getEditing: function () {
        if (this._start !== true) {
            throw new Error("getEditing函数只允许在local中调用");
        }
        return this._editing;
    },

    local: function () {

    },

    load: function (data) {

    },

    refresh: function () {

    },

    /**
     * 更新整个model
     */
    updateURL: function () {

    },
    /**
     * 添加一个元素或删除一个元素或修改一个元素
     */
    patchURL: function () {

    },
    /**
     * 删除整个model, destroy方法调用
     */
    deleteURL: function () {

    },
    /**
     * 读取model
     */
    readURL: function () {

    },

    read: function (options) {
        if (this._start == true || this._changing_ === true) {
            this._F.push({f: this.read, arg: arguments});
            return;
        }
        this._read(options);
    },

    update: function (options) {
        if (this._start == true || this._changing_ === true) {
            this._F.push({f: this.update, arg: arguments});
            return;
        }
        this._save(null, options);
    },

    patch: function (options) {
        if (this._start == true || this._changing_ === true) {
            this._F.push({f: this.patch, arg: arguments});
            return;
        }
        this._save(null, BI.extend({}, options, {
            patch: true
        }));
    }
});