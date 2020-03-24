/* !
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define(["../core/jquery"], factory);
    } else if (typeof exports === "object") {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(BI.jQuery);
    }
}(function ($) {

    var toFix  = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
        toBind = ( "onwheel" in document || document.documentMode >= 9 ) ?
            ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: "3.1.12",

        setup: function () {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function () {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler (event) {
        var orgEvent   = event || _global.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if ( "detail"      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( "wheelDelta"  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( "wheelDeltaY" in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( "wheelDeltaX" in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( "axis" in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( "deltaY" in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( "deltaX" in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = 40;
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = 800;
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? "floor" : "ceil" ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? "floor" : "ceil" ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? "floor" : "ceil" ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta () {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas (orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === "mousewheel" && absDelta % 120 === 0;
    }

}));/**
 * 当没有元素时有提示信息的view
 *
 * Created by GUY on 2015/9/8.
 * @class BI.Pane
 * @extends BI.Widget
 * @abstract
 */
BI.Pane = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Pane.superclass._defaultConfig.apply(this, arguments), {
            _baseCls: "bi-pane",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            overlap: true,
            onLoaded: BI.emptyFn
        });
    },

    _assertTip: function () {
        var o = this.options;
        if (!this._tipText) {
            this._tipText = BI.createWidget({
                type: "bi.label",
                cls: "bi-tips",
                text: o.tipText,
                height: 25
            });
            BI.createWidget({
                type: "bi.absolute_center_adapt",
                element: this,
                items: [this._tipText]
            });
        }
    },

    loading: function () {
        var self = this, o = this.options;
        var isIE = BI.isIE();
        var loadingAnimation = BI.createWidget({
            type: "bi.horizontal",
            cls: "bi-loading-widget" + (isIE ? " wave-loading hack" : ""),
            height: 30,
            width: 30,
            hgap: 5,
            vgap: 2.5,
            items: isIE ? [] : [{
                type: "bi.layout",
                cls: "animate-rect rect1",
                height: 25,
                width: 3
            }, {
                type: "bi.layout",
                cls: "animate-rect rect2",
                height: 25,
                width: 3
            }, {
                type: "bi.layout",
                cls: "animate-rect rect3",
                height: 25,
                width: 3
            }]
        });
        // pane在同步方式下由items决定tipText的显示与否
        // loading的异步情况下由loaded后对面板的populate的时机决定
        this.setTipVisible(false);
        if (o.overlap === true) {
            if (!BI.Layers.has(this.getName())) {
                BI.createWidget({
                    type: "bi.absolute_center_adapt",
                    cls: "loading-container",
                    items: [{
                        el: loadingAnimation
                    }],
                    element: BI.Layers.make(this.getName(), this)
                });
            }
            BI.Layers.show(self.getName());
        } else if (BI.isNull(this._loading)) {
            this._loading = loadingAnimation;
            this._loading.element.css("zIndex", 1);
            BI.createWidget({
                type: "bi.absolute_center_adapt",
                element: this,
                cls: "loading-container",
                items: [{
                    el: this._loading,
                    left: 0,
                    right: 0,
                    top: 0
                }]
            });
        }
        this.element.addClass("loading-status");
    },

    loaded: function () {
        var self = this, o = this.options;
        BI.Layers.remove(self.getName());
        this._loading && this._loading.destroy();
        this._loading && (this._loading = null);
        o.onLoaded();
        self.fireEvent(BI.Pane.EVENT_LOADED);
        this.element.removeClass("loading-status");
    },

    check: function () {
        this.setTipVisible(BI.isEmpty(this.options.items));
    },

    setTipVisible: function (b) {
        if (b === true) {
            this._assertTip();
            this._tipText.setVisible(true);
        } else {
            this._tipText && this._tipText.setVisible(false);
        }
    },

    populate: function (items) {
        this.options.items = items || [];
        this.check();
    },

    empty: function () {

    }
});
BI.Pane.EVENT_LOADED = "EVENT_LOADED";/**
 * guy
 * 这仅仅只是一个超类, 所有简单控件的基类
 * 1、类的控制，
 * 2、title的控制
 * 3、文字超过边界显示3个点
 * 4、cursor默认pointor
 * @class BI.Single
 * @extends BI.Widget
 * @abstract
 */
BI.Single = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.Single.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-single",
            readonly: false,
            title: null,
            warningTitle: null,
            tipType: null, // success或warning
            value: null,
            belowMouse: false   // title是否跟随鼠标
        });
    },

    _showToolTip: function (e, opt) {
        opt || (opt = {});
        var self = this, o = this.options;
        var type = this.getTipType() || (this.isEnabled() ? "success" : "warning");
        var title = type === "success" ? this.getTitle() : (this.getWarningTitle() || this.getTitle());
        if (BI.isKey(title)) {
            BI.Tooltips.show(e, this.getName(), title, type, this, opt);
            if (o.action) {
                BI.Actions.runAction(o.action, "hover", o, this);
            }
            BI.Actions.runGlobalAction("hover", o, this);
        }
    },

    _hideTooltip: function () {
        var self = this;
        var tooltip = BI.Tooltips.get(this.getName());
        if (BI.isNotNull(tooltip)) {
            tooltip.element.fadeOut(200, function () {
                BI.Tooltips.remove(self.getName());
            });
        }
    },

    _init: function () {
        BI.Single.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isKey(o.title) || BI.isKey(o.warningTitle)
            || BI.isFunction(o.title) || BI.isFunction(o.warningTitle)) {
            this.enableHover({
                belowMouse: o.belowMouse,
                container: o.container
            });
        }
    },

    _clearTimeOut: function () {
        if (BI.isNotNull(this.showTimeout)) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (BI.isNotNull(this.hideTimeout)) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    },

    enableHover: function (opt) {
        opt || (opt = {});
        var self = this;
        if (!this._hoverBinded) {
            this.element.on("mouseenter.title" + this.getName(), function (e) {
                self._e = e;
                if (self.getTipType() === "warning" || (BI.isKey(self.getWarningTitle()) && !self.isEnabled())) {
                    self.showTimeout = BI.delay(function () {
                        if (BI.isNotNull(self.showTimeout)) {
                            self._showToolTip(self._e || e, opt);
                        }
                    }, 200);
                } else if (self.getTipType() === "success" || self.isEnabled()) {
                    self.showTimeout = BI.delay(function () {
                        if (BI.isNotNull(self.showTimeout)) {
                            self._showToolTip(self._e || e, opt);
                        }
                    }, 500);
                }
            });
            this.element.on("mousemove.title" + this.getName(), function (e) {
                self._e = e;
                if (BI.isNotNull(self.showTimeout)) {
                    clearTimeout(self.showTimeout);
                    self.showTimeout = null;
                }
                if(BI.isNull(self.hideTimeout)) {
                    self.hideTimeout = BI.delay(function () {
                        if (BI.isNotNull(self.hideTimeout)) {
                            self._hideTooltip();
                        }
                    }, 500);
                }

                self.showTimeout = BI.delay(function () {
                    // DEC-5321 IE下如果回调已经进入事件队列，clearTimeout将不会起作用
                    if (BI.isNotNull(self.showTimeout)) {
                        if (BI.isNotNull(self.hideTimeout)) {
                            clearTimeout(self.hideTimeout);
                            self.hideTimeout = null;
                        }
                        // CHART-10611 在拖拽的情况下, 鼠标拖拽着元素离开了拖拽元素的容器，但是子元素在dom结构上仍然属于容器
                        // 这样会认为鼠标仍然在容器中, 500ms内放开的话，会在容器之外显示鼠标停留处显示容器的title
                        if (self.element.__isMouseInBounds__(self._e || e)) {
                            self._showToolTip(self._e || e, opt);
                        }
                    }
                }, 500);

            });
            this.element.on("mouseleave.title" + this.getName(), function (e) {
                self._e = null;
                self._clearTimeOut();
                self._hideTooltip();
            });
            this._hoverBinded = true;
        }
    },

    disabledHover: function () {
        // 取消hover事件
        this._clearTimeOut();
        this._hideTooltip();
        this.element.unbind("mouseenter.title" + this.getName())
            .unbind("mousemove.title" + this.getName())
            .unbind("mouseleave.title" + this.getName());
        this._hoverBinded = false;
    },

    populate: function (items) {
        this.items = items || [];
    },

    // opt: {container: '', belowMouse: false}
    setTitle: function (title, opt) {
        this.options.title = title;
        if (BI.isKey(title) || BI.isFunction(title)) {
            this.enableHover(opt);
        } else {
            this.disabledHover();
        }
    },

    setWarningTitle: function (title, opt) {
        this.options.warningTitle = title;
        if (BI.isKey(title) || BI.isFunction(title)) {
            this.enableHover(opt);
        } else {
            this.disabledHover();
        }
    },

    getTipType: function () {
        return this.options.tipType;
    },

    isReadOnly: function () {
        return !!this.options.readonly;
    },

    getTitle: function () {
        var title = this.options.title;
        if(BI.isFunction(title)) {
            return title();
        }
        return title;
    },

    getWarningTitle: function () {
        var title = this.options.warningTitle;
        if(BI.isFunction(title)) {
            return title();
        }
        return title;
    },

    setValue: function (val) {
        if (!this.options.readonly) {
            this.options.value = val;
        }
    },

    getValue: function () {
        return this.options.value;
    },

    _unMount: function () {
        BI.Single.superclass._unMount.apply(this, arguments);
        if(BI.isNotNull(this.showTimeout)) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        BI.Tooltips.remove(this.getName());
    }
});/**
 * guy 表示一行数据，通过position来定位位置的数据
 * @class BI.Text
 * @extends BI.Single
 */
BI.Text = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-text",
        textAlign: "left",
        whiteSpace: "normal",
        lineHeight: null,
        handler: null, // 如果传入handler,表示处理文字的点击事件，不是区域的
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0,
        text: "",
        py: "",
        highLight: false
    },

    render: function () {
        var self = this, o = this.options;
        if (o.hgap + o.lgap > 0) {
            this.element.css({
                "padding-left": o.hgap + o.lgap + "px"
            });
        }
        if (o.hgap + o.rgap > 0) {
            this.element.css({
                "padding-right": o.hgap + o.rgap + "px"
            });
        }
        if (o.vgap + o.tgap > 0) {
            this.element.css({
                "padding-top": o.vgap + o.tgap + "px"
            });
        }
        if (o.vgap + o.bgap > 0) {
            this.element.css({
                "padding-bottom": o.vgap + o.bgap + "px"
            });
        }
        if (BI.isNumber(o.height)) {
            this.element.css({lineHeight: o.height + "px"});
        }
        if (BI.isNumber(o.lineHeight)) {
            this.element.css({lineHeight: o.lineHeight + "px"});
        }
        if (BI.isWidthOrHeight(o.maxWidth)) {
            this.element.css({maxWidth: o.maxWidth});
        }
        this.element.css({
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textOverflow: o.whiteSpace === "nowrap" ? "ellipsis" : "",
            overflow: o.whiteSpace === "nowrap" ? "" : (BI.isWidthOrHeight(o.height) ? "auto" : "")
        });
        if (o.handler) {
            this.text = BI.createWidget({
                type: "bi.layout",
                tagName: "span"
            });
            this.text.element.click(function () {
                o.handler(self.getValue());
            });
            BI.createWidget({
                type: "bi.default",
                element: this,
                items: [this.text]
            });
        } else {
            this.text = this;
        }

        var text = this._getShowText();
        if (BI.isKey(text)) {
            this.setText(text);
        } else if (BI.isKey(o.value)) {
            this.setText(o.value);
        }
        if (BI.isKey(o.keyword)) {
            this.doRedMark(o.keyword);
        }
        if (o.highLight) {
            this.doHighLight();
        }
    },

    _getShowText: function () {
        var o = this.options;
        return BI.isFunction(o.text) ? o.text() : o.text;
    },


    doRedMark: function (keyword) {
        var o = this.options;
        // render之后做的doredmark,这个时候虽然标红了，但是之后text mounted执行的时候并没有keyword
        o.keyword = keyword;
        this.text.element.__textKeywordMarked__(this._getShowText() || o.value, keyword, o.py);
    },

    unRedMark: function () {
        var o = this.options;
        o.keyword = "";
        this.text.element.__textKeywordMarked__(this._getShowText() || o.value, "", o.py);
    },

    doHighLight: function () {
        this.text.element.addClass("bi-high-light");
    },

    unHighLight: function () {
        this.text.element.removeClass("bi-high-light");
    },

    setValue: function (text) {
        BI.Text.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            this.setText(text);
        }
    },

    setStyle: function (css) {
        this.text.element.css(css);
    },

    setText: function (text) {
        BI.Text.superclass.setText.apply(this, arguments);
        //  为textContext赋值为undefined时在ie和edge下会真的显示undefined
        this.options.text = BI.isNotNull(text) ? text : "";
        if (BI.isIE9Below()) {
            this.text.element.html(BI.htmlEncode(this._getShowText()));
            return;
        }
        if (/\s/.test(text)) {
            this.text.element[0].innerHTML = BI.htmlEncode(this._getShowText());
        } else {
            //  textContent性能更好,并且原生防xss
            this.text.element[0].textContent = this._getShowText();
        }
        BI.isKey(this.options.keyword) && this.doRedMark(this.options.keyword);
    }
});

BI.shortcut("bi.text", BI.Text);
/**
 * guy
 * @class BI.BasicButton
 * @extends BI.Single
 *
 * 一般的button父级
 */
BI.BasicButton = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.BasicButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-basic-button" + (conf.invalid ? "" : " cursor-pointer") + ((BI.isIE() && BI.getIEVersion() < 10) ? " hack" : ""),
            value: "",
            text: "",
            stopEvent: false,
            stopPropagation: false,
            selected: false,
            once: false, // 点击一次选中有效,再点无效
            forceSelected: false, // 点击即选中, 选中了就不会被取消,与once的区别是forceSelected不影响事件的触发
            forceNotSelected: false, // 无论怎么点击都不会被选中
            disableSelected: false, // 使能选中

            shadow: false,
            isShadowShowingOnSelected: false,  // 选中状态下是否显示阴影
            trigger: null,
            handler: BI.emptyFn,
            bubble: null
        });
    },
    _init: function () {
        BI.BasicButton.superclass._init.apply(this, arguments);
        var opts = this.options;
        if (opts.selected === true) {
            BI.nextTick(BI.bind(function () {
                this.setSelected(opts.selected);
            }, this));
        }
        BI.nextTick(BI.bind(this.bindEvent, this));

        if (opts.shadow) {
            this._createShadow();
        }
        if (opts.level) {
            this.element.addClass("button-" + opts.level);
        }
    },

    _createShadow: function () {
        var self = this, o = this.options;

        var assertMask = function () {
            if (!self.$mask) {
                self.$mask = BI.createWidget(BI.isObject(o.shadow) ? o.shadow : {}, {
                    type: "bi.layout",
                    cls: "bi-button-mask"
                });
                self.$mask.invisible();
                BI.createWidget({
                    type: "bi.absolute",
                    element: self,
                    items: [{
                        el: self.$mask,
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                });
            }
        };

        this.element.mouseup(function () {
            if (!self._hover && !o.isShadowShowingOnSelected) {
                assertMask();
                self.$mask.invisible();
            }
        });
        this.element.on("mouseenter." + this.getName(), function (e) {
            if (self.element.__isMouseInBounds__(e)) {
                if (self.isEnabled() && !self._hover && (o.isShadowShowingOnSelected || !self.isSelected())) {
                    assertMask();
                    self.$mask.visible();
                }
            }
        });
        this.element.on("mousemove." + this.getName(), function (e) {
            if (!self.element.__isMouseInBounds__(e)) {
                if (self.isEnabled() && !self._hover) {
                    assertMask();
                    self.$mask.invisible();
                }
            }
        });
        this.element.on("mouseleave." + this.getName(), function () {
            if (self.isEnabled() && !self._hover) {
                assertMask();
                self.$mask.invisible();
            }
        });
    },

    bindEvent: function () {
        var self = this;
        var o = this.options, hand = this.handle();
        if (!hand) {
            return;
        }
        hand = hand.element;
        var triggerArr = (o.trigger || "").split(",");
        BI.each(triggerArr, function (idx, trigger) {
            switch (trigger) {
                case "mouseup":
                    var mouseDown = false;
                    hand.mousedown(function () {
                        mouseDown = true;
                    });
                    hand.mouseup(function (e) {
                        if (mouseDown === true) {
                            clk(e);
                        }
                        mouseDown = false;
                        ev(e);
                    });
                    break;
                case "mousedown":
                    var mouseDown = false;
                    var selected = false;
                    hand.mousedown(function (e) {
                        // if (e.button === 0) {
                        BI.Widget._renderEngine.createElement(document).bind("mouseup." + self.getName(), function (e) {
                            // if (e.button === 0) {
                            if (BI.DOM.isExist(self) && !hand.__isMouseInBounds__(e) && mouseDown === true && !selected) {
                                // self.setSelected(!self.isSelected());
                                self._trigger();
                            }
                            mouseDown = false;
                            BI.Widget._renderEngine.createElement(document).unbind("mouseup." + self.getName());
                            // }
                        });
                        if (mouseDown === true) {
                            return;
                        }
                        if (self.isSelected()) {
                            selected = true;
                        } else {
                            clk(e);
                        }
                        mouseDown = true;
                        ev(e);
                        // }
                    });
                    hand.mouseup(function (e) {
                        // if (e.button === 0) {
                        if (BI.DOM.isExist(self) && mouseDown === true && selected === true) {
                            clk(e);
                        }
                        mouseDown = false;
                        selected = false;
                        BI.Widget._renderEngine.createElement(document).unbind("mouseup." + self.getName());
                        // }
                    });
                    break;
                case "dblclick":
                    hand.dblclick(clk);
                    break;
                case "lclick":
                    var mouseDown = false;
                    var interval;
                    hand.mousedown(function (e) {
                        BI.Widget._renderEngine.createElement(document).bind("mouseup." + self.getName(), function (e) {
                            interval && clearInterval(interval);
                            interval = null;
                            mouseDown = false;
                            BI.Widget._renderEngine.createElement(document).unbind("mouseup." + self.getName());
                        });
                        if (mouseDown === true) {
                            return;
                        }
                        if (!self.isEnabled() || (self.isOnce() && self.isSelected())) {
                            return;
                        }
                        interval = setInterval(function () {
                            if (self.isEnabled()) {
                                self.doClick();
                            }
                        }, 180);
                        mouseDown = true;
                        ev(e);
                    });
                    break;
                default:
                    if (o.stopEvent || o.stopPropagation) {
                        hand.mousedown(function (e) {
                            ev(e);
                        });
                    }
                    hand.click(clk);
                    break;
            }
        });

        // 之后的300ms点击无效
        var onClick = BI.debounce(this._doClick, BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });

        function ev (e) {
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
        }

        function clk (e) {
            ev(e);
            if (!self.isEnabled() || (self.isOnce() && self.isSelected())) {
                return;
            }
            if (BI.isKey(o.bubble) || BI.isFunction(o.bubble)) {
                if (BI.isNull(self.combo)) {
                    var popup;
                    BI.createWidget({
                        type: "bi.absolute",
                        element: self,
                        items: [{
                            el: {
                                type: "bi.bubble_combo",
                                trigger: "",
                                // bubble的提示不需要一直存在在界面上
                                destroyWhenHide: true,
                                ref: function () {
                                    self.combo = this;
                                },
                                el: {
                                    type: "bi.layout",
                                    height: "100%"
                                },
                                popup: {
                                    type: "bi.text_bubble_bar_popup_view",
                                    text: getBubble(),
                                    ref: function () {
                                        popup = this;
                                    },
                                    listeners: [{
                                        eventName: BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON,
                                        action: function (v) {
                                            self.combo.hideView();
                                            if (v) {
                                                onClick.apply(self, arguments);
                                            }
                                        }
                                    }]
                                },
                                listeners: [{
                                    eventName: BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW,
                                    action: function () {
                                        popup.populate(getBubble());
                                    }
                                }]
                            },
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 0
                        }]
                    });
                }
                if (self.combo.isViewVisible()) {
                    self.combo.hideView();
                } else {
                    self.combo.showView();
                }
                return;
            }
            onClick.apply(self, arguments);
        }

        function getBubble () {
            var bubble = self.options.bubble;
            if (BI.isFunction(bubble)) {
                return bubble();
            }
            return bubble;
        }
    },

    _trigger: function (e) {
        var o = this.options;
        if (!this.isEnabled()) {
            return;
        }
        if (!this.isDisableSelected()) {
            this.isForceSelected() ? this.setSelected(true) :
                (this.isForceNotSelected() ? this.setSelected(false) :
                    this.setSelected(!this.isSelected()));
        }
        if (this.isValid()) {
            o.handler.call(this, this.getValue(), this, e);
            var v = this.getValue();
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, v, this, e);
            this.fireEvent(BI.BasicButton.EVENT_CHANGE, v, this);
            if (o.action) {
                BI.Actions.runAction(o.action, "click", o, this);
            }
            BI.Actions.runGlobalAction("click", o, this);
        }
    },

    _doClick: function (e) {
        if (this.isValid()) {
            this.beforeClick(e);
        }
        this._trigger(e);
        if (this.isValid()) {
            this.doClick(e);
        }
    },

    beforeClick: function () {

    },

    doClick: function () {

    },

    handle: function () {
        return this;
    },

    hover: function () {
        this._hover = true;
        this.handle().element.addClass("hover");
        if (this.options.shadow) {
            this.$mask && this.$mask.setVisible(true);
        }
    },

    dishover: function () {
        this._hover = false;
        this.handle().element.removeClass("hover");
        if (this.options.shadow) {
            this.$mask && this.$mask.setVisible(false);
        }
    },

    setSelected: function (b) {
        var o = this.options;
        o.selected = b;
        if (b) {
            this.handle().element.addClass("active");
        } else {
            this.handle().element.removeClass("active");
        }
        if (o.shadow && !o.isShadowShowingOnSelected) {
            this.$mask && this.$mask.setVisible(false);
        }
    },

    isSelected: function () {
        return this.options.selected;
    },

    isOnce: function () {
        return this.options.once;
    },

    isForceSelected: function () {
        return this.options.forceSelected;
    },

    isForceNotSelected: function () {
        return this.options.forceNotSelected;
    },

    isDisableSelected: function () {
        return this.options.disableSelected;
    },

    setText: function (text) {
        this.options.text = text;
    },

    getText: function () {
        return this.options.text;
    },

    _setEnable: function (enable) {
        BI.BasicButton.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.element.addClass("base-disabled disabled");
        }
        if (!enable) {
            if (this.options.shadow) {
                this.$mask && this.$mask.setVisible(false);
            }
        }
    },

    empty: function () {
        BI.Widget._renderEngine.createElement(document).unbind("mouseup." + this.getName());
        BI.BasicButton.superclass.empty.apply(this, arguments);
    },

    destroy: function () {
        BI.BasicButton.superclass.destroy.apply(this, arguments);
    }
});
BI.BasicButton.EVENT_CHANGE = "BasicButton.EVENT_CHANGE";/**
 * 表示一个可以展开的节点, 不仅有选中状态而且有展开状态
 *
 * Created by GUY on 2015/9/9.
 * @class BI.NodeButton
 * @extends BI.BasicButton
 * @abstract
 */
BI.NodeButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.NodeButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            _baseCls: (conf._baseCls || "") + " bi-node",
            open: false
        });
    },

    _init: function () {
        BI.NodeButton.superclass._init.apply(this, arguments);
        var self = this;
        BI.nextTick(function () {
            self.setOpened(self.isOpened());
        });
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
        this.setOpened(!this.isOpened());
    },

    isOnce: function () {
        return false;
    },

    isOpened: function () {
        return !!this.options.open;
    },

    setOpened: function (b) {
        this.options.open = !!b;
    },

    triggerCollapse: function () {
        if(this.isOpened()) {
            this.setOpened(false);
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, this.getValue(), this);
        }
    },

    triggerExpand: function () {
        if(!this.isOpened()) {
            this.setOpened(true);
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, this.getValue(), this);
        }
    }
});/**
 * guy
 * tip提示
 * zIndex在10亿级别
 * @class BI.Tip
 * @extends BI.Single
 * @abstract
 */
BI.Tip = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Tip.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-tip",
            zIndex: BI.zIndex_tip
        });
    },

    _init: function () {
        BI.Tip.superclass._init.apply(this, arguments);
        this.element.css({zIndex: this.options.zIndex});
    }
});/**
 * Created by GUY on 2015/6/26.
 * @class BI.ButtonGroup
 * @extends BI.Widget
 */

BI.ButtonGroup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-button-group",
            behaviors: {},
            items: [],
            value: "",
            chooseType: BI.Selection.Single,
            layouts: [{
                type: "bi.center",
                hgap: 0,
                vgap: 0
            }]
        });
    },

    _init: function () {
        BI.ButtonGroup.superclass._init.apply(this, arguments);
        var o = this.options;
        var behaviors = {};
        BI.each(o.behaviors, function (key, rule) {
            behaviors[key] = BI.BehaviorFactory.createBehavior(key, {
                rule: rule
            });
        });
        this.behaviors = behaviors;
        this.populate(o.items);
        if(BI.isKey(o.value) || BI.isNotEmptyArray(o.value)){
            this.setValue(o.value);
        }
    },

    _createBtns: function (items) {
        var o = this.options;
        return BI.createWidgets(BI.createItems(items, {
            type: "bi.text_button"
        }));
    },

    _btnsCreator: function (items) {
        var self = this, args = Array.prototype.slice.call(arguments), o = this.options;
        var buttons = this._createBtns(items);
        args[0] = buttons;

        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        });
        BI.each(buttons, function (i, btn) {
            btn.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (type === BI.Events.CLICK) {
                    switch (o.chooseType) {
                        case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                            self.setValue(btn.getValue());
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_NONE:
                            self.setValue([]);
                            break;
                    }
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.fireEvent(BI.ButtonGroup.EVENT_CHANGE, value, obj);
                } else {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                }
            });
            btn.on(BI.Events.DESTROY, function () {
                BI.remove(self.buttons, btn);
            });
        });

        return buttons;
    },

    _packageBtns: function (btns) {
        var o = this.options;
        for (var i = o.layouts.length - 1; i > 0; i--) {
            btns = BI.map(btns, function (k, it) {
                return BI.extend({}, o.layouts[i], {
                    items: [
                        BI.extend({}, o.layouts[i].el, {
                            el: it
                        })
                    ]
                });
            });
        }
        return btns;
    },

    _packageSimpleItems: function (btns) {
        var o = this.options;
        return BI.map(o.items, function (i, item) {
            if (BI.stripEL(item) === item) {
                return btns[i];
            }
            return BI.extend({}, item, {
                el: btns[i]
            });
        });
    },

    _packageItems: function (items, packBtns) {
        return BI.createItems(BI.makeArrayByArray(items, {}), BI.clone(packBtns));
    },

    _packageLayout: function (items) {
        var o = this.options, layout = BI.deepClone(o.layouts[0]);

        var lay = BI.formatEL(layout).el;
        while (lay && lay.items && !BI.isEmpty(lay.items)) {
            lay = BI.formatEL(lay.items[0]).el;
        }
        lay.items = items;
        return layout;
    },

    // 如果是一个简单的layout
    _isSimpleLayout: function () {
        var o = this.options;
        return o.layouts.length === 1 && !BI.isArray(o.items[0]);
    },

    doBehavior: function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.buttons);
        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        });
    },

    prependItems: function (items) {
        var o = this.options;
        var btns = this._btnsCreator.apply(this, arguments);
        this.buttons = BI.concat(btns, this.buttons);

        if (this._isSimpleLayout() && this.layouts && this.layouts.prependItems) {
            this.layouts.prependItems(btns);
            return;
        }

        items = this._packageItems(items, this._packageBtns(btns));
        this.layouts.prependItems(this._packageLayout(items).items);
    },

    addItems: function (items) {
        var o = this.options;
        var btns = this._btnsCreator.apply(this, arguments);
        this.buttons = BI.concat(this.buttons, btns);

        // 如果是一个简单的layout
        if (this._isSimpleLayout() && this.layouts && this.layouts.addItems) {
            this.layouts.addItems(btns);
            return;
        }

        items = this._packageItems(items, this._packageBtns(btns));
        this.layouts.addItems(this._packageLayout(items).items);
    },

    removeItemAt: function (indexes) {
        BI.removeAt(this.buttons, indexes);
        this.layouts.removeItemAt(indexes);
    },

    removeItems: function (values) {
        values = BI.isArray(values) ? values : [values];
        var deleted = [];
        BI.each(this.buttons, function (i, button) {
            if (BI.deepContains(values, button.getValue())) {
                deleted.push(i);
            }
        });
        BI.removeAt(this.buttons, deleted);
        this.layouts.removeItemAt(deleted);
    },

    populate: function (items) {
        items = items || [];
        this.empty();
        this.options.items = items;

        this.buttons = this._btnsCreator.apply(this, arguments);
        if (this._isSimpleLayout()) {
            items = this._packageSimpleItems(this.buttons);
        } else {
            items = this._packageItems(items, this._packageBtns(this.buttons));
        }

        this.layouts = BI.createWidget(BI.extend({element: this}, this._packageLayout(items)));
    },

    setNotSelectedValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected && item.setSelected(false);
            } else {
                item.setSelected && item.setSelected(true);
            }
        });
    },

    setEnabledValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setEnable(true);
            } else {
                item.setEnable(false);
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected && item.setSelected(true);
            } else {
                item.setSelected && item.setSelected(false);
            }
        });
    },

    getNotSelectedValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !(item.isSelected && item.isSelected())) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && item.isSelected && item.isSelected()) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getAllButtons: function () {
        return this.buttons;
    },

    getAllLeaves: function () {
        return this.buttons;
    },

    getSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isSelected && item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    getNotSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isSelected && !item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    getIndexByValue: function (value) {
        var index = -1;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled() && item.getValue() === value) {
                index = i;
                return true;
            }
        });
        return index;
    },

    getNodeById: function (id) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled() && item.options.id === id) {
                node = item;
                return true;
            }
        });
        return node;
    },

    getNodeByValue: function (value) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled() && item.getValue() === value) {
                node = item;
                return true;
            }
        });
        return node;
    },

    empty: function () {
        BI.ButtonGroup.superclass.empty.apply(this, arguments);
        this.options.items = [];
    },

    destroy: function () {
        BI.ButtonGroup.superclass.destroy.apply(this, arguments);
        this.options.items = [];
    }
});
BI.extend(BI.ButtonGroup, {
    CHOOSE_TYPE_SINGLE: BI.Selection.Single,
    CHOOSE_TYPE_MULTI: BI.Selection.Multi,
    CHOOSE_TYPE_ALL: BI.Selection.All,
    CHOOSE_TYPE_NONE: BI.Selection.None,
    CHOOSE_TYPE_DEFAULT: BI.Selection.Default
});
BI.ButtonGroup.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.button_group", BI.ButtonGroup);/**
 * Created by GUY on 2015/8/10.
 * @class BI.ButtonTree
 * @extends BI.ButtonGroup
 */

BI.ButtonTree = BI.inherit(BI.ButtonGroup, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-button-tree"
        });
    },

    _init: function () {
        BI.ButtonTree.superclass._init.apply(this, arguments);
    },

    setNotSelectedValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (!BI.isFunction(item.setSelected)) {
                item.setNotSelectedValue(v);
                return;
            }
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected(false);
            } else {
                item.setSelected(true);
            }
        });
    },

    setEnabledValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.isFunction(item.setEnabledValue)) {
                item.setEnabledValue(v);
                return;
            }
            if (BI.deepContains(v, item.getValue())) {
                item.setEnable(true);
            } else {
                item.setEnable(false);
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (!BI.isFunction(item.setSelected)) {
                item.setValue(v);
                return;
            }
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected(true);
            } else {
                item.setSelected(false);
            }
        });
    },

    getNotSelectedValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                v = BI.concat(v, item.getNotSelectedValue());
                return;
            }
            if (item.isEnabled() && item.isSelected && !item.isSelected()) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                v = BI.concat(v, item.getValue());
                return;
            }
            if (item.isEnabled() && item.isSelected && item.isSelected()) {
                v.push(item.getValue());
            }
        });
        return v;
    },

    getSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                btns = btns.concat(item.getSelectedButtons());
                return;
            }
            if (item.isSelected && item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    getNotSelectedButtons: function () {
        var btns = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                btns = btns.concat(item.getNotSelectedButtons());
                return;
            }
            if (item.isSelected && !item.isSelected()) {
                btns.push(item);
            }
        });
        return btns;
    },

    // 获取所有的叶子节点
    getAllLeaves: function () {
        var leaves = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && !BI.isFunction(item.setSelected)) {
                leaves = leaves.concat(item.getAllLeaves());
                return;
            }
            if (item.isEnabled()) {
                leaves.push(item);
            }
        });
        return leaves;
    },

    getIndexByValue: function (value) {
        var index = -1;
        BI.any(this.buttons, function (i, item) {
            var vs = item.getValue();
            if (item.isEnabled() && (vs === value || BI.contains(vs, value))) {
                index = i;
                return true;
            }
        });
        return index;
    },

    getNodeById: function (id) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled()) {
                if (item.attr("id") === id) {
                    node = item;
                    return true;
                } else if (BI.isFunction(item.getNodeById)) {
                    if (node = item.getNodeById(id)) {
                        return true;
                    }
                }
            }
        });
        return node;
    },

    getNodeByValue: function (value) {
        var node;
        BI.any(this.buttons, function (i, item) {
            if (item.isEnabled()) {
                if (BI.isFunction(item.getNodeByValue)) {
                    if (node = item.getNodeByValue(value)) {
                        return true;
                    }
                } else if (item.attr("value") === value) {
                    node = item;
                    return true;
                }
            }
        });
        return node;
    }
});
BI.ButtonTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.button_tree", BI.ButtonTree);/**
 * guy
 * 异步树
 * @class BI.TreeView
 * @extends BI.Pane
 */
BI.TreeView = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TreeView.superclass._defaultConfig.apply(this, arguments), {
            _baseCls: "bi-tree",
            paras: {
                selectedValues: {}
            },
            itemsCreator: BI.emptyFn
        });
    },
    _init: function () {
        BI.TreeView.superclass._init.apply(this, arguments);
        var o = this.options;
        this._stop = false;

        this._createTree();
        this.tip = BI.createWidget({
            type: "bi.loading_bar",
            invisible: true,
            handler: BI.bind(this._loadMore, this)
        });
        BI.createWidget({
            type: "bi.vertical",
            scrollable: true,
            scrolly: false,
            element: this,
            items: [this.tip]
        });
        if(BI.isNotNull(o.value)) {
            this.setSelectedValue(o.value);
        }
        if (BI.isIE9Below && BI.isIE9Below()) {
            this.element.addClass("hack");
        }
    },

    _createTree: function () {
        this.id = "bi-tree" + BI.UUID();
        if (this.nodes) {
            this.nodes.destroy();
        }
        if (this.tree) {
            this.tree.destroy();
        }
        this.tree = BI.createWidget({
            type: "bi.layout",
            element: "<ul id='" + this.id + "' class='ztree'></ul>"
        });
        BI.createWidget({
            type: "bi.default",
            element: this.element,
            items: [this.tree]
        });
    },

    // 选择节点触发方法
    _selectTreeNode: function (treeId, treeNode) {
        this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, treeNode, this);
        this.fireEvent(BI.TreeView.EVENT_CHANGE, treeNode, this);
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: true,
                url: getUrl,
                autoParam: ["id", "name"],  // 节点展开异步请求自动提交id和name
                otherParam: BI.cjkEncodeDO(paras) // 静态参数
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    title: "title",
                    name: "text"    // 节点的name属性替换成text
                },
                simpleData: {
                    enable: true    // 可以穿id,pid属性的对象数组
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,   // 节点可以用html标签代替
                dblClickExpand: false
            },
            callback: {
                beforeExpand: beforeExpand,
                onAsyncSuccess: onAsyncSuccess,
                onAsyncError: onAsyncError,
                beforeCheck: beforeCheck,
                onCheck: onCheck,
                onExpand: onExpand,
                onCollapse: onCollapse,
                onClick: onClick
            }
        };
        var className = "dark", perTime = 100;

        function onClick (event, treeId, treeNode) {
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            var checked = treeNode.checked;
            var status = treeNode.getCheckStatus();
            if(status.half === true && status.checked === true) {
                checked = false;
            }
            // 更新此node的check状态, 影响父子关联，并调用beforeCheck和onCheck回调
            self.nodes.checkNode(treeNode, !checked, true, true);
        }

        function getUrl (treeId, treeNode) {
            var parentNode = self._getParentValues(treeNode);
            treeNode.times = treeNode.times || 1;
            var param = "id=" + treeNode.id
                + "&times=" + (treeNode.times++)
                + "&parentValues= " + _global.encodeURIComponent(BI.jsonEncode(parentNode))
                + "&checkState=" + _global.encodeURIComponent(BI.jsonEncode(treeNode.getCheckStatus()));

            return "&" + param;
        }

        function beforeExpand (treeId, treeNode) {
            if (!treeNode.isAjaxing) {
                if (!treeNode.children) {
                    treeNode.times = 1;
                    ajaxGetNodes(treeNode, "refresh");
                }
                return true;
            }
            BI.Msg.toast("Please Wait。", "warning"); // 不展开节点，也不触发onExpand事件
            return false;

        }

        function onAsyncSuccess (event, treeId, treeNode, msg) {
            treeNode.halfCheck = false;
            if (!msg || msg.length === 0 || /^<html>[\s,\S]*<\/html>$/gi.test(msg) || self._stop) {
                return;
            }
            var zTree = self.nodes;
            var totalCount = treeNode.count || 0;

            // 尝试去获取下一组节点，若获取值为空数组，表示获取完成
            // TODO by GUY
            if (treeNode.children.length > totalCount) {
                treeNode.count = treeNode.children.length;
                BI.delay(function () {
                    ajaxGetNodes(treeNode);
                }, perTime);
            } else {
                // treeNode.icon = "";
                zTree.updateNode(treeNode);
                zTree.selectNode(treeNode.children[0]);
                // className = (className === "dark" ? "":"dark");
            }
        }

        function onAsyncError (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
            var zTree = self.nodes;
            BI.Msg.toast("Error!", "warning");
            // treeNode.icon = "";
            // zTree.updateNode(treeNode);
        }

        function ajaxGetNodes (treeNode, reloadType) {
            var zTree = self.nodes;
            if (reloadType == "refresh") {
                zTree.updateNode(treeNode); // 刷新一下当前节点，如果treeNode.xxx被改了的话
            }
            zTree.reAsyncChildNodes(treeNode, reloadType, true); // 强制加载子节点，reloadType === refresh为先清空再加载，否则为追加到现有子节点之后
        }

        function beforeCheck (treeId, treeNode) {
            treeNode.halfCheck = false;
            if (treeNode.checked === true) {
                // 将展开的节点halfCheck设为false，解决展开节点存在halfCheck=true的情况 guy
                // 所有的半选状态都需要取消halfCheck=true的情况
                function track (children) {
                    BI.each(children, function (i, ch) {
                        if (ch.halfCheck === true) {
                            ch.halfCheck = false;
                            track(ch.children);
                        }
                    });
                }

                track(treeNode.children);
                var treeObj = self.nodes;
                var nodes = treeObj.getSelectedNodes();
                BI.$.each(nodes, function (index, node) {
                    node.halfCheck = false;
                });
            }
            var status = treeNode.getCheckStatus();
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            if(status.half === true && status.checked === true) {
                treeNode.checked = false;
            }
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        function onExpand (event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        function onCollapse (event, treeId, treeNode) {
        }

        return setting;
    },

    _getParentValues: function (treeNode) {
        if (!treeNode.getParentNode()) {
            return [];
        }
        var parentNode = treeNode.getParentNode();
        var result = this._getParentValues(parentNode);
        result = result.concat([this._getNodeValue(parentNode)]);
        return result;
    },

    _getNodeValue: function (node) {
        // 去除标红
        return node.value == null ? BI.replaceAll(node.text.replace(/<[^>]+>/g, ""), "&nbsp;", " ") : node.value;
    },

    // 获取半选框值
    _getHalfSelectedValues: function (map, node) {
        var self = this;
        var checkState = node.getCheckStatus();
        // 将未选的去掉
        if (checkState.checked === false && checkState.half === false) {
            return;
        }
        // 如果节点已展开,并且是半选
        if (BI.isNotEmptyArray(node.children) && checkState.half === true) {
            var children = node.children;
            BI.each(children, function (i, ch) {
                self._getHalfSelectedValues(map, ch);
            });
            return;
        }
        var parent = node.parentValues || self._getParentValues(node);
        var path = parent.concat(this._getNodeValue(node));
        // 当前节点是全选的，因为上面的判断已经排除了不选和半选
        if (BI.isNotEmptyArray(node.children) || checkState.half === false) {
            this._buildTree(map, path);
            return;
        }
        // 剩下的就是半选不展开的节点，因为不知道里面是什么情况，所以借助selectedValues(这个是完整的选中情况)
        var storeValues = BI.deepClone(this.options.paras.selectedValues);
        var treeNode = this._getTree(storeValues, path);
        this._addTreeNode(map, parent, this._getNodeValue(node), treeNode);
    },

    // 获取的是以values最后一个节点为根的子树
    _getTree: function (map, values) {
        var cur = map;
        BI.any(values, function (i, value) {
            if (cur[value] == null) {
                return true;
            }
            cur = cur[value];
        });
        return cur;
    },

    // 以values为path一路向里补充map, 并在末尾节点添加key: value节点
    _addTreeNode: function (map, values, key, value) {
        var cur = map;
        BI.each(values, function (i, value) {
            if (cur[value] == null) {
                cur[value] = {};
            }
            cur = cur[value];
        });
        cur[key] = value;
    },

    // 构造树节点
    _buildTree: function (map, values) {
        var cur = map;
        BI.each(values, function (i, value) {
            if (cur[value] == null) {
                cur[value] = {};
            }
            cur = cur[value];
        });
    },

    // 获取选中的值
    _getSelectedValues: function () {
        var self = this;
        var hashMap = {};
        var rootNoots = this.nodes.getNodes();
        track(rootNoots); // 可以看到这个方法没有递归调用，所以在_getHalfSelectedValues中需要关心全选的节点
        function track (nodes) {
            BI.each(nodes, function (i, node) {
                var checkState = node.getCheckStatus();
                if (checkState.checked === true || checkState.half === true) {
                    if (checkState.half === true) {
                        self._getHalfSelectedValues(hashMap, node);
                    } else {
                        var parentValues = node.parentValues || self._getParentValues(node);
                        var values = parentValues.concat([self._getNodeValue(node)]);
                        self._buildTree(hashMap, values);
                    }
                }
            });
        }

        return hashMap;
    },

    // 处理节点
    _dealWidthNodes: function (nodes) {
        var self = this, o = this.options;
        var ns = BI.Tree.arrayFormat(nodes);
        BI.each(ns, function (i, n) {
            n.title = n.title || n.text || n.value;
            n.isParent = n.isParent || n.parent;
            // 处理标红
            if (BI.isKey(o.paras.keyword)) {
                n.text = BI.$("<div>").__textKeywordMarked__(n.text, o.paras.keyword, n.py).html();
            } else {
                n.text = BI.htmlEncode(n.text + "");
            }
        });
        return nodes;
    },

    _loadMore: function () {
        var self = this, o = this.options;
        this.tip.setLoading();
        var op = BI.extend({}, o.paras, {
            times: ++this.times
        });
        o.itemsCreator(op, function (res) {
            if (self._stop === true) {
                return;
            }
            var hasNext = !!res.hasNext, nodes = res.items || [];

            if (!hasNext) {
                self.tip.setEnd();
            } else {
                self.tip.setLoaded();
            }
            if (nodes.length > 0) {
                self.nodes.addNodes(null, self._dealWidthNodes(nodes));
            }
        });
    },

    // 生成树内部方法
    _initTree: function (setting) {
        var self = this, o = this.options;
        self.fireEvent(BI.Events.INIT);
        this.times = 1;
        var tree = this.tree;
        tree.empty();
        this.loading();
        this.tip.setVisible(false);
        var callback = function (nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = BI.$.fn.zTree.init(tree.element, setting, nodes);
        };
        var op = BI.extend({}, o.paras, {
            times: 1
        });

        o.itemsCreator(op, function (res) {
            if (self._stop === true) {
                return;
            }
            var hasNext = !!res.hasNext, nodes = res.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes));
            }
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            op.times === 1 && self.fireEvent(BI.Events.AFTERINIT);
        });
    },

    // 构造树结构，
    initTree: function (nodes, setting) {
        var setting = setting || {
            async: {
                enable: false
            },
            check: {
                enable: false
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true
            },
            callback: {}
        };
        this.nodes = BI.$.fn.zTree.init(this.tree.element, setting, nodes);
    },

    start: function () {
        this._stop = false;
    },

    stop: function () {
        this._stop = true;
    },

    // 生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._createTree();
        this.start();
        this._initTree(setting);
    },

    populate: function () {
        this.stroke.apply(this, arguments);
    },

    hasChecked: function () {
        var treeObj = this.nodes;
        return treeObj.getCheckedNodes(true).length > 0;
    },

    checkAll: function (checked) {
        function setNode (children) {
            BI.each(children, function (i, child) {
                child.halfCheck = false;
                setNode(child.children);
            });
        }

        if (!this.nodes) {
            return;
        }

        BI.each(this.nodes.getNodes(), function (i, node) {
            node.halfCheck = false;
            setNode(node.children);
        });
        this.nodes.checkAllNodes(checked);
    },

    expandAll: function (flag) {
        this.nodes && this.nodes.expandAll(flag);
    },

    // 设置树节点的状态
    setValue: function (value, param) {
        this.checkAll(false);
        this.updateValue(value, param);
        this.refresh();
    },

    setSelectedValue: function (value) {
        this.options.paras.selectedValues = BI.deepClone(value || {});
    },

    updateValue: function (values, param) {
        if (!this.nodes) {
            return;
        }
        param || (param = "value");
        var treeObj = this.nodes;
        BI.each(values, function (v, op) {
            var nodes = treeObj.getNodesByParam(param, v, null);
            BI.each(nodes, function (j, node) {
                BI.extend(node, {checked: true}, op);
                treeObj.updateNode(node);
            });
        });
    },

    refresh: function () {
        this.nodes && this.nodes.refresh();
    },

    getValue: function () {
        if (!this.nodes) {
            return null;
        }
        return this._getSelectedValues();
    },

    destroyed: function () {
        this.stop();
        this.nodes && this.nodes.destroy();
    }
});
BI.extend(BI.TreeView, {
    REQ_TYPE_INIT_DATA: 1,
    REQ_TYPE_ADJUST_DATA: 2,
    REQ_TYPE_SELECT_DATA: 3,
    REQ_TYPE_GET_SELECTED_DATA: 4
});

BI.TreeView.EVENT_CHANGE = "EVENT_CHANGE";
BI.TreeView.EVENT_INIT = BI.Events.INIT;
BI.TreeView.EVENT_AFTERINIT = BI.Events.AFTERINIT;

BI.shortcut("bi.tree_view", BI.TreeView);/**
 * guy
 * 同步树
 * @class BI.AsyncTree
 * @extends BI.TreeView
 */
BI.AsyncTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.AsyncTree.superclass._defaultConfig.apply(this, arguments), {});
    },
    _init: function () {
        BI.AsyncTree.superclass._init.apply(this, arguments);
        var self = this;
        this.service = new BI.TreeRenderService({
            id: this.id,
            container: this.element,
            subNodeListGetter: function (tId) {
                // 获取待检测的子节点列表, ztree并没有获取节点列表dom的API, 此处使用BI.$获取
                return BI.$("#" + self.id + " #" + tId + "_ul");
            }
        });
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false,  // 很明显这棵树把异步请求关掉了，所有的异步请求都是手动控制的
                otherParam: BI.cjkEncodeDO(paras)
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,
                dblClickExpand: false
            },
            callback: {
                beforeCheck: beforeCheck,
                onCheck: onCheck,
                beforeExpand: beforeExpand,
                onExpand: onExpand,
                onCollapse: onCollapse,
                onClick: onClick
            }
        };

        function onClick (event, treeId, treeNode) {
            var zTree = BI.$.fn.zTree.getZTreeObj(treeId);
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            var checked = treeNode.checked;
            var status = treeNode.getCheckStatus();
            if (status.half === true && status.checked === true) {
                checked = false;
            }
            zTree.checkNode(treeNode, !checked, true, true);
        }

        function beforeCheck (treeId, treeNode) {
            treeNode.halfCheck = false;
            if (treeNode.checked === true) {
                // 将展开的节点halfCheck设为false，解决展开节点存在halfCheck=true的情况 guy
                // 所有的半选状态都需要取消halfCheck=true的情况
                function track (children) {
                    BI.each(children, function (i, ch) {
                        if (ch.halfCheck === true) {
                            ch.halfCheck = false;
                            track(ch.children);
                        }
                    });
                }

                track(treeNode.children);

                var treeObj = BI.$.fn.zTree.getZTreeObj(treeId);
                var nodes = treeObj.getSelectedNodes();
                BI.each(nodes, function (index, node) {
                    node.halfCheck = false;
                });
            }
            var status = treeNode.getCheckStatus();
            // 当前点击节点的状态是半选，且为true_part, 则将其改为false_part,使得点击半选后切换到的是全选
            if (status.half === true && status.checked === true) {
                treeNode.checked = false;
            }
        }

        function beforeExpand (treeId, treeNode) {
            self._beforeExpandNode(treeId, treeNode);
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        function onExpand (event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        function onCollapse (event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        return setting;
    },

    // 用来更新this.options.paras.selectedValues, 和ztree内部无关
    _selectTreeNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode);
        //        var values = parentValues.concat([name]);
        if (treeNode.checked === true) {
            this._addTreeNode(this.options.paras.selectedValues, parentValues, name, {});
        } else {
            var tNode = treeNode;
            var pNode = this._getTree(this.options.paras.selectedValues, parentValues);
            if (BI.isNotNull(pNode[name])) {
                delete pNode[name];
            }
            while (tNode != null && BI.isEmpty(pNode)) {
                parentValues = parentValues.slice(0, parentValues.length - 1);
                tNode = tNode.getParentNode();
                if (tNode != null) {
                    pNode = this._getTree(this.options.paras.selectedValues, parentValues);
                    name = this._getNodeValue(tNode);
                    delete pNode[name];
                }
            }
        }
        BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
    },

    // 展开节点
    _beforeExpandNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var complete = function (d) {
            var nodes = d.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes), !!d.hasNext);
            }
        };

        function callback(nodes, hasNext) {
            if (hasNext) {
                self.service.pushNodeList(treeNode.tId, getNodes);
            } else {
                self.service.removeNodeList(treeNode.tId);
            }
            // console.log("add nodes");
            self.nodes.addNodes(treeNode, nodes);

        }

        function getNodes(options) {
            // console.log(times);
            options = options || {};
            var parentValues = treeNode.parentValues || self._getParentValues(treeNode);
            var op = BI.extend({}, o.paras, {
                id: treeNode.id,
                times: options.times,
                parentValues: parentValues.concat(self._getNodeValue(treeNode)),
                checkState: treeNode.getCheckStatus()
            }, options);
            o.itemsCreator(op, complete);
        }

        // 展开节点会将halfCheck置为false以开启自动计算半选, 所以第一次展开节点的时候需要在置为false之前获取配置
        var checkState = treeNode.getCheckStatus();
        if (!treeNode.children) {
            setTimeout(function () {
                getNodes({
                    times: 1,
                    checkState: checkState
                });
            }, 17);
        }
    },

    // a,b 两棵树
    // a->b b->a 做两次校验, 构造一个校验后的map
    // e.g. 以a为基准，如果b没有此节点，则在map中添加。 如b有,且是全选的, 则在map中构造全选（为什么不添加a的值呢？ 因为这次是取并集）, 如果b中也有和a一样的存值，就递归
    _join: function (valueA, valueB) {
        var self = this;
        var map = {};
        track([], valueA, valueB);
        track([], valueB, valueA);

        function track (parent, node, compare) {
            BI.each(node, function (n, item) {
                if (BI.isNull(compare[n])) {
                    self._addTreeNode(map, parent, n, item);
                } else if (BI.isEmpty(compare[n])) {
                    self._addTreeNode(map, parent, n, item);
                } else {
                    track(parent.concat([n]), node[n], compare[n]);
                }
            });
        }

        return map;
    },

    hasChecked: function () {
        return !BI.isEmpty(this.options.paras.selectedValues) || BI.AsyncTree.superclass.hasChecked.apply(this, arguments);
    },

    _getJoinValue: function () {
        if (!this.nodes) {
            return {};
        }
        var checkedValues = this._getSelectedValues();
        if (BI.isEmpty(checkedValues)) {
            return BI.deepClone(this.options.paras.selectedValues);
        }
        if (BI.isEmpty(this.options.paras.selectedValues)) {
            return checkedValues;
        }
        return this._join(checkedValues, this.options.paras.selectedValues);
    },

    getValue: function () {
        return this._getJoinValue();
    },

    // 生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        this.service.clear();
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._initTree(setting);
    }
});

BI.shortcut("bi.async_tree", BI.AsyncTree);/**
 * guy
 * 局部树，两个请求树， 第一个请求构造树，第二个请求获取节点
 * @class BI.PartTree
 * @extends BI.AsyncTree
 */
BI.PartTree = BI.inherit(BI.AsyncTree, {
    _defaultConfig: function () {
        return BI.extend(BI.PartTree.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.PartTree.superclass._init.apply(this, arguments);
    },

    _loadMore: function () {
        var self = this, o = this.options;
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: ++this.times
        });
        this.tip.setLoading();
        o.itemsCreator(op, function (d) {
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            if (self._stop === true) {
                return;
            }
            if (!hasNext) {
                self.tip.setEnd();
            } else {
                self.tip.setLoaded();
            }
            if (nodes.length > 0) {
                self.nodes.addNodes(null, self._dealWidthNodes(nodes));
            }
        });
    },

    _selectTreeNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode);
        if (treeNode.checked === true) {
            this.options.paras.selectedValues = this._getJoinValue();
            // this._buildTree(self.options.paras.selectedValues, BI.concat(parentValues, name));
            o.itemsCreator(BI.extend({}, o.paras, {
                type: BI.TreeView.REQ_TYPE_ADJUST_DATA,
                curSelectedValue: name,
                parentValues: parentValues
            }), function (res) {
                self.options.paras.selectedValues = res;
                BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
            });
        } else {
            // 如果选中的值中不存在该值不处理
            // 因为反正是不选中，没必要管
            var t = this.options.paras.selectedValues;
            var p = parentValues.concat(name);
            for (var i = 0, len = p.length; i < len; i++) {
                t = t[p[i]];
                if (t == null) {
                    return;
                }
                // 选中中国-江苏, 搜索南京，取消勾选
                if (BI.isEmpty(t)) {
                    break;
                }
            }
            o.itemsCreator(BI.extend({}, o.paras, {
                type: BI.TreeView.REQ_TYPE_SELECT_DATA,
                notSelectedValue: name,
                parentValues: parentValues
            }), function (new_values) {
                self.options.paras.selectedValues = new_values;
                BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
            });
        }
    },

    _getSelectedValues: function () {
        var self = this;
        var hashMap = {};
        var rootNoots = this.nodes.getNodes();
        track(rootNoots);

        function track (nodes) {
            BI.each(nodes, function (i, node) {
                var checkState = node.getCheckStatus();
                if (checkState.checked === false) {
                    return true;
                }
                var parentValues = node.parentValues || self._getParentValues(node);
                // 把文字中的html去掉，其实就是把文字颜色去掉
                var values = parentValues.concat([self._getNodeValue(node)]);
                self._buildTree(hashMap, values);
                //                if(checkState.checked === true && checkState.half === false && nodes[i].flag === true){
                //                    continue;
                //                }
                if (BI.isNotEmptyArray(node.children)) {
                    track(node.children);
                    return true;
                }
                if (checkState.half === true) {
                    self._getHalfSelectedValues(hashMap, node);
                }
            });
        }

        return hashMap;
    },

    _initTree: function (setting, keyword) {
        var self = this, o = this.options;
        this.times = 1;
        var tree = this.tree;
        tree.empty();
        self.tip.setVisible(false);
        this.loading();
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: this.times
        });
        var complete = function (d) {
            if (self._stop === true || keyword != o.paras.keyword) {
                return;
            }
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            // 没有请求到数据也要初始化空树, 如果不初始化, 树就是上一次构造的树, 节点信息都是过期的
            callback(nodes.length > 0 ? self._dealWidthNodes(nodes) : []);
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            self.fireEvent(BI.Events.AFTERINIT);
        };

        function callback (nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = BI.$.fn.zTree.init(tree.element, setting, nodes);
        }

        BI.delay(function () {
            o.itemsCreator(op, complete);
        }, 100);
    },

    getValue: function () {
        return BI.deepClone(this.options.paras.selectedValues || {});
    },

    // 生成树方法
    stroke: function (config) {
        var o = this.options;
        delete o.paras.keyword;
        BI.extend(o.paras, config);
        delete o.paras.lastSearchValue;
        var setting = this._configSetting();
        this._initTree(setting, o.paras.keyword);
    }
});

BI.shortcut("bi.part_tree", BI.PartTree);/**
 * author: windy
 * 继承自treeView, 此树的父子节点的勾选状态互不影响, 此树不会有半选节点
 * 返回value格式为[["A"], ["A", "a"]]表示勾选了A且勾选了a
 * @class BI.ListTreeView
 * @extends BI.TreeView
 */
BI.ListTreeView = BI.inherit(BI.TreeView, {

    _constants: {
        SPLIT: "<|>"
    },

    _defaultConfig: function () {
        return BI.extend(BI.ListTreeView.superclass._defaultConfig.apply(this, arguments), {});
    },
    _init: function () {
        BI.ListTreeView.superclass._init.apply(this, arguments);
        var o = this.options;
        if(BI.isNotNull(o.value)) {
            this.setSelectedValue(o.value);
        }
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false
            },
            check: {
                enable: true,
                chkboxType: {Y: "", N: ""}
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,
                dblClickExpand: false
            },
            callback: {
                onCheck: onCheck,
                onClick: onClick
            }
        };

        function onClick (event, treeId, treeNode) {
            var zTree = BI.$.fn.zTree.getZTreeObj(treeId);
            var checked = treeNode.checked;
            self._checkValue(treeNode, !checked);
            zTree.checkNode(treeNode, !checked, true, true);
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        return setting;
    },

    _selectTreeNode: function (treeId, treeNode) {
        this._checkValue(treeNode, treeNode.checked);
        BI.ListTreeView.superclass._selectTreeNode.apply(this, arguments);
    },

    _transArrayToMap: function (treeArrays) {
        var self = this;
        var map = {};
        BI.each(treeArrays, function (idx, array) {
            var key = array.join(self._constants.SPLIT);
            map[key] = true;
        });
        return map;
    },

    _transMapToArray: function (treeMap) {
        var self = this;
        var array = [];
        BI.each(treeMap, function (key) {
            var item = key.split(self._constants.SPLIT);
            array.push(item);
        });
        return array;
    },

    _checkValue: function (treeNode, checked) {
        var key = BI.concat(this._getParentValues(treeNode), this._getNodeValue(treeNode)).join(this._constants.SPLIT);
        if(checked) {
            this.storeValue[key] = true;
        } else {
            delete this.storeValue[key];
        }
    },

    setSelectedValue: function (value) {
        this.options.paras.selectedValues = value || [];
        this.storeValue = this._transArrayToMap(value);
    },

    getValue: function () {
        return this._transMapToArray(this.storeValue);
    }
});

BI.shortcut("bi.list_tree_view", BI.ListTreeView);/**
 * author: windy
 * 继承自treeView, 此树的父子节点的勾选状态互不影响, 此树不会有半选节点
 * 返回value格式为["A", ["A", "a"]]表示勾选了A且勾选了a
 * @class BI.ListListAsyncTree
 * @extends BI.TreeView
 */
BI.ListAsyncTree = BI.inherit(BI.ListTreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.ListAsyncTree.superclass._defaultConfig.apply(this, arguments), {});
    },
    _init: function () {
        BI.ListAsyncTree.superclass._init.apply(this, arguments);
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false,  // 很明显这棵树把异步请求关掉了，所有的异步请求都是手动控制的
                otherParam: BI.cjkEncodeDO(paras)
            },
            check: {
                enable: true,
                chkboxType: {Y: "", N: ""}
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,
                dblClickExpand: false
            },
            callback: {
                onCheck: onCheck,
                beforeExpand: beforeExpand,
                beforeCheck: beforeCheck,
                onClick: onClick
            }
        };

        function beforeCheck (treeId, treeNode) {
            treeNode.half = false;
        }

        function onClick (event, treeId, treeNode) {
            var zTree = BI.$.fn.zTree.getZTreeObj(treeId);
            var checked = treeNode.checked;
            self._checkValue(treeNode, !checked);
            zTree.checkNode(treeNode, !checked, true, true);
        }

        function beforeExpand (treeId, treeNode) {
            self._beforeExpandNode(treeId, treeNode);
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        return setting;
    },

    // 展开节点
    _beforeExpandNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = treeNode.parentValues || self._getParentValues(treeNode);
        var op = BI.extend({}, o.paras, {
            id: treeNode.id,
            times: 1,
            parentValues: parentValues.concat(this._getNodeValue(treeNode))
        });
        var complete = function (d) {
            var nodes = d.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes), !!d.hasNext);
            }
        };
        var times = 1;

        function callback (nodes, hasNext) {
            self.nodes.addNodes(treeNode, nodes);
            // 展开节点是没有分页的
            if (hasNext === true) {
                BI.delay(function () {
                    times++;
                    op.times = times;
                    o.itemsCreator(op, complete);
                }, 100);
            }
        }

        if (!treeNode.children) {
            setTimeout(function () {
                o.itemsCreator(op, complete);
            }, 17);
        }
    },

    hasChecked: function () {
        return !BI.isEmpty(this.options.paras.selectedValues) || BI.ListAsyncTree.superclass.hasChecked.apply(this, arguments);
    },

    // 生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._initTree(setting);
    }
});

BI.shortcut("bi.list_async_tree", BI.ListAsyncTree);/**
 * guy
 * 局部树，两个请求树， 第一个请求构造树，第二个请求获取节点
 * @class BI.ListPartTree
 * @extends BI.AsyncTree
 */
BI.ListPartTree = BI.inherit(BI.ListAsyncTree, {
    _defaultConfig: function () {
        return BI.extend(BI.ListPartTree.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.ListPartTree.superclass._init.apply(this, arguments);
    },

    _loadMore: function () {
        var self = this, o = this.options;
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: ++this.times
        });
        this.tip.setLoading();
        o.itemsCreator(op, function (d) {
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            if (self._stop === true) {
                return;
            }
            if (!hasNext) {
                self.tip.setEnd();
            } else {
                self.tip.setLoaded();
            }
            if (nodes.length > 0) {
                self.nodes.addNodes(null, self._dealWidthNodes(nodes));
            }
        });
    },

    _initTree: function (setting, keyword) {
        var self = this, o = this.options;
        this.times = 1;
        var tree = this.tree;
        tree.empty();
        self.tip.setVisible(false);
        this.loading();
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: this.times
        });
        var complete = function (d) {
            if (self._stop === true || keyword != o.paras.keyword) {
                return;
            }
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            // 没有请求到数据也要初始化空树, 如果不初始化, 树就是上一次构造的树, 节点信息都是过期的
            callback(nodes.length > 0 ? self._dealWidthNodes(nodes) : []);
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            self.fireEvent(BI.Events.AFTERINIT);
        };

        function callback (nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = BI.$.fn.zTree.init(tree.element, setting, nodes);
        }

        BI.delay(function () {
            o.itemsCreator(op, complete);
        }, 100);
    },

    // 生成树方法
    stroke: function (config) {
        var o = this.options;
        delete o.paras.keyword;
        BI.extend(o.paras, config);
        delete o.paras.lastSearchValue;
        var setting = this._configSetting();
        this._initTree(setting, o.paras.keyword);
    }
});

BI.shortcut("bi.list_part_tree", BI.ListPartTree);BI.prepares.push(function () {
    BI.Resizers = new BI.ResizeController();
    BI.Layers = new BI.LayerController();
    BI.Maskers = new BI.MaskersController();
    BI.Bubbles = new BI.BubblesController();
    BI.Tooltips = new BI.TooltipsController();
    BI.Popovers = new BI.PopoverController();
    BI.Broadcasts = new BI.BroadcastController();
    BI.StyleLoaders = new BI.StyleLoaderManager();
});
/**
 * CollectionView
 *
 * Created by GUY on 2016/1/15.
 * @class BI.CollectionView
 * @extends BI.Widget
 */
BI.CollectionView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CollectionView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection",
            // width: 400, //必设
            // height: 300, //必设
            overflowX: true,
            overflowY: true,
            cellSizeAndPositionGetter: BI.emptyFn,
            horizontalOverscanSize: 0,
            verticalOverscanSize: 0,
            scrollLeft: 0,
            scrollTop: 0,
            items: []
        });
    },

    _init: function () {
        BI.CollectionView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.renderedCells = [];
        this.renderedKeys = [];
        this.renderRange = {};
        this._scrollLock = false;
        this._debounceRelease = BI.debounce(function () {
            self._scrollLock = false;
        }, 1000 / 60);
        this.container = BI.createWidget({
            type: "bi.absolute"
        });
        this.element.scroll(function () {
            if (self._scrollLock === true) {
                return;
            }
            o.scrollLeft = self.element.scrollLeft();
            o.scrollTop = self.element.scrollTop();
            self._calculateChildrenToRender();
            self.fireEvent(BI.CollectionView.EVENT_SCROLL, {
                scrollLeft: o.scrollLeft,
                scrollTop: o.scrollTop
            });
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            scrollable: o.overflowX === true && o.overflowY === true,
            scrolly: o.overflowX === false && o.overflowY === true,
            scrollx: o.overflowX === true && o.overflowY === false,
            items: [this.container]
        });
        if (o.items.length > 0) {
            this._calculateSizeAndPositionData();
            this._populate();
        }
    },

    mounted: function () {
        var  o = this.options;
        if (o.scrollLeft !== 0 || o.scrollTop !== 0) {
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        }
    },

    _calculateSizeAndPositionData: function () {
        var o = this.options;
        var cellMetadata = [];
        var sectionManager = new BI.SectionManager();
        var height = 0;
        var width = 0;

        for (var index = 0, len = o.items.length; index < len; index++) {
            var cellMetadatum = o.cellSizeAndPositionGetter(index);

            if (cellMetadatum.height == null || isNaN(cellMetadatum.height) ||
                cellMetadatum.width == null || isNaN(cellMetadatum.width) ||
                cellMetadatum.x == null || isNaN(cellMetadatum.x) ||
                cellMetadatum.y == null || isNaN(cellMetadatum.y)) {
                throw Error();
            }

            height = Math.max(height, cellMetadatum.y + cellMetadatum.height);
            width = Math.max(width, cellMetadatum.x + cellMetadatum.width);

            cellMetadatum.index = index;
            cellMetadata[index] = cellMetadatum;
            sectionManager.registerCell(cellMetadatum, index);
        }

        this._cellMetadata = cellMetadata;
        this._sectionManager = sectionManager;
        this._height = height;
        this._width = width;
    },

    _cellRenderers: function (height, width, x, y) {
        this._lastRenderedCellIndices = this._sectionManager.getCellIndices(height, width, x, y);
        return this._cellGroupRenderer();
    },

    _cellGroupRenderer: function () {
        var self = this, o = this.options;
        var rendered = [];
        BI.each(this._lastRenderedCellIndices, function (i, index) {
            var cellMetadata = self._sectionManager.getCellMetadata(index);
            rendered.push(cellMetadata);
        });
        return rendered;
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;
        var scrollLeft = BI.clamp(o.scrollLeft, 0, this._getMaxScrollLeft());
        var scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop());
        var left = Math.max(0, scrollLeft - o.horizontalOverscanSize);
        var top = Math.max(0, scrollTop - o.verticalOverscanSize);
        var right = Math.min(this._width, scrollLeft + o.width + o.horizontalOverscanSize);
        var bottom = Math.min(this._height, scrollTop + o.height + o.verticalOverscanSize);
        if (right > 0 && bottom > 0) {
            // 如果滚动的区间并没有超出渲染的范围
            if (top >= this.renderRange.minY && bottom <= this.renderRange.maxY && left >= this.renderRange.minX && right <= this.renderRange.maxX) {
                return;
            }
            var childrenToDisplay = this._cellRenderers(bottom - top, right - left, left, top);
            var renderedCells = [], renderedKeys = {}, renderedWidgets = {};
            // 存储所有的left和top
            var lefts = {}, tops = {};
            for (var i = 0, len = childrenToDisplay.length; i < len; i++) {
                var datum = childrenToDisplay[i];
                lefts[datum.x] = datum.x;
                lefts[datum.x + datum.width] = datum.x + datum.width;
                tops[datum.y] = datum.y;
                tops[datum.y + datum.height] = datum.y + datum.height;
            }
            lefts = BI.toArray(lefts);
            tops = BI.toArray(tops);
            var leftMap = BI.invert(lefts);
            var topMap = BI.invert(tops);
            // 存储上下左右四个边界
            var leftBorder = {}, rightBorder = {}, topBorder = {}, bottomBorder = {};
            var assertMinBorder = function (border, offset) {
                if (border[offset] == null) {
                    border[offset] = Number.MAX_VALUE;
                }
            };
            var assertMaxBorder = function (border, offset) {
                if (border[offset] == null) {
                    border[offset] = 0;
                }
            };
            for (var i = 0, len = childrenToDisplay.length; i < len; i++) {
                var datum = childrenToDisplay[i];
                var index = this.renderedKeys[datum.index] && this.renderedKeys[datum.index][1];
                var child;
                if (index >= 0) {
                    if (datum.width !== this.renderedCells[index]._width) {
                        this.renderedCells[index]._width = datum.width;
                        this.renderedCells[index].el.setWidth(datum.width);
                    }
                    if (datum.height !== this.renderedCells[index]._height) {
                        this.renderedCells[index]._height = datum.height;
                        this.renderedCells[index].el.setHeight(datum.height);
                    }
                    if (this.renderedCells[index]._left !== datum.x) {
                        this.renderedCells[index].el.element.css("left", datum.x + "px");
                    }
                    if (this.renderedCells[index]._top !== datum.y) {
                        this.renderedCells[index].el.element.css("top", datum.y + "px");
                    }
                    renderedCells.push(child = this.renderedCells[index]);
                } else {
                    child = BI.createWidget(BI.extend({
                        type: "bi.label",
                        width: datum.width,
                        height: datum.height
                    }, o.items[datum.index], {
                        cls: (o.items[datum.index].cls || "") + " container-cell" + (datum.y === 0 ? " first-row" : "") + (datum.x === 0 ? " first-col" : ""),
                        _left: datum.x,
                        _top: datum.y
                    }));
                    renderedCells.push({
                        el: child,
                        left: datum.x,
                        top: datum.y,
                        _left: datum.x,
                        _top: datum.y,
                        _width: datum.width,
                        _height: datum.height
                    });
                }
                var startTopIndex = topMap[datum.y] | 0;
                var endTopIndex = topMap[datum.y + datum.height] | 0;
                for (var k = startTopIndex; k <= endTopIndex; k++) {
                    var t = tops[k];
                    assertMinBorder(leftBorder, t);
                    assertMaxBorder(rightBorder, t);
                    leftBorder[t] = Math.min(leftBorder[t], datum.x);
                    rightBorder[t] = Math.max(rightBorder[t], datum.x + datum.width);
                }
                var startLeftIndex = leftMap[datum.x] | 0;
                var endLeftIndex = leftMap[datum.x + datum.width] | 0;
                for (var k = startLeftIndex; k <= endLeftIndex; k++) {
                    var l = lefts[k];
                    assertMinBorder(topBorder, l);
                    assertMaxBorder(bottomBorder, l);
                    topBorder[l] = Math.min(topBorder[l], datum.y);
                    bottomBorder[l] = Math.max(bottomBorder[l], datum.y + datum.height);
                }

                renderedKeys[datum.index] = [datum.index, i];
                renderedWidgets[i] = child;
            }
            // 已存在的， 需要添加的和需要删除的
            var existSet = {}, addSet = {}, deleteArray = [];
            BI.each(renderedKeys, function (i, key) {
                if (self.renderedKeys[i]) {
                    existSet[i] = key;
                } else {
                    addSet[i] = key;
                }
            });
            BI.each(this.renderedKeys, function (i, key) {
                if (existSet[i]) {
                    return;
                }
                if (addSet[i]) {
                    return;
                }
                deleteArray.push(key[1]);
            });
            BI.each(deleteArray, function (i, index) {
                // 性能优化，不调用destroy方法防止触发destroy事件
                self.renderedCells[index].el._destroy();
            });
            var addedItems = [];
            BI.each(addSet, function (index, key) {
                addedItems.push(renderedCells[key[1]]);
            });
            this.container.addItems(addedItems);
            // 拦截父子级关系
            this.container._children = renderedWidgets;
            this.container.attr("items", renderedCells);
            this.renderedCells = renderedCells;
            this.renderedKeys = renderedKeys;

            // Todo 左右比较特殊
            var minX = BI.min(leftBorder);
            var maxX = BI.max(rightBorder);

            var minY = BI.max(topBorder);
            var maxY = BI.min(bottomBorder);

            this.renderRange = {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
        }
    },

    _getMaxScrollLeft: function () {
        return Math.max(0, this._width - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollTop: function () {
        return Math.max(0, this._height - this.options.height + (this.options.overflowY ? BI.DOM.getScrollWidth() : 0));
    },

    _populate: function (items) {
        var o = this.options;
        this._reRange();
        if (items && items !== this.options.items) {
            this.options.items = items;
            this._calculateSizeAndPositionData();
        }
        if (o.items.length > 0) {
            this.container.setWidth(this._width);
            this.container.setHeight(this._height);

            this._calculateChildrenToRender();
            // 元素未挂载时不能设置scrollTop
            try {
                this.element.scrollTop(o.scrollTop);
                this.element.scrollLeft(o.scrollLeft);
            } catch (e) {
            }
        }
    },

    setScrollLeft: function (scrollLeft) {
        if (this.options.scrollLeft === scrollLeft) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollLeft = BI.clamp(scrollLeft || 0, 0, this._getMaxScrollLeft());
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollLeft(this.options.scrollLeft);
    },

    setScrollTop: function (scrollTop) {
        if (this.options.scrollTop === scrollTop) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollTop = BI.clamp(scrollTop || 0, 0, this._getMaxScrollTop());
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollTop(this.options.scrollTop);
    },

    setOverflowX: function (b) {
        var self = this;
        if (this.options.overflowX !== !!b) {
            this.options.overflowX = !!b;
            BI.nextTick(function () {
                self.element.css({overflowX: b ? "auto" : "hidden"});
            });
        }
    },

    setOverflowY: function (b) {
        var self = this;
        if (this.options.overflowY !== !!b) {
            this.options.overflowY = !!b;
            BI.nextTick(function () {
                self.element.css({overflowY: b ? "auto" : "hidden"});
            });
        }
    },

    getScrollLeft: function () {
        return this.options.scrollLeft;
    },

    getScrollTop: function () {
        return this.options.scrollTop;
    },

    getMaxScrollLeft: function () {
        return this._getMaxScrollLeft();
    },

    getMaxScrollTop: function () {
        return this._getMaxScrollTop();
    },

    // 重新计算children
    _reRange: function () {
        this.renderRange = {};
    },

    _clearChildren: function () {
        this.container._children = {};
        this.container.attr("items", []);
    },

    restore: function () {
        BI.each(this.renderedCells, function (i, cell) {
            cell.el._destroy();
        });
        this._clearChildren();
        this.renderedCells = [];
        this.renderedKeys = [];
        this.renderRange = {};
        this._scrollLock = false;
    },

    populate: function (items) {
        if (items && items !== this.options.items) {
            this.restore();
        }
        this._populate(items);
    }
});
BI.CollectionView.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.collection_view", BI.CollectionView);/**
 * @class BI.Combo
 * @extends BI.Widget
 */
BI.Combo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.Combo.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-combo",
            trigger: "click",
            toggle: true,
            direction: "bottom", // top||bottom||left||right||top,left||top,right||bottom,left||bottom,right||right,innerRight||right,innerLeft||innerRight||innerLeft
            logic: {
                dynamic: true
            },
            container: null, // popupview放置的容器，默认为this.element
            isDefaultInit: false,
            destroyWhenHide: false,
            isNeedAdjustHeight: true, // 是否需要高度调整
            isNeedAdjustWidth: true,
            stopEvent: false,
            stopPropagation: false,
            adjustLength: 0, // 调整的距离
            adjustXOffset: 0,
            adjustYOffset: 0,
            hideChecker: BI.emptyFn,
            offsetStyle: "left", // left,right,center
            el: {},
            popup: {},
            comboClass: "bi-combo-popup",
            hoverClass: "bi-combo-hover"
        });
    },

    _init: function () {
        BI.Combo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._initCombo();
        this._initPullDownAction();
        this.combo.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self.isEnabled() && self.isValid()) {
                if (type === BI.Events.EXPAND) {
                    self._popupView();
                }
                if (type === BI.Events.COLLAPSE) {
                    self._hideView();
                }
                if (type === BI.Events.EXPAND) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.fireEvent(BI.Combo.EVENT_EXPAND);
                }
                if (type === BI.Events.COLLAPSE) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.isViewVisible() && self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                }
                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Combo.EVENT_TRIGGER_CHANGE, obj);
                }
            }
        });

        self.element.on("mouseenter." + self.getName(), function (e) {
            if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                self.element.addClass(o.hoverClass);
            }
        });
        self.element.on("mouseleave." + self.getName(), function (e) {
            if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                self.element.removeClass(o.hoverClass);
            }
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("vertical", BI.extend(o.logic, {
            items: [
                { el: this.combo }
            ]
        }))));
        o.isDefaultInit && (this._assertPopupView());
        BI.Resizers.add(this.getName(), BI.bind(function () {
            if (this.isViewVisible()) {
                this._hideView();
            }
        }, this));
    },

    _toggle: function () {
        this._assertPopupViewRender();
        if (this.popupView.isVisible()) {
            this._hideView();
        } else {
            if (this.isEnabled()) {
                this._popupView();
            }
        }
    },

    _initPullDownAction: function () {
        var self = this, o = this.options;
        var evs = (this.options.trigger || "").split(",");
        var st = function (e) {
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
        };

        var enterPopup = false;

        function hide () {
            if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid() && o.toggle === true) {
                self._hideView();
                self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.combo);
                self.fireEvent(BI.Combo.EVENT_COLLAPSE);
            }
            self.popupView && self.popupView.element.off("mouseenter." + self.getName()).off("mouseleave." + self.getName());
            enterPopup = false;
        }

        BI.each(evs, function (i, ev) {
            switch (ev) {
                case "hover":
                    self.element.on("mouseenter." + self.getName(), function (e) {
                        if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                            self._popupView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                            self.fireEvent(BI.Combo.EVENT_EXPAND);
                        }
                    });
                    self.element.on("mouseleave." + self.getName(), function (e) {
                        if (self.popupView) {
                            self.popupView.element.on("mouseenter." + self.getName(), function (e) {
                                enterPopup = true;
                                self.popupView.element.on("mouseleave." + self.getName(), function (e) {
                                    hide();
                                });
                                self.popupView.element.off("mouseenter." + self.getName());
                            });
                            BI.defer(function () {
                                if (!enterPopup) {
                                    hide();
                                }
                            }, 50);
                        }
                    });
                    break;
                case "click":
                    var debounce = BI.debounce(function (e) {
                        if (self.combo.element.__isMouseInBounds__(e)) {
                            if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                                // if (!o.toggle && self.isViewVisible()) {
                                //     return;
                                // }
                                o.toggle ? self._toggle() : self._popupView();
                                if (self.isViewVisible()) {
                                    self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                                    self.fireEvent(BI.Combo.EVENT_EXPAND);
                                } else {
                                    self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.combo);
                                    self.fireEvent(BI.Combo.EVENT_COLLAPSE);
                                }
                            }
                        }
                    }, BI.EVENT_RESPONSE_TIME, {
                        "leading": true,
                        "trailing": false
                    });
                    self.element.off(ev + "." + self.getName()).on(ev + "." + self.getName(), function (e) {
                        debounce(e);
                        st(e);
                    });
                    break;
                case "click-hover":
                    var debounce = BI.debounce(function (e) {
                        if (self.combo.element.__isMouseInBounds__(e)) {
                            if (self.isEnabled() && self.isValid() && self.combo.isEnabled() && self.combo.isValid()) {
                                // if (self.isViewVisible()) {
                                //     return;
                                // }
                                self._popupView();
                                if (self.isViewVisible()) {
                                    self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.combo);
                                    self.fireEvent(BI.Combo.EVENT_EXPAND);
                                }
                            }
                        }
                    }, BI.EVENT_RESPONSE_TIME, {
                        "leading": true,
                        "trailing": false
                    });
                    self.element.off("click." + self.getName()).on("click." + self.getName(), function (e) {
                        debounce(e);
                        st(e);
                    });
                    self.element.on("mouseleave." + self.getName(), function (e) {
                        if (self.popupView) {
                            self.popupView.element.on("mouseenter." + self.getName(), function (e) {
                                enterPopup = true;
                                self.popupView.element.on("mouseleave." + self.getName(), function (e) {
                                    hide();
                                });
                                self.popupView.element.off("mouseenter." + self.getName());
                            });
                            BI.defer(function () {
                                if (!enterPopup) {
                                    hide();
                                }
                            }, 50);
                        }
                    });
                    break;
            }
        });
    },

    _initCombo: function () {
        this.combo = BI.createWidget(this.options.el, {
            value: this.options.value
        });
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if (this.popupView == null) {
            this.popupView = BI.createWidget(this.options.popup, {
                type: "bi.popup_view",
                value: o.value
            }, this);
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (type === BI.Events.CLICK) {
                    self.combo.setValue(self.getValue());
                    self.fireEvent(BI.Combo.EVENT_CHANGE, value, obj);
                }
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            this.popupView.setVisible(false);
            BI.nextTick(function () {
                self.fireEvent(BI.Combo.EVENT_AFTER_INIT);
            });
        }
    },

    _assertPopupViewRender: function () {
        this._assertPopupView();
        if (!this._rendered) {
            BI.createWidget({
                type: "bi.vertical",
                scrolly: false,
                element: this.options.container || this,
                items: [
                    {el: this.popupView}
                ]
            });
            this._rendered = true;
        }
    },

    _hideIf: function (e) {
        // if (this.element.__isMouseInBounds__(e) || (this.popupView && this.popupView.element.__isMouseInBounds__(e))) {
        //     return;
        // }
        // BI-10290 公式combo双击公式内容会收起
        if ((this.element.find(e.target).length > 0)
            || (this.popupView && this.popupView.element.find(e.target).length > 0)
            || e.target.className === "CodeMirror-cursor" || BI.Widget._renderEngine.createElement(e.target).closest(".CodeMirror-hints").length > 0) {// BI-9887 CodeMirror的公式弹框需要特殊处理下
            var directions = this.options.direction.split(",");
            if (BI.contains(directions, "innerLeft") || BI.contains(directions, "innerRight")) {
                // popup可以出现的trigger内部的combo，滚动时不需要消失，而是调整位置
                this.adjustWidth();
                this.adjustHeight();
            }
            return;
        }
        var isHide = this.options.hideChecker.apply(this, [e]);
        if (isHide === false) {
            return;
        }
        this._hideView();
    },

    _hideView: function () {
        this.fireEvent(BI.Combo.EVENT_BEFORE_HIDEVIEW);
        if (this.options.destroyWhenHide === true) {
            this.popupView && this.popupView.destroy();
            this.popupView = null;
            this._rendered = false;
        } else {
            this.popupView && this.popupView.invisible();
        }
        this.element.removeClass(this.options.comboClass);

        BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
        this.fireEvent(BI.Combo.EVENT_AFTER_HIDEVIEW);
    },

    _popupView: function (e) {
        this._assertPopupViewRender();
        this.fireEvent(BI.Combo.EVENT_BEFORE_POPUPVIEW);

        this.popupView.visible();
        this.adjustWidth(e);
        this.adjustHeight(e);

        this.element.addClass(this.options.comboClass);
        BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName()).unbind("mousewheel." + this.getName());
        BI.Widget._renderEngine.createElement(document).bind("mousedown." + this.getName(), BI.bind(this._hideIf, this)).bind("mousewheel." + this.getName(), BI.bind(this._hideIf, this));
        this.fireEvent(BI.Combo.EVENT_AFTER_POPUPVIEW);
    },

    adjustWidth: function (e) {
        var o = this.options;
        if (!this.popupView) {
            return;
        }
        if (o.isNeedAdjustWidth === true) {
            this.resetListWidth("");
            var width = this.popupView.element.outerWidth();
            var maxW = this.element.outerWidth() || o.width;
            if (width > maxW + 80) {
                maxW = maxW + 80;
            } else if (width > maxW) {
                maxW = width;
            }
            this.resetListWidth(maxW < 100 ? 100 : maxW);
        }
    },

    adjustHeight: function (e) {
        var o = this.options, p = {};
        if (!this.popupView) {
            return;
        }
        var isVisible = this.popupView.isVisible();
        this.popupView.visible();
        var combo = BI.isNotNull(e) ? {
            element: {
                offset: function () {
                    return {
                        left: e.pageX,
                        top: e.pageY
                    };
                },
                bounds: function () {
                    // offset为其相对于父定位元素的偏移
                    return {
                        x: e.offsetX,
                        y: e.offsetY,
                        width: 0,
                        height: 24
                    };
                },
                outerWidth: function () {
                    return 0;
                },
                outerHeight: function () {
                    return 24;
                }
            }
        } : this.combo;
        switch (o.direction) {
            case "bottom":
            case "bottom,right":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["bottom", "top", "right", "left"], o.offsetStyle);
                break;
            case "top":
            case "top,right":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["top", "bottom", "right", "left"], o.offsetStyle);
                break;
            case "left":
            case "left,bottom":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["left", "right", "bottom", "top"], o.offsetStyle);
                break;
            case "right":
            case "right,bottom":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "bottom", "top"], o.offsetStyle);
                break;
            case "top,left":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["top", "bottom", "left", "right"], o.offsetStyle);
                break;
            case "bottom,left":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight, ["bottom", "top", "left", "right"], o.offsetStyle);
                break;
            case "left,top":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["left", "right", "top", "bottom"], o.offsetStyle);
                break;
            case "right,top":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "top", "bottom"], o.offsetStyle);
                break;
            case "right,innerRight":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "innerRight", "innerLeft", "bottom", "top"], o.offsetStyle);
                break;
            case "right,innerLeft":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["right", "left", "innerLeft", "innerRight", "bottom", "top"], o.offsetStyle);
                break;
            case "innerRight":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["innerRight", "innerLeft", "right", "left",  "bottom", "top"], o.offsetStyle);
                break;
            case "innerLeft":
                p = BI.DOM.getComboPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength, o.adjustYOffset, o.isNeedAdjustHeight, ["innerLeft", "innerRight", "left", "right",  "bottom", "top"], o.offsetStyle);
                break;
            case "top,custom":
            case "custom,top":
                p = BI.DOM.getTopAdaptPosition(combo, this.popupView, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight);
                break;
            case "custom,bottom":
            case "bottom,custom":
                p = BI.DOM.getBottomAdaptPosition(combo, this.popupView, o.adjustYOffset || o.adjustLength, o.isNeedAdjustHeight);
                break;
            case "left,custom":
            case "custom,left":
                p = BI.DOM.getLeftAdaptPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength);
                delete p.top;
                delete p.adaptHeight;
                break;
            case "custom,right":
            case "right,custom":
                p = BI.DOM.getRightAdaptPosition(combo, this.popupView, o.adjustXOffset || o.adjustLength);
                delete p.top;
                delete p.adaptHeight;
                break;
        }

        if ("adaptHeight" in p) {
            this.resetListHeight(p["adaptHeight"]);
        }
        if ("left" in p) {
            this.popupView.element.css({
                left: p.left
            });
        }
        if ("top" in p) {
            this.popupView.element.css({
                top: p.top
            });
        }
        this.position = p;
        this.popupView.setVisible(isVisible);
    },

    resetListHeight: function (h) {
        this._assertPopupView();
        this.popupView.resetHeight && this.popupView.resetHeight(h);
    },

    resetListWidth: function (w) {
        this._assertPopupView();
        this.popupView.resetWidth && this.popupView.resetWidth(w);
    },

    populate: function (items) {
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        this.combo.populate.apply(this.combo, arguments);
    },

    _setEnable: function (arg) {
        BI.Combo.superclass._setEnable.apply(this, arguments);
        if (arg === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (arg === false) {
            this.element.addClass("base-disabled disabled");
        }
        !arg && this.element.removeClass(this.options.hoverClass);
        !arg && this.isViewVisible() && this._hideView();
    },

    setValue: function (v) {
        this.combo.setValue(v);
        if (BI.isNull(this.popupView)) {
            this.options.popup.value = v;
        } else {
            this.popupView.setValue(v);
        }
    },

    getValue: function () {
        if (BI.isNull(this.popupView)) {
            return this.options.popup.value;
        } else {
            return this.popupView.getValue();
        }
    },

    isViewVisible: function () {
        return this.isEnabled() && this.combo.isEnabled() && !!this.popupView && this.popupView.isVisible();
    },

    showView: function (e) {
        // 减少popup 调整宽高的次数
        if (this.isEnabled() && this.combo.isEnabled() && !this.isViewVisible()) {
            this._popupView(e);
        }
    },

    hideView: function () {
        this._hideView();
    },

    getView: function () {
        return this.popupView;
    },

    getPopupPosition: function () {
        return this.position;
    },

    toggle: function () {
        this._toggle();
    },

    destroyed: function () {
        BI.Widget._renderEngine.createElement(document).unbind("mousedown." + this.getName())
            .unbind("mousewheel." + this.getName())
            .unbind("mouseenter." + this.getName())
            .unbind("mousemove." + this.getName())
            .unbind("mouseleave." + this.getName());
        BI.Resizers.remove(this.getName());
        this.popupView && this.popupView._destroy();
    }
});
BI.Combo.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.Combo.EVENT_CHANGE = "EVENT_CHANGE";
BI.Combo.EVENT_EXPAND = "EVENT_EXPAND";
BI.Combo.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.Combo.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.Combo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.Combo.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.Combo.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.Combo.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

BI.shortcut("bi.combo", BI.Combo);/**
 *
 * 某个可以展开的节点
 *
 * Created by GUY on 2015/9/10.
 * @class BI.Expander
 * @extends BI.Widget
 */
BI.Expander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Expander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-expander",
            trigger: "click",
            toggle: true,
            // direction: "bottom", //top,bottom四个方向
            isDefaultInit: false, // 是否默认初始化子节点
            el: {},
            popup: {},
            expanderClass: "bi-expander-popup",
            hoverClass: "bi-expander-hover"
        });
    },

    _init: function () {
        BI.Expander.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._expanded = !!o.el.open;
        this._initExpander();
        this._initPullDownAction();
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self.isEnabled() && self.isValid()) {
                if (type === BI.Events.EXPAND) {
                    self._popupView();
                }
                if (type === BI.Events.COLLAPSE) {
                    self._hideView();
                }
                if (type === BI.Events.EXPAND) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.fireEvent(BI.Expander.EVENT_EXPAND);
                }
                if (type === BI.Events.COLLAPSE) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.isViewVisible() && self.fireEvent(BI.Expander.EVENT_COLLAPSE);
                }
                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Expander.EVENT_TRIGGER_CHANGE, value, obj);
                }
            }
        });

        this.element.hover(function () {
            if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                self.element.addClass(o.hoverClass);
            }
        }, function () {
            if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                self.element.removeClass(o.hoverClass);
            }
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [
                {el: this.expander}
            ]
        });
        o.isDefaultInit && this._assertPopupView();
        if (this.expander.isOpened() === true) {
            this._popupView();
        }
    },

    _toggle: function () {
        this._assertPopupViewRender();
        if (this.popupView.isVisible()) {
            this._hideView();
        } else {
            if (this.isEnabled()) {
                this._popupView();
            }
        }
    },

    _initPullDownAction: function () {
        var self = this, o = this.options;
        var evs = this.options.trigger.split(",");
        BI.each(evs, function (i, e) {
            switch (e) {
                case "hover":
                    self.element[e](function (e) {
                        if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                            self._popupView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.expander);
                            self.fireEvent(BI.Expander.EVENT_EXPAND);
                        }
                    }, function () {
                        if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid() && o.toggle) {
                            self._hideView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.expander);
                            self.fireEvent(BI.Expander.EVENT_COLLAPSE);
                        }
                    });
                    break;
                case "click":
                    if (e) {
                        self.element.off(e + "." + self.getName()).on(e + "." + self.getName(), BI.debounce(function (e) {
                            if (self.expander.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.isValid() && self.expander.isEnabled() && self.expander.isValid()) {
                                    o.toggle ? self._toggle() : self._popupView();
                                    if (self.isExpanded()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.expander);
                                        self.fireEvent(BI.Expander.EVENT_EXPAND);
                                    } else {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.expander);
                                        self.fireEvent(BI.Expander.EVENT_COLLAPSE);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, {
                            "leading": true,
                            "trailing": false
                        }));
                    }
                    break;
            }
        });
    },

    _initExpander: function () {
        this.expander = BI.createWidget(this.options.el);
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if (this.popupView == null) {
            this.popupView = BI.createWidget(this.options.popup, {
                type: "bi.button_group",
                cls: "expander-popup",
                layouts: [{
                    type: "bi.vertical",
                    hgap: 0,
                    vgap: 0
                }],
                value: o.value
            }, this);
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    // self.setValue(self.getValue());
                    self.fireEvent(BI.Expander.EVENT_CHANGE, value, obj);
                }
            });
            this.popupView.setVisible(this.isExpanded());
            BI.nextTick(function () {
                self.fireEvent(BI.Expander.EVENT_AFTER_INIT);
            });
        }
    },

    _assertPopupViewRender: function () {
        this._assertPopupView();
        if (!this._rendered) {
            BI.createWidget({
                type: "bi.vertical",
                scrolly: false,
                element: this,
                items: [
                    {el: this.popupView}
                ]
            });
            this._rendered = true;
        }
    },

    _hideView: function () {
        this.fireEvent(BI.Expander.EVENT_BEFORE_HIDEVIEW);
        this._expanded = false;
        this.expander.setOpened(false);
        this.popupView && this.popupView.invisible();
        this.element.removeClass(this.options.expanderClass);

        this.fireEvent(BI.Expander.EVENT_AFTER_HIDEVIEW);
    },

    _popupView: function () {
        this._assertPopupViewRender();
        this.fireEvent(BI.Expander.EVENT_BEFORE_POPUPVIEW);
        this._expanded = true;
        this.expander.setOpened(true);
        this.popupView.visible();
        this.element.addClass(this.options.expanderClass);
        this.fireEvent(BI.Expander.EVENT_AFTER_POPUPVIEW);
    },

    populate: function (items) {
        // this._assertPopupView();
        this.popupView && this.popupView.populate.apply(this.popupView, arguments);
        this.expander.populate.apply(this.expander, arguments);
    },

    _setEnable: function (arg) {
        BI.Expander.superclass._setEnable.apply(this, arguments);
        !arg && this.element.removeClass(this.options.hoverClass);
        !arg && this.isViewVisible() && this._hideView();
    },

    setValue: function (v) {
        this.expander.setValue(v);
        if (BI.isNull(this.popupView)) {
            this.options.popup.value = v;
        } else {
            this.popupView.setValue(v);
        }
    },

    getValue: function () {
        if (BI.isNull(this.popupView)) {
            return this.options.popup.value;
        } else {
            return this.popupView.getValue();
        }
    },

    isViewVisible: function () {
        return this.isEnabled() && this.expander.isEnabled() && !!this.popupView && this.popupView.isVisible();
    },

    isExpanded: function () {
        return this._expanded;
    },

    showView: function () {
        if (this.isEnabled() && this.expander.isEnabled()) {
            this._popupView();
        }
    },

    hideView: function () {
        this._hideView();
    },

    getView: function () {
        return this.popupView;
    },

    getAllLeaves: function () {
        return this.popupView && this.popupView.getAllLeaves();
    },

    getNodeById: function (id) {
        if (this.expander.options.id === id) {
            return this.expander;
        }
        return this.popupView && this.popupView.getNodeById(id);
    },

    getNodeByValue: function (value) {
        if (this.expander.getValue() === value) {
            return this.expander;
        }
        return this.popupView && this.popupView.getNodeByValue(value);
    },

    destroy: function () {
        BI.Expander.superclass.destroy.apply(this, arguments);
    }
});
BI.Expander.EVENT_EXPAND = "EVENT_EXPAND";
BI.Expander.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.Expander.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.Expander.EVENT_CHANGE = "EVENT_CHANGE";
BI.Expander.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.Expander.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.Expander.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.Expander.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.Expander.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

BI.shortcut("bi.expander", BI.Expander);/**
 * Created by GUY on 2015/8/10.
 */

BI.ComboGroup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ComboGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-combo-group bi-list-item",

            // 以下这些属性对每一个combo都是公用的
            trigger: "click,hover",
            direction: "right",
            adjustLength: 0,
            isDefaultInit: false,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,

            el: {type: "bi.text_button", text: "", value: ""},
            children: [],

            popup: {
                el: {
                    type: "bi.button_tree",
                    chooseType: 0,
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            }
        });
    },

    _init: function () {
        BI.ComboGroup.superclass._init.apply(this, arguments);
        this._populate(this.options.el);
    },

    _populate: function (item) {
        var self = this, o = this.options;
        var children = o.children;
        if (BI.isEmpty(children)) {
            throw new Error("ComboGroup构造错误");
        }
        BI.each(children, function (i, ch) {
            var son = BI.formatEL(ch).el.children;
            ch = BI.formatEL(ch).el;
            if (!BI.isEmpty(son)) {
                ch.el = BI.clone(ch);
                ch.children = son;
                ch.type = "bi.combo_group";
                ch.action = o.action;
                ch.height = o.height;
                ch.direction = o.direction;
                ch.isDefaultInit = o.isDefaultInit;
                ch.isNeedAdjustHeight = o.isNeedAdjustHeight;
                ch.isNeedAdjustWidth = o.isNeedAdjustWidth;
                ch.adjustLength = o.adjustLength;
                ch.popup = o.popup;
            }
        });
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            height: o.height,
            trigger: o.trigger,
            direction: o.direction,
            isDefaultInit: o.isDefaultInit,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            isNeedAdjustHeight: o.isNeedAdjustHeight,
            adjustLength: o.adjustLength,
            el: item,
            popup: BI.extend({}, o.popup, {
                el: BI.extend({
                    items: children
                }, o.popup.el)
            })
        });
        this.combo.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.ComboGroup.EVENT_CHANGE, obj);
            }
        });
    },

    getValue: function () {
        return this.combo.getValue();
    },

    setValue: function (v) {
        this.combo.setValue(v);
    }
});
BI.ComboGroup.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.combo_group", BI.ComboGroup);BI.VirtualGroup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.VirtualGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-virtual-group",
            items: [],
            layouts: [{
                type: "bi.center",
                hgap: 0,
                vgap: 0
            }]
        });
    },

    render: function () {
        var o = this.options;
        this.populate(o.items);
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    _packageBtns: function (items) {
        var o = this.options;
        var map = this.buttonMap = {};
        for (var i = o.layouts.length - 1; i > 0; i--) {
            items = BI.map(items, function (k, it) {
                var el = BI.stripEL(it);
                return BI.extend({}, o.layouts[i], {
                    items: [
                        BI.extend({}, o.layouts[i].el, {
                            el: BI.extend({
                                ref: function (_ref) {
                                    if (BI.isKey(map[el.value])) {
                                        map[el.value] = _ref;
                                    }
                                }
                            }, el)
                        })
                    ]
                });
            });
        }
        return items;
    },

    _packageLayout: function (items) {
        var o = this.options, layout = BI.deepClone(o.layouts[0]);

        var lay = BI.formatEL(layout).el;
        while (lay && lay.items && !BI.isEmpty(lay.items)) {
            lay = BI.formatEL(lay.items[0]).el;
        }
        lay.items = items;
        return layout;
    },

    addItems: function (items) {
        this.layouts.addItems(items);
    },

    prependItems: function (items) {
        this.layouts.prependItems(items);
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttonMap, function (key, item) {
            if (item) {
                if (v.deepContains(key)) {
                    item.setSelected && item.setSelected(true);
                } else {
                    item.setSelected && item.setSelected(false);
                }
            }
        });
    },

    getNotSelectedValue: function () {
        var v = [];
        BI.each(this.buttonMap, function (i, item) {
            if (item) {
                if (item.isEnabled() && !(item.isSelected && item.isSelected())) {
                    v.push(item.getValue());
                }
            }
        });
        return v;
    },

    getValue: function () {
        var v = [];
        BI.each(this.buttonMap, function (i, item) {
            if (item) {
                if (item.isEnabled() && item.isSelected && item.isSelected()) {
                    v.push(item.getValue());
                }
            }
        });
        return v;
    },

    populate: function (items) {
        var self = this;
        items = items || [];
        this.options.items = items;
        items = this._packageBtns(items);
        if (!this.layouts) {
            this.layouts = BI.createWidget(BI.extend({element: this}, this._packageLayout(items)));
        } else {
            this.layouts.populate(items);
        }
    }
});
BI.VirtualGroup.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.virtual_group", BI.VirtualGroup);/**
 * 加载控件
 *
 * Created by GUY on 2015/8/31.
 * @class BI.Loader
 * @extends BI.Widget
 */
BI.Loader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Loader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-loader",

            direction: "top",
            isDefaultInit: true, // 是否默认初始化数据
            logic: {
                dynamic: true,
                scrolly: true
            },

            // 下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            // 下面是分页信息
            count: false,
            prev: false,
            next: {},
            hasPrev: BI.emptyFn,
            hasNext: BI.emptyFn
        });
    },

    _prevLoad: function () {
        var self = this, o = this.options;
        this.prev.setLoading();
        o.itemsCreator.apply(this, [{times: --this.times}, function () {
            self.prev.setLoaded();
            self.prependItems.apply(self, arguments);
        }]);
    },

    _nextLoad: function () {
        var self = this, o = this.options;
        this.next.setLoading();
        o.itemsCreator.apply(this, [{times: ++this.times}, function () {
            self.next.setLoaded();
            self.addItems.apply(self, arguments);
        }]);
    },

    _init: function () {
        BI.Loader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (o.itemsCreator === false) {
            o.prev = false;
            o.next = false;
        }
        if (o.prev !== false) {
            this.prev = BI.createWidget(BI.extend({
                type: "bi.loading_bar"
            }, o.prev));
            this.prev.on(BI.Controller.EVENT_CHANGE, function (type) {
                if (type === BI.Events.CLICK) {
                    self._prevLoad();
                }
            });
        }

        this.button_group = BI.createWidget(o.el, {
            type: "bi.button_group",
            chooseType: 0,
            items: o.items,
            behaviors: {},
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.Loader.EVENT_CHANGE, obj);
            }
        });

        if (o.next !== false) {
            this.next = BI.createWidget(BI.extend({
                type: "bi.loading_bar"
            }, o.next));
            this.next.on(BI.Controller.EVENT_CHANGE, function (type) {
                if (type === BI.Events.CLICK) {
                    self._nextLoad();
                }
            });
        }

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({
            scrolly: true
        }, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.prev, this.button_group, this.next)
        }))));

        o.isDefaultInit && BI.isEmpty(o.items) && BI.nextTick(BI.bind(function () {
            o.isDefaultInit && BI.isEmpty(o.items) && this._populate();
        }, this));
        if (BI.isNotEmptyArray(o.items)) {
            this._populate(o.items);
        }
    },

    hasPrev: function () {
        var o = this.options;
        if (BI.isNumber(o.count)) {
            return this.count < o.count;
        }
        return !!o.hasPrev.apply(this, [{
            times: this.times,
            count: this.count
        }]);
    },

    hasNext: function () {
        var o = this.options;
        if (BI.isNumber(o.count)) {
            return this.count < o.count;
        }
        return !!o.hasNext.apply(this, [{
            times: this.times,
            count: this.count
        }]);
    },

    prependItems: function (items) {
        this.count += items.length;
        if (this.next !== false) {
            if (this.hasPrev()) {
                this.options.items = this.options.items.concat(items);
                this.prev.setLoaded();
            } else {
                this.prev.setEnd();
            }
        }
        this.button_group.prependItems.apply(this.button_group, arguments);
    },

    addItems: function (items) {
        this.count += items.length;
        if (BI.isObject(this.next)) {
            if (this.hasNext()) {
                this.options.items = this.options.items.concat(items);
                this.next.setLoaded();
            } else {
                this.next.setEnd();
            }
        }
        this.button_group.addItems.apply(this.button_group, arguments);
    },


    _populate: function (items) {
        var self = this, o = this.options;
        if (arguments.length === 0 && (BI.isFunction(o.itemsCreator))) {
            o.itemsCreator.apply(this, [{times: 1}, function () {
                if (arguments.length === 0) {
                    throw new Error("arguments can not be null!!!");
                }
                self.populate.apply(self, arguments);
                o.onLoaded();
            }]);
            return false;
        }
        this.options.items = items;
        this.times = 1;
        this.count = 0;
        this.count += items.length;
        if (BI.isObject(this.next)) {
            if (this.hasNext()) {
                this.next.setLoaded();
            } else {
                this.next.invisible();
            }
        }
        if (BI.isObject(this.prev)) {
            if (this.hasPrev()) {
                this.prev.setLoaded();
            } else {
                this.prev.invisible();
            }
        }
        return true;
    },

    populate: function () {
        this._populate.apply(this, arguments) && this.button_group.populate.apply(this.button_group, arguments);
    },

    setNotSelectedValue: function () {
        this.button_group.setNotSelectedValue.apply(this.button_group, arguments);
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    setValue: function () {
        this.button_group.setValue.apply(this.button_group, arguments);
    },

    getValue: function () {
        return this.button_group.getValue.apply(this.button_group, arguments);
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.button_group.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.button_group.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.button_group.getNodeByValue(value);
    },

    empty: function () {
        this.button_group.empty();
        BI.each([this.prev, this.next], function (i, ob) {
            ob && ob.setVisible(false);
        });
    },

    destroy: function () {
        BI.Loader.superclass.destroy.apply(this, arguments);
    }
});
BI.Loader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.loader", BI.Loader);/**
 * Created by GUY on 2015/6/26.
 */

BI.Navigation = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Navigation.superclass._defaultConfig.apply(this, arguments), {
            direction: "bottom", // top, bottom, left, right, custom
            logic: {
                dynamic: false
            },
            single: false,
            showIndex: false,
            tab: false,
            cardCreator: function (v) {
                return BI.createWidget();
            },

            afterCardCreated: BI.emptyFn,
            afterCardShow: BI.emptyFn
        });
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
        if (o.showIndex !== false) {
            this.setSelect(o.showIndex);
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
        this._assertCard(v);
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

BI.shortcut("bi.navigation", BI.Navigation);/**
 * 搜索逻辑控件
 *
 * Created by GUY on 2015/9/28.
 * @class BI.Searcher
 * @extends BI.Widget
 */

BI.Searcher = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Searcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-searcher",
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0,
            hgap: 0,

            isDefaultInit: false,
            isAutoSearch: true, // 是否自动搜索
            isAutoSync: true, // 是否自动同步数据, 即是否保持搜索面板和adapter面板状态值的统一
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,

            // isAutoSearch为false时启用
            onSearch: function (op, callback) {
                callback([]);
            },

            el: {
                type: "bi.search_editor"
            },

            popup: {
                type: "bi.searcher_view"
            },

            adapter: null,
            masker: { // masker层
                offset: {}
            }
        });
    },

    _init: function () {
        BI.Searcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.editor = BI.createWidget(o.el, {
            type: "bi.search_editor"
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap,
            items: [this.editor]
        });
        o.isDefaultInit && (this._assertPopupView());

        var search = BI.debounce(BI.bind(this._search, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function (type) {
            switch (type) {
                case BI.Events.STARTEDIT:
                    self._startSearch();
                    break;
                case BI.Events.EMPTY:
                    self._stopSearch();
                    break;
                case BI.Events.CHANGE:
                    search();
                    break;
                case BI.Events.PAUSE:
                    self._pauseSearch();
                    break;
            }
        });
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if ((o.masker && !BI.Maskers.has(this.getName())) || (o.masker === false && !this.popupView)) {
            this.popupView = BI.createWidget(o.popup, {
                type: "bi.searcher_view",
                chooseType: o.chooseType
            });
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    if (o.isAutoSync) {
                        var values = o.adapter && o.adapter.getValue();
                        if (!obj.isSelected()) {
                            o.adapter && o.adapter.setValue(BI.deepWithout(values, obj.getValue()));
                        } else {
                            switch (o.chooseType) {
                                case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                                    o.adapter && o.adapter.setValue([obj.getValue()]);
                                    break;
                                case BI.ButtonGroup.CHOOSE_TYPE_MULTI:
                                    values.push(obj.getValue());
                                    o.adapter && o.adapter.setValue(values);
                                    break;
                            }
                        }
                    }
                    self.fireEvent(BI.Searcher.EVENT_CHANGE, value, obj);
                }
            });
            BI.nextTick(function () {
                self.fireEvent(BI.Searcher.EVENT_AFTER_INIT);
            });
        }
        if (o.masker && !BI.Maskers.has(this.getName())) {
            BI.Maskers.create(this.getName(), o.adapter, BI.extend({
                container: this,
                render: this.popupView
            }, o.masker), this);
        }
    },

    _startSearch: function () {
        this._assertPopupView();
        this._stop = false;
        this._isSearching = true;
        this.fireEvent(BI.Searcher.EVENT_START);
        this.popupView.startSearch && this.popupView.startSearch();
        // 搜索前先清空dom
        // BI.Maskers.get(this.getName()).empty();
        BI.nextTick(function (name) {
            BI.Maskers.show(name);
        }, this.getName());
    },

    _pauseSearch: function () {
        var o = this.options, name = this.getName();
        this._stop = true;
        BI.nextTick(function (name) {
            BI.Maskers.hide(name);
        }, this.getName());
        if (this._isSearching === true) {
            this.popupView && this.popupView.pauseSearch && this.popupView.pauseSearch();
            this.fireEvent(BI.Searcher.EVENT_PAUSE);
        }
        this._isSearching = false;
    },

    _stopSearch: function () {
        var o = this.options, name = this.getName();
        this._stop = true;
        BI.Maskers.hide(name);
        if (this._isSearching === true) {
            this.popupView && this.popupView.stopSearch && this.popupView.stopSearch();
            this.fireEvent(BI.Searcher.EVENT_STOP);
        }
        this._isSearching = false;
    },

    _search: function () {
        var self = this, o = this.options, keyword = this._getLastSearchKeyword();
        if (keyword === "" || this._stop) {
            return;
        }
        if (o.isAutoSearch) {
            var items = (o.adapter && ((o.adapter.getItems && o.adapter.getItems()) || o.adapter.attr("items"))) || [];
            var finding = BI.Func.getSearchResult(items, keyword);
            var match = finding.match, find = finding.find;
            this.popupView.populate(find, match, keyword);
            o.isAutoSync && o.adapter && o.adapter.getValue && this.popupView.setValue(o.adapter.getValue());
            self.fireEvent(BI.Searcher.EVENT_SEARCHING);
            return;
        }
        this.popupView.loading && this.popupView.loading();
        o.onSearch({
            times: 1,
            keyword: keyword,
            selectedValues: o.adapter && o.adapter.getValue()
        }, function (searchResult, matchResult) {
            if (!self._stop) {
                var args = [].slice.call(arguments);
                if (args.length > 0) {
                    args.push(keyword);
                }
                BI.Maskers.show(self.getName());
                self.popupView.populate.apply(self.popupView, args);
                o.isAutoSync && o.adapter && o.adapter.getValue && self.popupView.setValue(o.adapter.getValue());
                self.popupView.loaded && self.popupView.loaded();
                self.fireEvent(BI.Searcher.EVENT_SEARCHING);
            }
        });
    },

    _getLastSearchKeyword: function () {
        if (this.isValid()) {
            var res = this.editor.getValue().match(/[\S]+/g);
            return BI.isNull(res) ? "" : res[res.length - 1];
        }
    },

    setAdapter: function (adapter) {
        this.options.adapter = adapter;
        BI.Maskers.remove(this.getName());
    },

    doSearch: function () {
        if (this.isSearching()) {
            this._search();
        }
    },

    stopSearch: function () {
        this._stopSearch();// 先停止搜索，然后再去设置editor为空
        // important:停止搜索必须退出编辑状态,这里必须加上try(input框不显示时blur会抛异常)
        try {
            this.editor.blur();
        } catch (e) {
            if (!this.editor.blur) {
                throw new Error("editor没有实现blur方法");
            }
        } finally {
            this.editor.setValue("");
        }
    },

    isSearching: function () {
        return this._isSearching;
    },

    isViewVisible: function () {
        return this.editor.isEnabled() && BI.Maskers.isVisible(this.getName());
    },

    getView: function () {
        return this.popupView;
    },

    hasMatched: function () {
        this._assertPopupView();
        return this.popupView.hasMatched();
    },

    adjustHeight: function () {
        if (BI.Maskers.has(this.getName()) && BI.Maskers.get(this.getName()).isVisible()) {
            BI.Maskers.show(this.getName());
        }
    },

    adjustView: function () {
        this.isViewVisible() && BI.Maskers.show(this.getName());
    },

    setValue: function (v) {
        if (BI.isNull(this.popupView)) {
            this.options.popup.value = v;
        } else {
            this.popupView.setValue(v);
        }
    },

    getKeyword: function () {
        return this._getLastSearchKeyword();
    },

    getKeywords: function () {
        return this.editor.getKeywords();
    },

    getValue: function () {
        var o = this.options;
        if (o.isAutoSync && o.adapter && o.adapter.getValue) {
            return o.adapter.getValue();
        }
        if (this.isSearching()) {
            return this.popupView.getValue();
        } else if (o.adapter && o.adapter.getValue) {
            return o.adapter.getValue();
        }
        if (BI.isNull(this.popupView)) {
            return o.popup.value;
        }
        return this.popupView.getValue();

    },

    populate: function (result, searchResult, keyword) {
        var o = this.options;
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        if (o.isAutoSync && o.adapter && o.adapter.getValue) {
            this.popupView.setValue(o.adapter.getValue());
        }
    },

    empty: function () {
        this.popupView && this.popupView.empty();
    },

    destroyed: function () {
        BI.Maskers.remove(this.getName());
    }
});
BI.Searcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.Searcher.EVENT_START = "EVENT_START";
BI.Searcher.EVENT_STOP = "EVENT_STOP";
BI.Searcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.Searcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.Searcher.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";

BI.shortcut("bi.searcher", BI.Searcher);/**
 *
 * 切换显示或隐藏面板
 *
 * Created by GUY on 2015/11/2.
 * @class BI.Switcher
 * @extends BI.Widget
 */
BI.Switcher = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Switcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-switcher",
            direction: BI.Direction.Top,
            trigger: "click",
            toggle: true,
            el: {},
            popup: {},
            adapter: null,
            masker: {},
            switcherClass: "bi-switcher-popup",
            hoverClass: "bi-switcher-hover"
        });
    },

    _init: function () {
        BI.Switcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._initSwitcher();
        this._initPullDownAction();
        this.switcher.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self.isEnabled() && self.isValid()) {
                if (type === BI.Events.EXPAND) {
                    self._popupView();
                }
                if (type === BI.Events.COLLAPSE) {
                    self._hideView();
                }
                if (type === BI.Events.EXPAND) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.fireEvent(BI.Switcher.EVENT_EXPAND);
                }
                if (type === BI.Events.COLLAPSE) {
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                    self.isViewVisible() && self.fireEvent(BI.Switcher.EVENT_COLLAPSE);
                }
                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Switcher.EVENT_TRIGGER_CHANGE, value, obj);
                }
            }
        });

        this.element.hover(function () {
            if (self.isEnabled() && self.switcher.isEnabled()) {
                self.element.addClass(o.hoverClass);
            }
        }, function () {
            if (self.isEnabled() && self.switcher.isEnabled()) {
                self.element.removeClass(o.hoverClass);
            }
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [
                {el: this.switcher}
            ]
        });
        o.isDefaultInit && (this._assertPopupView());
    },

    _toggle: function () {
        this._assertPopupView();
        if (this.isExpanded()) {
            this._hideView();
        } else {
            if (this.isEnabled()) {
                this._popupView();
            }
        }
    },

    _initPullDownAction: function () {
        var self = this, o = this.options;
        var evs = this.options.trigger.split(",");
        BI.each(evs, function (i, e) {
            switch (e) {
                case "hover":
                    self.element[e](function (e) {
                        if (self.isEnabled() && self.switcher.isEnabled()) {
                            self._popupView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.switcher);
                            self.fireEvent(BI.Switcher.EVENT_EXPAND);
                        }
                    }, function () {
                        if (self.isEnabled() && self.switcher.isEnabled() && o.toggle) {
                            self._hideView();
                            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.switcher);
                            self.fireEvent(BI.Switcher.EVENT_COLLAPSE);
                        }
                    });
                    break;
                default :
                    if (e) {
                        self.element.off(e + "." + self.getName()).on(e + "." + self.getName(), BI.debounce(function (e) {
                            if (self.switcher.element.__isMouseInBounds__(e)) {
                                if (self.isEnabled() && self.switcher.isEnabled()) {
                                    o.toggle ? self._toggle() : self._popupView();
                                    if (self.isExpanded()) {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EXPAND, "", self.switcher);
                                        self.fireEvent(BI.Switcher.EVENT_EXPAND);
                                    } else {
                                        self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.COLLAPSE, "", self.switcher);
                                        self.fireEvent(BI.Switcher.EVENT_COLLAPSE);
                                    }
                                }
                            }
                        }, BI.EVENT_RESPONSE_TIME, {
                            "leading": true,
                            "trailing": false
                        }));
                    }
                    break;
            }
        });
    },

    _initSwitcher: function () {
        this.switcher = BI.createWidget(this.options.el, {
            value: this.options.value
        });
    },

    _assertPopupView: function () {
        var self = this, o = this.options;
        if (!this._created) {
            this.popupView = BI.createWidget(o.popup, {
                type: "bi.button_group",
                element: o.adapter && BI.Maskers.create(this.getName(), o.adapter, BI.extend({container: this}, o.masker)),
                cls: "switcher-popup",
                layouts: [{
                    type: "bi.vertical",
                    hgap: 0,
                    vgap: 0
                }],
                value: o.value
            }, this);
            this.popupView.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                if (type === BI.Events.CLICK) {
                    self.fireEvent(BI.Switcher.EVENT_CHANGE, value, obj);
                }
            });
            if (o.direction !== BI.Direction.Custom && !o.adapter) {
                BI.createWidget({
                    type: "bi.vertical",
                    scrolly: false,
                    element: this,
                    items: [
                        {el: this.popupView}
                    ]
                });
            }
            this._created = true;
            BI.nextTick(function () {
                self.fireEvent(BI.Switcher.EVENT_AFTER_INIT);
            });
        }
    },

    _hideView: function () {
        this.fireEvent(BI.Switcher.EVENT_BEFORE_HIDEVIEW);
        var self = this, o = this.options;
        o.adapter ? BI.Maskers.hide(self.getName()) : (self.popupView && self.popupView.setVisible(false));
        BI.nextTick(function () {
            o.adapter ? BI.Maskers.hide(self.getName()) : (self.popupView && self.popupView.setVisible(false));
            self.element.removeClass(o.switcherClass);
            self.fireEvent(BI.Switcher.EVENT_AFTER_HIDEVIEW);
        });
    },

    _popupView: function () {
        var self = this, o = this.options;
        this._assertPopupView();
        this.fireEvent(BI.Switcher.EVENT_BEFORE_POPUPVIEW);
        o.adapter ? BI.Maskers.show(this.getName()) : self.popupView.setVisible(true);
        BI.nextTick(function (name) {
            o.adapter ? BI.Maskers.show(name) : self.popupView.setVisible(true);
            self.element.addClass(o.switcherClass);
            self.fireEvent(BI.Switcher.EVENT_AFTER_POPUPVIEW);
        }, this.getName());
    },

    populate: function (items) {
        this._assertPopupView();
        this.popupView.populate.apply(this.popupView, arguments);
        this.switcher.populate.apply(this.switcher, arguments);
    },

    _setEnable: function (arg) {
        BI.Switcher.superclass._setEnable.apply(this, arguments);
        !arg && this.isViewVisible() && this._hideView();
    },

    setValue: function (v) {
        this.switcher.setValue(v);
        if (BI.isNull(this.popupView)) {
            this.options.popup.value = v;
        } else {
            this.popupView.setValue(v);
        }
    },

    getValue: function () {
        if (BI.isNull(this.popupView)) {
            return this.options.popup.value;
        } else {
            return this.popupView.getValue();
        }
    },

    setAdapter: function (adapter) {
        this.options.adapter = adapter;
        BI.Maskers.remove(this.getName());
    },

    isViewVisible: function () {
        return this.isEnabled() && this.switcher.isEnabled() &&
            (this.options.adapter ? BI.Maskers.isVisible(this.getName()) : (this.popupView && this.popupView.isVisible()));
    },

    isExpanded: function () {
        return this.isViewVisible();
    },

    showView: function () {
        if (this.isEnabled() && this.switcher.isEnabled()) {
            this._popupView();
        }
    },

    hideView: function () {
        this._hideView();
    },

    getView: function () {
        return this.popupView;
    },

    adjustView: function () {
        this.isViewVisible() && BI.Maskers.show(this.getName());
    },

    getAllLeaves: function () {
        return this.popupView && this.popupView.getAllLeaves();
    },

    getNodeById: function (id) {
        if (this.switcher.attr("id") === id) {
            return this.switcher;
        }
        return this.popupView && this.popupView.getNodeById(id);
    },

    getNodeByValue: function (value) {
        if (this.switcher.getValue() === value) {
            return this.switcher;
        }
        return this.popupView && this.popupView.getNodeByValue(value);
    },

    empty: function () {
        this.popupView && this.popupView.empty();
    }
});
BI.Switcher.EVENT_EXPAND = "EVENT_EXPAND";
BI.Switcher.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.Switcher.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.Switcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.Switcher.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.Switcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.Switcher.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.Switcher.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.Switcher.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";

BI.shortcut("bi.switcher", BI.Switcher);/**
 * Created by GUY on 2015/6/26.
 */

BI.Tab = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Tab.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tab",
            direction: "top", // top, bottom, left, right, custom
            single: false, // 是不是单页面
            logic: {
                dynamic: false
            },
            showIndex: false,
            tab: false,
            cardCreator: function (v) {
                return BI.createWidget();
            }
        });
    },

    render: function () {
        var self = this, o = this.options;
        if (BI.isObject(o.tab)) {
            this.tab = BI.createWidget(this.options.tab, {type: "bi.button_group"});
            this.tab.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
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
        if (o.showIndex !== false) {
            this.setSelect(o.showIndex);
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

    removeTab: function (cardname) {
        var self = this, o = this.options;
        BI.any(this.cardMap, function (name, card) {
            if (BI.isEqual(name, (cardname + ""))) {
                self.layout.deleteCardByName(name);
                delete self.cardMap[name];
                return true;
            }
        });
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

BI.shortcut("bi.tab", BI.Tab);/**
 * 表示当前对象
 *
 * Created by GUY on 2015/9/7.
 * @class BI.EL
 * @extends BI.Widget
 */
BI.EL = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.EL.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-el",
            el: {},
            layout: {}
        });
    },
    _init: function () {
        BI.EL.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.ele = BI.createWidget(o.el);
        BI.createWidget(o.layout, {
            type: "bi.adaptive",
            element: this,
            items: [this.ele]
        });
        this.ele.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        this.ele.setValue(v);
    },

    getValue: function () {
        return this.ele.getValue();
    },

    populate: function () {
        this.ele.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.el", BI.EL);/**
 * z-index在1亿层级
 * 弹出提示消息框，用于模拟阻塞操作（通过回调函数实现）
 * @class BI.Msg
 */
BI.Msg = function () {

    var $mask, $pop;

    var messageShows = [];

    var toastStack = [];

    return {
        alert: function (title, message, callback) {
            this._show(false, title, message, callback);
        },
        confirm: function (title, message, callback) {
            this._show(true, title, message, callback);
        },
        prompt: function (title, message, value, callback, min_width) {
            // BI.Msg.prompt(title, message, value, callback, min_width);
        },
        toast: function (message, options, context) {
            options = options || {};
            context = context || BI.Widget._renderEngine.createElement("body");
            var level = options.level || "normal";
            var autoClose = BI.isNull(options.autoClose) ? true : options.autoClose;
            var callback = BI.isFunction(options.callback) ? options.callback : BI.emptyFn;
            var toast = BI.createWidget({
                type: "bi.toast",
                cls: "bi-message-animate bi-message-leave",
                level: level,
                autoClose: autoClose,
                text: message,
                listeners: [{
                    eventName: BI.Toast.EVENT_DESTORY,
                    action: function () {
                        BI.remove(toastStack, toast.element);
                        var _height = 10;
                        BI.each(toastStack, function (i, element) {
                            element.css({"top": _height});
                            _height += element.outerHeight() + 10;
                        });
                        callback();
                    }
                }]
            });
            var height = 10;
            BI.each(toastStack, function (i, element) {
                height += element.outerHeight() + 10;
            });
            BI.createWidget({
                type: "bi.absolute",
                element: context,
                items: [{
                    el: toast,
                    left: "50%",
                    top: height
                }]
            });
            toastStack.push(toast.element);
            toast.element.css({"margin-left": -1 * toast.element.outerWidth() / 2});
            toast.element.removeClass("bi-message-leave").addClass("bi-message-enter");

            autoClose && BI.delay(function () {
                toast.element.removeClass("bi-message-enter").addClass("bi-message-leave");
                toast.destroy();
            }, 5000);
        },
        _show: function (hasCancel, title, message, callback) {
            BI.isNull($mask) && ($mask = BI.Widget._renderEngine.createElement("<div class=\"bi-z-index-mask\">").css({
                position: "absolute",
                zIndex: BI.zIndex_tip - 2,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.5
            }).appendTo("body"));
            $pop = BI.Widget._renderEngine.createElement("<div class=\"bi-message-depend\">").css({
                position: "absolute",
                zIndex: BI.zIndex_tip - 1,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }).appendTo("body");
            var close = function () {
                messageShows[messageShows.length - 1].destroy();
                messageShows.pop();
                if (messageShows.length === 0) {
                    $mask.remove();
                    $mask = null;
                }
            };
            var controlItems = [];
            if (hasCancel === true) {
                controlItems.push({
                    el: {
                        type: "bi.button",
                        text: BI.i18nText("BI-Basic_Cancel"),
                        level: "ignore",
                        handler: function () {
                            close();
                            if (BI.isFunction(callback)) {
                                callback.apply(null, [false]);
                            }
                        }
                    }
                });
            }
            controlItems.push({
                el: {
                    type: "bi.button",
                    text: BI.i18nText("BI-Basic_OK"),
                    handler: function () {
                        close();
                        if (BI.isFunction(callback)) {
                            callback.apply(null, [true]);
                        }
                    }
                }
            });
            var conf = {
                element: $pop,
                type: "bi.center_adapt",
                items: [
                    {
                        type: "bi.border",
                        cls: "bi-card",
                        items: {
                            north: {
                                el: {
                                    type: "bi.border",
                                    cls: "bi-message-title bi-background",
                                    items: {
                                        center: {
                                            el: {
                                                type: "bi.label",
                                                cls: "bi-font-bold",
                                                text: title || BI.i18nText("BI-Basic_Prompt"),
                                                textAlign: "left",
                                                hgap: 20,
                                                height: 40
                                            }
                                        },
                                        east: {
                                            el: {
                                                type: "bi.icon_button",
                                                cls: "bi-message-close close-font",
                                                //                                                    height: 50,
                                                handler: function () {
                                                    close();
                                                    if (BI.isFunction(callback)) {
                                                        callback.apply(null, [false]);
                                                    }
                                                }
                                            },
                                            width: 60
                                        }
                                    }
                                },
                                height: 40
                            },
                            center: {
                                el: {
                                    type: "bi.label",
                                    vgap: 10,
                                    hgap: 20,
                                    whiteSpace: "normal",
                                    text: message
                                }
                            },
                            south: {
                                el: {
                                    type: "bi.absolute",
                                    items: [{
                                        el: {
                                            type: "bi.right_vertical_adapt",
                                            lgap: 10,
                                            items: controlItems
                                        },
                                        top: 0,
                                        left: 20,
                                        right: 20,
                                        bottom: 0
                                    }]

                                },
                                height: 44
                            }
                        },
                        width: 450,
                        height: 200
                    }
                ]
            };

            messageShows[messageShows.length] = BI.createWidget(conf);
        }
    };
}();/**
 * GridView
 *
 * Created by GUY on 2016/1/11.
 * @class BI.GridView
 * @extends BI.Widget
 */
BI.GridView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.GridView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid-view",
            // width: 400, //必设
            // height: 300, //必设
            overflowX: true,
            overflowY: true,
            overscanColumnCount: 0,
            overscanRowCount: 0,
            rowHeightGetter: BI.emptyFn, // number类型或function类型
            columnWidthGetter: BI.emptyFn, // number类型或function类型
            // estimatedColumnSize: 100, //columnWidthGetter为function时必设
            // estimatedRowSize: 30, //rowHeightGetter为function时必设
            scrollLeft: 0,
            scrollTop: 0,
            items: []
        });
    },

    _init: function () {
        BI.GridView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.renderedCells = [];
        this.renderedKeys = [];
        this.renderRange = {};
        this._scrollLock = false;
        this._debounceRelease = BI.debounce(function () {
            self._scrollLock = false;
        }, 1000 / 60);
        this.container = BI.createWidget({
            type: "bi.absolute"
        });
        this.element.scroll(function () {
            if (self._scrollLock === true) {
                return;
            }
            o.scrollLeft = self.element.scrollLeft();
            o.scrollTop = self.element.scrollTop();
            self._calculateChildrenToRender();
            self.fireEvent(BI.GridView.EVENT_SCROLL, {
                scrollLeft: o.scrollLeft,
                scrollTop: o.scrollTop
            });
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            scrollable: o.overflowX === true && o.overflowY === true,
            scrolly: o.overflowX === false && o.overflowY === true,
            scrollx: o.overflowX === true && o.overflowY === false,
            items: [this.container]
        });
        if (o.items.length > 0) {
            this._populate();
        }
    },

    mounted: function () {
        var o = this.options;
        if (o.scrollLeft !== 0 || o.scrollTop !== 0) {
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        }
    },

    _getOverscanIndices: function (cellCount, overscanCellsCount, startIndex, stopIndex) {
        return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
        };
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;

        var width = o.width, height = o.height, scrollLeft = BI.clamp(o.scrollLeft, 0, this._getMaxScrollLeft()),
            scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop()),
            overscanColumnCount = o.overscanColumnCount, overscanRowCount = o.overscanRowCount;

        if (height > 0 && width > 0) {
            var visibleColumnIndices = this._columnSizeAndPositionManager.getVisibleCellRange(width, scrollLeft);
            var visibleRowIndices = this._rowSizeAndPositionManager.getVisibleCellRange(height, scrollTop);

            if (BI.isEmpty(visibleColumnIndices) || BI.isEmpty(visibleRowIndices)) {
                return;
            }
            var horizontalOffsetAdjustment = this._columnSizeAndPositionManager.getOffsetAdjustment(width, scrollLeft);
            var verticalOffsetAdjustment = this._rowSizeAndPositionManager.getOffsetAdjustment(height, scrollTop);

            this._renderedColumnStartIndex = visibleColumnIndices.start;
            this._renderedColumnStopIndex = visibleColumnIndices.stop;
            this._renderedRowStartIndex = visibleRowIndices.start;
            this._renderedRowStopIndex = visibleRowIndices.stop;

            var overscanColumnIndices = this._getOverscanIndices(this.columnCount, overscanColumnCount, this._renderedColumnStartIndex, this._renderedColumnStopIndex);

            var overscanRowIndices = this._getOverscanIndices(this.rowCount, overscanRowCount, this._renderedRowStartIndex, this._renderedRowStopIndex);

            var columnStartIndex = overscanColumnIndices.overscanStartIndex;
            var columnStopIndex = overscanColumnIndices.overscanStopIndex;
            var rowStartIndex = overscanRowIndices.overscanStartIndex;
            var rowStopIndex = overscanRowIndices.overscanStopIndex;

            // 算区间size
            var minRowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowStartIndex);
            var minColumnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnStartIndex);
            var maxRowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowStopIndex);
            var maxColumnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnStopIndex);
            var top = minRowDatum.offset + verticalOffsetAdjustment;
            var left = minColumnDatum.offset + horizontalOffsetAdjustment;
            var bottom = maxRowDatum.offset + verticalOffsetAdjustment + maxRowDatum.size;
            var right = maxColumnDatum.offset + horizontalOffsetAdjustment + maxColumnDatum.size;
            // 如果滚动的区间并没有超出渲染的范围
            if (top >= this.renderRange.minY && bottom <= this.renderRange.maxY && left >= this.renderRange.minX && right <= this.renderRange.maxX) {
                return;
            }

            var renderedCells = [], renderedKeys = {}, renderedWidgets = {};
            var minX = this._getMaxScrollLeft(), minY = this._getMaxScrollTop(), maxX = 0, maxY = 0;
            var count = 0;
            for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                var rowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

                for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                    var key = rowIndex + "-" + columnIndex;
                    var columnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);

                    var index = this.renderedKeys[key] && this.renderedKeys[key][2];
                    var child;
                    if (index >= 0) {
                        if (columnDatum.size !== this.renderedCells[index]._width) {
                            this.renderedCells[index]._width = columnDatum.size;
                            this.renderedCells[index].el.setWidth(columnDatum.size);
                        }
                        if (rowDatum.size !== this.renderedCells[index]._height) {
                            this.renderedCells[index]._height = rowDatum.size;
                            this.renderedCells[index].el.setHeight(rowDatum.size);
                        }
                        if (this.renderedCells[index]._left !== columnDatum.offset + horizontalOffsetAdjustment) {
                            this.renderedCells[index].el.element.css("left", (columnDatum.offset + horizontalOffsetAdjustment) + "px");
                        }
                        if (this.renderedCells[index]._top !== rowDatum.offset + verticalOffsetAdjustment) {
                            this.renderedCells[index].el.element.css("top", (rowDatum.offset + verticalOffsetAdjustment) + "px");
                        }
                        renderedCells.push(child = this.renderedCells[index]);
                    } else {
                        child = BI.createWidget(BI.extend({
                            type: "bi.label",
                            width: columnDatum.size,
                            height: rowDatum.size
                        }, o.items[rowIndex][columnIndex], {
                            cls: (o.items[rowIndex][columnIndex].cls || "") + " grid-cell" + (rowIndex === 0 ? " first-row" : "") + (columnIndex === 0 ? " first-col" : ""),
                            _rowIndex: rowIndex,
                            _columnIndex: columnIndex,
                            _left: columnDatum.offset + horizontalOffsetAdjustment,
                            _top: rowDatum.offset + verticalOffsetAdjustment
                        }), this);
                        renderedCells.push({
                            el: child,
                            left: columnDatum.offset + horizontalOffsetAdjustment,
                            top: rowDatum.offset + verticalOffsetAdjustment,
                            _left: columnDatum.offset + horizontalOffsetAdjustment,
                            _top: rowDatum.offset + verticalOffsetAdjustment,
                            _width: columnDatum.size,
                            _height: rowDatum.size
                        });
                    }
                    minX = Math.min(minX, columnDatum.offset + horizontalOffsetAdjustment);
                    maxX = Math.max(maxX, columnDatum.offset + horizontalOffsetAdjustment + columnDatum.size);
                    minY = Math.min(minY, rowDatum.offset + verticalOffsetAdjustment);
                    maxY = Math.max(maxY, rowDatum.offset + verticalOffsetAdjustment + rowDatum.size);
                    renderedKeys[key] = [rowIndex, columnIndex, count];
                    renderedWidgets[count] = child;
                    count++;
                }
            }
            // 已存在的， 需要添加的和需要删除的
            var existSet = {}, addSet = {}, deleteArray = [];
            BI.each(renderedKeys, function (i, key) {
                if (self.renderedKeys[i]) {
                    existSet[i] = key;
                } else {
                    addSet[i] = key;
                }
            });
            BI.each(this.renderedKeys, function (i, key) {
                if (existSet[i]) {
                    return;
                }
                if (addSet[i]) {
                    return;
                }
                deleteArray.push(key[2]);
            });
            BI.each(deleteArray, function (i, index) {
                // 性能优化，不调用destroy方法防止触发destroy事件
                self.renderedCells[index].el._destroy();
            });
            var addedItems = [];
            BI.each(addSet, function (index, key) {
                addedItems.push(renderedCells[key[2]]);
            });
            // 与listview一样, 给上下文
            this.container.addItems(addedItems, this);
            // 拦截父子级关系
            this.container._children = renderedWidgets;
            this.container.attr("items", renderedCells);
            this.renderedCells = renderedCells;
            this.renderedKeys = renderedKeys;
            this.renderRange = {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
        }
    },

    /**
     * 获取真实的可滚动的最大宽度
     * 对于grid_view如果没有全部渲染过，this._columnSizeAndPositionManager.getTotalSize获取的宽度是不准确的
     * 因此在调用setScrollLeft等函数时会造成没法移动到最右端(预估可移动具体太短)
     */
    _getRealMaxScrollLeft: function () {
        var o = this.options;
        var totalWidth = 0;
        BI.count(0, this.columnCount, function (index) {
            totalWidth += o.columnWidthGetter(index);
        });
        return Math.max(0, totalWidth - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollLeft: function () {
        return Math.max(0, this._columnSizeAndPositionManager.getTotalSize() - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollTop: function () {
        return Math.max(0, this._rowSizeAndPositionManager.getTotalSize() - this.options.height + (this.options.overflowY ? BI.DOM.getScrollWidth() : 0));
    },

    _populate: function (items) {
        var self = this, o = this.options;
        this._reRange();
        this.columnCount = 0;
        this.rowCount = 0;
        if (items && items !== this.options.items) {
            this.options.items = items;
        }
        if (BI.isNumber(o.columnCount)) {
            this.columnCount = o.columnCount;
        } else if (o.items.length > 0) {
            this.columnCount = o.items[0].length;
        }
        if (BI.isNumber(o.rowCount)) {
            this.rowCount = o.rowCount;
        } else {
            this.rowCount = o.items.length;
        }
        this.container.setWidth(this.columnCount * o.estimatedColumnSize);
        this.container.setHeight(this.rowCount * o.estimatedRowSize);

        this._columnSizeAndPositionManager = new BI.ScalingCellSizeAndPositionManager(this.columnCount, o.columnWidthGetter, o.estimatedColumnSize);
        this._rowSizeAndPositionManager = new BI.ScalingCellSizeAndPositionManager(this.rowCount, o.rowHeightGetter, o.estimatedRowSize);

        this._calculateChildrenToRender();
        // 元素未挂载时不能设置scrollTop
        try {
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        } catch (e) {
        }
    },

    setScrollLeft: function (scrollLeft) {
        if (this.options.scrollLeft === scrollLeft) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollLeft = BI.clamp(scrollLeft || 0, 0, this._getRealMaxScrollLeft());
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollLeft(this.options.scrollLeft);
    },

    setScrollTop: function (scrollTop) {
        if (this.options.scrollTop === scrollTop) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollTop = BI.clamp(scrollTop || 0, 0, this._getMaxScrollTop());
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollTop(this.options.scrollTop);
    },

    setColumnCount: function (columnCount) {
        this.options.columnCount = columnCount;
    },

    setRowCount: function (rowCount) {
        this.options.rowCount = rowCount;
    },

    setOverflowX: function (b) {
        var self = this;
        if (this.options.overflowX !== !!b) {
            this.options.overflowX = !!b;
            BI.nextTick(function () {
                self.element.css({overflowX: b ? "auto" : "hidden"});
            });
        }
    },

    setOverflowY: function (b) {
        var self = this;
        if (this.options.overflowY !== !!b) {
            this.options.overflowY = !!b;
            BI.nextTick(function () {
                self.element.css({overflowY: b ? "auto" : "hidden"});
            });
        }
    },

    getScrollLeft: function () {
        return this.options.scrollLeft;
    },

    getScrollTop: function () {
        return this.options.scrollTop;
    },

    getMaxScrollLeft: function () {
        return this._getMaxScrollLeft();
    },

    getMaxScrollTop: function () {
        return this._getMaxScrollTop();
    },

    setEstimatedColumnSize: function (width) {
        this.options.estimatedColumnSize = width;
    },

    setEstimatedRowSize: function (height) {
        this.options.estimatedRowSize = height;
    },

    // 重新计算children
    _reRange: function () {
        this.renderRange = {};
    },

    _clearChildren: function () {
        this.container._children = {};
        this.container.attr("items", []);
    },

    restore: function () {
        BI.each(this.renderedCells, function (i, cell) {
            cell.el._destroy();
        });
        this._clearChildren();
        this.renderedCells = [];
        this.renderedKeys = [];
        this.renderRange = {};
        this._scrollLock = false;
    },

    populate: function (items) {
        if (items && items !== this.options.items) {
            this.restore();
        }
        this._populate(items);
    }
});
BI.GridView.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.grid_view", BI.GridView);
/**
 * Popover弹出层，
 * @class BI.Popover
 * @extends BI.Widget
 */
BI.Popover = BI.inherit(BI.Widget, {
    _constant: {
        SIZE: {
            SMALL: "small",
            NORMAL: "normal",
            BIG: "big"
        },
        HEADER_HEIGHT: 40
    },

    _defaultConfig: function () {
        return BI.extend(BI.Popover.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-popover bi-card bi-border-radius",
            // width: 600,
            // height: 500,
            size: "normal", // small, normal, big
            logic: {
                dynamic: false
            },
            header: null,
            body: null,
            footer: null,
            closable: true // BI-40839 是否显示右上角的关闭按钮
        });
    },
    render: function () {
        var self = this, o = this.options;
        this.startX = 0;
        this.startY = 0;
        this.tracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            var size = self._calculateSize();
            var W = BI.Widget._renderEngine.createElement("body").width(), H = BI.Widget._renderEngine.createElement("body").height();
            self.startX += deltaX;
            self.startY += deltaY;
            self.element.css({
                left: BI.clamp(self.startX, 0, W - self.element.width()) + "px",
                top: BI.clamp(self.startY, 0, H - self.element.height()) + "px"
            });
            // BI-12134 没有什么特别好的方法
            BI.Resizers._resize();
        }, function () {
            self.tracker.releaseMouseMoves();
        }, _global);
        var items = [{
            el: {
                type: "bi.htape",
                cls: "bi-message-title bi-header-background",
                ref: function (_ref) {
                    self.dragger = _ref;
                },
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: BI.isPlainObject(o.header) ? BI.createWidget(o.header, {
                            extraCls: "bi-font-bold"
                        }) : {
                            type: "bi.label",
                            cls: "bi-font-bold",
                            height: this._constant.HEADER_HEIGHT,
                            text: o.header,
                            title: o.header,
                            textAlign: "left"
                        },
                        left: 20,
                        top: 0,
                        right: 0,
                        bottom: 0
                    }]
                }, {
                    el: o.closable ? {
                        type: "bi.icon_button",
                        cls: "bi-message-close close-font",
                        height: this._constant.HEADER_HEIGHT,
                        handler: function () {
                            self.close();
                        }
                    } : {
                        type: "bi.layout"
                    },
                    width: 56
                }],
                height: this._constant.HEADER_HEIGHT
            },
            height: this._constant.HEADER_HEIGHT
        }, {
            el: o.logic.dynamic ? {
                type: "bi.vertical",
                scrolly: false,
                cls: "popover-body",
                ref: function () {
                    self.body = this;
                },
                hgap: 20,
                tgap: 10,
                items: [{
                    el: BI.createWidget(o.body)
                }]
            } : {
                type: "bi.absolute",
                items: [{
                    el: BI.createWidget(o.body),
                    left: 20,
                    top: 10,
                    right: 20,
                    bottom: 0
                }]
            }
        }];
        if (o.footer) {
            items.push({
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: BI.createWidget(o.footer),
                        left: 20,
                        top: 0,
                        right: 20,
                        bottom: 0
                    }],
                    height: 44
                },
                height: 44
            });
        }

        var size = this._calculateSize();

        return BI.extend({
            type: o.logic.dynamic ? "bi.vertical" : "bi.vtape",
            items: items,
            width: size.width
        }, o.logic.dynamic ? {
            type: "bi.vertical",
            scrolly: false
        } : {
            type: "bi.vtape",
            height: size.height
        });
    },

    mounted: function () {
        var self = this, o = this.options;
        this.dragger.element.mousedown(function (e) {
            var pos = self.element.offset();
            self.startX = pos.left;
            self.startY = pos.top;
            self.tracker.captureMouseMoves(e);
        });
        if (o.logic.dynamic) {
            var size = this._calculateSize();
            var height = this.element.height();
            var compareHeight = BI.clamp(height, size.height, 600) - (o.footer ? 84 : 44);
            this.body.element.height(compareHeight);
        }
    },

    _calculateSize: function () {
        var o = this.options;
        var size = {};
        if (BI.isNotNull(o.size)) {
            switch (o.size) {
                case this._constant.SIZE.SMALL:
                    size.width = 450;
                    size.height = 200;
                    break;
                case this._constant.SIZE.BIG:
                    size.width = 900;
                    size.height = 500;
                    break;
                default:
                    size.width = 550;
                    size.height = 500;
            }
        }
        return {
            width: o.width || size.width,
            height: o.height || size.height
        };
    },

    hide: function () {

    },

    open: function () {
        this.show();
        this.fireEvent(BI.Popover.EVENT_OPEN, arguments);
    },

    close: function () {
        this.hide();
        this.fireEvent(BI.Popover.EVENT_CLOSE, arguments);
    },

    setZindex: function (zindex) {
        this.element.css({"z-index": zindex});
    },

    destroyed: function () {
    }
});

BI.shortcut("bi.popover", BI.Popover);

BI.BarPopover = BI.inherit(BI.Popover, {
    _defaultConfig: function () {
        return BI.extend(BI.BarPopover.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText("BI-Basic_Sure"), BI.i18nText("BI-Basic_Cancel")]
        });
    },

    beforeCreate: function () {
        var self = this, o = this.options;
        o.footer || (o.footer = {
            type: "bi.right_vertical_adapt",
            lgap: 10,
            items: [{
                type: "bi.button",
                text: this.options.btns[1],
                value: 1,
                level: "ignore",
                handler: function (v) {
                    self.fireEvent(BI.Popover.EVENT_CANCEL, v);
                    self.close(v);
                }
            }, {
                type: "bi.button",
                text: this.options.btns[0],
                warningTitle: o.warningTitle,
                value: 0,
                handler: function (v) {
                    self.fireEvent(BI.Popover.EVENT_CONFIRM, v);
                    self.close(v);
                }
            }]
        });
    }
});

BI.shortcut("bi.bar_popover", BI.BarPopover);

BI.Popover.EVENT_CLOSE = "EVENT_CLOSE";
BI.Popover.EVENT_OPEN = "EVENT_OPEN";
BI.Popover.EVENT_CANCEL = "EVENT_CANCEL";
BI.Popover.EVENT_CONFIRM = "EVENT_CONFIRM";
/**
 * 下拉框弹出层, zIndex在1000w
 * @class BI.PopupView
 * @extends BI.Widget
 */
BI.PopupView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.PopupView.superclass._defaultConfig.apply(this, arguments), {
            _baseCls: "bi-popup-view",
            maxWidth: "auto",
            minWidth: 100,
            // maxHeight: 200,
            minHeight: 24,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0,
            hgap: 0,
            innerVGap: 0,
            direction: BI.Direction.Top, // 工具栏的方向
            stopEvent: false, // 是否停止mousedown、mouseup事件
            stopPropagation: false, // 是否停止mousedown、mouseup向上冒泡
            logic: {
                dynamic: true
            },

            tool: false, // 自定义工具栏
            tabs: [], // 导航栏
            buttons: [], // toolbar栏

            el: {
                type: "bi.button_group",
                items: [],
                chooseType: 0,
                behaviors: {},
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
    },

    _init: function () {
        BI.PopupView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var fn = function (e) {
                e.stopPropagation();
            }, stop = function (e) {
                e.stopEvent();
                return false;
            };
        this.element.css({
            "z-index": BI.zIndex_popup,
            "min-width": o.minWidth + "px",
            "max-width": o.maxWidth + "px"
        }).bind({click: fn});

        this.element.bind("mousewheel", fn);

        o.stopPropagation && this.element.bind({mousedown: fn, mouseup: fn, mouseover: fn});
        o.stopEvent && this.element.bind({mousedown: stop, mouseup: stop, mouseover: stop});
        this.tool = this._createTool();
        this.tab = this._createTab();
        this.view = this._createView();
        this.toolbar = this._createToolBar();

        this.view.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.PopupView.EVENT_CHANGE);
            }
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            scrolly: false,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap,
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction,
                BI.extend({
                    cls: "list-view-outer bi-card list-view-shadow"
                }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
                    items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.tool, this.tab, this.view, this.toolbar)
                })))
            )
        }))));
    },

    _createView: function () {
        var o = this.options;
        this.button_group = BI.createWidget(o.el, {type: "bi.button_group", value: o.value});
        this.button_group.element.css({"min-height": o.minHeight + "px", "padding-top": o.innerVGap + "px", "padding-bottom": o.innerVGap + "px"});
        return this.button_group;
    },

    _createTool: function () {
        var o = this.options;
        if (false === o.tool) {
            return;
        }
        return BI.createWidget(o.tool);
    },

    _createTab: function () {
        var o = this.options;
        if (o.tabs.length === 0) {
            return;
        }
        return BI.createWidget({
            type: "bi.center",
            cls: "list-view-tab",
            height: 25,
            items: o.tabs,
            value: o.value
        });
    },

    _createToolBar: function () {
        var o = this.options;
        if (o.buttons.length === 0) {
            return;
        }

        return BI.createWidget({
            type: "bi.center",
            cls: "list-view-toolbar bi-high-light bi-split-top",
            height: 24,
            items: BI.createItems(o.buttons, {
                once: false,
                shadow: true,
                isShadowShowingOnSelected: true
            })
        });
    },

    getView: function () {
        return this.view;
    },

    populate: function (items) {
        this.view.populate.apply(this.view, arguments);
    },

    resetWidth: function (w) {
        this.options.width = w;
        this.element.width(w);
    },

    resetHeight: function (h) {
        var tbHeight = this.toolbar ? (this.toolbar.attr("height") || 24) : 0,
            tabHeight = this.tab ? (this.tab.attr("height") || 24) : 0,
            toolHeight = ((this.tool && this.tool.attr("height")) || 24) * ((this.tool && this.tool.isVisible()) ? 1 : 0);
        var resetHeight = h - tbHeight - tabHeight - toolHeight - 2 * this.options.innerVGap;
        this.view.resetHeight ? this.view.resetHeight(resetHeight) :
            this.view.element.css({"max-height": resetHeight + "px"});
    },

    setValue: function (selectedValues) {
        this.tab && this.tab.setValue(selectedValues);
        this.view.setValue(selectedValues);
    },

    getValue: function () {
        return this.view.getValue();
    }
});
BI.PopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.popup_view", BI.PopupView);/**
 * 搜索面板
 *
 * Created by GUY on 2015/9/28.
 * @class BI.SearcherView
 * @extends BI.Pane
 */

BI.SearcherView = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        var conf = BI.SearcherView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-searcher-view bi-card",
            tipText: BI.i18nText("BI-No_Select"),
            chooseType: BI.Selection.Single,

            matcher: {// 完全匹配的构造器
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                items: [],
                layouts: [{
                    type: "bi.vertical"
                }]
            },
            searcher: {
                type: "bi.button_group",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                items: [],
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
    },

    _init: function () {
        BI.SearcherView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.matcher = BI.createWidget(o.matcher, {
            type: "bi.button_group",
            chooseType: o.chooseType,
            behaviors: {
                redmark: function () {
                    return true;
                }
            },
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });
        this.matcher.on(BI.Controller.EVENT_CHANGE, function (type, val, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SearcherView.EVENT_CHANGE, val, ob);
            }
        });
        this.spliter = BI.createWidget({
            type: "bi.vertical",
            height: 1,
            hgap: 10,
            items: [{
                type: "bi.layout",
                height: 1,
                cls: "searcher-view-spliter bi-background"
            }]
        });
        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.button_group",
            chooseType: o.chooseType,
            behaviors: {
                redmark: function () {
                    return true;
                }
            },
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });
        this.searcher.on(BI.Controller.EVENT_CHANGE, function (type, val, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SearcherView.EVENT_CHANGE, val, ob);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.matcher, this.spliter, this.searcher]
        });
    },

    startSearch: function () {

    },

    stopSearch: function () {

    },

    setValue: function (v) {
        this.matcher.setValue(v);
        this.searcher.setValue(v);
    },

    getValue: function () {
        return this.matcher.getValue().concat(this.searcher.getValue());
    },

    populate: function (searchResult, matchResult, keyword) {
        searchResult || (searchResult = []);
        matchResult || (matchResult = []);
        this.setTipVisible(searchResult.length + matchResult.length === 0);
        this.spliter.setVisible(BI.isNotEmptyArray(matchResult) && BI.isNotEmptyArray(searchResult));
        this.matcher.populate(matchResult, keyword);
        this.searcher.populate(searchResult, keyword);
    },

    empty: function () {
        this.searcher.empty();
        this.matcher.empty();
    },

    hasMatched: function () {
        return this.matcher.getAllButtons().length > 0;
    }
});
BI.SearcherView.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.searcher_view", BI.SearcherView);/**
 * 表示当前对象
 *
 * Created by GUY on 2017/5/23.
 * @class BI.ListView
 * @extends BI.Widget
 */
BI.ListView = BI.inherit(BI.Widget, {
    props: function () {
        return {
            baseCls: "bi-list-view",
            overscanHeight: 100,
            blockSize: 10,
            scrollTop: 0,
            el: {},
            items: []
        };
    },

    init: function () {
        var self = this;
        this.renderedIndex = -1;
        this.cache = {};
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            items: [BI.extend({
                type: "bi.vertical",
                scrolly: false,
                ref: function () {
                    self.container = this;
                }
            }, o.el)],
            element: this
        };
    },

    mounted: function () {
        var self = this, o = this.options;
        this._populate();
        this.element.scroll(function (e) {
            o.scrollTop = self.element.scrollTop();
            self._calculateBlocksToRender();
        });
        var lastWidth = this.element.width(),
            lastHeight = this.element.height();
        BI.ResizeDetector.addResizeListener(this, function () {
            var width = self.element.width(),
                height = self.element.height();
            if (width !== lastWidth || height !== lastHeight) {
                lastWidth = width;
                lastHeight = height;
                self._calculateBlocksToRender();
            }
        });
    },

    _renderMoreIf: function () {
        var self = this, o = this.options;
        var height = this.element.height();
        var minContentHeight = o.scrollTop + height + o.overscanHeight;
        var index = (this.cache[this.renderedIndex] && (this.cache[this.renderedIndex].index + o.blockSize)) || 0,
            cnt = this.renderedIndex + 1;
        var lastHeight;
        var getElementHeight = function () {
            return self.container.element.height();
        };
        while ((lastHeight = getElementHeight()) < minContentHeight && index < o.items.length) {
            var items = o.items.slice(index, index + o.blockSize);
            this.container.addItems(items, this);
            var addedHeight = getElementHeight() - lastHeight;
            this.cache[cnt] = {
                index: index,
                scrollTop: lastHeight,
                height: addedHeight
            };
            this.renderedIndex = cnt;
            cnt++;
            index += o.blockSize;
        }
    },

    _calculateBlocksToRender: function () {
        var o = this.options;
        this._renderMoreIf();
    },

    _populate: function (items) {
        var o = this.options;
        if (items && this.options.items !== items) {
            this.options.items = items;
        }
        this._calculateBlocksToRender();
        this.element.scrollTop(o.scrollTop);
    },

    restore: function () {
        this.renderedIndex = -1;
        this.container.empty();
        this.cache = {};
    },

    populate: function (items) {
        if (items && this.options.items !== items) {
            this.restore();
        }
        this._populate(items);
    },

    destroyed: function () {
        this.restore();
    }
});
BI.shortcut("bi.list_view", BI.ListView);

/**
 * 表示当前对象
 *
 * Created by GUY on 2017/5/22.
 * @class BI.VirtualList
 * @extends BI.Widget
 */
BI.VirtualList = BI.inherit(BI.Widget, {
    props: function () {
        return {
            baseCls: "bi-virtual-list",
            overscanHeight: 100,
            blockSize: 10,
            scrollTop: 0,
            items: []
        };
    },

    init: function () {
        var self = this;
        this.renderedIndex = -1;
        this.cache = {};
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.layout",
                ref: function () {
                    self.topBlank = this;
                }
            }, {
                type: "bi.vertical",
                scrolly: false,
                ref: function () {
                    self.container = this;
                }
            }, {
                type: "bi.layout",
                ref: function () {
                    self.bottomBlank = this;
                }
            }],
            element: this
        };
    },

    mounted: function () {
        var self = this, o = this.options;
        this._populate();
        this.element.scroll(function (e) {
            o.scrollTop = self.element.scrollTop();
            self._calculateBlocksToRender();
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self._calculateBlocksToRender();
        });
    },

    _renderMoreIf: function () {
        var self = this, o = this.options;
        var height = this.element.height();
        var minContentHeight = o.scrollTop + height + o.overscanHeight;
        var index = (this.cache[this.renderedIndex] && (this.cache[this.renderedIndex].index + o.blockSize)) || 0,
            cnt = this.renderedIndex + 1;
        var lastHeight;
        var getElementHeight = function () {
            return self.container.element.height() + self.topBlank.element.height() + self.bottomBlank.element.height();
        };
        while ((lastHeight = getElementHeight()) < minContentHeight && index < o.items.length) {
            var items = o.items.slice(index, index + o.blockSize);
            this.container.addItems(items, this);
            var addedHeight = getElementHeight() - lastHeight;
            this.cache[cnt] = {
                index: index,
                scrollTop: lastHeight,
                height: addedHeight
            };
            this.tree.set(cnt, addedHeight);
            this.renderedIndex = cnt;
            cnt++;
            index += o.blockSize;
        }
    },

    _calculateBlocksToRender: function () {
        var o = this.options;
        this._renderMoreIf();
        var height = this.element.height();
        var minContentHeightFrom = o.scrollTop - o.overscanHeight;
        var minContentHeightTo = o.scrollTop + height + o.overscanHeight;
        var start = this.tree.greatestLowerBound(minContentHeightFrom);
        var end = this.tree.leastUpperBound(minContentHeightTo);
        var needDestroyed = [];
        for (var i = 0; i < start; i++) {
            var index = this.cache[i].index;
            if (!this.cache[i].destroyed) {
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    needDestroyed.push(this.container._children[j]);
                    this.container._children[j] = null;
                }
                this.cache[i].destroyed = true;
            }
        }
        for (var i = end + 1; i <= this.renderedIndex; i++) {
            var index = this.cache[i].index;
            if (!this.cache[i].destroyed) {
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    needDestroyed.push(this.container._children[j]);
                    this.container._children[j] = null;
                }
                this.cache[i].destroyed = true;
            }
        }
        var firstFragment = BI.Widget._renderEngine.createFragment(), lastFragment = BI.Widget._renderEngine.createFragment();
        var currentFragment = firstFragment;
        for (var i = (start < 0 ? 0 : start); i <= end && i <= this.renderedIndex; i++) {
            var index = this.cache[i].index;
            if (!this.cache[i].destroyed) {
                currentFragment = lastFragment;
            }
            if (this.cache[i].destroyed === true) {
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    var w = this.container._addElement(j, BI.extend({root: true}, BI.stripEL(o.items[j])), this);
                    currentFragment.appendChild(w.element[0]);
                }
                this.cache[i].destroyed = false;
            }
        }
        this.container.element.prepend(firstFragment);
        this.container.element.append(lastFragment);
        this.topBlank.setHeight(this.cache[start < 0 ? 0 : start].scrollTop);
        var lastCache = this.cache[Math.min(end, this.renderedIndex)];
        this.bottomBlank.setHeight(this.tree.sumTo(this.renderedIndex) - lastCache.scrollTop - lastCache.height);
        BI.each(needDestroyed, function (i, child) {
            child && child._destroy();
        });
    },

    _populate: function (items) {
        var o = this.options;
        if (items && this.options.items !== items) {
            this.options.items = items;
        }
        this.tree = BI.PrefixIntervalTree.empty(Math.ceil(o.items.length / o.blockSize));
        this._calculateBlocksToRender();
        this.element.scrollTop(o.scrollTop);
    },

    _clearChildren: function () {
        BI.each(this.container._children, function (i, cell) {
            cell && cell._destroy();
        });
        this.container._children = {};
        this.container.attr("items", []);
    },

    restore: function () {
        this.renderedIndex = -1;
        this._clearChildren();
        this.cache = {};
        this.options.scrollTop = 0;
        // 依赖于cache的占位元素也要初始化
        this.topBlank.setHeight(0);
        this.bottomBlank.setHeight(0);
    },

    populate: function (items) {
        if (items && this.options.items !== items) {
            this.restore();
        }
        this._populate();
    },

    destroyed: function () {
        this.restore();
    }
});
BI.shortcut("bi.virtual_list", BI.VirtualList);

/**
 * 分页控件
 *
 * Created by GUY on 2015/8/31.
 * @class BI.Pager
 * @extends BI.Widget
 */
BI.Pager = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Pager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-pager",
            behaviors: {},
            layouts: [{
                type: "bi.horizontal",
                hgap: 10,
                vgap: 0
            }],

            dynamicShow: true, // 是否动态显示上一页、下一页、首页、尾页， 若为false，则指对其设置使能状态
            // dynamicShow为false时以下两个有用
            dynamicShowFirstLast: false, // 是否动态显示首页、尾页
            dynamicShowPrevNext: false, // 是否动态显示上一页、下一页
            pages: false, // 总页数
            curr: function () {
                return 1;
            }, // 初始化当前页
            groups: 0, // 连续显示分页数
            jump: BI.emptyFn, // 分页的回调函数

            first: false, // 是否显示首页
            last: false, // 是否显示尾页
            prev: "上一页",
            next: "下一页",

            firstPage: 1,
            lastPage: function () { // 在万不得已时才会调用这个函数获取最后一页的页码,  主要作用于setValue方法
                return 1;
            },
            hasPrev: BI.emptyFn, // pages不可用时有效
            hasNext: BI.emptyFn  // pages不可用时有效
        });
    },
    _init: function () {
        BI.Pager.superclass._init.apply(this, arguments);
        var self = this;
        this.currPage = BI.result(this.options, "curr");
        // 翻页太灵敏
        // this._lock = false;
        // this._debouce = BI.debounce(function () {
        //     self._lock = false;
        // }, 300);
        this._populate();
    },

    _populate: function () {
        var self = this, o = this.options, view = [], dict = {};
        this.empty();
        var pages = BI.result(o, "pages");
        var curr = BI.result(this, "currPage");
        var groups = BI.result(o, "groups");
        var first = BI.result(o, "first");
        var last = BI.result(o, "last");
        var prev = BI.result(o, "prev");
        var next = BI.result(o, "next");

        if (pages === false) {
            groups = 0;
            first = false;
            last = false;
        } else {
            groups > pages && (groups = pages);
        }

        // 计算当前组
        dict.index = Math.ceil((curr + ((groups > 1 && groups !== pages) ? 1 : 0)) / (groups === 0 ? 1 : groups));

        // 当前页非首页，则输出上一页
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) || curr > 1) && prev !== false) {
            if (BI.isKey(prev)) {
                view.push({
                    text: prev,
                    value: "prev",
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                });
            } else {
                view.push(BI.extend({
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                }, prev));
            }
        }

        // 当前组非首组，则输出首页
        if (((!o.dynamicShow && !o.dynamicShowFirstLast) || (dict.index > 1 && groups !== 0)) && first) {
            view.push({
                text: first,
                value: "first",
                disabled: !(dict.index > 1 && groups !== 0)
            });
            if (dict.index > 1 && groups !== 0) {
                view.push({
                    type: "bi.label",
                    cls: "page-ellipsis",
                    text: "\u2026"
                });
            }
        }

        // 输出当前页组
        dict.poor = Math.floor((groups - 1) / 2);
        dict.start = dict.index > 1 ? curr - dict.poor : 1;
        dict.end = dict.index > 1 ? (function () {
            var max = curr + (groups - dict.poor - 1);
            return max > pages ? pages : max;
        }()) : groups;
        if (dict.end - dict.start < groups - 1) { // 最后一组状态
            dict.start = dict.end - groups + 1;
        }
        var s = dict.start, e = dict.end;
        if (first && last && (dict.index > 1 && groups !== 0) && (pages > groups && dict.end < pages && groups !== 0)) {
            s++;
            e--;
        }
        for (; s <= e; s++) {
            if (s === curr) {
                view.push({
                    text: s,
                    value: s,
                    selected: true
                });
            } else {
                view.push({
                    text: s,
                    value: s
                });
            }
        }

        // 总页数大于连续分页数，且当前组最大页小于总页，输出尾页
        if (((!o.dynamicShow && !o.dynamicShowFirstLast) || (pages > groups && dict.end < pages && groups !== 0)) && last) {
            if (pages > groups && dict.end < pages && groups !== 0) {
                view.push({
                    type: "bi.label",
                    cls: "page-ellipsis",
                    text: "\u2026"
                });
            }
            view.push({
                text: last,
                value: "last",
                disabled: !(pages > groups && dict.end < pages && groups !== 0)
            });
        }

        // 当前页不为尾页时，输出下一页
        dict.flow = !prev && groups === 0;
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) && next) || (curr !== pages && next || dict.flow)) {
            view.push((function () {
                if (BI.isKey(next)) {
                    if (pages === false) {
                        return {text: next, value: "next", disabled: o.hasNext(curr) === false};
                    }
                    return (dict.flow && curr === pages)
                        ?
                        {text: next, value: "next", disabled: true}
                        :
                        {text: next, value: "next", disabled: !(curr !== pages && next || dict.flow)};
                }
                return BI.extend({
                    disabled: pages === false ? o.hasNext(curr) === false : !(curr !== pages && next || dict.flow)
                }, next);
                
            }()));
        }

        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(view, {
                cls: "bi-list-item-select bi-border-radius",
                height: 23,
                hgap: 10
            }),
            behaviors: o.behaviors,
            layouts: o.layouts
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            // if (self._lock === true) {
            //     return;
            // }
            // self._lock = true;
            // self._debouce();
            if (type === BI.Events.CLICK) {
                var v = self.button_group.getValue()[0];
                switch (v) {
                    case "first":
                        self.currPage = 1;
                        break;
                    case "last":
                        self.currPage = pages;
                        break;
                    case "prev":
                        self.currPage--;
                        break;
                    case "next":
                        self.currPage++;
                        break;
                    default:
                        self.currPage = v;
                        break;
                }
                o.jump.apply(self, [{
                    pages: pages,
                    curr: self.currPage
                }]);
                self._populate();
                self.fireEvent(BI.Pager.EVENT_CHANGE, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.fireEvent(BI.Pager.EVENT_AFTER_POPULATE);
    },

    getCurrentPage: function () {
        return this.currPage;
    },

    setAllPages: function (pages) {
        this.options.pages = pages;
    },

    hasPrev: function (v) {
        v || (v = 1);
        var o = this.options;
        var pages = this.options.pages;
        return pages === false ? o.hasPrev(v) : v > 1;
    },

    hasNext: function (v) {
        v || (v = 1);
        var o = this.options;
        var pages = this.options.pages;
        return pages === false ? o.hasNext(v) : v < pages;
    },

    setValue: function (v) {
        var o = this.options;
        v = v | 0;
        v = v < 1 ? 1 : v;
        if (o.pages === false) {
            var lastPage = BI.result(o, "lastPage"), firstPage = 1;
            this.currPage = v > lastPage ? lastPage : ((firstPage = BI.result(o, "firstPage")), (v < firstPage ? firstPage : v));
        } else {
            v = v > o.pages ? o.pages : v;
            this.currPage = v;
        }
        this._populate();
    },

    getValue: function () {
        var val = this.button_group.getValue()[0];
        switch (val) {
            case "prev":
                return -1;
            case "next":
                return 1;
            case "first":
                return BI.MIN;
            case "last":
                return BI.MAX;
            default :
                return val;
        }
    },

    attr: function (key, value) {
        BI.Pager.superclass.attr.apply(this, arguments);
        if (key === "curr") {
            this.currPage = BI.result(this.options, "curr");
        }
    },

    populate: function () {
        this._populate();
    }
});
BI.Pager.EVENT_CHANGE = "EVENT_CHANGE";
BI.Pager.EVENT_AFTER_POPULATE = "EVENT_AFTER_POPULATE";
BI.shortcut("bi.pager", BI.Pager);/**
 * 超链接
 *
 * Created by GUY on 2015/9/9.
 * @class BI.A
 * @extends BI.Text
 * @abstract
 */
BI.A = BI.inherit(BI.Text, {
    _defaultConfig: function () {
        var conf = BI.A.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-a display-block",
            href: "",
            target: "_blank",
            el: null,
            tagName: "a"
        });
    },
    _init: function () {
        var o = this.options;
        BI.A.superclass._init.apply(this, arguments);
        this.element.attr({href: o.href, target: o.target});
        if (o.el) {
            BI.createWidget(o.el, {
                element: this
            });
        }
    }
});

BI.shortcut("bi.a", BI.A);/**
 * guy
 * 加载条
 * @type {*|void|Object}
 */
BI.LoadingBar = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.LoadingBar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            baseCls: (conf.baseCls || "") + " bi-loading-bar bi-tips",
            height: 30,
            handler: BI.emptyFn
        });
    },
    _init: function () {
        BI.LoadingBar.superclass._init.apply(this, arguments);
        var self = this;
        this.loaded = BI.createWidget({
            type: "bi.text_button",
            cls: "loading-text bi-list-item-simple",
            text: BI.i18nText("BI-Load_More"),
            width: 120,
            handler: this.options.handler
        });
        this.loaded.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.loading = BI.createWidget({
            type: "bi.layout",
            width: this.options.height,
            height: this.options.height,
            cls: "loading-background cursor-default"
        });
        var loaded = BI.createWidget({
            type: "bi.center_adapt",
            items: [this.loaded]
        });
        var loading = BI.createWidget({
            type: "bi.center_adapt",
            items: [this.loading]
        });
        this.cardLayout = BI.createWidget({
            type: "bi.card",
            element: this,
            items: [{
                el: loaded,
                cardName: "loaded"
            }, {
                el: loading,
                cardName: "loading"
            }]
        });
        this.invisible();
    },

    _reset: function () {
        this.visible();
        this.loaded.setText(BI.i18nText("BI-Load_More"));
        this.loaded.enable();
    },

    setLoaded: function () {
        this._reset();
        this.cardLayout.showCardByName("loaded");
    },

    setEnd: function () {
        this.setLoaded();
        this.loaded.setText(BI.i18nText("BI-No_More_Data"));
        this.loaded.disable();
    },

    setLoading: function () {
        this._reset();
        this.cardLayout.showCardByName("loading");
    }
});

BI.shortcut("bi.loading_bar", BI.LoadingBar);/**
 * @class BI.IconButton
 * @extends BI.BasicButton
 * 图标的button
 */
BI.IconButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.IconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-icon-button horizon-center",
            iconWidth: null,
            iconHeight: null
        });
    },

    _init: function () {
        BI.IconButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.css({
            textAlign: "center"
        });
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: o.iconWidth,
            height: o.iconHeight
        });
        if (BI.isNumber(o.height) && o.height > 0 && BI.isNull(o.iconWidth) && BI.isNull(o.iconHeight)) {
            this.element.css("lineHeight", o.height + "px");
            BI.createWidget({
                type: "bi.default",
                element: this,
                items: [this.icon]
            });
        } else {
            this.element.css("lineHeight", "1");
            BI.createWidget({
                element: this,
                type: "bi.center_adapt",
                items: [this.icon]
            });
        }
    },

    doClick: function () {
        BI.IconButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconButton.EVENT_CHANGE, this);
        }
    }
});
BI.IconButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_button", BI.IconButton);/**
 * 图片的button
 *
 * Created by GUY on 2016/1/27.
 * @class BI.ImageButton
 * @extends BI.BasicButton
 */
BI.ImageButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.ImageButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-image-button",
            src: "",
            iconWidth: "100%",
            iconHeight: "100%"
        });
    },

    _init: function () {
        BI.ImageButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.image = BI.createWidget({
            type: "bi.img",
            width: o.iconWidth,
            height: o.iconHeight,
            src: o.src
        });
        if (BI.isNumber(o.iconWidth) || BI.isNumber(o.iconHeight)) {
            BI.createWidget({
                type: "bi.center_adapt",
                element: this,
                items: [this.image]
            });
        } else {
            BI.createWidget({
                type: "bi.adaptive",
                element: this,
                items: [this.image],
                scrollable: false
            });
        }
    },

    setWidth: function (w) {
        BI.ImageButton.superclass.setWidth.apply(this, arguments);
        this.options.width = w;
    },

    setHeight: function (h) {
        BI.ImageButton.superclass.setHeight.apply(this, arguments);
        this.options.height = h;
    },

    setImageWidth: function (w) {
        this.image.setWidth(w);
    },

    setImageHeight: function (h) {
        this.image.setHeight(h);
    },

    getImageWidth: function () {
        return this.image.element.width();
    },

    getImageHeight: function () {
        return this.image.element.height();
    },

    setSrc: function (src) {
        this.options.src = src;
        this.image.setSrc(src);
    },

    getSrc: function () {
        return this.image.getSrc();
    },

    doClick: function () {
        BI.ImageButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.ImageButton.EVENT_CHANGE, this);
        }
    }
});
BI.ImageButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.image_button", BI.ImageButton);
/**
 * 文字类型的按钮
 * @class BI.Button
 * @extends BI.BasicButton
 *
 * @cfg {JSON} options 配置属性
 * @cfg {'common'/'success'/'warning'/'ignore'} [options.level='common'] 按钮类型，用不同颜色强调不同的场景
 */
BI.Button = BI.inherit(BI.BasicButton, {

    _defaultConfig: function (props) {
        var conf = BI.Button.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-button" + ((BI.isIE() && BI.isIE9Below()) ? " hack" : ""),
            minWidth: (props.block === true || props.clear === true) ? 0 : 80,
            height: 24,
            shadow: props.clear !== true,
            isShadowShowingOnSelected: true,
            readonly: true,
            iconCls: "",
            level: "common",
            block: false, // 是否块状显示，即不显示边框，没有最小宽度的限制
            clear: false, // 是否去掉边框和背景
            ghost: false, // 是否幽灵显示, 即正常状态无背景
            textAlign: "center",
            whiteSpace: "nowrap",
            textWidth: null,
            textHeight: null,
            hgap: props.clear ? 0 : 10,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0
        });
    },

    _init: function () {
        BI.Button.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        if (BI.isNumber(o.height) && !o.clear && !o.block) {
            this.element.css({height: o.height + "px", lineHeight: (o.height - 2) + "px"});
        } else if (o.clear || o.block) {
            this.element.css({lineHeight: o.height + "px"});
        } else {
            this.element.css({lineHeight: (o.height - 2) + "px"});
        }
        if (BI.isKey(o.iconCls)) {
            this.icon = BI.createWidget({
                type: "bi.icon_label",
                cls: o.iconCls,
                width: 18,
                height: o.height - 2,
                iconWidth: o.iconWidth,
                iconHeight: o.iconHeight
            });
            this.text = BI.createWidget({
                type: "bi.label",
                text: o.text,
                value: o.value,
                height: o.height - 2
            });
            BI.createWidget({
                type: "bi.center_adapt",
                element: this,
                hgap: o.hgap,
                vgap: o.vgap,
                items: [{
                    type: "bi.horizontal",
                    items: [this.icon, this.text]
                }]
            });
        } else {
            this.text = BI.createWidget({
                type: "bi.label",
                textAlign: o.textAlign,
                whiteSpace: o.whiteSpace,
                textWidth: o.textWidth,
                textHeight: o.textHeight,
                hgap: o.hgap,
                vgap: o.vgap,
                tgap: o.tgap,
                bgap: o.bgap,
                lgap: o.lgap,
                rgap: o.rgap,
                element: this,
                text: o.text,
                value: o.value
            });
        }
        if (o.block === true) {
            this.element.addClass("block");
        }
        if (o.clear === true) {
            this.element.addClass("clear");
        }
        if (o.ghost === true) {
            this.element.addClass("ghost");
        }
        if (o.minWidth > 0) {
            this.element.css({"min-width": o.minWidth + "px"});
        }
    },

    doClick: function () {
        BI.Button.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.Button.EVENT_CHANGE, this);
        }
    },

    setText: function (text) {
        BI.Button.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    setValue: function (text) {
        BI.Button.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            this.text.setValue(text);
        }
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

    destroy: function () {
        BI.Button.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut("bi.button", BI.Button);
BI.Button.EVENT_CHANGE = "EVENT_CHANGE";
/**
 * guy
 * 可以点击的一行文字
 * @class BI.TextButton
 * @extends BI.BasicButton
 * 文字button
 */
BI.TextButton = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.TextButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-button",
            textAlign: "center",
            whiteSpace: "nowrap",
            textWidth: null,
            textHeight: null,
            hgap: 0,
            lgap: 0,
            rgap: 0,
            text: "",
            py: ""
        });
    },

    _init: function () {
        BI.TextButton.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textWidth: o.textWidth,
            textHeight: o.textHeight,
            width: o.width,
            height: o.height,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
    },

    doClick: function () {
        BI.TextButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextButton.EVENT_CHANGE, this.getValue(), this);
        }
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

    setText: function (text) {
        BI.TextButton.superclass.setText.apply(this, arguments);
        text = BI.isArray(text) ? text.join(",") : text;
        this.text.setText(text);
    },

    setStyle: function (style) {
        this.text.setStyle(style);
    },

    setValue: function (text) {
        BI.TextButton.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            text = BI.isArray(text) ? text.join(",") : text;
            this.text.setValue(text);
        }
    }
});
BI.TextButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_button", BI.TextButton);/**
 * 带有一个占位
 *
 * Created by GUY on 2015/9/11.
 * @class BI.BlankIconIconTextItem
 * @extends BI.BasicButton
 */
BI.BlankIconIconTextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.BlankIconIconTextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-blank-icon-text-item",
            logic: {
                dynamic: false
            },
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            blankWidth: 0,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.BlankIconIconTextItem.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        var blank = BI.createWidget({
            type: "bi.layout",
            width: o.blankWidth,
            height: o.height
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon1 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls1,
            forceNotSelected: true,
            width: o.height,
            height: o.height
        });
        this.icon2 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls2,
            forceNotSelected: true,
            width: o.height,
            height: o.height
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", blank, this.icon1, this.icon2, this.text)
        }))));
    },

    doClick: function () {
        BI.BlankIconIconTextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.BlankIconIconTextItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setSelected: function (b) {
        BI.BlankIconIconTextItem.superclass.setSelected.apply(this, arguments);
        this.icon1.setSelected(b);
        this.icon2.setSelected(b);
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
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
    }
});
BI.BlankIconIconTextItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.blank_icon_icon_text_item", BI.BlankIconIconTextItem);/**
 * guy
 * 一个占位符和两个icon和一行数 组成的一行listitem
 *
 * Created by GUY on 2015/9/15.
 * @class BI.BlankIconTextIconItem
 * @extends BI.BasicButton
 */
BI.BlankIconTextIconItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.BlankIconTextIconItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-blank-icon-text-icon-item",
            logic: {
                dynamic: false
            },
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            blankWidth: 0,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.BlankIconTextIconItem.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });

        var icon1 = BI.createWidget({
            type: "bi.icon_label",
            cls: o.iconCls1,
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_label",
                    cls: o.iconCls2,
                    width: o.height,
                    height: o.height,
                    iconWidth: o.iconWidth,
                    iconHeight: o.iconHeight
                },
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.layout",
                width: o.blankWidth
            }, icon1, this.text, {
                type: "bi.layout",
                width: o.height
            })
        }))));
    },

    doClick: function () {
        BI.BlankIconTextIconItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.BlankIconTextIconItem.EVENT_CHANGE, this.getValue(), this);
        }
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

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    }
});
BI.BlankIconTextIconItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.blank_icon_text_icon_item", BI.BlankIconTextIconItem);/**
 * 带有一个占位
 *
 * Created by GUY on 2015/9/11.
 * @class BI.BlankIconTextItem
 * @extends BI.BasicButton
 */
BI.BlankIconTextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.BlankIconTextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-blank-icon-text-item",
            logic: {
                dynamic: false
            },
            cls: "close-ha-font",
            blankWidth: 0,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.BlankIconTextItem.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        var blank = BI.createWidget({
            type: "bi.layout",
            width: o.blankWidth
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon = BI.createWidget({
            type: "bi.icon_label",
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", blank, this.icon, this.text)
        }))));
    },

    doClick: function () {
        BI.BlankIconTextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.BlankIconTextItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
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
    }
});
BI.BlankIconTextItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.blank_icon_text_item", BI.BlankIconTextItem);/**
 * guy
 * 两个icon和一行数 组成的一行listitem
 *
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextIconItem
 * @extends BI.BasicButton
 */
BI.IconTextIconItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.IconTextIconItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-icon-item",
            logic: {
                dynamic: false
            },
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.IconTextIconItem.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });

        var icon1 = BI.createWidget({
            type: "bi.icon_label",
            cls: o.iconCls1,
            width: o.leftIconWrapperWidth,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        var blank = BI.createWidget({
            type: "bi.layout",
            width: o.height
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_label",
                    cls: o.iconCls2,
                    width: o.rightIconWrapperWidth,
                    height: o.height,
                    iconWidth: o.iconWidth,
                    iconHeight: o.iconHeight
                },
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", icon1, this.text, blank)
        }))));
    },

    doClick: function () {
        BI.IconTextIconItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextIconItem.EVENT_CHANGE, this.getValue(), this);
        }
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

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    }
});
BI.IconTextIconItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_icon_item", BI.IconTextIconItem);/**
 * guy
 *
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextItem
 * @extends BI.BasicButton
 */
BI.IconTextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.IconTextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-item",
            direction: BI.Direction.Left,
            logic: {
                dynamic: false
            },
            iconWrapperWidth: null,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.IconTextItem.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon = BI.createWidget({
            type: "bi.icon_label",
            width: o.iconWrapperWidth || o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.icon, this.text)
        }))));
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    },

    doClick: function () {
        BI.IconTextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextItem.EVENT_CHANGE, this.getValue(), this);
        }
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
    }
});
BI.IconTextItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_item", BI.IconTextItem);/**
 *
 * 图标的button
 *
 * Created by GUY on 2015/9/9.
 * @class BI.TextIconItem
 * @extends BI.BasicButton
 */
BI.TextIconItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.TextIconItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-icon-item",
            logic: {
                dynamic: false
            },
            cls: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.TextIconItem.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon = BI.createWidget({
            type: "bi.icon_label",
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.text, this.icon)
        }))));
    },

    doClick: function () {
        BI.TextIconItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextIconItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
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
    }
});
BI.TextIconItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_icon_item", BI.TextIconItem);/**
 * guy
 * 一个button和一行数 组成的一行listitem
 *
 * Created by GUY on 2015/9/9.
 * @class BI.TextItem
 * @extends BI.BasicButton
 */
BI.TextItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.TextItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-item",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.TextItem.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textHeight: o.whiteSpace == "nowrap" ? o.height : o.textHeight,
            height: o.height,
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            py: o.py
        });
    },

    doClick: function () {
        BI.TextItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextItem.EVENT_CHANGE, this.getValue(), this);
        }
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

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    }
});
BI.TextItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_item", BI.TextItem);/**
 * guy
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextIconNode
 * @extends BI.NodeButton
 */
BI.IconTextIconNode = BI.inherit(BI.NodeButton, {

    _defaultConfig: function () {
        var conf = BI.IconTextIconNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-icon-node",
            logic: {
                dynamic: false
            },
            iconCls1: "close-ha-font",
            iconCls2: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.IconTextIconNode.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });

        var icon1 = BI.createWidget({
            type: "bi.icon_label",
            cls: o.iconCls1,
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        var blank = BI.createWidget({
            type: "bi.layout",
            width: o.height,
            height: o.height
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_label",
                    cls: o.iconCls2,
                    width: o.height,
                    iconWidth: o.iconWidth,
                    iconHeight: o.iconHeight
                },
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", icon1, this.text, blank)
        }))));
    },

    doClick: function () {
        BI.IconTextIconNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextIconNode.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    }
});
BI.IconTextIconNode.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_icon_node", BI.IconTextIconNode);/**
 * guy
 * Created by GUY on 2015/9/9.
 * @class BI.IconTextNode
 * @extends BI.NodeButton
 */
BI.IconTextNode = BI.inherit(BI.NodeButton, {

    _defaultConfig: function () {
        var conf = BI.IconTextNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-text-node",
            logic: {
                dynamic: false
            },
            cls: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.IconTextNode.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon = BI.createWidget({
            type: "bi.icon_label",
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.icon, this.text)
        }))));
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    },

    doClick: function () {
        BI.IconTextNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.IconTextNode.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    }
});
BI.IconTextNode.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_node", BI.IconTextNode);/**
 * Created by GUY on 2015/9/9.
 * @class BI.TextIconNode
 * @extends BI.NodeButton
 */
BI.TextIconNode = BI.inherit(BI.NodeButton, {

    _defaultConfig: function () {
        var conf = BI.TextIconNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-icon-node",
            logic: {
                dynamic: false
            },
            cls: "close-ha-font",
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.TextIconNode.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height
        });
        this.icon = BI.createWidget({
            type: "bi.icon_label",
            width: o.height,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.text, this.icon)
        }))));
    },

    doClick: function () {
        BI.TextIconNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextIconNode.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    }
});
BI.TextIconNode.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_icon_node", BI.TextIconNode);/**
 * guy
 *
 * Created by GUY on 2015/9/9.
 * @class BI.TextNode
 * @extends BI.NodeButton
 */
BI.TextNode = BI.inherit(BI.NodeButton, {

    _defaultConfig: function () {
        var conf = BI.TextNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-node",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        });
    },
    _init: function () {
        BI.TextNode.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textHeight: o.whiteSpace == "nowrap" ? o.height : o.textHeight,
            height: o.height,
            hgap: o.textHgap,
            vgap: o.textVgap,
            lgap: o.textLgap,
            rgap: o.textRgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            py: o.py
        });
    },

    doClick: function () {
        BI.TextNode.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TextNode.EVENT_CHANGE, this.getValue(), this);
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    getValue: function () {
        return this.text.getValue();
    },

    setText: function () {
        this.text.setText.apply(this.text, arguments);
    },

    getText: function () {
        return this.text.getText();
    }
});
BI.TextNode.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_node", BI.TextNode);/**
 * Created by GUY on 2015/4/15.
 * @class BI.Editor
 * @extends BI.Single
 */
BI.Editor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Editor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-editor bi-focus-shadow",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            // title,warningTitle这两个属性没用
            tipType: "warning",
            inputType: "text",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: ""
        });
    },

    _init: function () {
        BI.Editor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = this.addWidget(BI.createWidget({
            type: "bi.input",
            element: "<input type='" + o.inputType + "'/>",
            root: true,
            value: o.value,
            watermark: o.watermark,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank
        }));
        this.editor.element.css({
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            padding: "0",
            margin: "0"
        });
        if (BI.isKey(this.options.watermark)) {
            this._assertWaterMark();
        }

        var _items = [];
        if (this.watermark) {
            _items.push({
                el: this.watermark,
                left: 3,
                right: 3,
                top: 0,
                bottom: 0
            });
        }
        _items.push({
            el: this.editor,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        });

        var items = [{
            el: {
                type: "bi.absolute",
                ref: function(_ref) {
                    self.contentWrapper = _ref;
                },
                items: _items
            },
            left: o.hgap + o.lgap,
            right: o.hgap + o.rgap,
            top: o.vgap + o.tgap,
            bottom: o.vgap + o.bgap
        }];

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: items
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Input.EVENT_FOCUS, function () {
            self._checkError();
            self.element.addClass("bi-editor-focus");
            self.fireEvent(BI.Editor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Input.EVENT_BLUR, function () {
            self._setErrorVisible(false);
            self.element.removeClass("bi-editor-focus");
            self.fireEvent(BI.Editor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Input.EVENT_CLICK, function () {
            self.fireEvent(BI.Editor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Input.EVENT_CHANGE, function () {
            self.fireEvent(BI.Editor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Input.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.Editor.EVENT_KEY_DOWN, arguments);
        });
        this.editor.on(BI.Input.EVENT_QUICK_DOWN, function (e) {
            // tab键就不要隐藏了
            if (e.keyCode !== BI.KeyCode.TAB && self.watermark) {
                self.watermark.invisible();
            }
        });

        this.editor.on(BI.Input.EVENT_VALID, function () {
            self._checkWaterMark();
            self._setErrorVisible(false);
            self.fireEvent(BI.Editor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Input.EVENT_ERROR, function () {
            self._checkWaterMark();
            self.fireEvent(BI.Editor.EVENT_ERROR, arguments);
            self._setErrorVisible(self.isEditing());
        });
        this.editor.on(BI.Input.EVENT_RESTRICT, function () {
            self._checkWaterMark();
            var tip = self._setErrorVisible(true);
            tip && tip.element.fadeOut(100, function () {
                tip.element.fadeIn(100);
            });
            self.fireEvent(BI.Editor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Input.EVENT_EMPTY, function () {
            self._checkWaterMark();
            self.fireEvent(BI.Editor.EVENT_EMPTY, arguments);
        });
        this.editor.on(BI.Input.EVENT_ENTER, function () {
            self.fireEvent(BI.Editor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Input.EVENT_SPACE, function () {
            self.fireEvent(BI.Editor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Input.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.Editor.EVENT_BACKSPACE, arguments);
        });
        this.editor.on(BI.Input.EVENT_REMOVE, function () {
            self.fireEvent(BI.Editor.EVENT_REMOVE, arguments);
        });
        this.editor.on(BI.Input.EVENT_START, function () {
            self.fireEvent(BI.Editor.EVENT_START, arguments);
        });
        this.editor.on(BI.Input.EVENT_PAUSE, function () {
            self.fireEvent(BI.Editor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Input.EVENT_STOP, function () {
            self.fireEvent(BI.Editor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Input.EVENT_CONFIRM, function () {
            self.fireEvent(BI.Editor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Input.EVENT_CHANGE_CONFIRM, function () {
            self.fireEvent(BI.Editor.EVENT_CHANGE_CONFIRM, arguments);
        });
        this.element.click(function (e) {
            e.stopPropagation();
            return false;
        });
        if (BI.isKey(this.options.value) || BI.isEmptyString(this.options.value)) {
            this._checkError();
            this._checkWaterMark();
        } else {
            this._checkWaterMark();
        }
    },

    _checkToolTip: function () {
        var o = this.options;
        var errorText = o.errorText;
        if (BI.isFunction(errorText)) {
            errorText = errorText(this.editor.getValue());
        }
        if (BI.isKey(errorText)) {
            if (!this.isEnabled() || this.isValid() || (BI.Bubbles.has(this.getName()) && BI.Bubbles.get(this.getName()).isVisible())) {
                this.setTitle("");
            } else {
                this.setTitle(errorText);
            }
        }
    },

    _assertWaterMark: function() {
        var self = this, o = this.options;
        if(BI.isNull(this.watermark)) {
            this.watermark = BI.createWidget({
                type: "bi.label",
                cls: "bi-water-mark",
                text: this.options.watermark,
                height: o.height - 2 * (o.vgap + o.tgap),
                whiteSpace: "nowrap",
                textAlign: "left"
            });
            this.watermark.element.bind({
                mousedown: function (e) {
                    if (self.isEnabled()) {
                        self.editor.isEditing() || self.editor.focus();
                    } else {
                        self.editor.isEditing() && self.editor.blur();
                    }
                    e.stopEvent();
                }
            });
            this.watermark.element.bind("click", function (e) {
                if (self.isEnabled()) {
                    self.editor.isEditing() || self.editor.focus();
                } else {
                    self.editor.isEditing() && self.editor.blur();
                }
                e.stopEvent();
            });
        }
    },

    _checkError: function () {
        this._setErrorVisible(this.isEnabled() && !this.isValid());
        this._checkToolTip();
    },

    _checkWaterMark: function () {
        var o = this.options;
        if (!this.disabledWaterMark && this.editor.getValue() === "" && BI.isKey(o.watermark)) {
            this.watermark && this.watermark.visible();
        } else {
            this.watermark && this.watermark.invisible();
        }
    },

    setErrorText: function (text) {
        this.options.errorText = text;
    },

    getErrorText: function () {
        return this.options.errorText;
    },

    setWaterMark: function(v) {
        this.options.watermark = v;
        if(BI.isNull(this.watermark)) {
            this._assertWaterMark();
            BI.createWidget({
                type: "bi.absolute",
                element: this.contentWrapper,
                items: [{
                    el: this.watermark,
                    left: 3,
                    right: 3,
                    top: 0,
                    bottom: 0
                }]
            })
        }
        BI.isKey(v) && this.watermark.setText(v);
    },

    _setErrorVisible: function (b) {
        var o = this.options;
        var errorText = o.errorText;
        if (BI.isFunction(errorText)) {
            errorText = errorText(BI.trim(this.editor.getValue()));
        }
        if (!this.disabledError && BI.isKey(errorText)) {
            BI.Bubbles[b ? "show" : "hide"](this.getName(), errorText, this, {
                adjustYOffset: 2
            });
            this._checkToolTip();
            return BI.Bubbles.get(this.getName());
        }
    },

    disableError: function () {
        this.disabledError = true;
        this._checkError();
    },

    enableError: function () {
        this.disabledError = false;
        this._checkError();
    },

    disableWaterMark: function () {
        this.disabledWaterMark = true;
        this._checkWaterMark();
    },

    enableWaterMark: function () {
        this.disabledWaterMark = false;
        this._checkWaterMark();
    },

    focus: function () {
        this.element.addClass("text-editor-focus");
        this.editor.focus();
    },

    blur: function () {
        this.element.removeClass("text-editor-focus");
        this.editor.blur();
    },

    selectAll: function () {
        this.editor.selectAll();
    },

    onKeyDown: function (k) {
        this.editor.onKeyDown(k);
    },

    setValue: function (v) {
        BI.Editor.superclass.setValue.apply(this, arguments);
        this.editor.setValue(v);
        this._checkError();
        this._checkWaterMark();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    getLastChangedValue: function () {
        return this.editor.getLastChangedValue();
    },

    getValue: function () {
        if (!this.isValid()) {
            return BI.trim(this.editor.getLastValidValue());
        }
        return BI.trim(this.editor.getValue());
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    destroyed: function () {
        BI.Bubbles.remove(this.getName());
    }
});
BI.Editor.EVENT_CHANGE = "EVENT_CHANGE";
BI.Editor.EVENT_FOCUS = "EVENT_FOCUS";
BI.Editor.EVENT_BLUR = "EVENT_BLUR";
BI.Editor.EVENT_CLICK = "EVENT_CLICK";
BI.Editor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.Editor.EVENT_SPACE = "EVENT_SPACE";
BI.Editor.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.Editor.EVENT_START = "EVENT_START";
BI.Editor.EVENT_PAUSE = "EVENT_PAUSE";
BI.Editor.EVENT_STOP = "EVENT_STOP";
BI.Editor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.Editor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.Editor.EVENT_VALID = "EVENT_VALID";
BI.Editor.EVENT_ERROR = "EVENT_ERROR";
BI.Editor.EVENT_ENTER = "EVENT_ENTER";
BI.Editor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.Editor.EVENT_REMOVE = "EVENT_REMOVE";
BI.Editor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.editor", BI.Editor);/**
 * 多文件
 *
 * Created by GUY on 2016/4/13.
 * @class BI.MultifileEditor
 * @extends BI.Single
 * @abstract
 */
BI.MultifileEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.MultifileEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-multifile-editor",
            multiple: false,
            maxSize: -1, // 1024 * 1024
            accept: "",
            url: ""
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.MultifileEditor.superclass._init.apply(this, arguments);
        this.file = BI.createWidget({
            type: "bi.file",
            cls: "multifile-editor",
            width: "100%",
            height: "100%",
            name: o.name,
            url: o.url,
            multiple: o.multiple,
            accept: o.accept,
            maxSize: o.maxSize,
            title: o.title
        });
        this.file.on(BI.File.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_CHANGE, arguments);
        });
        this.file.on(BI.File.EVENT_UPLOADSTART, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_UPLOADSTART, arguments);
        });
        this.file.on(BI.File.EVENT_ERROR, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_ERROR, arguments);
        });
        this.file.on(BI.File.EVENT_PROGRESS, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_PROGRESS, arguments);
        });
        this.file.on(BI.File.EVENT_UPLOADED, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_UPLOADED, arguments);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.adaptive",
                    scrollable: false,
                    items: [this.file]
                },
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
            }]
        });
    },

    select: function () {
        this.file.select();
    },

    getValue: function () {
        return this.file.getValue();
    },

    upload: function () {
        this.file.upload();
    },

    reset: function () {
        this.file.reset();
    }
});
BI.MultifileEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultifileEditor.EVENT_UPLOADSTART = "EVENT_UPLOADSTART";
BI.MultifileEditor.EVENT_ERROR = "EVENT_ERROR";
BI.MultifileEditor.EVENT_PROGRESS = "EVENT_PROGRESS";
BI.MultifileEditor.EVENT_UPLOADED = "EVENT_UPLOADED";
BI.shortcut("bi.multifile_editor", BI.MultifileEditor);/**
 *
 * Created by GUY on 2016/1/18.
 * @class BI.TextAreaEditor
 * @extends BI.Single
 */
BI.TextAreaEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.TextAreaEditor.superclass._defaultConfig.apply(), {
            baseCls: "bi-textarea-editor",
            value: ""
        });
    },

    render: function() {
        var o = this.options, self = this;
        this.content = BI.createWidget({
            type: "bi.layout",
            tagName: "textarea",
            width: "100%",
            height: "100%",
            cls: "bi-textarea textarea-editor-content display-block"
        });
        this.content.element.css({resize: "none"});
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.adaptive",
                    items: [this.content]
                },
                left: 4,
                right: 4,
                top: 4,
                bottom: 8
            }]
        });

        this.content.element.on("input propertychange", function (e) {
            self._checkWaterMark();
            self.fireEvent(BI.TextAreaEditor.EVENT_CHANGE);
        });

        this.content.element.focus(function () {
            if (self.isValid()) {
                self._focus();
                self.fireEvent(BI.TextAreaEditor.EVENT_FOCUS);
            }
            BI.Widget._renderEngine.createElement(document).bind("mousedown." + self.getName(), function (e) {
                if (BI.DOM.isExist(self) && !self.element.__isMouseInBounds__(e)) {
                    BI.Widget._renderEngine.createElement(document).unbind("mousedown." + self.getName());
                    self.content.element.blur();
                }
            });
        });
        this.content.element.blur(function () {
            if (self.isValid()) {
                self._blur();
                self.fireEvent(BI.TextAreaEditor.EVENT_BLUR);
            }
            BI.Widget._renderEngine.createElement(document).unbind("mousedown." + self.getName());
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
        if (BI.isNotNull(o.style)) {
            this.setStyle(o.style);
        }
        this._checkWaterMark();
    },

    _checkWaterMark: function () {
        var self = this, o = this.options;
        var val = this.getValue();
        if (BI.isNotEmptyString(val)) {
            this.watermark && this.watermark.destroy();
            this.watermark = null;
        } else {
            if (BI.isNotEmptyString(o.watermark)) {
                if (!this.watermark) {
                    this.watermark = BI.createWidget({
                        type: "bi.text_button",
                        cls: "bi-water-mark cursor-default",
                        textAlign: "left",
                        whiteSpace: "normal",
                        text: o.watermark,
                        invalid: o.invalid,
                        disabled: o.disabled
                    });
                    this.watermark.on(BI.TextButton.EVENT_CHANGE, function () {
                        self.focus();
                    });
                    BI.createWidget({
                        type: "bi.absolute",
                        element: this,
                        items: [{
                            el: this.watermark,
                            left: 4,
                            top: 4,
                            right: 0
                        }]
                    });
                } else {
                    this.watermark.setText(o.watermark);
                    this.watermark.setValid(!o.invalid);
                    this.watermark.setEnable(!o.disabled);
                }
            }
        }
    },

    _focus: function () {
        this.content.element.addClass("textarea-editor-focus");
        this._checkWaterMark();
    },

    _blur: function () {
        this.content.element.removeClass("textarea-editor-focus");
        this._checkWaterMark();
    },

    focus: function () {
        this._focus();
        this.content.element.focus();
    },

    blur: function () {
        this._blur();
        this.content.element.blur();
    },

    getValue: function () {
        return this.content.element.val();
    },

    setValue: function (value) {
        this.content.element.val(value);
        this._checkWaterMark();
    },

    setStyle: function (style) {
        this.style = style;
        this.element.css(style);
        this.content.element.css(BI.extend({}, style, {
            color: style.color || BI.DOM.getContrastColor(BI.DOM.isRGBColor(style.backgroundColor) ? BI.DOM.rgb2hex(style.backgroundColor) : style.backgroundColor)
        }));
    },

    getStyle: function () {
        return this.style;
    },

    _setValid: function (b) {
        BI.TextAreaEditor.superclass._setValid.apply(this, arguments);
        // this.content.setValid(b);
        // this.watermark && this.watermark.setValid(b);
    },

    _setEnable: function (b) {
        BI.TextAreaEditor.superclass._setEnable.apply(this, [b]);
        this.content && (this.content.element[0].disabled = !b);
    }
});
BI.TextAreaEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextAreaEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextAreaEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.textarea_editor", BI.TextAreaEditor);/**
 * guy 表示一行数据，通过position来定位位置的数据
 * @class BI.Html
 * @extends BI.Single
 */
BI.Html = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-html",
        textAlign: "left",
        whiteSpace: "normal",
        lineHeight: null,
        handler: null, // 如果传入handler,表示处理文字的点击事件，不是区域的
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0,
        text: "",
        highLight: false
    },

    render: function () {
        var self = this, o = this.options;
        if (o.hgap + o.lgap > 0) {
            this.element.css({
                "padding-left": o.hgap + o.lgap + "px"
            });
        }
        if (o.hgap + o.rgap > 0) {
            this.element.css({
                "padding-right": o.hgap + o.rgap + "px"
            });
        }
        if (o.vgap + o.tgap > 0) {
            this.element.css({
                "padding-top": o.vgap + o.tgap + "px"
            });
        }
        if (o.vgap + o.bgap > 0) {
            this.element.css({
                "padding-bottom": o.vgap + o.bgap + "px"
            });
        }
        if (BI.isNumber(o.height)) {
            this.element.css({lineHeight: o.height + "px"});
        }
        if (BI.isNumber(o.lineHeight)) {
            this.element.css({lineHeight: o.lineHeight + "px"});
        }
        if (BI.isWidthOrHeight(o.maxWidth)) {
            this.element.css({maxWidth: o.maxWidth});
        }
        this.element.css({
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            textOverflow: o.whiteSpace === 'nowrap' ? "ellipsis" : "",
            overflow: o.whiteSpace === "nowrap" ? "" : "auto"
        });
        if (o.handler) {
            this.text = BI.createWidget({
                type: "bi.layout",
                tagName: "span"
            });
            this.text.element.click(function () {
                o.handler(self.getValue());
            });
            BI.createWidget({
                type: "bi.default",
                element: this,
                items: [this.text]
            });
        } else {
            this.text = this;
        }

        if (BI.isKey(o.text)) {
            this.setText(o.text);
        } else if (BI.isKey(o.value)) {
            this.setText(o.value);
        }
        if (o.highLight) {
            this.doHighLight();
        }
    },

    doHighLight: function () {
        this.text.element.addClass("bi-high-light");
    },

    unHighLight: function () {
        this.text.element.removeClass("bi-high-light");
    },

    setValue: function (text) {
        BI.Html.superclass.setValue.apply(this, arguments);
        if (!this.isReadOnly()) {
            this.setText(text);
        }
    },

    setStyle: function (css) {
        this.text.element.css(css);
    },

    setText: function (text) {
        BI.Html.superclass.setText.apply(this, arguments);
        this.options.text = text;
        this.text.element.html(text);
    }
});

BI.shortcut("bi.html", BI.Html);/**
 * guy 图标
 * @class BI.Icon
 * @extends BI.Single
 */
BI.Icon = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Icon.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "i",
            baseCls: (conf.baseCls || "") + " x-icon b-font horizon-center display-block"
        });
    },
    _init: function () {
        BI.Icon.superclass._init.apply(this, arguments);
        if (BI.isIE9Below && BI.isIE9Below()) {
            this.element.addClass("hack");
        }
    }
});
BI.shortcut("bi.icon", BI.Icon);/**
 * @class BI.Iframe
 * @extends BI.Single
 * @abstract
 * Created by GameJian on 2016/3/2.
 */
BI.Iframe = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Iframe.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "iframe",
            baseCls: (conf.baseCls || "") + " bi-iframe",
            src: "",
            name: "",
            attributes: {},
            width: "100%",
            height: "100%"
        });
    },

    _init: function () {
        var o = this.options;
        o.attributes.frameborder = "0";
        o.attributes.src = o.src;
        o.attributes.name = o.name;
        BI.Iframe.superclass._init.apply(this, arguments);
    },

    setSrc: function (src) {
        this.options.src = src;
        this.element.attr("src", src);
    },

    getSrc: function () {
        return this.options.src;
    },

    setName: function (name) {
        this.options.name = name;
        this.element.attr("name", name);
    },

    getName: function () {
        return this.options.name;
    }
});

BI.shortcut("bi.iframe", BI.Iframe);/**
 * ͼƬ
 *
 * Created by GUY on 2016/1/26.
 * @class BI.Img
 * @extends BI.Single
 * @abstract
 */
BI.Img = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Img.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            tagName: "img",
            baseCls: (conf.baseCls || "") + " bi-img display-block",
            src: "",
            attributes: {},
            width: "100%",
            height: "100%"
        });
    },

    _init: function () {
        var o = this.options;
        o.attributes.src = o.src;
        BI.Img.superclass._init.apply(this, arguments);
    },

    setSrc: function (src) {
        this.options.src = src;
        this.element.attr("src", src);
    },

    getSrc: function () {
        return this.options.src;
    }
});

BI.shortcut("bi.img", BI.Img);
/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.ImageCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        var conf = BI.ImageCheckbox.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-image-checkbox check-box-icon",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16
        });
    }
});
BI.ImageCheckbox.EVENT_CHANGE = BI.IconButton.EVENT_CHANGE;

BI.shortcut("bi.image_checkbox", BI.ImageCheckbox);/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Checkbox = BI.inherit(BI.BasicButton, {

    props: {
        baseCls: "bi-checkbox",
        selected: false,
        handler: BI.emptyFn,
        width: 16,
        height: 16,
        iconWidth: 16,
        iconHeight: 16
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.default",
                ref: function (_ref) {
                    self.checkbox = _ref;
                },
                cls: "checkbox-content",
                width: o.iconWidth - 2,
                height: o.iconHeight - 2
            }]
        };
    },

    _setEnable: function (enable) {
        BI.Checkbox.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.checkbox.element.removeClass("base-disabled disabled");
        } else {
            this.checkbox.element.addClass("base-disabled disabled");
        }
    },

    doClick: function () {
        BI.Checkbox.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.Checkbox.EVENT_CHANGE);
        }
    },

    setSelected: function (b) {
        BI.Checkbox.superclass.setSelected.apply(this, arguments);
        if (b) {
            this.checkbox.element.addClass("bi-high-light-background");
        } else {
            this.checkbox.element.removeClass("bi-high-light-background");
        }
    }
});
BI.Checkbox.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.checkbox", BI.Checkbox);/**
 * 文件
 *
 * Created by GUY on 2016/1/27.
 * @class BI.File
 * @extends BI.Single
 * @abstract
 */
(function (document) {

    /**
     * @description normalize input.files. create if not present, add item method if not present
     * @param       Object      generated wrap object
     * @return      Object      the wrap object itself
     */
    var F = (function (item) {
        return function (input) {
            var files = input.files || [input];
            if (!files.item) {
                files.item = item;
            }
            return files;
        };
    })(function (i) {
        return this[i];
    });

    var event = {

        /**
         * @description add an event via addEventListener or attachEvent
         * @param       DOMElement  the element to add event
         * @param       String      event name without "on" (e.g. "mouseover")
         * @param       Function    the callback to associate as event
         * @return      Object      noswfupload.event
         */
        add: document.addEventListener ?
            function (node, name, callback) {
                node.addEventListener(name, callback, false);
                return this;
            } :
            function (node, name, callback) {
                node.attachEvent("on" + name, callback);
                return this;
            },

        /**
         * @description remove an event via removeEventListener or detachEvent
         * @param       DOMElement  the element to remove event
         * @param       String      event name without "on" (e.g. "mouseover")
         * @param       Function    the callback associated as event
         * @return      Object      noswfupload.event
         */
        del: document.removeEventListener ?
            function (node, name, callback) {
                node.removeEventListener(name, callback, false);
                return this;
            } :
            function (node, name, callback) {
                node.detachEvent("on" + name, callback);
                return this;
            },

        /**
         * @description to block event propagation and prevent event default
         * @param       void        generated event or undefined
         * @return      Boolean     false
         */
        stop: function (e) {
            if (!e) {
                if (self.event) {
                    event.returnValue = !(event.cancelBubble = true);
                }
            } else {
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            }

            return false;
        }
    };

    var sendFile = (function (toString) {
        var multipart = function (boundary, name, file) {
                return "--".concat(
                    boundary, CRLF,
                    "Content-Disposition: form-data; name=\"", name, "\"; filename=\"", _global.encodeURIComponent(file.fileName), "\"", CRLF,
                    "Content-Type: application/octet-stream", CRLF,
                    CRLF,
                    file.getAsBinary(), CRLF,
                    "--", boundary, "--", CRLF
                );
            },
            isFunction = function (Function) {
                return toString.call(Function) === "[object Function]";
            },
            split = "onabort.onerror.onloadstart.onprogress".split("."),
            length = split.length,
            CRLF = "\r\n",
            xhr = this.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
            sendFile;

        // FireFox 3+, Safari 4 beta (Chrome 2 beta file is buggy and will not work)
        if (xhr.upload || xhr.sendAsBinary) {
            sendFile = function (handler, maxSize, width, height) {
                if (-1 < maxSize && maxSize < handler.file.fileSize) {
                    if (isFunction(handler.onerror)) {
                        handler.onerror();
                    }
                    return;
                }
                for (var
                         xhr = new XMLHttpRequest,
                         upload = xhr.upload || {
                             addEventListener: function (event, callback) {
                                 this["on" + event] = callback;
                             }
                         },
                         i = 0;
                     i < length;
                     i++
                ) {
                    upload.addEventListener(
                        split[i].substring(2),
                        (function (event) {
                            return function (rpe) {
                                if (isFunction(handler[event])) {
                                    handler[event](rpe, xhr);
                                }
                            };
                        })(split[i]),
                        false
                    );
                }
                upload.addEventListener(
                    "load",
                    function (rpe) {
                        if (handler.onreadystatechange === false) {
                            if (isFunction(handler.onload)) {
                                handler.onload(rpe, xhr);
                            }
                        } else {
                            setTimeout(function () {
                                if (xhr.readyState === 4) {
                                    if (isFunction(handler.onload)) {
                                        handler.onload(rpe, xhr);
                                    }
                                } else {
                                    setTimeout(arguments.callee, 15);
                                }
                            }, 15);
                        }
                    },
                    false
                );
                xhr.open("post", handler.url + "&filename=" + _global.encodeURIComponent(handler.file.fileName), true);
                if (!xhr.upload) {
                    var rpe = {loaded: 0, total: handler.file.fileSize || handler.file.size, simulation: true};
                    rpe.interval = setInterval(function () {
                        rpe.loaded += 1024 / 4;
                        if (rpe.total <= rpe.loaded) {
                            rpe.loaded = rpe.total;
                        }
                        upload.onprogress(rpe);
                    }, 100);
                    xhr.onabort = function () {
                        upload.onabort({});
                    };
                    xhr.onerror = function () {
                        upload.onerror({});
                    };
                    xhr.onreadystatechange = function () {
                        switch (xhr.readyState) {
                            case    2:
                            case    3:
                                if (rpe.total <= rpe.loaded) {
                                    rpe.loaded = rpe.total;
                                }
                                upload.onprogress(rpe);
                                break;
                            case    4:
                                clearInterval(rpe.interval);
                                rpe.interval = 0;
                                rpe.loaded = rpe.total;
                                upload.onprogress(rpe);
                                if (199 < xhr.status && xhr.status < 400) {
                                    upload["onload"]({});
                                    var attachO = BI.jsonDecode(xhr.responseText);
                                    attachO.filename = handler.file.fileName;
                                    if (handler.file.type.indexOf("image") != -1) {
                                        attachO.attach_type = "image";
                                    }
                                    handler.attach_array.push(attachO);
                                } else {
                                    upload["onerror"]({});
                                }
                                break;
                        }
                    };
                    upload.onloadstart(rpe);
                } else {
                    xhr.onreadystatechange = function () {
                        switch (xhr.readyState) {
                            case    4:
                                var attachO = BI.jsonDecode(xhr.responseText);
                                if (handler.file.type.indexOf("image") != -1) {
                                    attachO.attach_type = "image";
                                }
                                attachO.filename = handler.file.fileName;
                                if (handler.maxlength == 1) {
                                    handler.attach_array[0] = attachO;
                                    //                                   handler.attach_array.push(attachO);
                                } else {
                                    handler.attach_array.push(attachO);
                                }
                                break;
                        }
                    };
                    if (isFunction(upload.onloadstart)) {
                        upload.onloadstart();
                    }
                }
                var boundary = "AjaxUploadBoundary" + (new Date).getTime();
                xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
                if (handler.file.getAsBinary) {
                    xhr[xhr.sendAsBinary ? "sendAsBinary" : "send"](multipart(boundary, handler.name, handler.file));
                } else {
                    xhr.setRequestHeader("Content-Type", "multipart/form-data");
                    //                    xhr.setRequestHeader("X-Name", handler.name);
                    //                    xhr.setRequestHeader("X-File-Name", handler.file.fileName);
                    var form = new FormData();
                    form.append("FileData", handler.file);
                    xhr.send(form);
                }
                return handler;
            };
        }
        // Internet Explorer, Opera, others
        else {
            sendFile = function (handler, maxSize, width, height) {
                var url = handler.url.concat(-1 === handler.url.indexOf("?") ? "?" : "&", "AjaxUploadFrame=true"),
                    rpe = {
                        loaded: 1, total: 100, simulation: true, interval: setInterval(function () {
                            if (rpe.loaded < rpe.total) {
                                ++rpe.loaded;
                            }
                            if (isFunction(handler.onprogress)) {
                                handler.onprogress(rpe, {});
                            }
                        }, 100)
                    },
                    onload = function () {
                        iframe.onreadystatechange = iframe.onload = iframe.onerror = null;
                        form.parentNode.removeChild(form);
                        form = null;
                        clearInterval(rpe.interval);
                        // rpe.loaded = rpe.total;
                        try {
                            var responseText = (iframe.contentWindow.document || iframe.contentWindow.contentDocument).body.innerHTML;
                            var attachO = BI.jsonDecode(responseText);
                            if (handler.file.type.indexOf("image") != -1) {
                                attachO.attach_type = "image";
                            }

                            // attachO.fileSize = responseText.length;
                            try {
                                // decodeURIComponent特殊字符可能有问题, catch一下，保证能正常上传
                                attachO.filename = _global.decodeURIComponent(handler.file.fileName);
                            } catch (e) {
                                attachO.filename = handler.file.fileName;
                            }
                            if (handler.maxlength == 1) {
                                handler.attach_array[0] = attachO;
                            } else {
                                handler.attach_array.push(attachO);
                            }
                        } catch (e) {
                            if (isFunction(handler.onerror)) {
                                handler.onerror(rpe, event || _global.event);
                            }
                        }
                        if (isFunction(handler.onload)) {
                            handler.onload(rpe, {responseText: responseText});
                        }
                    },
                    target = ["AjaxUpload", (new Date).getTime(), String(Math.random()).substring(2)].join("_");
                try { // IE < 8 does not accept enctype attribute ...
                    var form = document.createElement("<form enctype=\"multipart/form-data\"></form>"),
                        iframe = handler.iframe || (handler.iframe = document.createElement("<iframe id=\"" + target + "\" name=\"" + target + "\" src=\"" + url + "\"></iframe>"));
                } catch (e) {
                    var form = document.createElement("form"),
                        iframe = handler.iframe || (handler.iframe = document.createElement("iframe"));
                    form.setAttribute("enctype", "multipart/form-data");
                    iframe.setAttribute("name", iframe.id = target);
                    iframe.setAttribute("src", url);
                }
                iframe.style.position = "absolute";
                iframe.style.left = iframe.style.top = "-10000px";
                iframe.onload = onload;
                iframe.onerror = function (event) {
                    if (isFunction(handler.onerror)) {
                        handler.onerror(rpe, event || _global.event);
                    }
                };
                iframe.onreadystatechange = function () {
                    if (/loaded|complete/i.test(iframe.readyState)) {
                        onload();

                        // wei : todo,将附件信息放到handler.attach
                    } else if (isFunction(handler.onloadprogress)) {
                        if (rpe.loaded < rpe.total) {
                            ++rpe.loaded;
                        }
                        handler.onloadprogress(rpe, {
                            readyState: {
                                loading: 2,
                                interactive: 3,
                                loaded: 4,
                                complete: 4
                            }[iframe.readyState] || 1
                        });
                    }
                };
                form.setAttribute("action", handler.url + "&filename=" + _global.encodeURIComponent(handler.file.fileName));
                form.setAttribute("target", iframe.id);
                form.setAttribute("method", "post");
                form.appendChild(handler.file);
                form.style.display = "none";
                if (isFunction(handler.onloadstart)) {
                    handler.onloadstart(rpe, {});
                }
                with (document.body || document.documentElement) {
                    appendChild(iframe);
                    appendChild(form);
                    form.submit();
                }

                return handler;
            };
        }
        xhr = null;
        return sendFile;
    })(Object.prototype.toString);

    var sendFiles = function (handler, maxSize, width, height) {

        var length = handler.files.length,
            i = 0,
            onload = handler.onload,
            onloadstart = handler.onloadstart;
        handler.current = 0;
        handler.total = 0;
        handler.sent = 0;
        while (handler.current < length) {
            handler.total += (handler.files[handler.current].fileSize || handler.files[handler.current].size);
            handler.current++;
        }
        handler.current = 0;
        if (length && handler.files[0].fileSize !== -1) {
            handler.file = handler.files[handler.current];

            sendFile(handler, maxSize, width, height).onload = function (rpe, xhr) {
                handler.onloadstart = null;
                handler.sent += (handler.files[handler.current].fileSize || handler.files[handler.current].size);
                if (++handler.current < length) {
                    handler.file = handler.files[handler.current];
                    sendFile(handler, maxSize, width, height).onload = arguments.callee;
                } else if (onload) {
                    handler.onloadstart = onloadstart;
                    handler.onload = onload;
                    handler.onload(rpe, xhr);
                }
            };
        } else if (length) {
            handler.total = length * 100;
            handler.file = handler.files[handler.current];
            sendFile(handler, maxSize, width, height).onload = function (rpe, xhr) {
                var callee = arguments.callee;
                handler.onloadstart = null;
                handler.sent += 100;
                if (++handler.current < length) {
                    if (/\b(chrome|safari)\b/i.test(navigator.userAgent)) {
                        handler.iframe.parentNode.removeChild(handler.iframe);
                        handler.iframe = null;
                    }
                    setTimeout(function () {
                        handler.file = handler.files[handler.current];
                        sendFile(handler, maxSize, width, height).onload = callee;
                    }, 15);
                } else if (onload) {
                    setTimeout(function () {
                        handler.iframe.parentNode.removeChild(handler.iframe);
                        handler.iframe = null;
                        handler.onloadstart = onloadstart;
                        handler.onload = onload;
                        handler.onload(rpe, xhr);
                    }, 15);
                }
            };
        }
        return handler;
    };

    BI.File = BI.inherit(BI.Single, {
        _defaultConfig: function () {
            var conf = BI.File.superclass._defaultConfig.apply(this, arguments);
            return BI.extend(conf, {
                baseCls: (conf.baseCls || "") + " bi-file display-block",
                tagName: "input",
                attributes: {
                    type: "file"
                },
                name: "",
                url: "",
                multiple: true,
                accept: "", /** '*.jpg; *.zip'**/
                maxSize: -1 // 1024 * 1024
            });
        },

        _init: function () {
            var self = this, o = this.options;
            BI.File.superclass._init.apply(this, arguments);
            if (o.multiple === true) {
                this.element.attr("multiple", "multiple");
            }
            this.element.attr("name", o.name || this.getName());
            this.element.attr("title", o.title || "");
        },

        created: function () {
            var self = this, o = this.options;
            // create the noswfupload.wrap Object
            // wrap.maxSize 文件大小限制
            // wrap.maxlength 文件个数限制
            var _wrap = this.wrap = this._wrap(this.element[0], o.maxSize);
            // fileType could contain whatever text but filter checks *.{extension}
            // if present

            // handlers

            _wrap.onloadstart = function (rpe, xhr) {
                // BI.Msg.toast("loadstart");
                self.fireEvent(BI.File.EVENT_UPLOADSTART, arguments);
            };

            _wrap.onprogress = function (rpe, xhr) {
                // BI.Msg.toast("onprogress");
                // percent for each bar

                // fileSize is -1 only if browser does not support file info access
                // this if splits recent browsers from others
                if (this.file.fileSize !== -1) {
                    // simulation property indicates when the progress event is fake
                    if (rpe.simulation) {

                    } else {

                    }
                } else {
                    // if fileSIze is -1 browser is using an iframe because it does
                    // not support
                    // files sent via Ajax (XMLHttpRequest)
                    // We can still show some information
                }
                self.fireEvent(BI.File.EVENT_PROGRESS, {
                    file: this.file,
                    total: rpe.total,
                    loaded: rpe.loaded,
                    simulation: rpe.simulation
                });
            };

            // generated if there is something wrong during upload
            _wrap.onerror = function () {
                // just inform the user something was wrong
                self.fireEvent(BI.File.EVENT_ERROR);
            };

            // generated when every file has been sent (one or more, it does not
            // matter)
            _wrap.onload = function (rpe, xhr) {
                var self_ = this;
                // just show everything is fine ...
                // ... and after a second reset the component
                setTimeout(function () {
                    self_.clean(); // remove files from list
                    self_.hide(); // hide progress bars and enable input file

                    if (200 > xhr.status || xhr.status > 399) {
                        BI.Msg.toast(BI.i18nText("BI-Upload_File_Error"), {level: "error"});
                        self.fireEvent(BI.File.EVENT_ERROR);
                        return;
                    }
                    var error = BI.some(_wrap.attach_array, function (index, attach) {
                        if (attach.errorCode) {
                            BI.Msg.toast(attach.errorMsg, {level: "error"});
                            self.fireEvent(BI.File.EVENT_ERROR, attach);
                            return true;
                        }
                    });
                    !error && self.fireEvent(BI.File.EVENT_UPLOADED);
                    // enable again the submit button/element
                }, 1000);
            };
            _wrap.url = o.url;
            _wrap.fileType = o.accept;   // 文件类型限制
            _wrap.attach_array = [];
            _wrap.attach_names = [];
            _wrap.attachNum = 0;
        },

        _events: function (wrap) {
            var self = this;
            event.add(wrap.dom.input, "change", function () {
                event.del(wrap.dom.input, "change", arguments.callee);
                for (var input = wrap.dom.input.cloneNode(true), i = 0, files = F(wrap.dom.input); i < files.length; i++) {
                    var item = files.item(i);
                    var tempFile = item.value || item.name;
                    var value = item.fileName || (item.fileName = tempFile.split("\\").pop()),
                        ext = -1 !== value.indexOf(".") ? value.split(".").pop().toLowerCase() : "unknown",
                        size = item.fileSize || item.size;
                    if (wrap.fileType && -1 === wrap.fileType.indexOf("*." + ext)) {
                        // 文件类型不支持
                        BI.Msg.toast(BI.i18nText("BI-Upload_File_Type_Error"), {level: "error"});
                        self.fireEvent(BI.File.EVENT_ERROR, {
                            errorType: 0,
                            file: item
                        });
                    } else if (wrap.maxSize !== -1 && size && wrap.maxSize < size) {
                        // 文件大小不支持
                        BI.Msg.toast(BI.i18nText("BI-Upload_File_Size_Error"), {level: "error"});
                        self.fireEvent(BI.File.EVENT_ERROR, {
                            errorType: 1,
                            file: item
                        });
                    } else {
                        wrap.files.unshift(item);
                        // BI.Msg.toast(value);
                    }
                }
                wrap.files.length > 0 && self.fireEvent(BI.File.EVENT_CHANGE, {
                    files: wrap.files
                });
                input.value = "";
                wrap.dom.input.parentNode.replaceChild(input, wrap.dom.input);
                wrap.dom.input = input;
                event.add(wrap.dom.input, "change", arguments.callee);
            });
            return wrap;
        },

        _wrap: function () {
            var self = this, o = this.options;
            // be sure input accept multiple files
            var input = this.element[0];
            if (o.multiple === true) {
                this.element.attr("multiple", "multiple");
            }
            input.value = "";

            // wrap Object
            return this._events({

                // DOM namespace
                dom: {
                    input: input,        // input file
                    disabled: false      // internal use, checks input file state
                },
                name: input.name,        // name to send for each file ($_FILES[{name}] in the server)
                // maxSize is the maximum amount of bytes for each file
                maxSize: o.maxSize ? o.maxSize >> 0 : -1,
                files: [],               // file list

                // remove every file from the noswfupload component
                clean: function () {
                    this.files = [];
                },

                // upload one file a time (which make progress possible rather than all files in one shot)
                // the handler is an object injected into the wrap one, could be the wrap itself or
                // something like {onload:function(){alert("OK")},onerror:function(){alert("Error")}, etc ...}
                upload: function (handler) {
                    if (handler) {
                        for (var key in handler) {
                            this[key] = handler[key];
                        }
                    }
                    sendFiles(this, this.maxSize);
                    return this;
                },

                // hide progress bar (total + current) and enable files selection
                hide: function () {
                    if (this.dom.disabled) {
                        this.dom.disabled = false;
                        this.dom.input.removeAttribute("disabled");
                    }
                },

                // show progress bar and disable file selection (used during upload)
                // total and current are pixels used to style bars
                // totalProp and currentProp are properties to change, "height" by default
                show: function (total, current, totalProp, currentProp) {
                    if (!this.dom.disabled) {
                        this.dom.disabled = true;
                        this.dom.input.setAttribute("disabled", "disabled");
                    }
                }
            });
        },

        select: function () {
            this.wrap && BI.Widget._renderEngine.createElement(this.wrap.dom.input).click();
        },

        upload: function (handler) {
            this.wrap && this.wrap.upload(handler);
        },

        getValue: function () {
            return this.wrap ? this.wrap.attach_array : [];
        },

        reset: function () {
            if (this.wrap) {
                this.wrap.attach_array = [];
                this.wrap.attach_names = [];
                this.wrap.attachNum = 0;
            }
        },

        _setEnable: function (enable) {
            BI.File.superclass._setEnable.apply(this, arguments);
            if (enable === true) {
                this.element.attr("disabled", "disabled");
            } else {
                this.element.removeAttr("disabled");
            }
        }
    });
    BI.File.EVENT_CHANGE = "EVENT_CHANGE";
    BI.File.EVENT_UPLOADSTART = "EVENT_UPLOADSTART";
    BI.File.EVENT_ERROR = "EVENT_ERROR";
    BI.File.EVENT_PROGRESS = "EVENT_PROGRESS";
    BI.File.EVENT_UPLOADED = "EVENT_UPLOADED";
    BI.shortcut("bi.file", BI.File);
})(_global.document || {});/**
 * guy
 * @class BI.Input 一个button和一行数 组成的一行listitem
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Input = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Input.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-input display-block overflow-dot",
            tagName: "input",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn, // 按确定键能否退出编辑
            allowBlank: false
        });
    },

    _init: function () {
        BI.Input.superclass._init.apply(this, arguments);
        var self = this;
        var ctrlKey = false;
        var keyCode = null;
        var inputEventValid = false;
        var _keydown = BI.debounce(function (keyCode) {
            self.onKeyDown(keyCode, ctrlKey);
            self._keydown_ = false;
        }, 300);
        var _clk = BI.debounce(BI.bind(this._click, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this._focusDebounce = BI.debounce(BI.bind(this._focus, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this._blurDebounce = BI.debounce(BI.bind(this._blur, this), BI.EVENT_RESPONSE_TIME, {
            "leading": true,
            "trailing": false
        });
        this.element
            .keydown(function (e) {
                inputEventValid = false;
                ctrlKey = e.ctrlKey || e.metaKey; // mac的cmd支持一下
                keyCode = e.keyCode;
                self.fireEvent(BI.Input.EVENT_QUICK_DOWN, arguments);
            })
            .keyup(function (e) {
                keyCode = null;
                if (!(inputEventValid && e.keyCode === BI.KeyCode.ENTER)) {
                    self._keydown_ = true;
                    _keydown(e.keyCode);
                }
            })
            .on("input propertychange", function (e) {
                // 输入内容全选并直接删光，如果按键没放开就失去焦点不会触发keyup，被focusout覆盖了
                // 其中propertychange在元素属性发生改变的时候就会触发 是为了兼容IE8
                // 通过keyCode判断会漏掉输入法点击输入(右键粘贴暂缓)
                var originalEvent = e.originalEvent;
                if (BI.isNull(originalEvent.propertyName) || originalEvent.propertyName === "value") {
                    inputEventValid = true;
                    self._keydown_ = true;
                    _keydown(keyCode);
                    keyCode = null;
                }
            })
            .click(function (e) {
                e.stopPropagation();
                _clk();
            })
            .mousedown(function (e) {
                self.element.val(self.element.val());
            })
            .focus(function (e) { // 可以不用冒泡
                self._focusDebounce();
            })
            .focusout(function (e) {
                self._blurDebounce();
            });
        if (BI.isKey(this.options.value) || BI.isEmptyString(this.options.value)) {
            this.setValue(this.options.value);
        }
    },

    _focus: function () {
        this.element.addClass("bi-input-focus");
        this._checkValidationOnValueChange();
        this._isEditing = true;
        if (this.getValue() == "") {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_EMPTY);
        }
        this.fireEvent(BI.Input.EVENT_FOCUS);
    },

    _blur: function () {
        var self = this;
        if (self._keydown_ === true) {
            BI.delay(blur, 300);
        } else {
            blur();
        }

        function blur () {
            if (!self.isValid() && self.options.quitChecker.apply(self, [BI.trim(self.getValue())]) !== false) {
                self.element.val(self._lastValidValue ? self._lastValidValue : "");
                self._checkValidationOnValueChange();
                self._defaultState();
            }
            self.element.removeClass("bi-input-focus");
            self._isEditing = false;
            self._start = false;
            if (self.isValid()) {
                var lastValidValue = self._lastValidValue;
                self._lastValidValue = self.getValue();
                self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CONFIRM, self.getValue(), self);
                self.fireEvent(BI.Input.EVENT_CONFIRM);
                if (self._lastValidValue !== lastValidValue) {
                    self.fireEvent(BI.Input.EVENT_CHANGE_CONFIRM);
                }
            }
            self.fireEvent(BI.Input.EVENT_BLUR);
        }
    },

    _click: function () {
        if (this._isEditing !== true) {
            this.selectAll();
            this.fireEvent(BI.Input.EVENT_CLICK);
        }
    },

    onClick: function () {
        this._click();
    },

    onKeyDown: function (keyCode, ctrlKey) {
        if (!this.isValid() || BI.trim(this._lastChangedValue) !== BI.trim(this.getValue())) {
            this._checkValidationOnValueChange();
        }
        if (this.isValid() && BI.trim(this.getValue()) !== "") {
            if (BI.trim(this.getValue()) !== this._lastValue && (!this._start || this._lastValue == null || this._lastValue === "")
                || (this._pause === true && !/(\s|\u00A0)$/.test(this.getValue()))) {
                this._start = true;
                this._pause = false;
                this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STARTEDIT, this.getValue(), this);
                this.fireEvent(BI.Input.EVENT_START);
            }
        }
        if (keyCode == BI.KeyCode.ENTER) {
            if (this.isValid() || this.options.quitChecker.apply(this, [BI.trim(this.getValue())]) !== false) {
                this.blur();
                this.fireEvent(BI.Input.EVENT_ENTER);
            } else {
                this.fireEvent(BI.Input.EVENT_RESTRICT);
            }
        }
        if (keyCode == BI.KeyCode.SPACE) {
            this.fireEvent(BI.Input.EVENT_SPACE);
        }
        if (keyCode == BI.KeyCode.BACKSPACE && this._lastValue == "") {
            this.fireEvent(BI.Input.EVENT_REMOVE);
        }
        if (keyCode == BI.KeyCode.BACKSPACE || keyCode == BI.KeyCode.DELETE) {
            this.fireEvent(BI.Input.EVENT_BACKSPACE);
        }
        this.fireEvent(BI.Input.EVENT_KEY_DOWN, arguments);

        // _valueChange中会更新_lastValue, 这边缓存用以后续STOP事件服务
        var lastValue = this._lastValue;
        if(BI.trim(this.getValue()) !== BI.trim(this._lastValue || "")){
            this._valueChange();
        }
        if (BI.isEndWithBlank(this.getValue())) {
            this._pause = true;
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.PAUSE, "", this);
            this.fireEvent(BI.Input.EVENT_PAUSE);
            this._defaultState();
        } else if ((keyCode === BI.KeyCode.BACKSPACE || keyCode === BI.KeyCode.DELETE) &&
            BI.trim(this.getValue()) === "" && (lastValue !== null && BI.trim(lastValue) !== "")) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_STOP);
        }
    },

    // 初始状态
    _defaultState: function () {
        if (this.getValue() == "") {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_EMPTY);
        }
        this._lastValue = this.getValue();
        this._lastSubmitValue = null;
    },

    _valueChange: function () {
        if (this.isValid() && BI.trim(this.getValue()) !== this._lastSubmitValue) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CHANGE, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_CHANGE);
            this._lastSubmitValue = BI.trim(this.getValue());
        }
        if (this.getValue() == "") {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY, this.getValue(), this);
            this.fireEvent(BI.Input.EVENT_EMPTY);
        }
        this._lastValue = this.getValue();
    },

    _checkValidationOnValueChange: function () {
        var o = this.options;
        var v = this.getValue();
        this.setValid(
            (o.allowBlank === true && BI.trim(v) == "") || (
                BI.isNotEmptyString(BI.trim(v)) && o.validationChecker.apply(this, [BI.trim(v)]) !== false
            )
        );
    },

    focus: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能focus");
        }
        if (!this._isEditing === true) {
            this.element.focus();
            this.selectAll();
        }
    },

    blur: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能blur");
        }
        if (this._isEditing === true) {
            this.element.blur();
            this._blurDebounce();
        }
    },

    selectAll: function () {
        if (!this.element.is(":visible")) {
            throw new Error("input输入框在不可见下不能select");
        }
        this.element.select();
        this._isEditing = true;
    },

    setValue: function (textValue) {
        this.element.val(textValue);
        BI.nextTick(BI.bind(function () {
            this._checkValidationOnValueChange();
            this._defaultState();
            if (this.isValid()) {
                this._lastValidValue = this._lastSubmitValue = this.getValue();
            }
        }, this));
    },

    getValue: function () {
        return this.element.val() || "";
    },

    isEditing: function () {
        return this._isEditing;
    },

    getLastValidValue: function () {
        return this._lastValidValue;
    },

    getLastChangedValue: function () {
        return this._lastChangedValue;
    },

    _setValid: function () {
        BI.Input.superclass._setValid.apply(this, arguments);
        if (this.isValid()) {
            this._lastChangedValue = this.getValue();
            this.element.removeClass("bi-input-error");
            this.fireEvent(BI.Input.EVENT_VALID, BI.trim(this.getValue()), this);
        } else {
            if (this._lastChangedValue === this.getValue()) {
                this._lastChangedValue = null;
            }
            this.element.addClass("bi-input-error");
            this.fireEvent(BI.Input.EVENT_ERROR, BI.trim(this.getValue()), this);
        }
    },

    _setEnable: function (b) {
        BI.Input.superclass._setEnable.apply(this, [b]);
        this.element[0].disabled = !b;
    }
});
BI.Input.EVENT_CHANGE = "EVENT_CHANGE";

BI.Input.EVENT_FOCUS = "EVENT_FOCUS";
BI.Input.EVENT_CLICK = "EVENT_CLICK";
BI.Input.EVENT_BLUR = "EVENT_BLUR";
BI.Input.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.Input.EVENT_QUICK_DOWN = "EVENT_QUICK_DOWN";
BI.Input.EVENT_SPACE = "EVENT_SPACE";
BI.Input.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.Input.EVENT_START = "EVENT_START";
BI.Input.EVENT_PAUSE = "EVENT_PAUSE";
BI.Input.EVENT_STOP = "EVENT_STOP";
BI.Input.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.Input.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.Input.EVENT_REMOVE = "EVENT_REMOVE";
BI.Input.EVENT_EMPTY = "EVENT_EMPTY";
BI.Input.EVENT_VALID = "EVENT_VALID";
BI.Input.EVENT_ERROR = "EVENT_ERROR";
BI.Input.EVENT_ENTER = "EVENT_ENTER";
BI.Input.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.shortcut("bi.input", BI.Input);
/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.ImageRadio = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        var conf = BI.ImageRadio.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-radio radio-icon",
            selected: false,
            handler: BI.emptyFn,
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16
        });
    },

    _init: function () {
        BI.ImageRadio.superclass._init.apply(this, arguments);
    },

    doClick: function () {
        BI.ImageRadio.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.ImageRadio.EVENT_CHANGE);
        }
    }
});
BI.ImageRadio.EVENT_CHANGE = BI.IconButton.EVENT_CHANGE;

BI.shortcut("bi.image_radio", BI.ImageRadio);/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.Radio = BI.inherit(BI.BasicButton, {

    props: {
        baseCls: "bi-radio",
        selected: false,
        handler: BI.emptyFn,
        width: 16,
        height: 16,
        iconWidth: 14,
        iconHeight: 14
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.center_adapt",
            element: this.element,
            items: [{
                type: "bi.layout",
                cls: "radio-content",
                ref: function (_ref) {
                    self.radio = _ref;
                },
                width: o.iconWidth,
                height: o.iconHeight
            }]
        };
    },

    _setEnable: function (enable) {
        BI.Radio.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.radio.element.removeClass("base-disabled disabled");
        } else {
            this.radio.element.addClass("base-disabled disabled");
        }
    },

    doClick: function () {
        BI.Radio.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.Radio.EVENT_CHANGE);
        }
    },

    setSelected: function (b) {
        BI.Radio.superclass.setSelected.apply(this, arguments);
        if (b) {
            this.radio.element.addClass("bi-high-light-background");
        } else {
            this.radio.element.removeClass("bi-high-light-background");
        }
    }
});
BI.Radio.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.radio", BI.Radio);/**
 * Created by dailer on 2019/6/19.
 */

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
            text: "",
            highLight: false
        });
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
            keyword: o.keyword,
            highLight: o.highLight
        };
    },

    _init: function () {
        BI.AbstractLabel.superclass._init.apply(this, arguments);

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
            if (o.whiteSpace == "normal") { // 1.3
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
                    scrollable: o.whiteSpace === "normal",
                    element: this,
                    items: [this.text]
                });
                return;
            }
            if (BI.isNumber(o.height) && o.height > 0) { // 1.4
                this.element.css({
                    "line-height": o.height + "px"
                });
                json.textAlign = o.textAlign;
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
        if (o.whiteSpace == "normal") { // 1.7
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
                scrollable: true,
                element: this,
                items: [this.text]
            });
            return;
        }
        if (BI.isNumber(o.height) && o.height > 0) { // 1.8
            this.element.css({
                "line-height": o.height + "px"
            });
            json.textAlign = o.textAlign;
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
        BI.extend(json, {
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        });

        this.text = BI.createWidget(BI.extend(json, {
            maxWidth: "100%"
        }));
        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [this.text]
        });
    },

    _createNotCenterEl: function () {
        var o = this.options;
        var adaptLayout = o.textAlign === "right" ? "bi.right_vertical_adapt" : "bi.vertical_adapt";
        var json = this._createJson();
        if (BI.isNumber(o.width) && o.width > 0) {
            if (BI.isNumber(o.textWidth) && o.textWidth > 0) {
                json.width = o.textWidth;
                if (BI.isNumber(o.height) && o.height > 0) { // 2.1
                    BI.createWidget({
                        type: adaptLayout,
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
                this.text = BI.createWidget(BI.extend(json, {
                    element: this,
                    hgap: o.hgap,
                    vgap: o.vgap,
                    lgap: o.lgap,
                    rgap: o.rgap,
                    tgap: o.tgap,
                    bgap: o.bgap
                }));
                if (o.whiteSpace !== "normal") {
                    this.element.css({
                        "line-height": o.height - (o.vgap * 2) + "px"
                    });
                }
                return;
            }
            json.width = o.width - 2 * o.hgap - o.lgap - o.rgap;
            BI.createWidget({ // 2.4
                type: adaptLayout,
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
            json.width = o.textWidth;
            BI.createWidget({  // 2.5
                type: adaptLayout,
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
                    "line-height": o.height - (o.vgap * 2) + "px"
                });
            }
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
        BI.extend(json, {
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        });

        this.text = BI.createWidget(BI.extend(json, {
            maxWidth: "100%"
        }));
        BI.createWidget({
            type: adaptLayout,
            element: this,
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
    },

    populate: function () {
        BI.AbstractLabel.superclass.populate.apply(this, arguments);
    }
});/**
 * Created by GUY on 2015/6/26.
 */

BI.HtmlLabel = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-html-label"
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.html",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            value: o.value
        };
    }
});

BI.shortcut("bi.html_label", BI.HtmlLabel);/**
 * @class BI.IconButton
 * @extends BI.BasicButton
 * 图标标签
 */
BI.IconLabel = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-icon-label horizon-center",
        iconWidth: null,
        iconHeight: null
    },

    _init: function () {
        BI.IconLabel.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.css({
            textAlign: "center"
        });
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: o.iconWidth,
            height: o.iconHeight
        });
        if (BI.isNumber(o.height) && o.height > 0 && BI.isNull(o.iconWidth) && BI.isNull(o.iconHeight)) {
            this.element.css("lineHeight", o.height + "px");
            BI.createWidget({
                type: "bi.default",
                element: this,
                items: [this.icon]
            });
        } else {
            this.element.css("lineHeight", "1");
            BI.createWidget({
                element: this,
                type: "bi.center_adapt",
                items: [this.icon]
            });
        }
    }
});
BI.shortcut("bi.icon_label", BI.IconLabel);/**
 * Created by GUY on 2015/6/26.
 */

BI.Label = BI.inherit(BI.AbstractLabel, {

    props: {
        baseCls: "bi-label",
        py: "",
        keyword: ""
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
            keyword: o.keyword,
            highLight: o.highLight
        };
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    }
});

BI.shortcut("bi.label", BI.Label);/**
 * guy a元素
 * @class BI.Link
 * @extends BI.Text
 */
BI.Link = BI.inherit(BI.Label, {
    _defaultConfig: function () {
        var conf = BI.Link.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-link display-block",
            tagName: "a",
            href: "",
            target: "_blank"
        });
    },

    _createJson: function () {
        var o = this.options;
        return {
            type: "bi.a",
            textAlign: o.textAlign,
            whiteSpace: o.whiteSpace,
            lineHeight: o.textHeight,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py,
            href: o.href,
            target: o.target
        };
    },

    _init: function () {
        BI.Link.superclass._init.apply(this, arguments);
    }
});

BI.shortcut("bi.link", BI.Link);/**
 * guy
 * 气泡提示
 * @class BI.Bubble
 * @extends BI.Tip
 * @type {*|void|Object}
 */
BI.Bubble = BI.inherit(BI.Tip, {
    _defaultConfig: function () {
        return BI.extend(BI.Bubble.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-bubble",
            direction: "top",
            text: "",
            level: "error",
            height: 18
        });
    },
    _init: function () {
        BI.Bubble.superclass._init.apply(this, arguments);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({click: fn, mousedown: fn, mouseup: fn, mouseover: fn, mouseenter: fn, mouseleave: fn, mousemove: fn});
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this["_" + this.options.direction]()]
        });
    },

    _createBubbleText: function () {
        var o = this.options;
        return (this.text = BI.createWidget({
            type: "bi.label",
            cls: "bubble-text" + (" bubble-" + o.level),
            text: o.text,
            hgap: 5,
            height: 18
        }));
    },

    _top: function () {
        return BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: this._createBubbleText(),
                height: 18
            }, {
                el: {
                    type: "bi.layout"
                },
                height: 3
            }]
        });
    },

    _bottom: function () {
        return BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.layout"
                },
                height: 3
            }, {
                el: this._createBubbleText(),
                height: 18
            }]
        });
    },

    _left: function () {
        return BI.createWidget({
            type: "bi.right",
            items: [{
                el: {
                    type: "bi.layout",
                    width: 3,
                    height: 18
                }
            }, {
                el: this._createBubbleText()
            }]
        });
    },

    _right: function () {
        return BI.createWidget({
            type: "bi.left",
            items: [{
                el: {
                    type: "bi.layout",
                    width: 3,
                    height: 18
                }
            }, {
                el: this._createBubbleText()
            }]
        });
    },

    setText: function (text) {
        this.text.setText(text);
    }
});

BI.shortcut("bi.bubble", BI.Bubble);/**
 * toast提示
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Toast
 * @extends BI.Tip
 */
BI.Toast = BI.inherit(BI.Tip, {
    _const: {
        minWidth: 200,
        hgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.Toast.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-toast",
            text: "",
            level: "success" // success或warning
        });
    },
    _init: function () {
        BI.Toast.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.css({
            minWidth: this._const.minWidth + "px"
        });
        this.element.addClass("toast-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({click: fn, mousedown: fn, mouseup: fn, mouseover: fn, mouseenter: fn, mouseleave: fn, mousemove: fn});
        var cls = "close-font";
        switch(o.level) {
            case "success":
                cls = "toast-success-font";
                break;
            case "error":
                cls = "toast-error-font";
                break;
            case "warning":
                cls = "toast-warning-font";
                break;
            case "normal":
            default:
                cls = "toast-message-font";
                break;
        }

        var items = [{
            type: "bi.icon_label",
            cls: cls + " toast-icon",
            width: 36
        }, {
            el: {
                type: "bi.label",
                whiteSpace: "normal",
                text: o.text,
                textHeight: 16,
                textAlign: "left"
            },
            rgap: o.autoClose ? this._const.hgap : 0
        }];

        var columnSize = [36, ""];

        if(o.autoClose === false) {
            items.push({
                type: "bi.icon_button",
                cls: "close-font toast-icon",
                handler: function () {
                    self.destroy();
                },
                width: 36
            });
            columnSize.push(36);
        }

        this.text = BI.createWidget({
            type: "bi.horizontal_adapt",
            element: this,
            items: items,
            vgap: 7,
            columnSize: columnSize
        });
    },

    setText: function (text) {
        this.text.setText(text);
    },

    beforeDestroy: function () {
        this.fireEvent(BI.Toast.EVENT_DESTORY);
    }
});
BI.Toast.EVENT_DESTORY = "EVENT_DESTORY";
BI.shortcut("bi.toast", BI.Toast);/**
 * title提示
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Tooltip
 * @extends BI.Tip
 */
BI.Tooltip = BI.inherit(BI.Tip, {
    _const: {
        hgap: 5,
        vgap: 3
    },

    _defaultConfig: function () {
        return BI.extend(BI.Tooltip.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tooltip",
            text: "",
            level: "success", // success或warning
            stopEvent: false,
            stopPropagation: false
        });
    },
    _init: function () {
        BI.Tooltip.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.addClass("tooltip-" + o.level);
        var fn = function (e) {
            o.stopPropagation && e.stopPropagation();
            o.stopEvent && e.stopEvent();
        };
        this.element.bind({
            click: fn,
            mousedown: fn,
            mouseup: fn,
            mouseover: fn,
            mouseenter: fn,
            mouseleave: fn,
            mousemove: fn
        });

        var texts = (o.text + "").split("\n");
        if (texts.length > 1) {
            BI.createWidget({
                type: "bi.vertical",
                element: this,
                hgap: this._const.hgap,
                items: BI.map(texts, function (i, text) {
                    return {
                        type: "bi.label",
                        textAlign: "left",
                        whiteSpace: "normal",
                        text: text,
                        textHeight: 18
                    };
                })
            });
        } else {
            this.text = BI.createWidget({
                type: "bi.label",
                element: this,
                textAlign: "left",
                whiteSpace: "normal",
                text: o.text,
                textHeight: 18,
                hgap: this._const.hgap
            });
        }
    },

    setWidth: function (width) {
        this.element.width(width - 2 * this._const.hgap);
    },

    setText: function (text) {
        this.text && this.text.setText(text);
    },

    setLevel: function (level) {
        this.element.removeClass("tooltip-success").removeClass("tooltip-warning");
        this.element.addClass("tooltip-" + level);
    }
});

BI.shortcut("bi.tooltip", BI.Tooltip);/**
 * 下拉
 * @class BI.Trigger
 * @extends BI.Single
 * @abstract
 */
BI.Trigger = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Trigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            _baseCls: (conf._baseCls || "") + " bi-trigger cursor-pointer",
            height: 24
        });
    },

    _init: function () {
        BI.Trigger.superclass._init.apply(this, arguments);
    },

    setKey: function () {

    },

    getKey: function () {

    }
});/**
 *
 * 自定义树
 *
 * Created by GUY on 2015/9/7.
 * @class BI.CustomTree
 * @extends BI.Single
 */
BI.CustomTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CustomTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-tree",
            expander: {
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: [],
            itemsCreator: BI.emptyFn,

            el: {
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
    },

    _init: function () {
        BI.CustomTree.superclass._init.apply(this, arguments);
        this.initTree(this.options.items);
    },

    _formatItems: function (nodes) {
        var self = this, o = this.options;
        nodes = BI.Tree.transformToTreeFormat(nodes);

        var items = [];
        BI.each(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children) || node.isParent === true) {
                var item = BI.extend({
                    type: "bi.expander",
                    el: {
                        value: node.value
                    },
                    popup: {type: "bi.custom_tree"}
                }, BI.deepClone(o.expander), {
                    id: node.id,
                    pId: node.pId
                });
                var el = BI.stripEL(node);
                if (!BI.isWidget(el)) {
                    el = BI.clone(el);
                    delete el.children;
                    BI.extend(item.el, el);
                } else {
                    item.el = el;
                }
                item.popup.expander = BI.deepClone(o.expander);
                item.items = item.popup.items = node.children;
                item.itemsCreator = item.popup.itemsCreator = function (op) {
                    if (BI.isNotNull(op.node)) {// 从子节点传过来的itemsCreator直接向上传递
                        return o.itemsCreator.apply(self, arguments);
                    }
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0].node = node;
                    return o.itemsCreator.apply(self, args);
                };
                BI.isNull(item.popup.el) && (item.popup.el = BI.deepClone(o.el));
                items.push(item);
            } else {
                items.push(node);
            }
        });
        return items;
    },

    // 构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.tree = BI.createWidget(o.el, {
            element: this,
            items: this._formatItems(nodes),
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(this, [op, function (items) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0] = self._formatItems(items);
                    callback.apply(null, args);
                }]);
            },
            value: o.value
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.CustomTree.EVENT_CHANGE, val, obj);
            }
        });
    },

    // 生成树方法
    stroke: function (nodes) {
        this.populate.apply(this, arguments);
    },

    populate: function (nodes) {
        var args = Array.prototype.slice.call(arguments, 0);
        if (arguments.length > 0) {
            args[0] = this._formatItems(nodes);
        }
        this.tree.populate.apply(this.tree, args);
    },

    setValue: function (v) {
        this.tree && this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree ? this.tree.getValue() : [];
    },

    getAllButtons: function () {
        return this.tree ? this.tree.getAllButtons() : [];
    },

    getAllLeaves: function () {
        return this.tree ? this.tree.getAllLeaves() : [];
    },

    getNodeById: function (id) {
        return this.tree && this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree && this.tree.getNodeByValue(id);
    },

    empty: function () {
        this.tree.empty();
    }
});
BI.CustomTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.custom_tree", BI.CustomTree);/*
 * JQuery zTree core v3.5.18
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-06-18
 */
(function($){
	var settings = {}, roots = {}, caches = {},
	//default consts of core
	_consts = {
		className: {
			BUTTON: "button",
			LEVEL: "level",
			ICO_LOADING: "ico_loading",
			SWITCH: "switch"
		},
		event: {
			NODECREATED: "ztree_nodeCreated",
			CLICK: "ztree_click",
			EXPAND: "ztree_expand",
			COLLAPSE: "ztree_collapse",
			ASYNC_SUCCESS: "ztree_async_success",
			ASYNC_ERROR: "ztree_async_error",
			REMOVE: "ztree_remove",
			SELECTED: "ztree_selected",
			UNSELECTED: "ztree_unselected"
		},
		id: {
			A: "_a",
			ICON: "_ico",
			SPAN: "_span",
			SWITCH: "_switch",
			UL: "_ul"
		},
		line: {
			ROOT: "root",
			ROOTS: "roots",
			CENTER: "center",
			BOTTOM: "bottom",
			NOLINE: "noline",
			LINE: "line"
		},
		folder: {
			OPEN: "open",
			CLOSE: "close",
			DOCU: "docu"
		},
		node: {
			CURSELECTED: "curSelectedNode"
		}
	},
	//default setting of core
	_setting = {
		treeId: "",
		treeObj: null,
		view: {
			addDiyDom: null,
			autoCancelSelected: true,
			dblClickExpand: true,
			expandSpeed: "fast",
			fontCss: {},
			nameIsHTML: false,
			selectedMulti: true,
			showIcon: true,
			showLine: true,
			showTitle: true,
			txtSelectedEnable: false
		},
		data: {
			key: {
				children: "children",
				name: "name",
				title: "",
				url: "url"
			},
			simpleData: {
				enable: false,
				idKey: "id",
				pIdKey: "pId",
				rootPId: null
			},
			keep: {
				parent: false,
				leaf: false
			}
		},
		async: {
			enable: false,
			contentType: "application/x-www-form-urlencoded",
			type: "post",
			dataType: "text",
			url: "",
			autoParam: [],
			otherParam: [],
			dataFilter: null
		},
		callback: {
			beforeAsync:null,
			beforeClick:null,
			beforeDblClick:null,
			beforeRightClick:null,
			beforeMouseDown:null,
			beforeMouseUp:null,
			beforeExpand:null,
			beforeCollapse:null,
			beforeRemove:null,

			onAsyncError:null,
			onAsyncSuccess:null,
			onNodeCreated:null,
			onClick:null,
			onDblClick:null,
			onRightClick:null,
			onMouseDown:null,
			onMouseUp:null,
			onExpand:null,
			onCollapse:null,
			onRemove:null
		}
	},
	//default root of core
	//zTree use root to save full data
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		if (!r) {
			r = {};
			data.setRoot(setting, r);
		}
		r[setting.data.key.children] = [];
		r.expandTriggerFlag = false;
		r.curSelectedList = [];
		r.noSelection = true;
		r.createdNodes = [];
		r.zId = 0;
		r._ver = (new Date()).getTime();
	},
	//default cache of core
	_initCache = function(setting) {
		var c = data.getCache(setting);
		if (!c) {
			c = {};
			data.setCache(setting, c);
		}
		c.nodes = [];
		c.doms = [];
	},
	//default bindEvent of core
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.NODECREATED, function (event, treeId, node) {
			tools.apply(setting.callback.onNodeCreated, [event, treeId, node]);
		});

		o.bind(c.CLICK, function (event, srcEvent, treeId, node, clickFlag) {
			tools.apply(setting.callback.onClick, [srcEvent, treeId, node, clickFlag]);
		});

		o.bind(c.EXPAND, function (event, treeId, node) {
			tools.apply(setting.callback.onExpand, [event, treeId, node]);
		});

		o.bind(c.COLLAPSE, function (event, treeId, node) {
			tools.apply(setting.callback.onCollapse, [event, treeId, node]);
		});

		o.bind(c.ASYNC_SUCCESS, function (event, treeId, node, msg) {
			tools.apply(setting.callback.onAsyncSuccess, [event, treeId, node, msg]);
		});

		o.bind(c.ASYNC_ERROR, function (event, treeId, node, XMLHttpRequest, textStatus, errorThrown) {
			tools.apply(setting.callback.onAsyncError, [event, treeId, node, XMLHttpRequest, textStatus, errorThrown]);
		});

		o.bind(c.REMOVE, function (event, treeId, treeNode) {
			tools.apply(setting.callback.onRemove, [event, treeId, treeNode]);
		});

		o.bind(c.SELECTED, function (event, srcEvent, treeId, node) {
			tools.apply(setting.callback.onSelected, [srcEvent, treeId, node]);
		});
		o.bind(c.UNSELECTED, function (event, srcEvent, treeId, node) {
			tools.apply(setting.callback.onUnSelected, [srcEvent, treeId, node]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.NODECREATED)
		.unbind(c.CLICK)
		.unbind(c.EXPAND)
		.unbind(c.COLLAPSE)
		.unbind(c.ASYNC_SUCCESS)
		.unbind(c.ASYNC_ERROR)
		.unbind(c.REMOVE)
		.unbind(c.SELECTED)
		.unbind(c.UNSELECTED);
	},
	//default event proxy of core
	_eventProxy = function(event) {
		var target = event.target,
		setting = data.getSetting(event.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null,
		tmp = null;

		if (tools.eqs(event.type, "mousedown")) {
			treeEventType = "mousedown";
		} else if (tools.eqs(event.type, "mouseup")) {
			treeEventType = "mouseup";
		} else if (tools.eqs(event.type, "contextmenu")) {
			treeEventType = "contextmenu";
		} else if (tools.eqs(event.type, "click")) {
			if (tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.SWITCH) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "switchNode";
			} else {
				tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
				if (tmp) {
					tId = tools.getNodeMainDom(tmp).id;
					nodeEventType = "clickNode";
				}
			}
		} else if (tools.eqs(event.type, "dblclick")) {
			treeEventType = "dblclick";
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {
				tId = tools.getNodeMainDom(tmp).id;
				nodeEventType = "switchNode";
			}
		}
		if (treeEventType.length > 0 && tId.length == 0) {
			tmp = tools.getMDom(setting, target, [{tagName:"a", attrName:"treeNode"+consts.id.A}]);
			if (tmp) {tId = tools.getNodeMainDom(tmp).id;}
		}
		// event to node
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "switchNode" :
					if (!node.isParent) {
						nodeEventType = "";
					} else if (tools.eqs(event.type, "click")
						|| (tools.eqs(event.type, "dblclick") && tools.apply(setting.view.dblClickExpand, [setting.treeId, node], setting.view.dblClickExpand))) {
						nodeEventCallback = handler.onSwitchNode;
					} else {
						nodeEventType = "";
					}
					break;
				case "clickNode" :
					nodeEventCallback = handler.onClickNode;
					break;
			}
		}
		// event to zTree
		switch (treeEventType) {
			case "mousedown" :
				treeEventCallback = handler.onZTreeMousedown;
				break;
			case "mouseup" :
				treeEventCallback = handler.onZTreeMouseup;
				break;
			case "dblclick" :
				treeEventCallback = handler.onZTreeDblclick;
				break;
			case "contextmenu" :
				treeEventCallback = handler.onZTreeContextmenu;
				break;
		}
		var proxyResult = {
			stop: false,
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of core
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var r = data.getRoot(setting),
		childKey = setting.data.key.children;
		n.level = level;
		n.tId = setting.treeId + "_" + (++r.zId);
		n.parentTId = parentNode ? parentNode.tId : null;
		n.open = (typeof n.open == "string") ? tools.eqs(n.open, "true") : !!n.open;
		if (n[childKey] && n[childKey].length > 0) {
			n.isParent = true;
			n.zAsync = true;
		} else {
			n.isParent = (typeof n.isParent == "string") ? tools.eqs(n.isParent, "true") : !!n.isParent;
			n.open = (n.isParent && !setting.async.enable) ? n.open : false;
			n.zAsync = !n.isParent;
		}
		n.isFirstNode = isFirstNode;
		n.isLastNode = isLastNode;
		n.getParentNode = function() {return data.getNodeCache(setting, n.parentTId);};
		n.getPreNode = function() {return data.getPreNode(setting, n);};
		n.getNextNode = function() {return data.getNextNode(setting, n);};
		n.isAjaxing = false;
		data.fixPIdKeyValue(setting, n);
	},
	_init = {
		bind: [_bindEvent],
		unbind: [_unbindEvent],
		caches: [_initCache],
		nodes: [_initNode],
		proxys: [_eventProxy],
		roots: [_initRoot],
		beforeA: [],
		afterA: [],
		innerBeforeA: [],
		innerAfterA: [],
		zTreeTools: []
	},
	//method of operate data
	data = {
		addNodeCache: function(setting, node) {
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = node;
		},
		getNodeCacheId: function(tId) {
			return tId.substring(tId.lastIndexOf("_")+1);
		},
		addAfterA: function(afterA) {
			_init.afterA.push(afterA);
		},
		addBeforeA: function(beforeA) {
			_init.beforeA.push(beforeA);
		},
		addInnerAfterA: function(innerAfterA) {
			_init.innerAfterA.push(innerAfterA);
		},
		addInnerBeforeA: function(innerBeforeA) {
			_init.innerBeforeA.push(innerBeforeA);
		},
		addInitBind: function(bindEvent) {
			_init.bind.push(bindEvent);
		},
		addInitUnBind: function(unbindEvent) {
			_init.unbind.push(unbindEvent);
		},
		addInitCache: function(initCache) {
			_init.caches.push(initCache);
		},
		addInitNode: function(initNode) {
			_init.nodes.push(initNode);
		},
		addInitProxy: function(initProxy, isFirst) {
			if (!!isFirst) {
				_init.proxys.splice(0,0,initProxy);
			} else {
				_init.proxys.push(initProxy);
			}
		},
		addInitRoot: function(initRoot) {
			_init.roots.push(initRoot);
		},
		addNodesData: function(setting, parentNode, nodes) {
			var childKey = setting.data.key.children;
			if (!parentNode[childKey]) parentNode[childKey] = [];
			if (parentNode[childKey].length > 0) {
				parentNode[childKey][parentNode[childKey].length - 1].isLastNode = false;
				view.setNodeLineIcos(setting, parentNode[childKey][parentNode[childKey].length - 1]);
			}
			parentNode.isParent = true;
			parentNode[childKey] = parentNode[childKey].concat(nodes);
		},
		addSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			if (!data.isSelectedNode(setting, node)) {
				root.curSelectedList.push(node);
			}
		},
		addCreatedNode: function(setting, node) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				root.createdNodes.push(node);
			}
		},
		addZTreeTools: function(zTreeTools) {
			_init.zTreeTools.push(zTreeTools);
		},
		exSetting: function(s) {
			$.extend(true, _setting, s);
		},
		fixPIdKeyValue: function(setting, node) {
			if (setting.data.simpleData.enable) {
				node[setting.data.simpleData.pIdKey] = node.parentTId ? node.getParentNode()[setting.data.simpleData.idKey] : setting.data.simpleData.rootPId;
			}
		},
		getAfterA: function(setting, node, array) {
			for (var i=0, j=_init.afterA.length; i<j; i++) {
				_init.afterA[i].apply(this, arguments);
			}
		},
		getBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.beforeA.length; i<j; i++) {
				_init.beforeA[i].apply(this, arguments);
			}
		},
		getInnerAfterA: function(setting, node, array) {
			for (var i=0, j=_init.innerAfterA.length; i<j; i++) {
				_init.innerAfterA[i].apply(this, arguments);
			}
		},
		getInnerBeforeA: function(setting, node, array) {
			for (var i=0, j=_init.innerBeforeA.length; i<j; i++) {
				_init.innerBeforeA[i].apply(this, arguments);
			}
		},
		getCache: function(setting) {
			return caches[setting.treeId];
		},
		getNextNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length-1; i<=l; i++) {
				if (p[childKey][i] === node) {
					return (i==l ? null : p[childKey][i+1]);
				}
			}
			return null;
		},
		getNodeByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return null;
			var childKey = setting.data.key.children;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					return nodes[i];
				}
				var tmp = data.getNodeByParam(setting, nodes[i][childKey], key, value);
				if (tmp) return tmp;
			}
			return null;
		},
		getNodeCache: function(setting, tId) {
			if (!tId) return null;
			var n = caches[setting.treeId].nodes[data.getNodeCacheId(tId)];
			return n ? n : null;
		},
		getNodeName: function(setting, node) {
			var nameKey = setting.data.key.name;
			return "" + node[nameKey];
		},
		getNodeTitle: function(setting, node) {
			var t = setting.data.key.title === "" ? setting.data.key.name : setting.data.key.title;
			return "" + node[t];
		},
		getNodes: function(setting) {
			return data.getRoot(setting)[setting.data.key.children];
		},
		getNodesByParam: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i][key] == value) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParam(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByParamFuzzy: function(setting, nodes, key, value) {
			if (!nodes || !key) return [];
			var childKey = setting.data.key.children,
			result = [];
			value = value.toLowerCase();
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (typeof nodes[i][key] == "string" && nodes[i][key].toLowerCase().indexOf(value)>-1) {
					result.push(nodes[i]);
				}
				result = result.concat(data.getNodesByParamFuzzy(setting, nodes[i][childKey], key, value));
			}
			return result;
		},
		getNodesByFilter: function(setting, nodes, filter, isSingle, invokeParam) {
			if (!nodes) return (isSingle ? null : []);
			var childKey = setting.data.key.children,
			result = isSingle ? null : [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (tools.apply(filter, [nodes[i], invokeParam], false)) {
					if (isSingle) {return nodes[i];}
					result.push(nodes[i]);
				}
				var tmpResult = data.getNodesByFilter(setting, nodes[i][childKey], filter, isSingle, invokeParam);
				if (isSingle && !!tmpResult) {return tmpResult;}
				result = isSingle ? tmpResult : result.concat(tmpResult);
			}
			return result;
		},
		getPreNode: function(setting, node) {
			if (!node) return null;
			var childKey = setting.data.key.children,
			p = node.parentTId ? node.getParentNode() : data.getRoot(setting);
			for (var i=0, l=p[childKey].length; i<l; i++) {
				if (p[childKey][i] === node) {
					return (i==0 ? null : p[childKey][i-1]);
				}
			}
			return null;
		},
		getRoot: function(setting) {
			return setting ? roots[setting.treeId] : null;
		},
		getRoots: function() {
			return roots;
		},
		getSetting: function(treeId) {
			return settings[treeId];
		},
		getSettings: function() {
			return settings;
		},
		getZTreeTools: function(treeId) {
			var r = this.getRoot(this.getSetting(treeId));
			return r ? r.treeTools : null;
		},
		initCache: function(setting) {
			for (var i=0, j=_init.caches.length; i<j; i++) {
				_init.caches[i].apply(this, arguments);
			}
		},
		initNode: function(setting, level, node, parentNode, preNode, nextNode) {
			for (var i=0, j=_init.nodes.length; i<j; i++) {
				_init.nodes[i].apply(this, arguments);
			}
		},
		initRoot: function(setting) {
			for (var i=0, j=_init.roots.length; i<j; i++) {
				_init.roots[i].apply(this, arguments);
			}
		},
		isSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i]) return true;
			}
			return false;
		},
		removeNodeCache: function(setting, node) {
			var childKey = setting.data.key.children;
			if (node[childKey]) {
				for (var i=0, l=node[childKey].length; i<l; i++) {
					arguments.callee(setting, node[childKey][i]);
				}
			}
			data.getCache(setting).nodes[data.getNodeCacheId(node.tId)] = null;
		},
		removeSelectedNode: function(setting, node) {
			var root = data.getRoot(setting);
			for (var i=0, j=root.curSelectedList.length; i<j; i++) {
				if(node === root.curSelectedList[i] || !data.getNodeCache(setting, root.curSelectedList[i].tId)) {
					root.curSelectedList.splice(i, 1);
					i--;j--;
				}
			}
		},
		setCache: function(setting, cache) {
			caches[setting.treeId] = cache;
		},
		setRoot: function(setting, root) {
			roots[setting.treeId] = root;
		},
		setZTreeTools: function(setting, zTreeTools) {
			for (var i=0, j=_init.zTreeTools.length; i<j; i++) {
				_init.zTreeTools[i].apply(this, arguments);
			}
		},
		transformToArrayFormat: function (setting, nodes) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			r = [];
			if (tools.isArray(nodes)) {
				for (var i=0, l=nodes.length; i<l; i++) {
					r.push(nodes[i]);
					if (nodes[i][childKey])
						r = r.concat(data.transformToArrayFormat(setting, nodes[i][childKey]));
				}
			} else {
				r.push(nodes);
				if (nodes[childKey])
					r = r.concat(data.transformToArrayFormat(setting, nodes[childKey]));
			}
			return r;
		},
		transformTozTreeFormat: function(setting, sNodes) {
			var i,l,
			key = setting.data.simpleData.idKey,
			parentKey = setting.data.simpleData.pIdKey,
			childKey = setting.data.key.children;
			if (!key || key=="" || !sNodes) return [];

			if (tools.isArray(sNodes)) {
				var r = [];
				var tmpMap = {};
				for (i=0, l=sNodes.length; i<l; i++) {
					tmpMap[sNodes[i][key]] = sNodes[i];
				}
				for (i=0, l=sNodes.length; i<l; i++) {
					if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
						if (!tmpMap[sNodes[i][parentKey]][childKey])
							tmpMap[sNodes[i][parentKey]][childKey] = [];
						tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
					} else {
						r.push(sNodes[i]);
					}
				}
				return r;
			}else {
				return [sNodes];
			}
		}
	},
	//method of event proxy
	event = {
		bindEvent: function(setting) {
			for (var i=0, j=_init.bind.length; i<j; i++) {
				_init.bind[i].apply(this, arguments);
			}
		},
		unbindEvent: function(setting) {
			for (var i=0, j=_init.unbind.length; i<j; i++) {
				_init.unbind[i].apply(this, arguments);
			}
		},
		bindTree: function(setting) {
			var eventParam = {
				treeId: setting.treeId
			},
			o = setting.treeObj;
			if (!setting.view.txtSelectedEnable) {
				// for can't select text
				o.bind('selectstart', function(e){
					var node
					var n = e.originalEvent.srcElement.nodeName.toLowerCase();
					return (n === "input" || n === "textarea" );
				}).css({
					"-moz-user-select":"-moz-none"
				});
			}
			o.bind('click', eventParam, event.proxy);
			o.bind('dblclick', eventParam, event.proxy);
			o.bind('mouseover', eventParam, event.proxy);
			o.bind('mouseout', eventParam, event.proxy);
			o.bind('mousedown', eventParam, event.proxy);
			o.bind('mouseup', eventParam, event.proxy);
			o.bind('contextmenu', eventParam, event.proxy);
		},
		unbindTree: function(setting) {
			var o = setting.treeObj;
			o.unbind('click', event.proxy)
			.unbind('dblclick', event.proxy)
			.unbind('mouseover', event.proxy)
			.unbind('mouseout', event.proxy)
			.unbind('mousedown', event.proxy)
			.unbind('mouseup', event.proxy)
			.unbind('contextmenu', event.proxy);
		},
		doProxy: function(e) {
			var results = [];
			for (var i=0, j=_init.proxys.length; i<j; i++) {
				var proxyResult = _init.proxys[i].apply(this, arguments);
				results.push(proxyResult);
				if (proxyResult.stop) {
					break;
				}
			}
			return results;
		},
		proxy: function(e) {
			var setting = data.getSetting(e.data.treeId);
			if (!tools.uCanDo(setting, e)) return true;
			var results = event.doProxy(e),
			r = true, x = false;
			for (var i=0, l=results.length; i<l; i++) {
				var proxyResult = results[i];
				if (proxyResult.nodeEventCallback) {
					x = true;
					r = proxyResult.nodeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
				if (proxyResult.treeEventCallback) {
					x = true;
					r = proxyResult.treeEventCallback.apply(proxyResult, [e, proxyResult.node]) && r;
				}
			}
			return r;
		}
	},
	//method of event handler
	handler = {
		onSwitchNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (node.open) {
				if (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			} else {
				if (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false) return true;
				data.getRoot(setting).expandTriggerFlag = true;
				view.switchNode(setting, node);
			}
			return true;
		},
		onClickNode: function (event, node) {
			var setting = data.getSetting(event.data.treeId),
			clickFlag = ( (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey)) && data.isSelectedNode(setting, node)) ? 0 : (setting.view.autoCancelSelected && (event.ctrlKey || event.metaKey) && setting.view.selectedMulti) ? 2 : 1;
			if (tools.apply(setting.callback.beforeClick, [setting.treeId, node, clickFlag], true) == false) return true;
			if (clickFlag === 0) {
				view.cancelPreSelectedNode(setting, node);
			} else {
				view.selectNode(setting, node, clickFlag === 2);
			}
			setting.treeObj.trigger(consts.event.CLICK, [event, setting.treeId, node, clickFlag]);
			return true;
		},
		onZTreeMousedown: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseDown, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseDown, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeMouseup: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeMouseUp, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onMouseUp, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeDblclick: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeDblClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onDblClick, [event, setting.treeId, node]);
			}
			return true;
		},
		onZTreeContextmenu: function(event, node) {
			var setting = data.getSetting(event.data.treeId);
			if (tools.apply(setting.callback.beforeRightClick, [setting.treeId, node], true)) {
				tools.apply(setting.callback.onRightClick, [event, setting.treeId, node]);
			}
			return (typeof setting.callback.onRightClick) != "function";
		}
	},
	//method of tools for zTree
	tools = {
		apply: function(fun, param, defaultValue) {
			if ((typeof fun) == "function") {
				return fun.apply(zt, param?param:[]);
			}
			return defaultValue;
		},
		canAsync: function(setting, node) {
			var childKey = setting.data.key.children;
			return (setting.async.enable && node && node.isParent && !(node.zAsync || (node[childKey] && node[childKey].length > 0)));
		},
		clone: function (obj){
			if (obj === null) return null;
			var o = tools.isArray(obj) ? [] : {};
			for(var i in obj){
				o[i] = (obj[i] instanceof Date) ? new Date(obj[i].getTime()) : (typeof obj[i] === "object" ? arguments.callee(obj[i]) : obj[i]);
			}
			return o;
		},
		eqs: function(str1, str2) {
			return str1.toLowerCase() === str2.toLowerCase();
		},
		isArray: function(arr) {
			return Object.prototype.toString.apply(arr) === "[object Array]";
		},
		$: function(node, exp, setting) {
			if (!!exp && typeof exp != "string") {
				setting = exp;
				exp = "";
			}
			if (typeof node == "string") {
				return $(node, setting ? setting.treeObj.get(0).ownerDocument : null);
			} else {
				return $("#" + node.tId + exp, setting ? setting.treeObj : null);
			}
		},
		getMDom: function (setting, curDom, targetExpr) {
			if (!curDom) return null;
			while (curDom && curDom.id !== setting.treeId) {
				for (var i=0, l=targetExpr.length; curDom.tagName && i<l; i++) {
					if (tools.eqs(curDom.tagName, targetExpr[i].tagName) && curDom.getAttribute(targetExpr[i].attrName) !== null) {
						return curDom;
					}
				}
				curDom = curDom.parentNode;
			}
			return null;
		},
		getNodeMainDom:function(target) {
			return ($(target).parent("li").get(0) || $(target).parentsUntil("li").parent().get(0));
		},
		isChildOrSelf: function(dom, parentId) {
			return ( $(dom).closest("#" + parentId).length> 0 );
		},
		uCanDo: function(setting, e) {
			return true;
		}
	},
	//method of operate ztree dom
	view = {
		addNodes: function(setting, parentNode, newNodes, isSilent) {
			if (setting.data.keep.leaf && parentNode && !parentNode.isParent) {
				return;
			}
			if (!tools.isArray(newNodes)) {
				newNodes = [newNodes];
			}
			if (setting.data.simpleData.enable) {
				newNodes = data.transformTozTreeFormat(setting, newNodes);
			}
			if (parentNode) {
				var target_switchObj = $$(parentNode, consts.id.SWITCH, setting),
				target_icoObj = $$(parentNode, consts.id.ICON, setting),
				target_ulObj = $$(parentNode, consts.id.UL, setting);

				if (!parentNode.open) {
					view.replaceSwitchClass(parentNode, target_switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(parentNode, target_icoObj, consts.folder.CLOSE);
					parentNode.open = false;
					target_ulObj.css({
						"display": "none"
					});
				}

				data.addNodesData(setting, parentNode, newNodes);
				view.createNodes(setting, parentNode.level + 1, newNodes, parentNode);
				if (!isSilent) {
					view.expandCollapseParentNode(setting, parentNode, true);
				}
			} else {
				data.addNodesData(setting, data.getRoot(setting), newNodes);
				view.createNodes(setting, 0, newNodes, null);
			}
		},
		appendNodes: function(setting, level, nodes, parentNode, initFlag, openFlag) {
			if (!nodes) return [];
			var html = [],
			childKey = setting.data.key.children;
			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				if (initFlag) {
					var tmpPNode = (parentNode) ? parentNode: data.getRoot(setting),
					tmpPChild = tmpPNode[childKey],
					isFirstNode = ((tmpPChild.length == nodes.length) && (i == 0)),
					isLastNode = (i == (nodes.length - 1));
					data.initNode(setting, level, node, parentNode, isFirstNode, isLastNode, openFlag);
					data.addNodeCache(setting, node);
				}

				var childHtml = [];
				if (node[childKey] && node[childKey].length > 0) {
					//make child html first, because checkType
					childHtml = view.appendNodes(setting, level + 1, node[childKey], node, initFlag, openFlag && node.open);
				}
				if (openFlag) {

					view.makeDOMNodeMainBefore(html, setting, node);
					view.makeDOMNodeLine(html, setting, node);
					data.getBeforeA(setting, node, html);
					view.makeDOMNodeNameBefore(html, setting, node);
					data.getInnerBeforeA(setting, node, html);
					view.makeDOMNodeIcon(html, setting, node);
					data.getInnerAfterA(setting, node, html);
					view.makeDOMNodeNameAfter(html, setting, node);
					data.getAfterA(setting, node, html);
					if (node.isParent && node.open) {
						view.makeUlHtml(setting, node, html, childHtml.join(''));
					}
					view.makeDOMNodeMainAfter(html, setting, node);
					data.addCreatedNode(setting, node);
				}
			}
			return html;
		},
		appendParentULDom: function(setting, node) {
			var html = [],
			nObj = $$(node, setting);
			if (!nObj.get(0) && !!node.parentTId) {
				view.appendParentULDom(setting, node.getParentNode());
				nObj = $$(node, setting);
			}
			var ulObj = $$(node, consts.id.UL, setting);
			if (ulObj.get(0)) {
				ulObj.remove();
			}
			var childKey = setting.data.key.children,
			childHtml = view.appendNodes(setting, node.level+1, node[childKey], node, false, true);
			view.makeUlHtml(setting, node, html, childHtml.join(''));
			nObj.append(html.join(''));
		},
		asyncNode: function(setting, node, isSilent, callback) {
			var i, l;
			if (node && !node.isParent) {
				tools.apply(callback);
				return false;
			} else if (node && node.isAjaxing) {
				return false;
			} else if (tools.apply(setting.callback.beforeAsync, [setting.treeId, node], true) == false) {
				tools.apply(callback);
				return false;
			}
			if (node) {
				node.isAjaxing = true;
				var icoObj = $$(node, consts.id.ICON, setting);
				icoObj.attr({"style":"", "class":consts.className.BUTTON + " " + consts.className.ICO_LOADING});
			}

			var tmpParam = {};
			for (i = 0, l = setting.async.autoParam.length; node && i < l; i++) {
				var pKey = setting.async.autoParam[i].split("="), spKey = pKey;
				if (pKey.length>1) {
					spKey = pKey[1];
					pKey = pKey[0];
				}
				tmpParam[spKey] = node[pKey];
			}
			if (tools.isArray(setting.async.otherParam)) {
				for (i = 0, l = setting.async.otherParam.length; i < l; i += 2) {
					tmpParam[setting.async.otherParam[i]] = setting.async.otherParam[i + 1];
				}
			} else {
				for (var p in setting.async.otherParam) {
					tmpParam[p] = setting.async.otherParam[p];
				}
			}

			var _tmpV = data.getRoot(setting)._ver;
			$.ajax({
				contentType: setting.async.contentType,
                cache: false,
				type: setting.async.type,
				url: tools.apply(setting.async.url, [setting.treeId, node], setting.async.url),
				data: tmpParam,
				dataType: setting.async.dataType,
				success: function(msg) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					var newNodes = [];
					try {
						if (!msg || msg.length == 0) {
							newNodes = [];
						} else if (typeof msg == "string") {
							newNodes = eval("(" + msg + ")");
						} else {
							newNodes = msg;
						}
					} catch(err) {
						newNodes = msg;
					}

					if (node) {
						node.isAjaxing = null;
						node.zAsync = true;
					}
					view.setNodeLineIcos(setting, node);
					if (newNodes && newNodes !== "") {
						newNodes = tools.apply(setting.async.dataFilter, [setting.treeId, node, newNodes], newNodes);
						view.addNodes(setting, node, !!newNodes ? tools.clone(newNodes) : [], !!isSilent);
					} else {
						view.addNodes(setting, node, [], !!isSilent);
					}
					setting.treeObj.trigger(consts.event.ASYNC_SUCCESS, [setting.treeId, node, msg]);
					tools.apply(callback);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					if (_tmpV != data.getRoot(setting)._ver) {
						return;
					}
					if (node) node.isAjaxing = null;
					view.setNodeLineIcos(setting, node);
					setting.treeObj.trigger(consts.event.ASYNC_ERROR, [setting.treeId, node, XMLHttpRequest, textStatus, errorThrown]);
				}
			});
			return true;
		},
		cancelPreSelectedNode: function (setting, node, excludeNode) {
			var list = data.getRoot(setting).curSelectedList,
				i, n;
			for (i=list.length-1; i>=0; i--) {
				n = list[i];
				if (node === n || (!node && (!excludeNode || excludeNode !== n))) {
					$$(n, consts.id.A, setting).removeClass(consts.node.CURSELECTED);
					if (node) {
						data.removeSelectedNode(setting, node);
						setting.treeObj.trigger(consts.event.UNSELECTED, [event, setting.treeId, n]);
						break;
					} else {
						list.splice(i, 1);
						setting.treeObj.trigger(consts.event.UNSELECTED, [event, setting.treeId, n]);
					}
				}
			}
		},
		createNodeCallback: function(setting) {
			if (!!setting.callback.onNodeCreated || !!setting.view.addDiyDom) {
				var root = data.getRoot(setting);
				while (root.createdNodes.length>0) {
					var node = root.createdNodes.shift();
					tools.apply(setting.view.addDiyDom, [setting.treeId, node]);
					if (!!setting.callback.onNodeCreated) {
						setting.treeObj.trigger(consts.event.NODECREATED, [setting.treeId, node]);
					}
				}
			}
		},
		createNodes: function(setting, level, nodes, parentNode) {
			if (!nodes || nodes.length == 0) return;
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			openFlag = !parentNode || parentNode.open || !!$$(parentNode[childKey][0], setting).get(0);
			root.createdNodes = [];
			var zTreeHtml = view.appendNodes(setting, level, nodes, parentNode, true, openFlag);
			if (!parentNode) {
				setting.treeObj.append(zTreeHtml.join(''));
			} else {
				var ulObj = $$(parentNode, consts.id.UL, setting);
				if (ulObj.get(0)) {
					ulObj.append(zTreeHtml.join(''));
				}
			}
			view.createNodeCallback(setting);
		},
		destroy: function(setting) {
			if (!setting) return;
			data.initCache(setting);
			data.initRoot(setting);
			event.unbindTree(setting);
			event.unbindEvent(setting);
			setting.treeObj.empty();
			delete settings[setting.treeId];
		},
		expandCollapseNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			if (!node) {
				tools.apply(callback, []);
				return;
			}
			if (root.expandTriggerFlag) {
				var _callback = callback;
				callback = function(){
					if (_callback) _callback();
					if (node.open) {
						setting.treeObj.trigger(consts.event.EXPAND, [setting.treeId, node]);
					} else {
						setting.treeObj.trigger(consts.event.COLLAPSE, [setting.treeId, node]);
					}
				};
				root.expandTriggerFlag = false;
			}
			if (!node.open && node.isParent && ((!$$(node, consts.id.UL, setting).get(0)) || (node[childKey] && node[childKey].length>0 && !$$(node[childKey][0], setting).get(0)))) {
				view.appendParentULDom(setting, node);
				view.createNodeCallback(setting);
			}
			if (node.open == expandFlag) {
				tools.apply(callback, []);
				return;
			}
			var ulObj = $$(node, consts.id.UL, setting),
			switchObj = $$(node, consts.id.SWITCH, setting),
			icoObj = $$(node, consts.id.ICON, setting);

			if (node.isParent) {
				node.open = !node.open;
				if (node.iconOpen && node.iconClose) {
					icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
				}

				if (node.open) {
					view.replaceSwitchClass(node, switchObj, consts.folder.OPEN);
					view.replaceIcoClass(node, icoObj, consts.folder.OPEN);
					if (animateFlag == false || setting.view.expandSpeed == "") {
						ulObj.show();
						tools.apply(callback, []);
					} else {
						if (node[childKey] && node[childKey].length > 0) {
							ulObj.slideDown(setting.view.expandSpeed, callback);
						} else {
							ulObj.show();
							tools.apply(callback, []);
						}
					}
				} else {
					view.replaceSwitchClass(node, switchObj, consts.folder.CLOSE);
					view.replaceIcoClass(node, icoObj, consts.folder.CLOSE);
					if (animateFlag == false || setting.view.expandSpeed == "" || !(node[childKey] && node[childKey].length > 0)) {
						ulObj.hide();
						tools.apply(callback, []);
					} else {
						ulObj.slideUp(setting.view.expandSpeed, callback);
					}
				}
			} else {
				tools.apply(callback, []);
			}
		},
		expandCollapseParentNode: function(setting, node, expandFlag, animateFlag, callback) {
			if (!node) return;
			if (!node.parentTId) {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback);
				return;
			} else {
				view.expandCollapseNode(setting, node, expandFlag, animateFlag);
			}
			if (node.parentTId) {
				view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, animateFlag, callback);
			}
		},
		expandCollapseSonNode: function(setting, node, expandFlag, animateFlag, callback) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			treeNodes = (node) ? node[childKey]: root[childKey],
			selfAnimateSign = (node) ? false : animateFlag,
			expandTriggerFlag = data.getRoot(setting).expandTriggerFlag;
			data.getRoot(setting).expandTriggerFlag = false;
			if (treeNodes) {
				for (var i = 0, l = treeNodes.length; i < l; i++) {
					if (treeNodes[i]) view.expandCollapseSonNode(setting, treeNodes[i], expandFlag, selfAnimateSign);
				}
			}
			data.getRoot(setting).expandTriggerFlag = expandTriggerFlag;
			view.expandCollapseNode(setting, node, expandFlag, animateFlag, callback );
		},
		isSelectedNode: function (setting, node) {
			if (!node) {
				return false;
			}
			var list = data.getRoot(setting).curSelectedList,
				i;
			for (i=list.length-1; i>=0; i--) {
				if (node === list[i]) {
					return true;
				}
			}
			return false;
		},
		makeDOMNodeIcon: function(html, setting, node) {
			var nameStr = data.getNodeName(setting, node),
			name = setting.view.nameIsHTML ? nameStr : nameStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			html.push("<span id='", node.tId, consts.id.ICON,
				"' title='' treeNode", consts.id.ICON," class='", view.makeNodeIcoClass(setting, node),
				"' style='", view.makeNodeIcoStyle(setting, node), "'></span><span id='", node.tId, consts.id.SPAN,
				"'>",name,"</span>");
		},
		makeDOMNodeLine: function(html, setting, node) {
			html.push("<span id='", node.tId, consts.id.SWITCH,	"' title='' class='", view.makeNodeLineClass(setting, node), "' treeNode", consts.id.SWITCH,"></span>");
		},
		makeDOMNodeMainAfter: function(html, setting, node) {
			html.push("</li>");
		},
		makeDOMNodeMainBefore: function(html, setting, node) {
			html.push("<li id='", node.tId, "' class='", consts.className.LEVEL, node.level,"' tabindex='0' hidefocus='true' treenode>");
		},
		makeDOMNodeNameAfter: function(html, setting, node) {
			html.push("</a>");
		},
		makeDOMNodeNameBefore: function(html, setting, node) {
			var title = data.getNodeTitle(setting, node),
			url = view.makeNodeUrl(setting, node),
			fontcss = view.makeNodeFontCss(setting, node),
			fontStyle = [];
			for (var f in fontcss) {
				fontStyle.push(f, ":", fontcss[f], ";");
			}
			html.push("<a id='", node.tId, consts.id.A, "' class='", consts.className.LEVEL, node.level,"' treeNode", consts.id.A," onclick=\"", (node.click || ''),
				"\" ", ((url != null && url.length > 0) ? "href='" + url + "'" : ""), " target='",view.makeNodeTarget(node),"' style='", fontStyle.join(''),
				"'");
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle) && title) {html.push("title='", title.replace(/'/g,"&#39;").replace(/</g,'&lt;').replace(/>/g,'&gt;'),"'");}
			html.push(">");
		},
		makeNodeFontCss: function(setting, node) {
			var fontCss = tools.apply(setting.view.fontCss, [setting.treeId, node], setting.view.fontCss);
			return (fontCss && ((typeof fontCss) != "function")) ? fontCss : {};
		},
		makeNodeIcoClass: function(setting, node) {
			var icoCss = ["ico"];
			if (!node.isAjaxing) {
				icoCss[0] = (node.iconSkin ? node.iconSkin + "_" : "") + icoCss[0];
				if (node.isParent) {
					icoCss.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
				} else {
					icoCss.push(consts.folder.DOCU);
				}
			}
			return consts.className.BUTTON + " " + icoCss.join('_');
		},
		makeNodeIcoStyle: function(setting, node) {
			var icoStyle = [];
			if (!node.isAjaxing) {
				var icon = (node.isParent && node.iconOpen && node.iconClose) ? (node.open ? node.iconOpen : node.iconClose) : node.icon;
				if (icon) icoStyle.push("background:url(", icon, ") 0 0 no-repeat;");
				if (setting.view.showIcon == false || !tools.apply(setting.view.showIcon, [setting.treeId, node], true)) {
					icoStyle.push("width:0px;height:0px;");
				}
			}
			return icoStyle.join('');
		},
		makeNodeLineClass: function(setting, node) {
			var lineClass = [];
			if (setting.view.showLine) {
				if (node.level == 0 && node.isFirstNode && node.isLastNode) {
					lineClass.push(consts.line.ROOT);
				} else if (node.level == 0 && node.isFirstNode) {
					lineClass.push(consts.line.ROOTS);
				} else if (node.isLastNode) {
					lineClass.push(consts.line.BOTTOM);
				} else {
					lineClass.push(consts.line.CENTER);
				}
			} else {
				lineClass.push(consts.line.NOLINE);
			}
			if (node.isParent) {
				lineClass.push(node.open ? consts.folder.OPEN : consts.folder.CLOSE);
			} else {
				lineClass.push(consts.folder.DOCU);
			}
			return view.makeNodeLineClassEx(node) + lineClass.join('_');
		},
		makeNodeLineClassEx: function(node) {
			return consts.className.BUTTON + " " + consts.className.LEVEL + node.level + " " + consts.className.SWITCH + " ";
		},
		makeNodeTarget: function(node) {
			return (node.target || "_blank");
		},
		makeNodeUrl: function(setting, node) {
			var urlKey = setting.data.key.url;
			return node[urlKey] ? node[urlKey] : null;
		},
		makeUlHtml: function(setting, node, html, content) {
			html.push("<ul id='", node.tId, consts.id.UL, "' class='", consts.className.LEVEL, node.level, " ", view.makeUlLineClass(setting, node), "' style='display:", (node.open ? "block": "none"),"'>");
			html.push(content);
			html.push("</ul>");
		},
		makeUlLineClass: function(setting, node) {
			return ((setting.view.showLine && !node.isLastNode) ? consts.line.LINE : "");
		},
		removeChildNodes: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			nodes = node[childKey];
			if (!nodes) return;

			for (var i = 0, l = nodes.length; i < l; i++) {
				data.removeNodeCache(setting, nodes[i]);
			}
			data.removeSelectedNode(setting);
			delete node[childKey];

			if (!setting.data.keep.parent) {
				node.isParent = false;
				node.open = false;
				var tmp_switchObj = $$(node, consts.id.SWITCH, setting),
				tmp_icoObj = $$(node, consts.id.ICON, setting);
				view.replaceSwitchClass(node, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(node, tmp_icoObj, consts.folder.DOCU);
				$$(node, consts.id.UL, setting).remove();
			} else {
				$$(node, consts.id.UL, setting).empty();
			}
		},
		setFirstNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][0].isFirstNode = true;
			}
		},
		setLastNode: function(setting, parentNode) {
			var childKey = setting.data.key.children, childLength = parentNode[childKey].length;
			if ( childLength > 0) {
				parentNode[childKey][childLength - 1].isLastNode = true;
			}
		},
		removeNode: function(setting, node) {
			var root = data.getRoot(setting),
			childKey = setting.data.key.children,
			parentNode = (node.parentTId) ? node.getParentNode() : root;

			node.isFirstNode = false;
			node.isLastNode = false;
			node.getPreNode = function() {return null;};
			node.getNextNode = function() {return null;};

			if (!data.getNodeCache(setting, node.tId)) {
				return;
			}

			$$(node, setting).remove();
			data.removeNodeCache(setting, node);
			data.removeSelectedNode(setting, node);

			for (var i = 0, l = parentNode[childKey].length; i < l; i++) {
				if (parentNode[childKey][i].tId == node.tId) {
					parentNode[childKey].splice(i, 1);
					break;
				}
			}
			view.setFirstNode(setting, parentNode);
			view.setLastNode(setting, parentNode);

			var tmp_ulObj,tmp_switchObj,tmp_icoObj,
			childLength = parentNode[childKey].length;

			//repair nodes old parent
			if (!setting.data.keep.parent && childLength == 0) {
				//old parentNode has no child nodes
				parentNode.isParent = false;
				parentNode.open = false;
				tmp_ulObj = $$(parentNode, consts.id.UL, setting);
				tmp_switchObj = $$(parentNode, consts.id.SWITCH, setting);
				tmp_icoObj = $$(parentNode, consts.id.ICON, setting);
				view.replaceSwitchClass(parentNode, tmp_switchObj, consts.folder.DOCU);
				view.replaceIcoClass(parentNode, tmp_icoObj, consts.folder.DOCU);
				tmp_ulObj.css("display", "none");

			} else if (setting.view.showLine && childLength > 0) {
				//old parentNode has child nodes
				var newLast = parentNode[childKey][childLength - 1];
				tmp_ulObj = $$(newLast, consts.id.UL, setting);
				tmp_switchObj = $$(newLast, consts.id.SWITCH, setting);
				tmp_icoObj = $$(newLast, consts.id.ICON, setting);
				if (parentNode == root) {
					if (parentNode[childKey].length == 1) {
						//node was root, and ztree has only one root after move node
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.ROOT);
					} else {
						var tmp_first_switchObj = $$(parentNode[childKey][0], consts.id.SWITCH, setting);
						view.replaceSwitchClass(parentNode[childKey][0], tmp_first_switchObj, consts.line.ROOTS);
						view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
					}
				} else {
					view.replaceSwitchClass(newLast, tmp_switchObj, consts.line.BOTTOM);
				}
				tmp_ulObj.removeClass(consts.line.LINE);
			}
		},
		replaceIcoClass: function(node, obj, newName) {
			if (!obj || node.isAjaxing) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[tmpList.length-1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
		},
		replaceSwitchClass: function(node, obj, newName) {
			if (!obj) return;
			var tmpName = obj.attr("class");
			if (tmpName == undefined) return;
			var tmpList = tmpName.split("_");
			switch (newName) {
				case consts.line.ROOT:
				case consts.line.ROOTS:
				case consts.line.CENTER:
				case consts.line.BOTTOM:
				case consts.line.NOLINE:
					tmpList[0] = view.makeNodeLineClassEx(node) + newName;
					break;
				case consts.folder.OPEN:
				case consts.folder.CLOSE:
				case consts.folder.DOCU:
					tmpList[1] = newName;
					break;
			}
			obj.attr("class", tmpList.join("_"));
			if (newName !== consts.folder.DOCU) {
				obj.removeAttr("disabled");
			} else {
				obj.attr("disabled", "disabled");
			}
		},
		selectNode: function(setting, node, addFlag) {
			if (!addFlag) {
				view.cancelPreSelectedNode(setting, null, node);
			}
			$$(node, consts.id.A, setting).addClass(consts.node.CURSELECTED);
			data.addSelectedNode(setting, node);
			setting.treeObj.trigger(consts.event.SELECTED, [event, setting.treeId, node]);
		},
		setNodeFontCss: function(setting, treeNode) {
			var aObj = $$(treeNode, consts.id.A, setting),
			fontCss = view.makeNodeFontCss(setting, treeNode);
			if (fontCss) {
				aObj.css(fontCss);
			}
		},
		setNodeLineIcos: function(setting, node) {
			if (!node) return;
			var switchObj = $$(node, consts.id.SWITCH, setting),
			ulObj = $$(node, consts.id.UL, setting),
			icoObj = $$(node, consts.id.ICON, setting),
			ulLine = view.makeUlLineClass(setting, node);
			if (ulLine.length==0) {
				ulObj.removeClass(consts.line.LINE);
			} else {
				ulObj.addClass(ulLine);
			}
			switchObj.attr("class", view.makeNodeLineClass(setting, node));
			if (node.isParent) {
				switchObj.removeAttr("disabled");
			} else {
				switchObj.attr("disabled", "disabled");
			}
			icoObj.removeAttr("style");
			icoObj.attr("style", view.makeNodeIcoStyle(setting, node));
			icoObj.attr("class", view.makeNodeIcoClass(setting, node));
		},
		setNodeName: function(setting, node) {
			var title = data.getNodeTitle(setting, node),
			nObj = $$(node, consts.id.SPAN, setting);
			nObj.empty();
			if (setting.view.nameIsHTML) {
				nObj.html(data.getNodeName(setting, node));
			} else {
				nObj.text(data.getNodeName(setting, node));
			}
			if (tools.apply(setting.view.showTitle, [setting.treeId, node], setting.view.showTitle)) {
				var aObj = $$(node, consts.id.A, setting);
				aObj.attr("title", !title ? "" : title);
			}
		},
		setNodeTarget: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting);
			aObj.attr("target", view.makeNodeTarget(node));
		},
		setNodeUrl: function(setting, node) {
			var aObj = $$(node, consts.id.A, setting),
			url = view.makeNodeUrl(setting, node);
			if (url == null || url.length == 0) {
				aObj.removeAttr("href");
			} else {
				aObj.attr("href", url);
			}
		},
		switchNode: function(setting, node) {
			if (node.open || !tools.canAsync(setting, node)) {
				view.expandCollapseNode(setting, node, !node.open);
			} else if (setting.async.enable) {
				if (!view.asyncNode(setting, node)) {
					view.expandCollapseNode(setting, node, !node.open);
					return;
				}
			} else if (node) {
				view.expandCollapseNode(setting, node, !node.open);
			}
		}
	};
	// zTree defind
	$.fn.zTree = {
		consts : _consts,
		_z : {
			tools: tools,
			view: view,
			event: event,
			data: data
		},
		getZTreeObj: function(treeId) {
			var o = data.getZTreeTools(treeId);
			return o ? o : null;
		},
		destroy: function(treeId) {
			if (!!treeId && treeId.length > 0) {
				view.destroy(data.getSetting(treeId));
			} else {
				for(var s in settings) {
					view.destroy(settings[s]);
				}
			}
		},
		init: function(obj, zSetting, zNodes) {
			var setting = tools.clone(_setting);
			$.extend(true, setting, zSetting);
			setting.treeId = obj.attr("id");
			setting.treeObj = obj;
			setting.treeObj.empty();
			settings[setting.treeId] = setting;
			//For some older browser,(e.g., ie6)
			if(typeof document.body.style.maxHeight === "undefined") {
				setting.view.expandSpeed = "";
			}
			data.initRoot(setting);
			var root = data.getRoot(setting),
			childKey = setting.data.key.children;
			zNodes = zNodes ? tools.clone(tools.isArray(zNodes)? zNodes : [zNodes]) : [];
			if (setting.data.simpleData.enable) {
				root[childKey] = data.transformTozTreeFormat(setting, zNodes);
			} else {
				root[childKey] = zNodes;
			}

			data.initCache(setting);
			event.unbindTree(setting);
			event.bindTree(setting);
			event.unbindEvent(setting);
			event.bindEvent(setting);

			var zTreeTools = {
				setting : setting,
				addNodes : function(parentNode, newNodes, isSilent) {
					if (!newNodes) return null;
					if (!parentNode) parentNode = null;
					if (parentNode && !parentNode.isParent && setting.data.keep.leaf) return null;
					var xNewNodes = tools.clone(tools.isArray(newNodes)? newNodes: [newNodes]);
					function addCallback() {
						view.addNodes(setting, parentNode, xNewNodes, (isSilent==true));
					}

					if (tools.canAsync(setting, parentNode)) {
						view.asyncNode(setting, parentNode, isSilent, addCallback);
					} else {
						addCallback();
					}
					return xNewNodes;
				},
				cancelSelectedNode : function(node) {
					view.cancelPreSelectedNode(setting, node);
				},
				destroy : function() {
					view.destroy(setting);
				},
				expandAll : function(expandFlag) {
					expandFlag = !!expandFlag;
					view.expandCollapseSonNode(setting, null, expandFlag, true);
					return expandFlag;
				},
				expandNode : function(node, expandFlag, sonSign, focus, callbackFlag) {
					if (!node || !node.isParent) return null;
					if (expandFlag !== true && expandFlag !== false) {
						expandFlag = !node.open;
					}
					callbackFlag = !!callbackFlag;

					if (callbackFlag && expandFlag && (tools.apply(setting.callback.beforeExpand, [setting.treeId, node], true) == false)) {
						return null;
					} else if (callbackFlag && !expandFlag && (tools.apply(setting.callback.beforeCollapse, [setting.treeId, node], true) == false)) {
						return null;
					}
					if (expandFlag && node.parentTId) {
						view.expandCollapseParentNode(setting, node.getParentNode(), expandFlag, false);
					}
					if (expandFlag === node.open && !sonSign) {
						return null;
					}

					data.getRoot(setting).expandTriggerFlag = callbackFlag;
					if (!tools.canAsync(setting, node) && sonSign) {
						view.expandCollapseSonNode(setting, node, expandFlag, true, function() {
							if (focus !== false) {try{$$(node, setting).focus().blur();}catch(e){}}
						});
					} else {
						node.open = !expandFlag;
						view.switchNode(this.setting, node);
						if (focus !== false) {try{$$(node, setting).focus().blur();}catch(e){}}
					}
					return expandFlag;
				},
				getNodes : function() {
					return data.getNodes(setting);
				},
				getNodeByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodeByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodeByTId : function(tId) {
					return data.getNodeCache(setting, tId);
				},
				getNodesByParam : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParam(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByParamFuzzy : function(key, value, parentNode) {
					if (!key) return null;
					return data.getNodesByParamFuzzy(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), key, value);
				},
				getNodesByFilter: function(filter, isSingle, parentNode, invokeParam) {
					isSingle = !!isSingle;
					if (!filter || (typeof filter != "function")) return (isSingle ? null : []);
					return data.getNodesByFilter(setting, parentNode?parentNode[setting.data.key.children]:data.getNodes(setting), filter, isSingle, invokeParam);
				},
				getNodeIndex : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
					for (var i=0, l = parentNode[childKey].length; i < l; i++) {
						if (parentNode[childKey][i] == node) return i;
					}
					return -1;
				},
				getSelectedNodes : function() {
					var r = [], list = data.getRoot(setting).curSelectedList;
					for (var i=0, l=list.length; i<l; i++) {
						r.push(list[i]);
					}
					return r;
				},
				isSelectedNode : function(node) {
					return data.isSelectedNode(setting, node);
				},
				reAsyncChildNodes : function(parentNode, reloadType, isSilent) {
					if (!this.setting.async.enable) return;
					var isRoot = !parentNode;
					if (isRoot) {
						parentNode = data.getRoot(setting);
					}
					if (reloadType=="refresh") {
						var childKey = this.setting.data.key.children;
						for (var i = 0, l = parentNode[childKey] ? parentNode[childKey].length : 0; i < l; i++) {
							data.removeNodeCache(setting, parentNode[childKey][i]);
						}
						data.removeSelectedNode(setting);
						parentNode[childKey] = [];
						if (isRoot) {
							this.setting.treeObj.empty();
						} else {
							var ulObj = $$(parentNode, consts.id.UL, setting);
							ulObj.empty();
						}
					}
					view.asyncNode(this.setting, isRoot? null:parentNode, !!isSilent);
				},
				refresh : function() {
					this.setting.treeObj.empty();
					var root = data.getRoot(setting),
					nodes = root[setting.data.key.children]
					data.initRoot(setting);
					root[setting.data.key.children] = nodes
					data.initCache(setting);
					view.createNodes(setting, 0, root[setting.data.key.children]);
				},
				removeChildNodes : function(node) {
					if (!node) return null;
					var childKey = setting.data.key.children,
					nodes = node[childKey];
					view.removeChildNodes(setting, node);
					return nodes ? nodes : null;
				},
				removeNode : function(node, callbackFlag) {
					if (!node) return;
					callbackFlag = !!callbackFlag;
					if (callbackFlag && tools.apply(setting.callback.beforeRemove, [setting.treeId, node], true) == false) return;
					view.removeNode(setting, node);
					if (callbackFlag) {
						this.setting.treeObj.trigger(consts.event.REMOVE, [setting.treeId, node]);
					}
				},
				selectNode : function(node, addFlag) {
					if (!node) return;
					if (tools.uCanDo(setting)) {
						addFlag = setting.view.selectedMulti && addFlag;
						if (node.parentTId) {
							view.expandCollapseParentNode(setting, node.getParentNode(), true, false, function() {
								try{$$(node, setting).focus().blur();}catch(e){}
							});
						} else {
							try{$$(node, setting).focus().blur();}catch(e){}
						}
						view.selectNode(setting, node, addFlag);
					}
				},
				transformTozTreeNodes : function(simpleNodes) {
					return data.transformTozTreeFormat(setting, simpleNodes);
				},
				transformToArray : function(nodes) {
					return data.transformToArrayFormat(setting, nodes);
				},
				updateNode : function(node, checkTypeFlag) {
					if (!node) return;
					var nObj = $$(node, setting);
					if (nObj.get(0) && tools.uCanDo(setting)) {
						view.setNodeName(setting, node);
						view.setNodeTarget(setting, node);
						view.setNodeUrl(setting, node);
						view.setNodeLineIcos(setting, node);
						view.setNodeFontCss(setting, node);
					}
				}
			}
			root.treeTools = zTreeTools;
			data.setZTreeTools(setting, zTreeTools);

			if (root[childKey] && root[childKey].length > 0) {
				view.createNodes(setting, 0, root[childKey]);
			} else if (setting.async.enable && setting.async.url && setting.async.url !== '') {
				view.asyncNode(setting);
			}
			return zTreeTools;
		}
	};

	var zt = $.fn.zTree,
	$$ = tools.$,
	consts = zt.consts;
})(BI.jQuery);/*
 * JQuery zTree excheck v3.5.18
 * http://zTree.me/
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2015-06-18
 */
(function($){
	//default consts of excheck
	var _consts = {
		event: {
			CHECK: "ztree_check"
		},
		id: {
			CHECK: "_check"
		},
		checkbox: {
			STYLE: "checkbox",
			DEFAULT: "chk",
			DISABLED: "disable",
			FALSE: "false",
			TRUE: "true",
			FULL: "full",
			PART: "part",
			FOCUS: "focus"
		},
		radio: {
			STYLE: "radio",
			TYPE_ALL: "all",
			TYPE_LEVEL: "level"
		}
	},
	//default setting of excheck
	_setting = {
		check: {
			enable: false,
			autoCheckTrigger: false,
			chkStyle: _consts.checkbox.STYLE,
			nocheckInherit: false,
			chkDisabledInherit: false,
			radioType: _consts.radio.TYPE_LEVEL,
			chkboxType: {
				"Y": "ps",
				"N": "ps"
			}
		},
		data: {
			key: {
				checked: "checked"
			}
		},
		callback: {
			beforeCheck:null,
			onCheck:null
		}
	},
	//default root of excheck
	_initRoot = function (setting) {
		var r = data.getRoot(setting);
		r.radioCheckedList = [];
	},
	//default cache of excheck
	_initCache = function(treeId) {},
	//default bind event of excheck
	_bindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.bind(c.CHECK, function (event, srcEvent, treeId, node) {
			event.srcEvent = srcEvent;
			tools.apply(setting.callback.onCheck, [event, treeId, node]);
		});
	},
	_unbindEvent = function(setting) {
		var o = setting.treeObj,
		c = consts.event;
		o.unbind(c.CHECK);
	},
	//default event proxy of excheck
	_eventProxy = function(e) {
		var target = e.target,
		setting = data.getSetting(e.data.treeId),
		tId = "", node = null,
		nodeEventType = "", treeEventType = "",
		nodeEventCallback = null, treeEventCallback = null;

		if (tools.eqs(e.type, "mouseover")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "mouseoverCheck";
			}
		} else if (tools.eqs(e.type, "mouseout")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "mouseoutCheck";
			}
		} else if (tools.eqs(e.type, "click")) {
			if (setting.check.enable && tools.eqs(target.tagName, "span") && target.getAttribute("treeNode"+ consts.id.CHECK) !== null) {
				tId = tools.getNodeMainDom(target).id;
				nodeEventType = "checkNode";
			}
		}
		if (tId.length>0) {
			node = data.getNodeCache(setting, tId);
			switch (nodeEventType) {
				case "checkNode" :
					nodeEventCallback = _handler.onCheckNode;
					break;
				case "mouseoverCheck" :
					nodeEventCallback = _handler.onMouseoverCheck;
					break;
				case "mouseoutCheck" :
					nodeEventCallback = _handler.onMouseoutCheck;
					break;
			}
		}
		var proxyResult = {
			stop: nodeEventType === "checkNode",
			node: node,
			nodeEventType: nodeEventType,
			nodeEventCallback: nodeEventCallback,
			treeEventType: treeEventType,
			treeEventCallback: treeEventCallback
		};
		return proxyResult
	},
	//default init node of excheck
	_initNode = function(setting, level, n, parentNode, isFirstNode, isLastNode, openFlag) {
		if (!n) return;
		var checkedKey = setting.data.key.checked;
		if (typeof n[checkedKey] == "string") n[checkedKey] = tools.eqs(n[checkedKey], "true");
		n[checkedKey] = !!n[checkedKey];
		n.checkedOld = n[checkedKey];
		if (typeof n.nocheck == "string") n.nocheck = tools.eqs(n.nocheck, "true");
		n.nocheck = !!n.nocheck || (setting.check.nocheckInherit && parentNode && !!parentNode.nocheck);
		if (typeof n.chkDisabled == "string") n.chkDisabled = tools.eqs(n.chkDisabled, "true");
		n.chkDisabled = !!n.chkDisabled || (setting.check.chkDisabledInherit && parentNode && !!parentNode.chkDisabled);
		if (typeof n.halfCheck == "string") n.halfCheck = tools.eqs(n.halfCheck, "true");
		n.halfCheck = !!n.halfCheck;
		n.check_Child_State = -1;
		n.check_Focus = false;
		n.getCheckStatus = function() {return data.getCheckStatus(setting, n);};

		if (setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL && n[checkedKey] ) {
			var r = data.getRoot(setting);
			r.radioCheckedList.push(n);
		}
	},
	//add dom for check
	_beforeA = function(setting, node, html) {
		var checkedKey = setting.data.key.checked;
		if (setting.check.enable) {
			data.makeChkFlag(setting, node);
			html.push("<span ID='", node.tId, consts.id.CHECK, "' class='", view.makeChkClass(setting, node), "' treeNode", consts.id.CHECK, (node.nocheck === true?" style='display:none;'":""),"></span>");
		}
	},
	//update zTreeObj, add method of check
	_zTreeTools = function(setting, zTreeTools) {
		zTreeTools.checkNode = function(node, checked, checkTypeFlag, callbackFlag) {
			var checkedKey = this.setting.data.key.checked;
			if (node.chkDisabled === true) return;
			if (checked !== true && checked !== false) {
				checked = !node[checkedKey];
			}
			callbackFlag = !!callbackFlag;

			if (node[checkedKey] === checked && !checkTypeFlag) {
				return;
			} else if (callbackFlag && tools.apply(this.setting.callback.beforeCheck, [this.setting.treeId, node], true) == false) {
				return;
			}
			if (tools.uCanDo(this.setting) && this.setting.check.enable && node.nocheck !== true) {
				node[checkedKey] = checked;
				var checkObj = $$(node, consts.id.CHECK, this.setting);
				if (checkTypeFlag || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
				if (callbackFlag) {
					this.setting.treeObj.trigger(consts.event.CHECK, [null, this.setting.treeId, node]);
				}
			}
		}

		zTreeTools.checkAllNodes = function(checked) {
			view.repairAllChk(this.setting, !!checked);
		}

		zTreeTools.getCheckedNodes = function(checked) {
			var childKey = this.setting.data.key.children;
			checked = (checked !== false);
			return data.getTreeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey], checked);
		}

		zTreeTools.getChangeCheckedNodes = function() {
			var childKey = this.setting.data.key.children;
			return data.getTreeChangeCheckedNodes(this.setting, data.getRoot(this.setting)[childKey]);
		}

		zTreeTools.setChkDisabled = function(node, disabled, inheritParent, inheritChildren) {
			disabled = !!disabled;
			inheritParent = !!inheritParent;
			inheritChildren = !!inheritChildren;
			view.repairSonChkDisabled(this.setting, node, disabled, inheritChildren);
			view.repairParentChkDisabled(this.setting, node.getParentNode(), disabled, inheritParent);
		}

		var _updateNode = zTreeTools.updateNode;
		zTreeTools.updateNode = function(node, checkTypeFlag) {
			if (_updateNode) _updateNode.apply(zTreeTools, arguments);
			if (!node || !this.setting.check.enable) return;
			var nObj = $$(node, this.setting);
			if (nObj.get(0) && tools.uCanDo(this.setting)) {
				var checkObj = $$(node, consts.id.CHECK, this.setting);
				if (checkTypeFlag == true || this.setting.check.chkStyle === consts.radio.STYLE) view.checkNodeRelation(this.setting, node);
				view.setChkClass(this.setting, checkObj, node);
				view.repairParentChkClassWithSelf(this.setting, node);
			}
		}
	},
	//method of operate data
	_data = {
		getRadioCheckedList: function(setting) {
			var checkedList = data.getRoot(setting).radioCheckedList;
			for (var i=0, j=checkedList.length; i<j; i++) {
				if(!data.getNodeCache(setting, checkedList[i].tId)) {
					checkedList.splice(i, 1);
					i--; j--;
				}
			}
			return checkedList;
		},
		getCheckStatus: function(setting, node) {
			if (!setting.check.enable || node.nocheck || node.chkDisabled) return null;
			var checkedKey = setting.data.key.checked,
			r = {
				checked: node[checkedKey],
				half: node.halfCheck ? node.halfCheck : (setting.check.chkStyle == consts.radio.STYLE ? (node.check_Child_State === 2) : (node[checkedKey] ? (node.check_Child_State > -1 && node.check_Child_State < 2) : (node.check_Child_State > 0)))
			};
			return r;
		},
		getTreeCheckedNodes: function(setting, nodes, checked, results) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			onlyOne = (checked && setting.check.chkStyle == consts.radio.STYLE && setting.check.radioType == consts.radio.TYPE_ALL);
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] == checked) {
					results.push(nodes[i]);
					if(onlyOne) {
						break;
					}
				}
				data.getTreeCheckedNodes(setting, nodes[i][childKey], checked, results);
				if(onlyOne && results.length > 0) {
					break;
				}
			}
			return results;
		},
		getTreeChangeCheckedNodes: function(setting, nodes, results) {
			if (!nodes) return [];
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked;
			results = !results ? [] : results;
			for (var i = 0, l = nodes.length; i < l; i++) {
				if (nodes[i].nocheck !== true && nodes[i].chkDisabled !== true && nodes[i][checkedKey] != nodes[i].checkedOld) {
					results.push(nodes[i]);
				}
				data.getTreeChangeCheckedNodes(setting, nodes[i][childKey], results);
			}
			return results;
		},
		makeChkFlag: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			chkFlag = -1;
			if (node[childKey]) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var cNode = node[childKey][i];
					var tmp = -1;
					if (setting.check.chkStyle == consts.radio.STYLE) {
						if (cNode.nocheck === true || cNode.chkDisabled === true) {
							tmp = cNode.check_Child_State;
						} else if (cNode.halfCheck === true) {
							tmp = 2;
						} else if (cNode[checkedKey]) {
							tmp = 2;
						} else {
							tmp = cNode.check_Child_State > 0 ? 2:0;
						}
						if (tmp == 2) {
							chkFlag = 2; break;
						} else if (tmp == 0){
							chkFlag = 0;
						}
					} else if (setting.check.chkStyle == consts.checkbox.STYLE) {
						if (cNode.nocheck === true || cNode.chkDisabled === true) {
							tmp = cNode.check_Child_State;
						} else if (cNode.halfCheck === true) {
							tmp = 1;
						} else if (cNode[checkedKey] ) {
							tmp = (cNode.check_Child_State === -1 || cNode.check_Child_State === 2) ? 2 : 1;
						} else {
							tmp = (cNode.check_Child_State > 0) ? 1 : 0;
						}
						if (tmp === 1) {
							chkFlag = 1; break;
						} else if (tmp === 2 && chkFlag > -1 && i > 0 && tmp !== chkFlag) {
							chkFlag = 1; break;
						} else if (chkFlag === 2 && tmp > -1 && tmp < 2) {
							chkFlag = 1; break;
						} else if (tmp > -1) {
							chkFlag = tmp;
						}
					}
				}
			}
			node.check_Child_State = chkFlag;
		}
	},
	//method of event proxy
	_event = {

	},
	//method of event handler
	_handler = {
		onCheckNode: function (event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkedKey = setting.data.key.checked;
			if (tools.apply(setting.callback.beforeCheck, [setting.treeId, node], true) == false) return true;
			node[checkedKey] = !node[checkedKey];
			view.checkNodeRelation(setting, node);
			var checkObj = $$(node, consts.id.CHECK, setting);
			view.setChkClass(setting, checkObj, node);
			view.repairParentChkClassWithSelf(setting, node);
			setting.treeObj.trigger(consts.event.CHECK, [event, setting.treeId, node]);
			return true;
		},
		onMouseoverCheck: function(event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkObj = $$(node, consts.id.CHECK, setting);
			node.check_Focus = true;
			view.setChkClass(setting, checkObj, node);
			return true;
		},
		onMouseoutCheck: function(event, node) {
			if (node.chkDisabled === true) return false;
			var setting = data.getSetting(event.data.treeId),
			checkObj = $$(node, consts.id.CHECK, setting);
			node.check_Focus = false;
			view.setChkClass(setting, checkObj, node);
			return true;
		}
	},
	//method of tools for zTree
	_tools = {

	},
	//method of operate ztree dom
	_view = {
		checkNodeRelation: function(setting, node) {
			var pNode, i, l,
			childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			r = consts.radio;
			if (setting.check.chkStyle == r.STYLE) {
				var checkedList = data.getRadioCheckedList(setting);
				if (node[checkedKey]) {
					if (setting.check.radioType == r.TYPE_ALL) {
						for (i = checkedList.length-1; i >= 0; i--) {
							pNode = checkedList[i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								checkedList.splice(i, 1);

								view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
								if (pNode.parentTId != node.parentTId) {
									view.repairParentChkClassWithSelf(setting, pNode);
								}
							}
						}
						checkedList.push(node);
					} else {
						var parentNode = (node.parentTId) ? node.getParentNode() : data.getRoot(setting);
						for (i = 0, l = parentNode[childKey].length; i < l; i++) {
							pNode = parentNode[childKey][i];
							if (pNode[checkedKey] && pNode != node) {
								pNode[checkedKey] = false;
								view.setChkClass(setting, $$(pNode, consts.id.CHECK, setting), pNode);
							}
						}
					}
				} else if (setting.check.radioType == r.TYPE_ALL) {
					for (i = 0, l = checkedList.length; i < l; i++) {
						if (node == checkedList[i]) {
							checkedList.splice(i, 1);
							break;
						}
					}
				}

			} else {
				if (node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.Y.indexOf("s") > -1)) {
					view.setSonNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && (!node[childKey] || node[childKey].length==0 || setting.check.chkboxType.N.indexOf("s") > -1)) {
					view.setSonNodeCheckBox(setting, node, false);
				}
				if (node[checkedKey] && setting.check.chkboxType.Y.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, true);
				}
				if (!node[checkedKey] && setting.check.chkboxType.N.indexOf("p") > -1) {
					view.setParentNodeCheckBox(setting, node, false);
				}
			}
		},
		makeChkClass: function(setting, node) {
			var checkedKey = setting.data.key.checked,
			c = consts.checkbox, r = consts.radio,
			checkboxType = setting.check.chkboxType;
			var notEffectByOtherNode = (checkboxType.Y === "" && checkboxType.N === "");
			fullStyle = "";
			if (node.chkDisabled === true) {
				fullStyle = c.DISABLED;
			} else if (node.halfCheck) {
				fullStyle = c.PART;
			} else if (setting.check.chkStyle == r.STYLE) {
				fullStyle = (node.check_Child_State < 1)? c.FULL:c.PART;
			} else {
				fullStyle = node[checkedKey] ? ((node.check_Child_State === 2 || node.check_Child_State === -1) || notEffectByOtherNode ? c.FULL:c.PART) : ((node.check_Child_State < 1 || notEffectByOtherNode)? c.FULL:c.PART);
			}
			var chkName = setting.check.chkStyle + "_" + (node[checkedKey] ? c.TRUE : c.FALSE) + "_" + fullStyle;
			chkName = (node.check_Focus && node.chkDisabled !== true) ? chkName + "_" + c.FOCUS : chkName;
			return consts.className.BUTTON + " " + c.DEFAULT + " " + chkName;
		},
		repairAllChk: function(setting, checked) {
			if (setting.check.enable && setting.check.chkStyle === consts.checkbox.STYLE) {
				var checkedKey = setting.data.key.checked,
				childKey = setting.data.key.children,
				root = data.getRoot(setting);
				for (var i = 0, l = root[childKey].length; i<l ; i++) {
					var node = root[childKey][i];
					if (node.nocheck !== true && node.chkDisabled !== true) {
						node[checkedKey] = checked;
					}
					view.setSonNodeCheckBox(setting, node, checked);
				}
			}
		},
		repairChkClass: function(setting, node) {
			if (!node) return;
			data.makeChkFlag(setting, node);
			if (node.nocheck !== true) {
				var checkObj = $$(node, consts.id.CHECK, setting);
				view.setChkClass(setting, checkObj, node);
			}
		},
		repairParentChkClass: function(setting, node) {
			if (!node || !node.parentTId) return;
			var pNode = node.getParentNode();
			view.repairChkClass(setting, pNode);
			view.repairParentChkClass(setting, pNode);
		},
		repairParentChkClassWithSelf: function(setting, node) {
			if (!node) return;
			var childKey = setting.data.key.children;
			if (node[childKey] && node[childKey].length > 0) {
				view.repairParentChkClass(setting, node[childKey][0]);
			} else {
				view.repairParentChkClass(setting, node);
			}
		},
		repairSonChkDisabled: function(setting, node, chkDisabled, inherit) {
			if (!node) return;
			var childKey = setting.data.key.children;
			if (node.chkDisabled != chkDisabled) {
				node.chkDisabled = chkDisabled;
			}
			view.repairChkClass(setting, node);
			if (node[childKey] && inherit) {
				for (var i = 0, l = node[childKey].length; i < l; i++) {
					var sNode = node[childKey][i];
					view.repairSonChkDisabled(setting, sNode, chkDisabled, inherit);
				}
			}
		},
		repairParentChkDisabled: function(setting, node, chkDisabled, inherit) {
			if (!node) return;
			if (node.chkDisabled != chkDisabled && inherit) {
				node.chkDisabled = chkDisabled;
			}
			view.repairChkClass(setting, node);
			view.repairParentChkDisabled(setting, node.getParentNode(), chkDisabled, inherit);
		},
		setChkClass: function(setting, obj, node) {
			if (!obj) return;
			if (node.nocheck === true) {
				obj.hide();
			} else {
				obj.show();
			}
            obj.attr('class', view.makeChkClass(setting, node));
		},
		setParentNodeCheckBox: function(setting, node, value, srcNode) {
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			checkObj = $$(node, consts.id.CHECK, setting);
			if (!srcNode) srcNode = node;
			data.makeChkFlag(setting, node);
			if (node.nocheck !== true && node.chkDisabled !== true) {
				node[checkedKey] = value;
				view.setChkClass(setting, checkObj, node);
				if (setting.check.autoCheckTrigger && node != srcNode) {
					setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
				}
			}
			if (node.parentTId) {
				var pSign = true;
				if (!value) {
					var pNodes = node.getParentNode()[childKey];
					for (var i = 0, l = pNodes.length; i < l; i++) {
						if ((pNodes[i].nocheck !== true && pNodes[i].chkDisabled !== true && pNodes[i][checkedKey])
						|| ((pNodes[i].nocheck === true || pNodes[i].chkDisabled === true) && pNodes[i].check_Child_State > 0)) {
							pSign = false;
							break;
						}
					}
				}
				if (pSign) {
					view.setParentNodeCheckBox(setting, node.getParentNode(), value, srcNode);
				}
			}
		},
		setSonNodeCheckBox: function(setting, node, value, srcNode) {
			if (!node) return;
			var childKey = setting.data.key.children,
			checkedKey = setting.data.key.checked,
			checkObj = $$(node, consts.id.CHECK, setting);
			if (!srcNode) srcNode = node;

			var hasDisable = false;
			if (node[childKey]) {
				for (var i = 0, l = node[childKey].length; i < l && node.chkDisabled !== true; i++) {
					var sNode = node[childKey][i];
					view.setSonNodeCheckBox(setting, sNode, value, srcNode);
					if (sNode.chkDisabled === true) hasDisable = true;
				}
			}

			if (node != data.getRoot(setting) && node.chkDisabled !== true) {
				if (hasDisable && node.nocheck !== true) {
					data.makeChkFlag(setting, node);
				}
				if (node.nocheck !== true && node.chkDisabled !== true) {
					node[checkedKey] = value;
					if (!hasDisable) node.check_Child_State = (node[childKey] && node[childKey].length > 0) ? (value ? 2 : 0) : -1;
				} else {
					node.check_Child_State = -1;
				}
				view.setChkClass(setting, checkObj, node);
				if (setting.check.autoCheckTrigger && node != srcNode && node.nocheck !== true && node.chkDisabled !== true) {
					setting.treeObj.trigger(consts.event.CHECK, [null, setting.treeId, node]);
				}
			}

		}
	},

	_z = {
		tools: _tools,
		view: _view,
		event: _event,
		data: _data
	};
	$.extend(true, $.fn.zTree.consts, _consts);
	$.extend(true, $.fn.zTree._z, _z);

	var zt = $.fn.zTree,
	tools = zt._z.tools,
	consts = zt.consts,
	view = zt._z.view,
	data = zt._z.data,
	event = zt._z.event,
	$$ = tools.$;

	data.exSetting(_setting);
	data.addInitBind(_bindEvent);
	data.addInitUnBind(_unbindEvent);
	data.addInitCache(_initCache);
	data.addInitNode(_initNode);
	data.addInitProxy(_eventProxy, true);
	data.addInitRoot(_initRoot);
	data.addBeforeA(_beforeA);
	data.addZTreeTools(_zTreeTools);

	var _createNodes = view.createNodes;
	view.createNodes = function(setting, level, nodes, parentNode) {
		if (_createNodes) _createNodes.apply(view, arguments);
		if (!nodes) return;
		view.repairParentChkClassWithSelf(setting, parentNode);
	}
	var _removeNode = view.removeNode;
	view.removeNode = function(setting, node) {
		var parentNode = node.getParentNode();
		if (_removeNode) _removeNode.apply(view, arguments);
		if (!node || !parentNode) return;
		view.repairChkClass(setting, parentNode);
		view.repairParentChkClass(setting, parentNode);
	}

	var _appendNodes = view.appendNodes;
	view.appendNodes = function(setting, level, nodes, parentNode, initFlag, openFlag) {
		var html = "";
		if (_appendNodes) {
			html = _appendNodes.apply(view, arguments);
		}
		if (parentNode) {
			data.makeChkFlag(setting, parentNode);
		}
		return html;
	}
})(BI.jQuery);/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/1/8
 */

!(function () {
    BI.TreeRenderService = BI.inherit(BI.OB, {
        _init: function () {
            this.nodeLists = {};

            this.id = this.options.id;
            // renderService是否已经注册了滚动
            this.hasBinded = false;

            this.container = this.options.container;
        },

        _getNodeListBounds: function (tId) {
            var nodeList = this.options.subNodeListGetter(tId)[0];
            return {
                top: nodeList.offsetTop,
                left: nodeList.offsetLeft,
                width: nodeList.offsetWidth,
                height: nodeList.offsetHeight
            }
        },

        _getTreeContainerBounds: function () {
            var nodeList = this.container[0];
            if (BI.isNotNull(nodeList)) {
                return {
                    top: nodeList.offsetTop + nodeList.scrollTop,
                    left: nodeList.offsetLeft + nodeList.scrollLeft,
                    width: nodeList.offsetWidth,
                    height: nodeList.offsetHeight
                };
            }
            return {};
        },

        _canNodePopulate: function (tId) {
            if (this.nodeLists[tId].locked) {
                return false;
            }
            // 获取ul, 即子节点列表的bounds
            // 是否需要继续加载，只需要看子节点列表的下边界与container是否无交集
            var bounds = this._getNodeListBounds(tId);
            var containerBounds = this._getTreeContainerBounds(tId);
            // ul底部是不是漏出来了
            if (bounds.top + bounds.height < containerBounds.top + containerBounds.height) {
                return true;
            }
            return false;
        },

        _isNodeInVisible: function (tId) {
            var nodeList = this.options.subNodeListGetter(tId);
            return nodeList.length === 0 || nodeList.css("display") === "none";
        },

        pushNodeList: function (tId, populate) {
            var self = this;
            if (!BI.has(this.nodeLists, tId)) {
                this.nodeLists[tId] = {
                    populate: BI.debounce(populate, 0),
                    options: {
                        times: 1
                    },
                    // 在上一次请求返回前, 通过滚动再次触发加载的时候, 不应该认为是下一次分页, 需要等待上次请求返回
                    // 以保证顺序和请求次数的完整
                    locked: false
                };
            } else {
                this.nodeLists[tId].locked = false;
            }
            if(!this.hasBinded) {
                // console.log("绑定事件");
                this.hasBinded = true;
                this.container && this.container.on("scroll", BI.debounce(function () {
                    self.refreshAllNodes();
                }, 30));
            }
        },

        refreshAllNodes: function () {
            var self = this;
            BI.each(this.nodeLists, function (tId) {
                // 不展开的节点就不看了
                !self._isNodeInVisible(tId) && self.refreshNodes(tId);
            });
        },

        refreshNodes: function (tId) {
            if (this._canNodePopulate(tId)) {
                var nodeList = this.nodeLists[tId];
                nodeList.options.times++;
                nodeList.locked = true;
                nodeList.populate({
                    times: nodeList.options.times
                });
            }
        },

        removeNodeList: function (tId) {
            delete this.nodeLists[tId];
            if (BI.size(this.nodeLists) === 0) {
                this.clear();
            }
        },

        clear: function () {
            var self = this;
            BI.each(this.nodeLists, function (tId) {
                self.removeNodeList(tId);
            });
            this.nodeLists = {};
            // console.log("解绑事件");
            this.container.off("scroll");
            this.hasBinded = false;
        }
    });
})();
//# sourceMappingURL=base.js.map