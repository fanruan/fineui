/**
 * 显示页码的分页控件
 *
 * Created by GUY on 2016/6/30.
 * @class BI.DirectionPager
 * @extends BI.Widget
 */
BI.DirectionPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.DirectionPager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-direction-pager",
            height: 24,
            horizontal: {
                pages: false, // 总页数
                curr: 1, // 初始化当前页， pages为数字时可用

                hasPrev: BI.emptyFn,
                hasNext: BI.emptyFn,
                firstPage: 1,
                lastPage: BI.emptyFn
            },
            vertical: {
                pages: false, // 总页数
                curr: 1, // 初始化当前页， pages为数字时可用

                hasPrev: BI.emptyFn,
                hasNext: BI.emptyFn,
                firstPage: 1,
                lastPage: BI.emptyFn
            }
        });
    },
    _init: function () {
        BI.DirectionPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var v = o.vertical, h = o.horizontal;
        this._createVPager();
        this._createHPager();
        this.layout = BI.createWidget({
            type: "bi.absolute",
            scrollable: false,
            element: this,
            items: [{
                el: this.vpager,
                top: 0,
                right: 86
            }, {
                el: this.vlabel,
                top: 0,
                right: 110
            }, {
                el: this.hpager,
                top: 0,
                right: 0
            }, {
                el: this.hlabel,
                top: 0,
                right: 24
            }]
        });
    },

    _createVPager: function () {
        var self = this, o = this.options;
        var v = o.vertical;
        this.vlabel = BI.createWidget({
            type: "bi.label",
            width: 24,
            height: 24,
            value: v.curr,
            title: v.curr,
            invisible: true
        });
        this.vpager = BI.createWidget({
            type: "bi.pager",
            width: 72,
            layouts: [{
                type: "bi.horizontal",
                scrollx: false,
                rgap: 24
            }],
            invisible: true,

            dynamicShow: false,
            pages: v.pages,
            curr: v.curr,
            groups: 0,

            first: false,
            last: false,
            prev: {
                type: "bi.icon_button",
                value: "prev",
                title: BI.i18nText("BI-Up_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_First_Page"),
                height: 22,
                width: 22,
                cls: "bi-border direction-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Down_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: 22,
                width: 22,
                cls: "bi-border direction-pager-next column-next-page-h-font"
            },

            hasPrev: v.hasPrev,
            hasNext: v.hasNext,
            firstPage: v.firstPage,
            lastPage: v.lastPage
        });

        this.vpager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.DirectionPager.EVENT_CHANGE);
        });
        this.vpager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.vlabel.setValue(this.getCurrentPage());
            self.vlabel.setTitle(this.getCurrentPage());
        });
    },

    _createHPager: function () {
        var self = this, o = this.options;
        var h = o.horizontal;
        this.hlabel = BI.createWidget({
            type: "bi.label",
            width: 24,
            height: 24,
            value: h.curr,
            title: h.curr,
            invisible: true
        });
        this.hpager = BI.createWidget({
            type: "bi.pager",
            width: 72,
            layouts: [{
                type: "bi.horizontal",
                scrollx: false,
                rgap: 24
            }],
            invisible: true,

            dynamicShow: false,
            pages: h.pages,
            curr: h.curr,
            groups: 0,

            first: false,
            last: false,
            prev: {
                type: "bi.icon_button",
                value: "prev",
                title: BI.i18nText("BI-Left_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_First_Page"),
                height: 22,
                width: 22,
                cls: "bi-border direction-pager-prev row-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Right_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: 22,
                width: 22,
                cls: "bi-border direction-pager-next row-next-page-h-font"
            },

            hasPrev: h.hasPrev,
            hasNext: h.hasNext,
            firstPage: h.firstPage,
            lastPage: h.lastPage
        });

        this.hpager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.DirectionPager.EVENT_CHANGE);
        });
        this.hpager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.hlabel.setValue(this.getCurrentPage());
            self.hlabel.setTitle(this.getCurrentPage());
        });
    },

    getVPage: function () {
        return this.vpager.getCurrentPage();
    },

    getHPage: function () {
        return this.hpager.getCurrentPage();
    },

    setVPage: function (v) {
        this.vpager.setValue(v);
        this.vlabel.setValue(v);
        this.vlabel.setTitle(v);
    },

    setHPage: function (v) {
        this.hpager.setValue(v);
        this.hlabel.setValue(v);
        this.hlabel.setTitle(v);
    },

    hasVNext: function () {
        return this.vpager.hasNext();
    },

    hasHNext: function () {
        return this.hpager.hasNext();
    },

    hasVPrev: function () {
        return this.vpager.hasPrev();
    },

    hasHPrev: function () {
        return this.hpager.hasPrev();
    },

    setHPagerVisible: function (b) {
        this.hpager.setVisible(b);
        this.hlabel.setVisible(b);
    },

    setVPagerVisible: function (b) {
        this.vpager.setVisible(b);
        this.vlabel.setVisible(b);
    },

    populate: function () {
        this.vpager.populate();
        this.hpager.populate();
        var vShow = false, hShow = false;
        if (!this.hasHNext() && !this.hasHPrev()) {
            this.setHPagerVisible(false);
        } else {
            this.setHPagerVisible(true);
            hShow = true;
        }
        if (!this.hasVNext() && !this.hasVPrev()) {
            this.setVPagerVisible(false);
        } else {
            this.setVPagerVisible(true);
            vShow = true;
        }
        this.setVisible(hShow || vShow);
        var num = [86, 110, 0, 24];
        var items = this.layout.attr("items");

        if (vShow === true && hShow === true) {
            items[0].right = num[0];
            items[1].right = num[1];
            items[2].right = num[2];
            items[3].right = num[3];
        } else if (vShow === true) {
            items[0].right = num[2];
            items[1].right = num[3];
        } else if (hShow === true) {
            items[2].right = num[2];
            items[3].right = num[3];
        }
        this.layout.attr("items", items);
        this.layout.resize();
    },

    clear: function () {
        this.vpager.attr("curr", 1);
        this.hpager.attr("curr", 1);
    }
});
BI.DirectionPager.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.direction_pager", BI.DirectionPager);