/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/10
 */

describe("HtmlTest", function () {

    /**
     * test_author_windy
     */
    it("html_h1", function () {
        var a = BI.Test.createWidget({
            type: "bi.html",
            text: "<h1>在bi.html标签中使用html原生标签</h1>"
        });
        expect(a.element.find("h1").length).to.equal(1);
        a.destroy();
    });


    /**
     * test_author_windy
     */
    it("html测试属性方法", function () {
        var a = BI.Test.createWidget({
            type: "bi.html",
            text: "<h1>在bi.html标签中使用html原生标签</h1>",
            height: 200,
            width: 200,
            value: "1",
            highLight: true,
            hgap: 10,
            vgap: 10,
            handler: BI.emptyFn
        });
        a.setValue("DDDDD");
        a.setStyle({"background-color": "red"});
        expect(a.text.element.css("background-color")).to.equal("rgb(255, 0, 0)");
        a.destroy();
    });
});