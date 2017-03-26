/**
 *
 * Created by GUY on 2016/8/10.
 * @class BI.SequenceTableDynamicNumber
 * @extends BI.SequenceTableTreeNumber
 */
BI.SequenceTableDynamicNumber = BI.inherit(BI.SequenceTableTreeNumber, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableDynamicNumber.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-sequence-table-dynamic-number"
        });
    },

    _init: function () {
        BI.SequenceTableDynamicNumber.superclass._init.apply(this, arguments);
    },

    _formatNumber: function (nodes) {
        var self = this, o = this.options;
        var result = [];
        var count = this._getStart(nodes);

        function getLeafCount(node) {
            var cnt = 0;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    cnt += getLeafCount(child);
                });
                if (node.children.length > 1 && BI.isNotEmptyArray(node.values)) {
                    cnt++;
                }
            } else {
                cnt++;
            }
            return cnt;
        }

        var start = 0, top = 0;
        BI.each(nodes, function (i, node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var cnt = getLeafCount(child);
                    result.push({
                        text: count++,
                        start: start,
                        top: top,
                        cnt: cnt,
                        index: index,
                        height: cnt * o.rowSize
                    });
                    start += cnt;
                    top += cnt * o.rowSize;
                });
                if (BI.isNotEmptyArray(node.values)) {
                    result.push({
                        text: BI.i18nText("BI-Summary_Values"),
                        start: start++,
                        top: top,
                        cnt: 1,
                        isSummary: true,
                        height: o.rowSize
                    });
                    top += o.rowSize;
                }
            }
        });
        return result;
    }
});
$.shortcut('bi.sequence_table_dynamic_number', BI.SequenceTableDynamicNumber);