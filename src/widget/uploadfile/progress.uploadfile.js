/**
 * Created by Young's on 2016/4/21.
 */
BI.UploadFileWithProgress = BI.inherit(BI.Widget, {

    _constants: {
        UPLOAD_PROGRESS: "__upload_progress__"
    },

    _defaultConfig: function () {
        return BI.extend(BI.UploadFileWithProgress.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-upload-file-with-progress",
            progressEL: BICst.BODY_ELEMENT,
            multiple: false,
            maxSize: 1024 * 1024,
            accept: "",
            url: ""
        })
    },

    _init: function () {
        BI.UploadFileWithProgress.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.file = BI.createWidget({
            type: "bi.multifile_editor",
            width: "100%",
            height: "100%",
            name: o.name,
            url: o.url,
            multiple: o.multiple,
            accept: o.accept,
            maxSize: o.maxSize
        });

        this.file.on(BI.MultifileEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.UploadFileWithProgress.EVENT_CHANGE, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_UPLOADSTART, function () {
            self.progressBar = BI.createWidget({
                type: "bi.progress_bar",
                width: 300
            });
            BI.createWidget({
                type: "bi.center_adapt",
                element: BI.Layers.create(self._constants.UPLOAD_PROGRESS, self.options.progressEL),
                items: [self.progressBar],
                width: "100%",
                height: "100%"
            });

            BI.Layers.show(self._constants.UPLOAD_PROGRESS);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_UPLOADSTART, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_ERROR, function () {
            BI.Layers.remove(self._constants.UPLOAD_PROGRESS);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_ERROR, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_PROGRESS, function (data) {
            var process = Math.ceil(data.loaded / data.total * 100);
            self.progressBar.setValue(process > 100 ? 100 : process);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_PROGRESS, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_UPLOADED, function () {
            BI.Layers.remove(self._constants.UPLOAD_PROGRESS);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_UPLOADED, arguments);
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
BI.UploadFileWithProgress.EVENT_CHANGE = "EVENT_CHANGE";
BI.UploadFileWithProgress.EVENT_UPLOADSTART = "EVENT_UPLOADSTART";
BI.UploadFileWithProgress.EVENT_ERROR = "EVENT_ERROR";
BI.UploadFileWithProgress.EVENT_PROGRESS = "EVENT_PROGRESS";
BI.UploadFileWithProgress.EVENT_UPLOADED = "EVENT_UPLOADED";
$.shortcut("bi.upload_file_with_progress", BI.UploadFileWithProgress);