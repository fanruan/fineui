/**
 * 文件
 *
 * Created by GUY on 2016/1/27.
 * @class BI.File
 * @extends BI.Single
 * @abstract
 */
(function (document) {

    /**
     * @description normalize input.files. create if not present, add item method if not present
     * @param       Object      generated wrap object
     * @return      Object      the wrap object itself
     */
    var F = (function (item) {
        return function (input) {
            var files = input.files || [input];
            if (!files.item) {
                files.item = item;
            }
            return files;
        };
    })(function (i) {
        return this[i];
    });

    var event = {

        /**
         * @description add an event via addEventListener or attachEvent
         * @param       DOMElement  the element to add event
         * @param       String      event name without "on" (e.g. "mouseover")
         * @param       Function    the callback to associate as event
         * @return      Object      noswfupload.event
         */
        add: document.addEventListener ?
            function (node, name, callback) {
                node.addEventListener(name, callback, false);
                return this;
            } :
            function (node, name, callback) {
                node.attachEvent("on" + name, callback);
                return this;
            },

        /**
         * @description remove an event via removeEventListener or detachEvent
         * @param       DOMElement  the element to remove event
         * @param       String      event name without "on" (e.g. "mouseover")
         * @param       Function    the callback associated as event
         * @return      Object      noswfupload.event
         */
        del: document.removeEventListener ?
            function (node, name, callback) {
                node.removeEventListener(name, callback, false);
                return this;
            } :
            function (node, name, callback) {
                node.detachEvent("on" + name, callback);
                return this;
            },

        /**
         * @description to block event propagation and prevent event default
         * @param       void        generated event or undefined
         * @return      Boolean     false
         */
        stop: function (e) {
            if (!e) {
                if (self.event) {
                    event.returnValue = !(event.cancelBubble = true);
                }
            } else {
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
            }

            return false;
        }
    };

    var sendFile = (function (toString) {
        var multipart = function (boundary, name, file) {
                return "--".concat(
                    boundary, CRLF,
                    "Content-Disposition: form-data; name=\"", name, "\"; filename=\"", _global.encodeURIComponent(file.fileName), "\"", CRLF,
                    "Content-Type: application/octet-stream", CRLF,
                    CRLF,
                    file.getAsBinary(), CRLF,
                    "--", boundary, "--", CRLF
                );
            },
            isFunction = function (Function) {
                return toString.call(Function) === "[object Function]";
            },
            split = "onabort.onerror.onloadstart.onprogress".split("."),
            length = split.length,
            CRLF = "\r\n",
            xhr = this.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
            sendFile;

        // FireFox 3+, Safari 4 beta (Chrome 2 beta file is buggy and will not work)
        if (xhr.upload || xhr.sendAsBinary) {
            sendFile = function (handler, maxSize, width, height) {
                var current = handler.current;
                if (-1 < maxSize && maxSize < handler.file.fileSize) {
                    if (isFunction(handler.onerror)) {
                        handler.onerror();
                    }
                    return;
                }
                for (var
                         xhr = new XMLHttpRequest,
                         upload = xhr.upload || {
                             addEventListener: function (event, callback) {
                                 this["on" + event] = callback;
                             }
                         },
                         i = 0;
                     i < length;
                     i++
                ) {
                    upload.addEventListener(
                        split[i].substring(2),
                        (function (event) {
                            return function (rpe) {
                                if (isFunction(handler[event])) {
                                    handler[event](rpe, xhr);
                                }
                            };
                        })(split[i]),
                        false
                    );
                }
                upload.addEventListener(
                    "load",
                    function (rpe) {
                        if (handler.onreadystatechange === false) {
                            if (isFunction(handler.onload)) {
                                handler.onload(rpe, xhr);
                            }
                        } else {
                            setTimeout(function () {
                                if (xhr.readyState === 4) {
                                    if (isFunction(handler.onload)) {
                                        handler.onload(rpe, xhr);
                                    }
                                } else {
                                    setTimeout(arguments.callee, 15);
                                }
                            }, 15);
                        }
                    },
                    false
                );
                xhr.open("post", BI.appendQuery(handler.url, {
                    filename: _global.encodeURIComponent(handler.file.fileName),
                }), true);
                if (!xhr.upload) {
                    var rpe = { loaded: 0, total: handler.file.fileSize || handler.file.size, simulation: true };
                    rpe.interval = setInterval(function () {
                        rpe.loaded += 1024 / 4;
                        if (rpe.total <= rpe.loaded) {
                            rpe.loaded = rpe.total;
                        }
                        upload.onprogress(rpe);
                    }, 100);
                    xhr.onabort = function () {
                        upload.onabort({});
                    };
                    xhr.onerror = function () {
                        upload.onerror({});
                    };
                    xhr.onreadystatechange = function () {
                        switch (xhr.readyState) {
                            case    2:
                            case    3:
                                if (rpe.total <= rpe.loaded) {
                                    rpe.loaded = rpe.total;
                                }
                                upload.onprogress(rpe);
                                break;
                            case    4:
                                clearInterval(rpe.interval);
                                rpe.interval = 0;
                                rpe.loaded = rpe.total;
                                upload.onprogress(rpe);
                                if (199 < xhr.status && xhr.status < 400) {
                                    upload["onload"]({});
                                    var attachO = BI.jsonDecode(xhr.responseText);
                                    attachO.filename = handler.file.fileName;
                                    if (handler.file.type.indexOf("image") != -1) {
                                        attachO.attach_type = "image";
                                    }
                                    handler.attach_array[current] = attachO;
                                } else {
                                    upload["onerror"]({});
                                }
                                break;
                        }
                    };
                    upload.onloadstart(rpe);
                } else {
                    xhr.onreadystatechange = function () {
                        switch (xhr.readyState) {
                            case    4:
                                var attachO = BI.jsonDecode(xhr.responseText);
                                if (handler.file.type.indexOf("image") != -1) {
                                    attachO.attach_type = "image";
                                }
                                attachO.filename = handler.file.fileName;
                                if (handler.maxLength == 1) {
                                    handler.attach_array[0] = attachO;
                                    //                                   handler.attach_array.push(attachO);
                                } else {
                                    handler.attach_array[current] = attachO;
                                }
                                break;
                        }
                    };
                    if (isFunction(upload.onloadstart)) {
                        upload.onloadstart();
                    }
                }
                var boundary = "AjaxUploadBoundary" + (new Date).getTime();
                xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
                if (handler.file.getAsBinary) {
                    xhr[xhr.sendAsBinary ? "sendAsBinary" : "send"](multipart(boundary, handler.name, handler.file));
                } else {
                    xhr.setRequestHeader("Content-Type", "multipart/form-data");
                    //                    xhr.setRequestHeader("X-Name", handler.name);
                    //                    xhr.setRequestHeader("X-File-Name", handler.file.fileName);
                    var form = new FormData();
                    form.append("FileData", handler.file);
                    xhr.send(form);
                }
                return handler;
            };
        }
        // Internet Explorer, Opera, others
        else {
            sendFile = function (handler, maxSize, width, height) {
                var current = handler.current;
                var url = handler.url.concat(-1 === handler.url.indexOf("?") ? "?" : "&", "AjaxUploadFrame=true"),
                    rpe = {
                        loaded: 1, total: 100, simulation: true, interval: setInterval(function () {
                            if (rpe.loaded < rpe.total) {
                                ++rpe.loaded;
                            }
                            if (isFunction(handler.onprogress)) {
                                handler.onprogress(rpe, {});
                            }
                        }, 100)
                    },
                    onload = function () {
                        iframe.onreadystatechange = iframe.onload = iframe.onerror = null;
                        form.parentNode.removeChild(form);
                        form = null;
                        clearInterval(rpe.interval);
                        // rpe.loaded = rpe.total;
                        try {
                            var responseText = (iframe.contentWindow.document || iframe.contentWindow.contentDocument).body.innerHTML;
                            var attachO = BI.jsonDecode(responseText);
                            if (handler.file.type.indexOf("image") != -1) {
                                attachO.attach_type = "image";
                            }

                            // attachO.fileSize = responseText.length;
                            try {
                                // decodeURIComponent特殊字符可能有问题, catch一下，保证能正常上传
                                attachO.filename = _global.decodeURIComponent(handler.file.fileName);
                            } catch (e) {
                                attachO.filename = handler.file.fileName;
                            }
                            if (handler.maxLength == 1) {
                                handler.attach_array[0] = attachO;
                            } else {
                                handler.attach_array[current] = attachO;
                            }
                        } catch (e) {
                            if (isFunction(handler.onerror)) {
                                handler.onerror(rpe, event || _global.event);
                            }
                        }
                        if (isFunction(handler.onload)) {
                            handler.onload(rpe, { responseText: responseText });
                        }
                    },
                    target = ["AjaxUpload", (new Date).getTime(), String(Math.random()).substring(2)].join("_");
                try { // IE < 8 does not accept enctype attribute ...
                    var form = document.createElement("<form enctype=\"multipart/form-data\"></form>"),
                        iframe = handler.iframe || (handler.iframe = document.createElement("<iframe id=\"" + target + "\" name=\"" + target + "\" src=\"" + url + "\"></iframe>"));
                } catch (e) {
                    var form = document.createElement("form"),
                        iframe = handler.iframe || (handler.iframe = document.createElement("iframe"));
                    form.setAttribute("enctype", "multipart/form-data");
                    iframe.setAttribute("name", iframe.id = target);
                    iframe.setAttribute("src", url);
                }
                iframe.style.position = "absolute";
                iframe.style.left = iframe.style.top = "-10000px";
                iframe.onload = onload;
                iframe.onerror = function (event) {
                    if (isFunction(handler.onerror)) {
                        handler.onerror(rpe, event || _global.event);
                    }
                };
                iframe.onreadystatechange = function () {
                    if (/loaded|complete/i.test(iframe.readyState)) {
                        onload();

                        // wei : todo,将附件信息放到handler.attach
                    } else if (isFunction(handler.onloadprogress)) {
                        if (rpe.loaded < rpe.total) {
                            ++rpe.loaded;
                        }
                        handler.onloadprogress(rpe, {
                            readyState: {
                                loading: 2,
                                interactive: 3,
                                loaded: 4,
                                complete: 4
                            }[iframe.readyState] || 1
                        });
                    }
                };
                form.setAttribute("action", handler.url + "&filename=" + _global.encodeURIComponent(handler.file.fileName));
                form.setAttribute("target", iframe.id);
                form.setAttribute("method", "post");
                form.appendChild(handler.file);
                form.style.display = "none";
                if (isFunction(handler.onloadstart)) {
                    handler.onloadstart(rpe, {});
                }
                with (document.body || document.documentElement) {
                    appendChild(iframe);
                    appendChild(form);
                    form.submit();
                }

                return handler;
            };
        }
        xhr = null;
        return sendFile;
    })(Object.prototype.toString);

    var sendFiles = function (handler, maxSize, width, height) {

        var length = handler.files.length,
            i = 0,
            onload = handler.onload,
            onloadstart = handler.onloadstart;
        handler.current = 0;
        handler.total = 0;
        handler.sent = 0;
        while (handler.current < length) {
            handler.total += (handler.files[handler.current].fileSize || handler.files[handler.current].size);
            handler.current++;
        }
        handler.current = 0;
        if (length && handler.files[0].fileSize !== -1) {
            handler.file = handler.files[handler.current];

            sendFile(handler, maxSize, width, height).onload = function (rpe, xhr) {
                handler.onloadstart = null;
                handler.sent += (handler.files[handler.current].fileSize || handler.files[handler.current].size);
                if (++handler.current < length) {
                    handler.file = handler.files[handler.current];
                    sendFile(handler, maxSize, width, height).onload = arguments.callee;
                } else if (onload) {
                    handler.onloadstart = onloadstart;
                    handler.onload = onload;
                    handler.onload(rpe, xhr);
                }
            };
        } else if (length) {
            handler.total = length * 100;
            handler.file = handler.files[handler.current];
            sendFile(handler, maxSize, width, height).onload = function (rpe, xhr) {
                var callee = arguments.callee;
                handler.onloadstart = null;
                handler.sent += 100;
                if (++handler.current < length) {
                    if (/\b(chrome|safari)\b/i.test(navigator.userAgent)) {
                        handler.iframe.parentNode.removeChild(handler.iframe);
                        handler.iframe = null;
                    }
                    setTimeout(function () {
                        handler.file = handler.files[handler.current];
                        sendFile(handler, maxSize, width, height).onload = callee;
                    }, 15);
                } else if (onload) {
                    setTimeout(function () {
                        handler.iframe.parentNode.removeChild(handler.iframe);
                        handler.iframe = null;
                        handler.onloadstart = onloadstart;
                        handler.onload = onload;
                        handler.onload(rpe, xhr);
                    }, 15);
                }
            };
        }
        return handler;
    };

    var r1 = /\.([^.]+)$/;  //  .png
    var r2 = /\/([^/]+)$/;  //  image/png

    /**
     * 校验文件类型是否合法,同时兼容旧版形式
     * @param fileName
     * @param fileType
     * @returns {boolean}
     */
    var fileTypeValidate = function (fileName, fileType) {
        if (!fileType) {
            return true;
        }
        var mimes = fileType.split(",");
        if (mimes[0] === fileType) {
            mimes = (fileType + "").split(";");
        }
        return BI.some(mimes, function (index, mime) {
            var matches;
            if (matches = mime.match(r1)) {
                return fileName.toLowerCase().indexOf(matches[1]) > -1;
            }
            if (matches = mime.match(r2)) {
                return matches[1] === "*" ? true : fileName.toLowerCase().indexOf(matches[1]) > -1;
            }
        });
    };

    BI.File = BI.inherit(BI.Widget, {
        _defaultConfig: function () {
            var conf = BI.File.superclass._defaultConfig.apply(this, arguments);
            return BI.extend(conf, {
                baseCls: (conf.baseCls || "") + " bi-file display-block",
                tagName: "input",
                attributes: {
                    type: "file"
                },
                name: "",
                url: "",
                multiple: true,
                accept: "", //  .png,.pdf,image/jpg,image/*  等
                maxSize: -1, // 1024 * 1024
                maxLength: -1 // 无限制, 与multiple配合使用
            });
        },

        render: function () {
            var self = this, o = this.options;
            if (o.multiple === true) {
                this.element.attr("multiple", "multiple");
            }
            this.element.attr("name", o.name || this.getName());
            this.element.attr("title", o.title || "");
            this.element.attr("accept", o.accept);
        },

        created: function () {
            var self = this, o = this.options;
            // create the noswfupload.wrap Object
            // wrap.maxSize 文件大小限制
            // wrap.maxLength 文件个数限制
            var _wrap = this.wrap = this._wrap(this.element[0], o.maxSize);
            // fileType could contain whatever text but filter checks *.{extension}
            // if present

            // handlers

            _wrap.onloadstart = function (rpe, xhr) {
                // BI.Msg.toast("loadstart");
                self.fireEvent(BI.File.EVENT_UPLOADSTART, arguments);
            };

            _wrap.onprogress = function (rpe, xhr) {
                // BI.Msg.toast("onprogress");
                // percent for each bar

                // fileSize is -1 only if browser does not support file info access
                // this if splits recent browsers from others
                if (this.file.fileSize !== -1) {
                    // simulation property indicates when the progress event is fake
                    if (rpe.simulation) {

                    } else {

                    }
                } else {
                    // if fileSIze is -1 browser is using an iframe because it does
                    // not support
                    // files sent via Ajax (XMLHttpRequest)
                    // We can still show some information
                }
                self.fireEvent(BI.File.EVENT_PROGRESS, {
                    file: this.file,
                    total: rpe.total,
                    loaded: rpe.loaded,
                    simulation: rpe.simulation
                });
            };

            // generated if there is something wrong during upload
            _wrap.onerror = function () {
                // just inform the user something was wrong
                self.fireEvent(BI.File.EVENT_ERROR);
            };

            // generated when every file has been sent (one or more, it does not
            // matter)
            _wrap.onload = function (rpe, xhr) {
                var self_ = this;
                // just show everything is fine ...
                // ... and after a second reset the component
                setTimeout(function () {
                    self_.clean(); // remove files from list
                    self_.hide(); // hide progress bars and enable input file
                    // enable again the submit button/element
                }, 100);
                if (200 > xhr.status || xhr.status > 399) {
                    BI.Msg.toast(BI.i18nText("BI-Upload_File_Error"), { level: "error" });
                    self.fireEvent(BI.File.EVENT_ERROR);
                    return;
                }
                var error = BI.some(_wrap.attach_array, function (index, attach) {
                    if (attach.errorCode) {
                        BI.Msg.toast(BI.i18nText(attach.errorMsg), { level: "error" });
                        self.fireEvent(BI.File.EVENT_ERROR, attach);
                        return true;
                    }
                });
                !error && self.fireEvent(BI.File.EVENT_UPLOADED);
            };
            _wrap.url = o.url;
            _wrap.fileType = o.accept;   // 文件类型限制
            _wrap.attach_array = [];
            _wrap.attach_names = [];
            _wrap.attachNum = 0;
        },

        _events: function (wrap) {
            var self = this, o = this.options;
            event.add(wrap.dom.input, "change", function () {
                event.del(wrap.dom.input, "change", arguments.callee);
                var input = wrap.dom.input.cloneNode(true);
                var files = F(wrap.dom.input);
                if (o.maxLength !== -1 && o.maxLength < files.length) {
                    self.fireEvent(BI.File.EVENT_ERROR, {
                        errorType: 2
                    });
                } else {
                    for (var i = 0; i < files.length; i++) {
                        var item = files.item(i);
                        var tempFile = item.value || item.name;
                        var value = item.fileName || (item.fileName = tempFile.split("\\").pop()),
                            ext = -1 !== value.indexOf(".") ? value.split(".").pop().toLowerCase() : "unknown",
                            size = item.fileSize || item.size;
                        var validateFileType = fileTypeValidate(value, wrap.fileType);
                        if (!validateFileType) {
                            // 文件类型不支持
                            BI.Msg.toast(BI.i18nText("BI-Upload_File_Type_Error"), { level: "error" });
                            self.fireEvent(BI.File.EVENT_ERROR, {
                                errorType: 0,
                                file: item
                            });
                        } else if (wrap.maxSize !== -1 && size && wrap.maxSize < size) {
                            // 文件大小不支持
                            BI.Msg.toast(BI.i18nText("BI-Upload_File_Size_Error"), { level: "error" });
                            self.fireEvent(BI.File.EVENT_ERROR, {
                                errorType: 1,
                                file: item
                            });
                        } else {
                            wrap.files.unshift(item);
                            // BI.Msg.toast(value);
                        }
                    }
                }
                wrap.files.length > 0 && self.fireEvent(BI.File.EVENT_CHANGE, {
                    files: wrap.files
                });
                input.value = "";
                wrap.dom.input.parentNode.replaceChild(input, wrap.dom.input);
                wrap.dom.input = input;
                event.add(wrap.dom.input, "change", arguments.callee);
            });
            return wrap;
        },

        _wrap: function () {
            var self = this, o = this.options;
            // be sure input accept multiple files
            var input = this.element[0];
            if (o.multiple === true) {
                this.element.attr("multiple", "multiple");
            }
            input.value = "";

            // wrap Object
            return this._events({

                // DOM namespace
                dom: {
                    input: input,        // input file
                    disabled: false      // internal use, checks input file state
                },
                name: input.name,        // name to send for each file ($_FILES[{name}] in the server)
                // maxSize is the maximum amount of bytes for each file
                maxSize: o.maxSize ? o.maxSize >> 0 : -1,
                maxLength: o.maxLength,
                files: [],               // file list

                // remove every file from the noswfupload component
                clean: function () {
                    this.files = [];
                },

                // upload one file a time (which make progress possible rather than all files in one shot)
                // the handler is an object injected into the wrap one, could be the wrap itself or
                // something like {onload:function(){alert("OK")},onerror:function(){alert("Error")}, etc ...}
                upload: function (handler) {
                    if (handler) {
                        for (var key in handler) {
                            this[key] = handler[key];
                        }
                    }
                    sendFiles(this, this.maxSize);
                    return this;
                },

                // hide progress bar (total + current) and enable files selection
                hide: function () {
                    if (this.dom.disabled) {
                        this.dom.disabled = false;
                        this.dom.input.removeAttribute("disabled");
                    }
                },

                // show progress bar and disable file selection (used during upload)
                // total and current are pixels used to style bars
                // totalProp and currentProp are properties to change, "height" by default
                show: function (total, current, totalProp, currentProp) {
                    if (!this.dom.disabled) {
                        this.dom.disabled = true;
                        this.dom.input.setAttribute("disabled", "disabled");
                    }
                }
            });
        },

        setMaxFileLength: function(v) {
            this.options.maxLength = v;
            if (this.wrap) {
                this.wrap.maxLength = v;
            }
        },

        select: function () {
            this.wrap && BI.Widget._renderEngine.createElement(this.wrap.dom.input).click();
        },

        upload: function (handler) {
            this.wrap && this.wrap.upload(handler);
        },

        getValue: function () {
            return this.wrap ? this.wrap.attach_array : [];
        },

        reset: function () {
            if (this.wrap) {
                this.wrap.attach_array = [];
                this.wrap.attach_names = [];
                this.wrap.attachNum = 0;
            }
        },

        _setEnable: function (enable) {
            BI.File.superclass._setEnable.apply(this, arguments);
            if (enable === true) {
                this.element.attr("disabled", "disabled");
            } else {
                this.element.removeAttr("disabled");
            }
        }
    });
    BI.File.EVENT_CHANGE = "EVENT_CHANGE";
    BI.File.EVENT_UPLOADSTART = "EVENT_UPLOADSTART";
    BI.File.EVENT_ERROR = "EVENT_ERROR";
    BI.File.EVENT_PROGRESS = "EVENT_PROGRESS";
    BI.File.EVENT_UPLOADED = "EVENT_UPLOADED";
    BI.shortcut("bi.file", BI.File);
})(_global.document || {});
