/**
 * Created by GUY on 2015/6/26.
 */

BI.Label = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Label.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-label",
            textAlign: "center",
            whiteSpace: "nowrap", //normal  or  nowrap
            forceCenter: false, //是否无论如何都要居中, 不考虑超出边界的情况, 在未知宽度和高度时有效
            textWidth: null,
            textHeight: null,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            text: "",
            py: "",
            keyword: ""
        })
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.text",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        };
    },

    _init: function () {
        BI.Label.superclass._init.apply(this, arguments);

        if (this.options.textAlign === "center") {
            this._createCenterEl();
        } else {
            this._createNotCenterEl();
        }
    },

    _createCenterEl: function () {
        var o = this.options;
        var json = this._createJson();
        if (BI.isNumber(o.width) && o.width > 0) {
            if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
                if (BI.isNumber(o.height) && o.height > 0) {
                    var gap = (o.width - o.textWidth) / 2;
                    BI.createWidget({
                        type: "bi.adaptive",
                        height: o.height,
                        scrollable: true,
                        element: this.element,
                        items: [
                            {
                                el: (this.text = BI.createWidget(json)),
                                left: gap + o.hgap + o.lgap,
                                right: gap + o.hgap + o.rgap,
                                top: o.vgap + o.tgap,
                                bottom: o.vgap + o.bgap
                            }
                        ]
                    });
                    this.element.css({"line-height": o.height + "px"});
                    return;
                }
                json.width = o.textWidth;
                BI.createWidget({
                    type: "bi.center_adapt",
                    scrollable: true,
                    element: this.element,
                    items: [
                        {
                            el: (this.text = BI.createWidget(json))
                        }
                    ]
                });
                return;
            }
            if (o.whiteSpace == "normal") {
                this.text = BI.createWidget(json);
                BI.createWidget({
                    type: "bi.center_adapt",
                    scrollable: true,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    element: this.element,
                    items: [this.text]
                });
                return;
            }
            if (BI.isNumber(o.height) && o.height > 0) {
                this.element.css({
                    "line-height": o.height + "px"
                });
                BI.createWidget({
                    type: "bi.absolute",
                    scrollable: true,
                    element: this.element,
                    items: [{
                        el: (this.text = BI.createWidget(json)),
                        left: o.hgap + o.lgap,
                        right: o.hgap + o.rgap,
                        top: o.vgap + o.tgap,
                        bottom: o.vgap + o.bgap
                    }]
                });
                return;
            }
            json.width = o.width - 2 * o.hgap;
            BI.createWidget({
                type: "bi.center_adapt",
                scrollable: true,
                element: this.element,
                items: [{
                    el: (this.text = BI.createWidget(json))
                }]
            });
            return;
        }
        if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
            json.width = o.textWidth;
            BI.createWidget({
                type: "bi.center_adapt",
                scrollable: true,
                element: this.element,
                items: [
                    {
                        el: (this.text = BI.createWidget(json))
                    }
                ]
            });
            return;
        }
        if (o.whiteSpace == "normal") {
            this.text = BI.createWidget(json);
            this.text = BI.createWidget({
                type: "bi.center_adapt",
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap,
                scrollable: true,
                element: this.element,
                items: [this.text]
            });
            return;
        }
        if (BI.isNumber(o.height) && o.height > 0) {
            if (BI.isNumber(o.textHeight) && o.textHeight > 0) {
                this.element.css({
                    "line-height": o.height + "px"
                });
                BI.createWidget({
                    type: "bi.adaptive",
                    height: o.height,
                    scrollable: true,
                    element: this.element,
                    items: [{
                        el: (this.text = BI.createWidget(json)),
                        left: o.hgap + o.lgap,
                        right: o.hgap + o.rgap,
                        top: o.vgap + o.tgap,
                        bottom: o.vgap + o.bgap
                    }]
                });
                return;
            }
            BI.extend(json, {
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap
            });
            this.element.css({
                "line-height": o.height + "px"
            });
            this.text = BI.createWidget(BI.extend(json, {
                element: this.element
            }));
            BI.createWidget({
                type: "bi.layout",
                element: this.text,
                scrollable: true
            });
            return;
        }
        BI.extend(json, {
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        });
        if (o.forceCenter) {
            this.text = BI.createWidget(json);
            BI.createWidget({
                type: "bi.center_adapt",
                element: this.element,
                items: [this.text]
            });
            return;
        }
        this.text = BI.createWidget(BI.extend(json, {
            element: this.element
        }));
        BI.createWidget({
            type: "bi.layout",
            element: this.text,
            scrollable: true
        })
    },

    _createNotCenterEl: function () {
        var o = this.options;
        var json = this._createJson();
        if (BI.isNumber(o.width) && o.width > 0) {
            if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
                if (BI.isNumber(o.height) && o.height > 0) {
                    BI.createWidget({
                        type: "bi.adaptive",
                        height: o.height,
                        scrollable: true,
                        element: this.element,
                        items: [
                            {
                                el: (this.text = BI.createWidget(json)),
                                left: o.hgap + o.lgap,
                                right: o.hgap + o.rgap,
                                top: o.vgap + o.tgap,
                                bottom: o.vgap + o.bgap
                            }
                        ]
                    });
                    this.element.css({"line-height": o.height + "px"});
                    return;
                }
                json.width = o.textWidth;
                BI.createWidget({
                    type: "bi.vertical_adapt",
                    scrollable: true,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    element: this.element,
                    items: [
                        {
                            el: (this.text = BI.createWidget(json))
                        }
                    ]
                });
                return;
            }
            if (o.whiteSpace == "normal") {
                this.text = BI.createWidget(json);
                BI.createWidget({
                    type: "bi.vertical_adapt",
                    scrollable: true,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    element: this.element,
                    items: [this.text]
                });
                return;
            }
            if (BI.isNumber(o.height) && o.height > 0) {
                this.element.css({
                    "line-height": o.height + "px"
                });
                BI.createWidget({
                    type: "bi.absolute",
                    scrollable: true,
                    element: this.element,
                    items: [{
                        el: (this.text = BI.createWidget(json)),
                        left: o.hgap + o.lgap,
                        right: o.hgap + o.rgap,
                        top: o.vgap + o.tgap,
                        bottom: o.vgap + o.bgap
                    }]
                });
                return;
            }
            json.width = o.width - 2 * o.hgap - o.lgap - o.rgap;
            BI.createWidget({
                type: "bi.vertical_adapt",
                scrollable: true,
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap,
                element: this.element,
                items: [{
                    el: (this.text = BI.createWidget(json))
                }]
            });
            return;
        }
        if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
            json.width = o.textWidth;
            BI.createWidget({
                type: "bi.vertical_adapt",
                scrollable: true,
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap,
                element: this.element,
                items: [
                    {
                        el: (this.text = BI.createWidget(json))
                    }
                ]
            });
            return;
        }
        if (o.whiteSpace == "normal") {
            this.text = BI.createWidget(json)
            this.text = BI.createWidget({
                type: "bi.vertical_adapt",
                scrollable: true,
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap,
                element: this.element,
                items: [this.text]
            });
            return;
        }
        if (BI.isNumber(o.height) && o.height > 0) {
            if (BI.isNumber(o.textHeight) && o.textHeight > 0) {
                this.element.css({
                    "line-height": o.height + "px"
                });
                BI.createWidget({
                    type: "bi.adaptive",
                    height: o.height,
                    scrollable: true,
                    element: this.element,
                    items: [{
                        el: (this.text = BI.createWidget(json)),
                        left: o.hgap + o.lgap,
                        right: o.hgap + o.rgap,
                        top: o.vgap + o.tgap,
                        bottom: o.vgap + o.bgap
                    }]
                });
                return;
            }
            BI.extend(json, {
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap
            });
            this.element.css({
                "line-height": o.height + "px"
            });
            this.text = BI.createWidget(BI.extend(json, {
                element: this.element
            }));
            BI.createWidget({
                type: "bi.layout",
                element: this.text,
                scrollable: true
            });
            return;
        }
        BI.extend(json, {
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        });
        if (o.forceCenter) {
            this.text = BI.createWidget(json);
            BI.createWidget({
                type: "bi.vertical_adapt",
                element: this.element,
                items: [this.text]
            });
            return;
        }
        this.text = BI.createWidget(BI.extend(json, {
            element: this.element
        }));
        BI.createWidget({
            type: "bi.layout",
            element: this.text,
            scrollable: true
        })
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    setText: function (v) {
        this.options.text = v;
        this.text.setText(v);
    },

    getText: function () {
        return this.options.text;
    },

    setValue: function (v) {
        BI.Label.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            this.text.setValue(v);
        }
    },

    populate: function () {
        BI.Label.superclass.populate.apply(this, arguments);
    }
});

$.shortcut("bi.label", BI.Label);