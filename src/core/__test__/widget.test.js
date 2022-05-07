/**
 * Created by guy on 2018/01/23.
 */
describe("widgetTest", function () {

    before(function () {
    });

    /**
     * test_author_guy
     */
    it("widget生命周期测试", function () {

        var Demo = BI.inherit(BI.Widget, {
            render: function () {
                return {
                    type: "bi.label",
                    text: "old"
                };
            }
        });
        BI.shortcut("demo.demo", Demo);

        var demo = BI.Test.createWidget({
            type: "demo.demo",
            render: function () {
                return {
                    type: "bi.label",
                    text: "new"
                };
            }
        });

        expect(demo.element.text()).to.equal("new");
        demo.destroy();
    });

});
