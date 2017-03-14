/**
 * 多文件
 *
 * Created by GUY on 2016/4/13.
 * @class BI.MultifileEditor
 * @extends BI.Single
 * @abstract
 */
BI.MultifileEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.MultifileEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-multifile-editor",
            multiple: false,
            maxSize: 1024 * 1024,
            accept: "",
            url: ""
        })
    },

    _init: function () {
        var self = this, o = this.options;
        BI.MultifileEditor.superclass._init.apply(this, arguments);
        this.file = BI.createWidget({
            type: "bi.file",
            cls: "multifile-editor",
            width: "100%",
            height: "100%",
            name: o.name,
            url: o.url,
            multiple: o.multiple,
            accept: o.accept,
            maxSize: o.maxSize
        });
        this.file.on(BI.File.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_CHANGE, arguments);
        });
        this.file.on(BI.File.EVENT_UPLOADSTART, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_UPLOADSTART, arguments);
        });
        this.file.on(BI.File.EVENT_ERROR, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_ERROR, arguments);
        });
        this.file.on(BI.File.EVENT_PROGRESS, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_PROGRESS, arguments);
        });
        this.file.on(BI.File.EVENT_UPLOADED, function () {
            self.fireEvent(BI.MultifileEditor.EVENT_UPLOADED, arguments);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: {
                    type: "bi.adaptive",
                    scrollable: false,
                    items: [this.file]
                },
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
            }]
        });
    },

    select: function () {
        this.file.select();
    },

    getValue: function () {
        return this.file.getValue();
    },

    upload: function () {
        this.file.upload();
    },

    reset: function () {
        this.file.reset();
    },

    setEnable: function (enable) {
        BI.MultiFile.superclass.setEnable.apply(this, arguments);
        this.file.setEnable(enable);
    }
});
BI.MultifileEditor.EVENT_CHANGE = "MultifileEditor.EVENT_CHANGE";
BI.MultifileEditor.EVENT_UPLOADSTART = "MultifileEditor.EVENT_UPLOADSTART";
BI.MultifileEditor.EVENT_ERROR = "MultifileEditor.EVENT_ERROR";
BI.MultifileEditor.EVENT_PROGRESS = "MultifileEditor.EVENT_PROGRESS";
BI.MultifileEditor.EVENT_UPLOADED = "MultifileEditor.EVENT_UPLOADED";
$.shortcut("bi.multifile_editor", BI.MultifileEditor);