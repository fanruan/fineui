/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/3/9
 */
describe("MessageTest", function () {

    /**
     * test_author_windy
     */
    it("alert", function (done) {
        BI.Msg.alert("message", "ASASASASA");
        var body = BI.Widget._renderEngine.createElement("body");
        expect(body.find(".bi-message-depend").length).to.equal(1);
        BI.nextTick(function () {
            body.find(".bi-message-depend .bi-button").click();
            expect(body.find(".bi-message-depend").length).to.equal(0);
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("toast_hand_close", function (done) {
        BI.Msg.toast("message", {
            autoClose: false
        });
        var body = BI.Widget._renderEngine.createElement("body");
        expect(body.find(".bi-toast").length).to.equal(1);
        BI.nextTick(function () {
            body.find(".bi-toast .bi-icon-button").click();
            expect(body.find(".bi-toast").length).to.equal(0);
            done();
        });
    });

    /**
     * test_author_windy
     */
    it("toast_auto_close", function () {
        BI.Msg.toast("message");
        var body = BI.Widget._renderEngine.createElement("body");
        expect(body.find(".bi-toast").length).to.equal(1);
    });
});

