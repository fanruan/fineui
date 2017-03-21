/**
 * Created by windy on 2016/12/20.
 */
BI.DynamicGroupTabButtonGroup = BI.inherit(BI.Widget, {

    _const: {
        MERGE_ADD_WIDTH: 65
    },

    _defaultConfig: function () {
        return BI.extend(BI.DynamicGroupTabButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            cls: "bi-dynamic-group-tab-button-group",
            items: [],
            frozenButtons: [],
            height: 30
        })
    },

    _init: function () {
        BI.DynamicGroupTabButtonGroup.superclass._init.apply(this, arguments);
        var o = this.options;
        this.tab = BI.createWidget({
            type: "bi.button_group",
            height: o.height,
            items: [],
            layouts: [{
                type: "bi.horizontal",
                scrollable: false,
                scrollx: false
            }]
        });

        this.tab.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.DynamicGroupTabButtonGroup.EVENT_CHANGE, arguments);
        });

        var self = this;

        this.scrollLeft = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-font bi-icon-button-scroll",
            invisible: true
        });

        this.scrollLeft.on(BI.IconButton.EVENT_CHANGE, function () {
            self._scrollLeft();
        });
        this.scrollRight = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-font bi-icon-button-scroll",
            invisible: true
        });
        this.scrollRight.on(BI.IconButton.EVENT_CHANGE, function () {
            self._scrollRight();
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self.resize();
        });

        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [{
                type: "bi.horizontal",
                tgap: -1,
                height: o.height,
                scrollx: false,
                cls: "bi-sheet-tab-dynamic-horizontal",
                items: [this.tab,
                    {
                        type: "bi.vertical_adapt",
                        items: [this.scrollLeft],
                        height: o.height
                    },
                    {
                        type: "bi.vertical_adapt",
                        items: [this.scrollRight],
                        height: o.height
                    },
                    {
                        type: "bi.vertical_adapt",
                        items: o.frozenButtons,
                        height: o.height,
                        lgap: 10
                    }
                ]
            }]
        })
    },

    _scrollLeft: function () {
        this._scrollTo(this.tab.element[0].scrollLeft - this.scrollSection)
    },

    _scrollRight: function () {
        this._scrollTo(this.tab.element[0].scrollLeft + this.scrollSection)
    },

    _getTotalWidth: function () {
        var totalWidth = this.element.outerWidth();
        totalWidth -= this._const.MERGE_ADD_WIDTH;
        BI.each(this.options.frozenButtons, function (idx, button) {
            if (BI.isWidget(button)) {
                totalWidth -= button.getWidth();
            } else {
                totalWidth -= button.width;
            }
        })
        return totalWidth;
    },

    _calculateButtonsWith: function (fn) {
        var buttonWidth = 0;
        var self = this;
        BI.some(this.tab.getAllButtons(), function (idx, item) {
            buttonWidth += item.element.outerWidth();
            if (BI.isNotNull(fn) && fn.apply(self, [item])) {
                return true;
            }
        })
        return buttonWidth;
    },

    _dealWithScrollButtonState: function () {
        var buttonWidth = this._calculateButtonsWith();
        if (this.tab.element[0].scrollLeft === 0) {
            this.scrollLeft.setEnable(false);
        } else {
            this.scrollLeft.setEnable(true);
        }
        var ulWidth = this.tab.element.outerWidth();
        //可以滚动的最大距离
        var maxLeft = buttonWidth - ulWidth;
        if (this.tab.element[0].scrollLeft === maxLeft) {
            this.scrollRight.setEnable(false);
        } else {
            this.scrollRight.setEnable(true);
        }
    },

    _needScroll: function (visibleWidth, buttonWidth) {
        var currentLeft = this.tab.element[0].scrollLeft;
        return (visibleWidth > currentLeft && visibleWidth - currentLeft > buttonWidth) ||
            (visibleWidth < currentLeft)
    },

    _scrollTo: function (value) {
        var self = this;
        BI.delay(function () {
            self.tab.element.scrollLeft(value);
            self._dealWithScrollButtonState();
        }, 30);
    },

    _scrollToEnd: function () {
        this._scrollTo(this._calculateButtonsWith())
    },

    resize: function () {
        //获取当前所有可使用的宽度，不包含添加和合并和导航按钮以及之间的空隙
        var totalWidth = this._getTotalWidth();
        //所有button的宽度
        var buttonWidth = this._calculateButtonsWith();
        var width = buttonWidth;
        var showScrollButton = false;
        if (buttonWidth > totalWidth) {
            width = totalWidth;
            showScrollButton = true;
        }
        this.scrollLeft.setVisible(showScrollButton);
        this.scrollRight.setVisible(showScrollButton);
        //这边动态改变buttongroup的宽度，因为最大宽度是变的
        this.tab.element.width(width);
        this._dealWithScrollButtonState();
        this.scrollSection = width * 2 / 3;
        this.scrollSelectedVisible();
    },

    scrollSelectedVisible: function () {
        var value = this.tab.getValue()[0];
        //从index 0到当前选中的tab的所有button的宽度
        var visibleWidth = this._calculateButtonsWith(function (item) {
            if (item.getValue() === value) {
                return true;
            }
        })
        var buttonWidth = this._getTotalWidth();
        var scrollWidth = visibleWidth - buttonWidth / 2;
        if (this._needScroll(visibleWidth, buttonWidth)) {
            this._scrollTo(scrollWidth)
        }
    },

    getAllButtons: function () {
        return this.tab.getAllButtons.apply(this.tab, arguments);
    },

    addItems: function (items) {
        this.tab.addItems.apply(this.tab, arguments);
        this.resize();
        this._scrollToEnd();
    },

    getValue: function () {
        this.tab.getValue.apply(this.tab, arguments);
    },

    setValue: function (v) {
        this.tab.setValue.apply(this.tab, arguments);
    },

    populate: function () {
        this.tab.populate.apply(this.tab, arguments);
        this.resize();
    }
})

BI.DynamicGroupTabButtonGroup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.dynamic_group_tab_button_group", BI.DynamicGroupTabButtonGroup);