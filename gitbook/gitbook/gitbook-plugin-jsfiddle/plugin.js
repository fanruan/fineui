require(["gitbook", "jquery"], function (gitbook, $) {
    var matcher = /\/\/jsfiddle.net\/.+/;
    var defaults = {
        type: 'script',
        tabs: ['js', 'html', 'css', 'result'],
        theme: 'light'
    };
    var localConfig = {
        jsfiddle: {}
    };
    var extractConfigFromURL = function (href) {
        var match = /(#)(.+)$/ig.exec(href);
        if (match && match[2]) {
            return match[2].split('&').reduce(function (params, param) {
                var splitParam = param.split('=');
                if (splitParam[0] === 'tabs') {
                    splitParam[1] = splitParam[1].split(',');
                }
                params[splitParam[0]] = splitParam[1];
                return params;
            }, {});
        }
        return {};
    };
    var generateAdditionalParams = function (config) {
        var params = '/';
        if (config.theme) {
            params += config.theme + '/';
        }
        var colors = Object.keys(config).reduce(function (colors, key) {
            if (['href', 'type', 'theme', 'tabs', 'width', 'height'].indexOf(key) !== -1) {
                return colors;
            }
            colors += key + '=' + config[key] + '&';
            return colors;
        }, '');

        colors = colors.replace(/&$/, '');
        if (colors) {
            return params + '?' + colors;
        }
        return params;
    };

    var generateUrl = function (config) {
        var additionalParam = generateAdditionalParams(config);
        var type = config.type == 'frame' ? 'embedded' : 'embed';
        return config.href + type + '/' + config.tabs.join(',') + additionalParam;
    };

    var creator = {
        script: function (config) {
            var script = document.createElement('script');
            script.src = generateUrl(config);
            script.async = true;
            return script;
        },
        frame: function (config) {
            return $([
                '<iframe',
                ' width=',
                '"' + (config.width ? config.width : '100%') + '"',
                ' height=',
                '"' + (config.height ? config.height : '300') + '"',
                ' src="' + generateUrl(config) + '"',
                ' allowfullscreen="allowfullscreen" frameborder="0"',
                '>',
                '</iframe>'
            ].join(''))[0];
        }
    };

    var createEmbedNode = function (href, config) {
        var normalURL = href.replace(/#.+$/, '');
        var configFromUrl = extractConfigFromURL(href);
        var mergedConfig = $.extend({href: normalURL}, config, configFromUrl);
        return creator[mergedConfig.type](mergedConfig);
    };

    function embedAllLink(config) {
        localConfig.jsfiddle = $.extend(localConfig.jsfiddle || {}, config.jsfiddle);
        $(".book-body a").each(function (index, link) {
            if (link.href && matcher.test(link.href)) {
                link.parentNode.insertBefore(createEmbedNode(link.href, localConfig.jsfiddle), link.nextSibling);
                link.parentNode.removeChild(link);
            }
        });
    }

    gitbook.events.bind("start", function (e, config) {
        localConfig.jsfiddle = $.extend({}, defaults);
        matcher = /(http|https):\/\/jsfiddle.net\/.+/;
        embedAllLink(config);
    });

    gitbook.events.bind("page.change", function () {
        if (matcher) {
            embedAllLink(localConfig);
        }
    });

});