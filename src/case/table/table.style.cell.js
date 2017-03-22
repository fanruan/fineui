/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.TableStyleCell
 * @extends BI.Single
 */
BI.TableStyleCell = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.TableStyleCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-style-cell",
            styleGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.TableStyleCell.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            forceCenter: true,
            hgap: 5,
            text: o.text
        });
        this._digestStyle();
    },

    _digestStyle: function () {
        var o = this.options;
        var style = o.styleGetter();
        if (style) {
            this.text.element.css(style);
        }
    },

    setText: function (text) {
        this.text.setText(text);
    },

    populate: function () {
        this._digestStyle();
    }
});
$.shortcut('bi.table_style_cell', BI.TableStyleCell);