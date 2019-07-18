/**
 * Created by windy on 2018/01/23.
 */
describe("TextTest", function () {

    /**
     * test_author_windy
     */
    it("setText", function () {
        var text = BI.Test.createWidget({
            type: "bi.text"
        });
        text.setText("AAA");
        expect(text.element[0].textContent).to.equal("AAA");
    });

    /**
     * test_author_windy
     */
    it("setStyle", function () {
        var text = BI.Test.createWidget({
            type: "bi.text"
        });
        text.setStyle({"color": "red"});
        expect(text.element[0].style.color).to.equal("red");
    });
});
