/**
 * Created by dailer on 2019/6/19.
 */
!(function () {
    BI.AbstractLabel = BI.inherit(BI.Single, {

        _defaultConfig: function (props) {
            var conf = BI.AbstractLabel.superclass._defaultConfig.apply(this, arguments);
            return BI.extend(conf, {
                textAlign: "center",
                whiteSpace: "nowrap", // normal  or  nowrap
                textWidth: null,
                textHeight: null,
                hgap: 0,
                vgap: 0,
                lgap: 0,
                rgap: 0,
                tgap: 0,
                bgap: 0,
                highLight: false,
                handler: null
            });
        },

        _createJson: function () {
            var o = this.options;
            return {
                type: "bi.text",
                textAlign: o.textAlign,
                whiteSpace: o.whiteSpace,
                lineHeight: o.textHeight,
                maxWidth: "100%",
                text: o.text,
                value: o.value,
                py: o.py,
                keyword: o.keyword,
                highLight: o.highLight,
                handler: o.handler
            };
        },

        render: function () {
            if (this.options.textAlign === "center") {
                this._createCenterEl();
            } else {
                this._createNotCenterEl();
            }
        },

        _createCenterEl: function () {
            var o = this.options;
            var json = this._createJson();
            json.textAlign = "left";
            if (BI.isNumber(o.width) && o.width > 0) {
                if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
                    json.maxWidth = o.textWidth;
                    if (BI.isNumber(o.height) && o.height > 0) { // 1.1
                        BI.createWidget({
                            type: "bi.center_adapt",
                            height: o.height,
                            columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                            scrollable: o.whiteSpace === "normal",
                            element: this,
                            items: [
                                {
                                    el: (this.text = BI.createWidget(json))
                                }
                            ]
                        });
                        return;
                    }
                    BI.createWidget({ // 1.2
                        type: "bi.center_adapt",
                        columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                        scrollable: o.whiteSpace === "normal",
                        element: this,
                        items: [
                            {
                                el: (this.text = BI.createWidget(json))
                            }
                        ]
                    });
                    return;
                }
                if (o.whiteSpace === "normal") { // 1.3
                    BI.extend(json, {
                        hgap: o.hgap,
                        vgap: o.vgap,
                        lgap: o.lgap,
                        rgap: o.rgap,
                        tgap: o.tgap,
                        bgap: o.bgap
                    });
                    this.text = BI.createWidget(json);
                    BI.createWidget({
                        type: "bi.center_adapt",
                        columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                        scrollable: o.whiteSpace === "normal",
                        element: this,
                        items: [this.text]
                    });
                    return;
                }
                if (BI.isNumber(o.height) && o.height > 0) { // 1.4
                    this.element.css({
                        "line-height": o.height / BI.pixRatio + BI.pixUnit
                    });
                    json.textAlign = o.textAlign;
                    delete json.maxWidth;
                    this.text = BI.createWidget(BI.extend(json, {
                        element: this,
                        hgap: o.hgap,
                        vgap: o.vgap,
                        lgap: o.lgap,
                        rgap: o.rgap,
                        tgap: o.tgap,
                        bgap: o.bgap
                    }));
                    return;
                }
                BI.extend(json, { // 1.5
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    maxWidth: "100%"
                });
                this.text = BI.createWidget(json);
                BI.createWidget({
                    type: "bi.center_adapt",
                    columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                    scrollable: o.whiteSpace === "normal",
                    element: this,
                    items: [this.text]
                });
                return;
            }
            if (BI.isNumber(o.textWidth) && o.textWidth > 0) {  // 1.6
                json.maxWidth = o.textWidth;
                BI.createWidget({
                    type: "bi.center_adapt",
                    columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                    scrollable: o.whiteSpace === "normal",
                    element: this,
                    items: [
                        {
                            el: (this.text = BI.createWidget(json))
                        }
                    ]
                });
                return;
            }
            if (o.whiteSpace === "normal") { // 1.7
                BI.extend(json, {
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap
                });
                this.text = BI.createWidget(json);
                BI.createWidget({
                    type: "bi.center_adapt",
                    columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                    scrollable: true,
                    element: this,
                    items: [this.text]
                });
                return;
            }
            if (BI.isNumber(o.height) && o.height > 0) { // 1.8
                this.element.css({
                    "line-height": o.height / BI.pixRatio + BI.pixUnit
                });
                json.textAlign = o.textAlign;
                delete json.maxWidth;
                this.text = BI.createWidget(BI.extend(json, {
                    element: this,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap
                }));
                return;
            }
            this.text = BI.createWidget(BI.extend(json, {
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap
            }));
            BI.createWidget({
                type: "bi.center_adapt",
                columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                element: this,
                items: [this.text]
            });
        },

        _createNotCenterEl: function () {
            var o = this.options;
            var adaptLayout = "bi.vertical_adapt";
            var json = this._createJson();
            if (BI.isNumber(o.width) && o.width > 0) {
                if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
                    json.maxWidth = o.textWidth;
                    if (BI.isNumber(o.height) && o.height > 0) { // 2.1
                        BI.createWidget({
                            type: adaptLayout,
                            horizontalAlign: o.textAlign,
                            columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                            height: o.height,
                            scrollable: o.whiteSpace === "normal",
                            element: this,
                            items: [
                                {
                                    el: (this.text = BI.createWidget(json))
                                }
                            ]
                        });
                        return;
                    }
                    BI.createWidget({ // 2.2
                        type: adaptLayout,
                        horizontalAlign: o.textAlign,
                        columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                        scrollable: o.whiteSpace === "normal",
                        hgap: o.hgap,
                        vgap: o.vgap,
                        lgap: o.lgap,
                        rgap: o.rgap,
                        tgap: o.tgap,
                        bgap: o.bgap,
                        element: this,
                        items: [
                            {
                                el: (this.text = BI.createWidget(json))
                            }
                        ]
                    });
                    return;
                }
                if (BI.isNumber(o.height) && o.height > 0) { // 2.3
                    if (o.whiteSpace !== "normal") {
                        this.element.css({
                            "line-height": (o.height - (o.vgap * 2)) / BI.pixRatio + BI.pixUnit
                        });
                    }
                    delete json.maxWidth;
                    this.text = BI.createWidget(BI.extend(json, {
                        element: this,
                        hgap: o.hgap,
                        vgap: o.vgap,
                        lgap: o.lgap,
                        rgap: o.rgap,
                        tgap: o.tgap,
                        bgap: o.bgap
                    }));
                    return;
                }
                json.maxWidth = o.width - 2 * o.hgap - o.lgap - o.rgap;
                BI.createWidget({ // 2.4
                    type: adaptLayout,
                    horizontalAlign: o.textAlign,
                    columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                    scrollable: o.whiteSpace === "normal",
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    element: this,
                    items: [{
                        el: (this.text = BI.createWidget(json))
                    }]
                });
                return;
            }
            if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
                json.maxWidth = o.textWidth;
                BI.createWidget({  // 2.5
                    type: adaptLayout,
                    horizontalAlign: o.textAlign,
                    columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                    scrollable: o.whiteSpace === "normal",
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap,
                    element: this,
                    items: [
                        {
                            el: (this.text = BI.createWidget(json))
                        }
                    ]
                });
                return;
            }
            if (BI.isNumber(o.height) && o.height > 0) {
                if (o.whiteSpace !== "normal") {
                    this.element.css({
                        "line-height": (o.height - (o.vgap * 2)) / BI.pixRatio + BI.pixUnit
                    });
                }
                delete json.maxWidth;
                this.text = BI.createWidget(BI.extend(json, { // 2.6
                    element: this,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap
                }));
                return;
            }
            this.text = BI.createWidget(BI.extend(json, {
                hgap: o.hgap,
                vgap: o.vgap,
                lgap: o.lgap,
                rgap: o.rgap,
                tgap: o.tgap,
                bgap: o.bgap
            }));
            BI.createWidget({
                type: adaptLayout,
                horizontalAlign: o.textAlign,
                columnSize: ["auto"], // important！ 让文字在flex布局下shrink为1
                element: this,
                scrollable: o.whiteSpace === "normal",
                items: [this.text]
            });
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

        setStyle: function (css) {
            this.text.setStyle(css);
        },

        setValue: function (v) {
            BI.AbstractLabel.superclass.setValue.apply(this, arguments);
            if (!this.isReadOnly()) {
                this.text.setValue(v);
            }
        }
    });
}());
