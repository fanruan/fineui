!(function () {
    var Store = BI.inherit(Fix.Model, {
        _init: function () {

        },

        computed: {},

        watch: {},

        actions: {
            init: function (cb) {
                var tree = BI.Tree.transformToTreeFormat(Demo.CONFIG);
                var traversal = function (array, callback) {
                    var t = [];
                    BI.some(array, function (i, item) {
                        var match = callback(i, item);
                        if (match) {
                            t.push(item.id);
                        }
                        var b = traversal(item.children, callback);
                        if (BI.isNotEmptyArray(b)) {
                            t = BI.concat([item.id], b);
                        }
                    });
                    return t;
                };
                var paths = traversal(tree, function (index, node) {
                    if (!node.children || BI.isEmptyArray(node.children)) {
                        if (node.value === Demo.showIndex) {
                            return true;
                        }
                    }
                });
                BI.each(Demo.CONFIG, function (index, item) {
                    if (BI.contains(paths, item.id)) {
                        item.open = true;
                    }
                });

                cb();
            },

            handleTreeSelectChange: function (v) {
                var matched = BI.some(Demo.CONFIG, function (index, item) {
                    if (item.value === v) {
                        BI.Router.$router.push({
                            name: "component",
                            params: {
                                componentId: item.value
                            }
                        });
                        // BI.history.navigate(item.text, {trigger: true});
                        return true;
                    }
                });
                if (!matched) {
                    BI.Router.$router.push("/");
                    // BI.history.navigate("", {trigger: true});
                }
            }
        }
    });
    BI.store("demo.store.main", Store);
})();
