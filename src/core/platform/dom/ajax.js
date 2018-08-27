// BI请求
_.extend(BI, {

    ajax: function (option) {
        option || (option = {});
        var async = option.async;
        option.data = BI.cjkEncodeDO(option.data || {});

        $.ajax({
            url: option.url,
            type: "POST",
            data: option.data,
            async: async,
            error: option.error,
            complete: function (res, status) {
                if (BI.isFunction(option.complete)) {
                    option.complete(BI.jsonDecode(res.responseText), status);
                }
            }
        });
    }
});