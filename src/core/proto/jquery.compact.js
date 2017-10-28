//缓存this.element的操作数据
if (jQuery) {
    function wrap(prefix, name) {
        return "_bi-widget" + prefix + name;
    }

    (function ($) {
        var css = $.fn.css;
        $.fn.css = function (name, value) {
            if (this._isWidget === true) {
                var key;
                //this.element不允许get样式
                if (BI.isPlainObject(name)) {
                    for (key in name) {
                        this.css(key, name[key]);
                    }
                    return this;
                }
                key = wrap("css", name);
                if (this[key] !== value) {
                    css.apply(this, arguments);
                    this[key] = value;
                    return this;
                }
                return this;
            }
            return css.apply(this, arguments);
        };
        $.each(["width", "height"], function (index, name) {
            var fn = $.fn[name];
            $.fn[name] = function (value) {
                if (this._isWidget === true && arguments.length === 1) {
                    var key = wrap("", name);
                    if (this[key] !== value) {
                        fn.apply(this, arguments);
                        this[key] = value;
                        return this;
                    }
                    return this;
                }
                return fn.apply(this, arguments);
            }
        })
    })(jQuery);
}