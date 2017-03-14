window.BI = window.BI || {};

$.extend(BI, {
    $defaultImport: function (options) {
        var config = $.extend({
            op: 'resource',
            path: null,
            type: null,
            must: false
        }, options);
        config.url = FR.servletURL + '?op=' + config.op + '&resource=' + config.path;
        this.$import(config.url, config.type,config.must);
    },
    $import: function () {
        var _LOADED = {}; // alex:保存加载过的
        function loadReady(src, must) {
            var $scripts = $("head script");
            $.each($scripts, function (i, item) {
                if (item.src.indexOf(src) != -1) {
                    _LOADED[src] = true;
                }
            });
            var $links = $("head link");
            $.each($links, function (i, item) {
                if (item.href.indexOf(src) != -1 && must) {
                    _LOADED[src] = false;
                    $(item).remove();
                }
            });
        }

        // must=true 强行加载
        return function (src, ext, must) {
            loadReady(src, must);
            // alex:如果已经加载过了的,直接return
            if (_LOADED[src] === true) {
                return;
            }
            if (ext === 'css') {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = src;
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(link);
                _LOADED[src] = true;
            } else {
                // alex:这里用同步调用的方式,必须等待ajax完成
                $.ajax({
                    url: src,
                    dataType: "script", // alex:指定dataType为script,jquery会帮忙做globalEval的事情
                    async: false,
                    cache: true,
                    complete: function (res, status) {
                        /*
                         * alex:发现jquery会很智能地判断一下返回的数据类型是不是script,然后做一个globalEval
                         * 所以当status为success时就不需要再把其中的内容加到script里面去了
                         */
                        if (status == 'success') {
                            _LOADED[src] = true;
                        }
                    }
                })
            }
        }
    }()
});