/**
 * 显示页码的分页控件
 *
 * Created by GUY on 2016/2/17.
 * @class BI.NumberPager
 * @extends BI.Widget
 */
BI.NumberPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.NumberPager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-number-pager",
            width: 95,
            height: 25,
            pages: false, //总页数
            curr: 1, //初始化当前页， pages为数字时可用

            hasPrev: BI.emptyFn,
            hasNext: BI.emptyFn,
            firstPage: 1,
            lastPage: BI.emptyFn
        })
    },
    _init: function () {
        BI.NumberPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentPage = o.curr;
        this.label = BI.createWidget({
            type: "bi.label",
            height: o.height - 2,
            value: this.currentPage
        });
        this.pager = BI.createWidget({
            type: "bi.pager",
            width: 36,
            layouts: [{
                type: "bi.horizontal",
                hgap: 1,
                vgap: 1
            }],

            dynamicShow: false,
            pages: o.pages,
            curr: o.curr,
            groups: 0,

            first: false,
            last: false,
            prev: {
                type: "bi.icon_button",
                value: "prev",
                title: BI.i18nText("BI-Previous_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_First_Page"),
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
                cls: "number-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
                cls: "number-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            if (self.getCurrentPage() !== self.pager.getCurrentPage()) {
                self.currentPage = self.pager.getCurrentPage();
                self.fireEvent(BI.NumberPager.EVENT_CHANGE);
            }
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.label.setValue(self.pager.getCurrentPage());
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            columnSize: [20, "", 20, 36],
            items: [{type: "bi.label", text: "第"}, this.label, {type: "bi.label", text: "页"}, this.pager]
        })
    },

    getCurrentPage: function () {
        return this.currentPage;
    },

    hasPrev: function () {
        return this.pager.hasPrev();
    },

    hasNext: function () {
        return this.pager.hasNext();
    },

    setValue: function (v) {
        this.currentPage = v;
        this.pager.setValue(v);
    },

    populate: function () {
        this.pager.populate();
    }
});
BI.NumberPager.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.number_pager", BI.NumberPager);