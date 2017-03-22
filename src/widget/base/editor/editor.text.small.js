/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.SmallTextEditor = BI.inherit(BI.TextEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallTextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-text-editor",
            height: 25
        });
    },

    _init: function () {
        BI.SmallTextEditor.superclass._init.apply(this, arguments);
    }
});
$.shortcut("bi.small_text_editor", BI.SmallTextEditor);