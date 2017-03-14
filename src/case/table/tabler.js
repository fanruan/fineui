/**
 * 分页table
 *
 * Created by GUY on 2015/9/8.
 * @class BI.Tabler
 * @extends BI.Widget
 */
BI.Tabler = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Tabler.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tabler",

            pager: {},

            layouts: [{
                type: "bi.float_center_adapt"
            }],

            tabler: {
                isNeedFreeze: false,//是否需要冻结单元格
                freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

                isNeedMerge: true,//是否需要合并单元格

                mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                    return BI.isEqual(row1, row2);
                },

                columnSize: [],
                rowSize: 37,
                header: [],
                items: [],

                //交叉表头
                crossHeader: [],
                crossItems: []
            }
        })
    },
    _init: function () {
        BI.Tabler.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.pager = BI.createWidget(o.pager, {
            type: "bi.pager"
        });
        var creater = BI.createWidget({
            type: "bi.button_tree",
            items: [{
                el: this.pager
            }],
            layouts: o.layouts
        })
        this.pager.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.Tabler.EVENT_CHANGE);
            }
        });
        this.container = BI.createWidget({
            type: "bi.layout"
        })
        BI.createWidget({
            type: "bi.vtape",
            element: this.element,
            items: [{
                el: this.container
            }, {
                el: creater,
                height: 40
            }]
        });
        this.populate();
    },

    getCurrentPage: function () {
        return this.pager.getValue();
    },

    populate: function (opt) {
        var o = this.options;
        this.container.empty();

        BI.extend(o.tabler, opt);
        this.table = BI.createWidget(this.options.tabler, {
            type: "bi.table_tree",
            element: this.container
        });
    }
});
BI.Tabler.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.tabler", BI.Tabler);