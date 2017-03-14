/**
 * 有总页数的分页控件
 *
 * Created by GUY on 2015/9/8.
 * @class BI.AllPagger
 * @extends BI.Widget
 */
BI.AllPagger = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AllPagger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-all-pager",
            width: 96,
            height: 25,
            pages: 1, //必选项
            curr: 1 //初始化当前页， pages为数字时可用
        })
    },
    _init: function () {
        BI.AllPagger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.small_text_editor",
            cls: "pager-editor",
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
                cls: "all-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                cls: "all-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.pager.setValue(BI.parseInt(self.editor.getValue()));
            self.fireEvent(BI.AllPagger.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllPagger.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.editor.setValue(self.pager.getCurrentPage());
        });

        this.allPages = BI.createWidget({
            type: "bi.label",
            width: 30,
            title: o.pages,
            text: "/" + o.pages
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            columnSize: [30, "", 36],
            items: [this.editor, this.allPages, this.pager]
        })
    },

    setAllPages: function (v) {
        this.allPages.setText("/" + v);
        this.allPages.setTitle(v);
        this.pager.setAllPages(v);
    },

    setValue: function (v) {
        this.pager.setValue(v);
    },

    getCurrentPage: function () {
        return this.pager.getCurrentPage();
    },

    hasPrev: function () {
        return this.pager.hasPrev();
    },

    hasNext: function () {
        return this.pager.hasNext();
    },

    populate: function () {
        this.pager.populate();
    }
});
BI.AllPagger.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.all_pager", BI.AllPagger);