/**
 *
 * 原生表格滚动条，为了IE8的兼容
 *
 * Created by GUY on 2016/1/12.
 * @class BI.NativeTableScrollbar
 * @extends BI.Widget
 */
BI.NativeTableScrollbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NativeTableScrollbar.superclass._defaultConfig.apply(this, arguments), {
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            defaultPosition: 0,
            position: 0,
            size: 0
        })
    },

    render: function () {
        var self = this, o = this.options;
        //把滚动台size改掉
        this.element.width(36);

        var throttle = BI.throttle(function () {
            self.fireEvent(BI.NativeTableScrollbar.EVENT_SCROLL, self.element.scrollTop());
        }, 150, {leading: false});
        this.element.scroll(function () {
            throttle();
        });
        return {
            type: "bi.default",
            scrolly: true,
            items: [{
                type: "bi.layout",
                width: 1,
                ref: function (_ref) {
                    self.inner = _ref;
                }
            }]
        }
    },

    mounted: function () {
        this._populate();
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);
        try {
            this.element.scrollTop(o.position);
        } catch (e) {

        }
        this.inner.element.height(o.contentSize);
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
    },

    setPosition: function (position) {
        this.options.position = position;
    },

    setSize: function (size) {
        this.setHeight(size);
        this.options.size = size;
    },

    populate: function () {
        this._populate();
    }
});
BI.NativeTableScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.native_table_scrollbar", BI.NativeTableScrollbar);


BI.NativeTableHorizontalScrollbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.NativeTableHorizontalScrollbar.superclass._defaultConfig.apply(this, arguments), {
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            position: 0,
            size: 0
        })
    },

    render: function () {
        var self = this, o = this.options;
        //把滚动台size改掉
        this.element.height(36);

        var throttle = BI.throttle(function () {
            self.fireEvent(BI.NativeTableScrollbar.EVENT_SCROLL, self.element.scrollLeft());
        }, 150, {leading: false});
        this.element.scroll(function () {
            throttle();
        });
        return {
            type: "bi.default",
            scrollx: true,
            items: [{
                type: "bi.layout",
                height: 1,
                ref: function (_ref) {
                    self.inner = _ref;
                }
            }]
        }
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
    },

    setPosition: function (position) {
        this.options.position = position;
    },

    setSize: function (size) {
        this.setWidth(size);
        this.options.size = size;
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);
        try {
            this.element.scrollLeft(o.position);
        } catch (e) {

        }
        this.inner.element.width(o.contentSize);
    },

    populate: function () {
        this._populate();
    }
});
BI.NativeTableHorizontalScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.native_table_horizontal_scrollbar", BI.NativeTableHorizontalScrollbar);