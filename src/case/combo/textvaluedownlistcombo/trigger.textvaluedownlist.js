/**
 * 选择字段trigger, downlist专用
 * 显示形式为 父亲值(儿子值)
 *
 * @class BI.DownListSelectTextTrigger
 * @extends BI.Trigger
 */
BI.DownListSelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.DownListSelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-select-text-trigger",
            height: 24,
            text: ""
        });
    },

    _init: function () {
        BI.DownListSelectTextTrigger.superclass._init.apply(this, arguments);
        var o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            element: this,
            height: o.height,
            items: this._formatItemArray(o.items),
            text: o.text
        });
    },

    _formatItemArray: function(){
        var sourceArray = BI.flatten(BI.deepClone(this.options.items));
        var targetArray = [];
        BI.each(sourceArray, function(idx, item){
            if(BI.has(item, "el")){
                BI.each(item.children, function(id, it){
                    it.text = item.el.text + "(" + it.text + ")";
                });
                targetArray = BI.concat(targetArray, item.children);
            }else{
                targetArray.push(item);
            }
        });
        return targetArray;
    },

    setValue: function (vals) {
        this.trigger.setValue(vals);
    },

    populate: function (items) {
        this.trigger.populate(this._formatItemArray(items));
    }
});
$.shortcut("bi.down_list_select_text_trigger", BI.DownListSelectTextTrigger);