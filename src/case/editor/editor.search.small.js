/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallSearchEditor
 * @extends BI.SearchEditor
 */
BI.SmallSearchEditor = BI.inherit(BI.SearchEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallSearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-search-editor",
            height: 24
        });
    },

    _init: function () {
        BI.SmallSearchEditor.superclass._init.apply(this, arguments);
    }
});
$.shortcut("bi.small_search_editor", BI.SmallSearchEditor);