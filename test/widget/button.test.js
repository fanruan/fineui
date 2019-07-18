/**
 * Created by windy on 2018/01/23.
 */
describe("ButtonTest", function () {

    /**
     * test_author_windy
     */
    it("EventClickTest", function (done) {
        var button = BI.Test.createWidget({
            type: "bi.button",
            text: "CCC",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            button.element.click();
            expect(button.element.children(".bi-text").text()).to.equal("click");
            done();
        });

    });
});
