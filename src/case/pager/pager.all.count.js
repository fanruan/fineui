/**
 * 有总页数和总行数的分页控件
 * Created by Young's on 2016/10/13.
 */
BI.AllCountPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AllCountPager.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-all-count-pager",
            pagerDirection: "vertical", // 翻页按钮方向，可选值：vertical/horizontal
            height: 24,
            pages: 1, // 必选项
            curr: 1, // 初始化当前页， pages为数字时可用，
            count: 1, // 总行数
            rowInfoObject: null,
            showRowCount: true,
            showRowInfo: true,
        });
    },
    _init: function () {
        BI.AllCountPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options, pagerIconCls = this._getPagerIconCls();
        this.editor = BI.createWidget({
            type: "bi.small_text_editor",
            cls: "pager-editor bi-border-radius",
            validationChecker: function (v) {
                return (o.pages === 0 && v === "0") || BI.isPositiveInteger(v);
            },
            hgap: 4,
            vgap: 0,
            value: o.curr,
            errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
            width: 40,
            height: 24,
            invisible: o.pages <= 1
        });

        this.pager = BI.createWidget({
            type: "bi.pager",
            width: 58,
            layouts: [{
                type: "bi.horizontal",
                lgap: 5
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
                height: 22,
                width: 22,
                cls: "bi-border bi-border-radius all-pager-prev bi-list-item-select2 " + pagerIconCls.preCls
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: 22,
                width: 22,
                cls: "bi-border bi-border-radius all-pager-next bi-list-item-select2 " + pagerIconCls.nextCls
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage,
            invisible: o.pages <= 1
        });

        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.pager.setValue(BI.parseInt(self.editor.getValue()));
            self.fireEvent(BI.AllCountPager.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllCountPager.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.editor.setValue(self.pager.getCurrentPage());
        });

        this.allPages = BI.createWidget({
            type: "bi.label",
            title: o.pages,
            height: o.height,
            text: "/" + o.pages,
            lgap: 5,
            invisible: o.pages <= 1
        });

        BI.createWidget(o.showRowCount ? {
            type: "bi.vertical_adapt",
            element: this,
            scrollx: false,
            columnSize: ["fill", ""],
            horizontalAlign: BI.HorizontalAlign.Right,
            items: [
                this._getRowCountObject(),
                this.editor, this.allPages, this.pager
            ],
        } : {
            type: "bi.vertical_adapt",
            element: this,
            items: [this.editor, this.allPages, this.pager]
        });
    },

    _getPagerIconCls: function () {
        var o = this.options;
        switch (o.pagerDirection) {
            case "horizontal":
                return {
                    preCls: "row-pre-page-h-font ",
                    nextCls: "row-next-page-h-font "
                };
            case "vertical":
            default:
                return {
                    preCls: "column-pre-page-h-font ",
                    nextCls: "column-next-page-h-font "
                };
        }
    },

    _getRowCountObject: function() {
        var self = this, o = this.options;

        return {
            type: "bi.left",
            height: o.height,
            scrollable: false,
            ref: function (_ref) {
                self.rowCountObject = _ref;
            },
            items: [{
                type: "bi.label",
                height: o.height,
                text: BI.i18nText("BI-Basic_Total"),
                ref: function (_ref) {
                    self.prevText = _ref;
                }
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.rowCount = _ref;
                    },
                    cls: "row-count",
                    height: o.height,
                    text: o.count,
                    title: o.count
                },
                hgap: 5,
            }, {
                type: "bi.label",
                height: o.height,
                text: BI.i18nText("BI-Tiao_Data"),
                textAlign: "left"
            }, BI.isNotEmptyObject(o.rowInfoObject) ? o.rowInfoObject : null]
        };
    },

    setAllPages: function (v) {
        this.allPages.setText("/" + v);
        this.allPages.setTitle(v);
        this.options.pages = v;
        this.pager.setAllPages(v);
        this.editor.setEnable(v >= 1);
        this.setPagerVisible(v > 1);
    },

    setShowRowInfo: function (b) {
        this.options.showRowInfo = b;
        this.rowCountObject.setVisible(b);
    },

    setValue: function (v) {
        this.pager.setValue(v);
    },

    setVPage: function (v) {
        this.pager.setValue(v);
    },

    setCount: function (count) {
        if (this.options.showRowCount) {
            this.rowCount.setText(count);
            this.rowCount.setTitle(count);
        }
    },

    setCountPrevText: function (text) {
        if (this.options.showRowCount) {
            this.prevText.setText(text);
        }
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

    isShowPager: function () {
        return this.options.showRowInfo || this.options.pages > 1;
    },

    setPagerVisible: function (b) {
        this.editor.setVisible(b);
        this.allPages.setVisible(b);
        this.pager.setVisible(b);
    },

    populate: function () {
        this.pager.populate();
        this.setPagerVisible(this.options.pages > 1);
    }
});
BI.AllCountPager.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.all_count_pager", BI.AllCountPager);