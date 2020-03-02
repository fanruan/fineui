/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/2
 */

describe("edit_icon_check_combo", function () {

    /**
     * test_author_windy
     */
    it("测试弹出收起", function (done) {
        var combo = BI.Test.createWidget({
            type: "bi.editor_icon_check_combo",
            watermark: "默认值",
            width: 200,
            height: 24,
            value: 2,
            items: [{
                text: "MVC-1",
                value: "1"
            }, {
                text: "MVC-2",
                value: "2"
            }, {
                text: "MVC-3",
                value: "3"
            }]
        });
        BI.nextTick(function () {
            combo.element.find(".bi-editor-trigger").click();
            combo.element.find(".bi-text-icon-popup .bi-single-select-item").click();
            expect(combo.getValue()[0]).to.equal("3");
            combo.populate([{
                text: "MVC-1",
                value: "4"
            }, {
                text: "MVC-2",
                value: "5"
            }, {
                text: "MVC-3",
                value: "6"
            }]);
            combo.setValue("4");
            expect(combo.getValue()[0]).to.equal("4");
            combo.destroy();
            done();
        })
    });
});