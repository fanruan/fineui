/**
 * 表示当前对象
 *
 * Created by GUY on 2015/9/7.
 * @class BI.VirtualList
 * @extends BI.Widget
 */
BI.VirtualList = BI.inherit(BI.Widget, {
    props: function () {
        return {
            baseCls: "bi-virtual-list clusterize-scroll",
        };
    },
    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.default",
            items: [{
                type: "bi.layout",
                ref: function () {
                    self.contentEl = this;
                },
                cls: "clusterize-content"
            }]
        }
    },

    mounted: function () {
        var data = [];
        for (var i = 0; i < 10000; i++) {
            data.push("<div style='height: 30px;'>" + i + "</div>");
        }
        new Clusterize({
            rows: data,
            scrollElem: this.element[0],
            contentElem: this.contentEl.element[0]
        })
    },

    populate: function () {
    }
});
BI.shortcut('bi.virtual_list', BI.VirtualList);