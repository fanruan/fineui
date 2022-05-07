/**
 * 多文件
 *
 * Created by GUY on 2016/4/13.
 * @class BI.MultifileEditor
 * @extends BI.Single
 * @abstract
 */
BI.MultifileEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.MultifileEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-multifile-editor",
            multiple: false,
            maxSize: -1, // 1024 * 1024
            accept: "",
            url: ""
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.file = BI.createWidget({
            type: "bi.file",
            cls: "multifile-editor",
            width: "100%",
            height: "100%",
            name: o.name,
            url: o.url,
            multiple: o.multiple,
            accept: o.accept,
            maxSize: o.maxSize,
            maxLength: o.maxLength,
            title: o.title
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
            element: this,
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

    _reset: function () {
        this.file.reset();
    },

    setMaxFileLength: function (v) {
        this.file.setMaxFileLength(v);
    },

    select: function () {
        this.file.select();
    },

    getQueue: function () {
        return this.file.getQueue();
    },

    getValue: function () {
        return this.file.getValue();
    },

    upload: function () {
        this._reset();
        this.file.upload();
    },

    sendFiles: function (files) {
        this._reset();

        this.file.sendFiles(files);
    },

    reset: function () {
        this._reset();
    }
});
BI.MultifileEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultifileEditor.EVENT_UPLOADSTART = "EVENT_UPLOADSTART";
BI.MultifileEditor.EVENT_ERROR = "EVENT_ERROR";
BI.MultifileEditor.EVENT_PROGRESS = "EVENT_PROGRESS";
BI.MultifileEditor.EVENT_UPLOADED = "EVENT_UPLOADED";
BI.shortcut("bi.multifile_editor", BI.MultifileEditor);
