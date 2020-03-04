/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/2
 */

describe("textvaluecombo", function () {

    /**
     * test_author_windy
     */
    it("测试setValue", function () {
        var combo = BI.Test.createWidget({
            type: "bi.text_value_combo",
            text: "默认值",
            value: 22,
            width: 300,
            items: [{
                text: "MVC-1",
                iconCls: "date-font",
                value: 1
            }, {
                text: "MVC-2",
                iconCls: "search-font",
                value: 2
            }, {
                text: "MVC-3",
                iconCls: "pull-right-font",
                value: 3
            }]
        });
        combo.setValue(2);
        expect(combo.getValue()[0]).to.equal(2);
        combo.destroy();
    });

    /**
     * test_author_windy
     */
    it("测试populate", function () {
        var combo = BI.Test.createWidget({
            type: "bi.text_value_combo",
            text: "默认值",
            value: 22,
            width: 300
        });
        combo.populate([{
            text: "MVC-1",
            iconCls: "date-font",
            value: 1
        }, {
            text: "MVC-2",
            iconCls: "search-font",
            value: 2
        }, {
            text: "MVC-3",
            iconCls: "pull-right-font",
            value: 3
        }]);
        combo.setValue(2);
        expect(combo.getValue()[0]).to.equal(2);
        combo.destroy();
    });

    /**
     * test_author_windy
     */
    it("测试small_setValue", function () {
        var combo = BI.Test.createWidget({
            type: "bi.small_text_value_combo",
            text: "默认值",
            value: 22,
            width: 300,
            items: [{
                text: "MVC-1",
                iconCls: "date-font",
                value: 1
            }, {
                text: "MVC-2",
                iconCls: "search-font",
                value: 2
            }, {
                text: "MVC-3",
                iconCls: "pull-right-font",
                value: 3
            }]
        });
        combo.setValue(2);
        expect(combo.getValue()[0]).to.equal(2);
        combo.destroy();
    });

    /**
     * test_author_windy
     */
    it("测试small_populate", function () {
        var combo = BI.Test.createWidget({
            type: "bi.small_text_value_combo",
            text: "默认值",
            value: 22,
            width: 300
        });
        combo.populate([{
            text: "MVC-1",
            iconCls: "date-font",
            value: 1
        }, {
            text: "MVC-2",
            iconCls: "search-font",
            value: 2
        }, {
            text: "MVC-3",
            iconCls: "pull-right-font",
            value: 3
        }]);
        combo.setValue(2);
        expect(combo.getValue()[0]).to.equal(2);
        combo.destroy();
    });
});