/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/18
 */

describe("multilayer_select_tree", function () {

    var items = [{id: -1, pId: -2, value: "根目录", text: "根目录"},
        {id: 1, pId: -1, value: "第一级目录1", text: "第一级目录1"},
        {id: 11, pId: 1, value: "第二级文件1", text: "第二级文件1"},
        {id: 12, pId: 1, value: "第二级目录2", text: "第二级目录2"},
        {id: 121, pId: 12, value: "第三级目录1", text: "第三级目录1"},
        {id: 122, pId: 12, value: "第三级文件1", text: "第三级文件1"},
        {id: 1211, pId: 121, value: "第四级目录1", text: "第四级目录1"},
        {
            id: 12111,
            pId: 1211,
            value: "第五级文件1",
            text: "第五级文件111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
        },
        {id: 2, pId: -1, value: "第一级目录2", text: "第一级目录2"},
        {id: 21, pId: 2, value: "第二级目录3", text: "第二级目录3"},
        {id: 22, pId: 2, value: "第二级文件2", text: "第二级文件2"},
        {id: 211, pId: 21, value: "第三级目录2", text: "第三级目录2"},
        {id: 212, pId: 21, value: "第三级文件2", text: "第三级文件2"},
        {id: 2111, pId: 211, value: "第四级文件1", text: "第四级文件1"}];

    /**
     *   test_author_windy
     **/
    it("defaultValue_allowEdit", function () {
        var tree = BI.Test.createWidget({
            type: "bi.multilayer_select_tree_combo",
            width: 300,
            height: 24,
            allowEdit: true,
            items: BI.deepClone(items),
            value: "第一级目录2"
        });
        expect(tree.getValue()).to.equal("第一级目录2");
        tree.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("defaultValue_not_allowEdit", function () {
        var tree = BI.Test.createWidget({
            type: "bi.multilayer_select_tree_combo",
            width: 300,
            height: 24,
            items: BI.deepClone(items),
            value: "第一级目录2"
        });
        expect(tree.getValue()).to.equal("第一级目录2");
        tree.destroy();
    });

    /**
     *   test_author_windy
     **/
    it("点选选值", function (done) {
        var tree = BI.Test.createWidget({
            type: "bi.multilayer_select_tree_combo",
            width: 300,
            height: 24,
            allowEdit: true,
            items: BI.deepClone(items),
            value: "第一级目录2"
        });
        tree.element.find(".bi-multi-layer-select-tree-trigger").click();
        BI.nextTick(function () {
            tree.element.find(".bi-select-tree-plus-group-node").click();
            expect(tree.getValue()[0]).to.equal("根目录");
            tree.destroy();
            done();
        });
    });

    /**
     *   test_author_windy
     **/
    it("搜索选值", function (done) {
        var tree = BI.Test.createWidget({
            type: "bi.multilayer_select_tree_combo",
            width: 300,
            height: 24,
            allowEdit: true,
            items: BI.deepClone(items)
        });
        BI.nextTick(function () {
            tree.element.find(".bi-multi-layer-select-tree-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(tree.element.find(".bi-multi-layer-select-tree-trigger .bi-input"), "2", 50, function () {
                    BI.nextTick(function () {
                        tree.element.find(".bi-select-tree-mid-plus-group-node").click();
                        expect(tree.getValue()[0]).to.equal("第一级目录2");
                        tree.destroy();
                        done();
                    });
                });
            });
        });
    });

    /**
     *   test_author_windy
     **/
    it("新增值", function (done) {
        var tree = BI.Test.createWidget({
            type: "bi.multilayer_select_tree_combo",
            width: 300,
            height: 24,
            allowEdit: true,
            allowInsertValue: true,
            items: BI.deepClone(items)
        });
        BI.nextTick(function () {
            tree.element.find(".bi-multi-layer-select-tree-trigger .tip-text-style").click();
            // 这边为啥要加呢，因为input的setValue中有nextTick
            BI.nextTick(function () {
                BI.Test.triggerKeyDown(tree.element.find(".bi-multi-layer-select-tree-trigger .bi-input"), "z", 50, function () {
                    BI.nextTick(function () {
                        tree.element.find(".bi-text-button:contains(+点击新增\"z\")").click();
                        expect(tree.getValue()[0]).to.equal("z");
                        tree.destroy();
                        done();
                    });
                });
            });
        });
    });
});