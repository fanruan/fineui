/**
 * 可以跳转的分页控件
 *
 * Created by GUY on 2015/9/8.
 * @class BI.SkipPager
 * @extends BI.Widget
 */
BI.SkipPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SkipPager.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-skip-pager",
            width: 110,
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
        BI.SkipPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentPage = o.curr;
        this.editor = BI.createWidget({
            type: "bi.small_text_editor",
            validationChecker: function (v) {
                return BI.isPositiveInteger(v);
            },
            hgap: 4,
            vgap: 0,
            value: o.curr,
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: 30,
            height: o.height - 2
        });
        this.pager = BI.createWidget({
            type: "bi.pager",
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
                cls: "number-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                cls: "number-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.pager.setValue(self.editor.getValue());
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            if (self.getCurrentPage() !== self.pager.getCurrentPage()) {
                self.currentPage = self.pager.getCurrentPage();
                self.fireEvent(BI.SkipPager.EVENT_CHANGE);
            }
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.editor.setValue(self.pager.getCurrentPage());
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            items: [{type: "bi.label", text: "第"}, this.editor, {type: "bi.label", text: "页"}, this.pager]
        })
    },

    getCurrentPage: function () {
        return this.currentPage;
    },

    setValue: function(v){
        this.currentPage = v;
        this.pager.setValue(v);
    },

    populate: function () {
        this.pager.populate();
    }
});
BI.SkipPager.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.skip_pager", BI.SkipPager);