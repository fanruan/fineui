/**
 * Created by windy on 2018/01/23.
 */
describe("ButtonTest", function () {

    /**
     * test_author_windy
     */
    it("Click点击触发事件", function (done) {
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
            button.destroy();
            done();
        });

    });


    /**
     * test_author_windy
     */
    it("MouseDown触发事件", function (done) {
        var button = BI.Test.createWidget({
            type: "bi.button",
            text: "CCC",
            trigger: "mousedown",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            button.element.mousedown();
            expect(button.element.children(".bi-text").text()).to.equal("click");
            button.destroy();
            done();
        });

    });

    /**
     * test_author_windy
     */
    it("MouseUp触发事件", function (done) {
        var button = BI.Test.createWidget({
            type: "bi.button",
            text: "CCC",
            trigger: "mouseup",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            button.element.mousedown();
            button.element.mouseup();
            expect(button.element.children(".bi-text").text()).to.equal("click");
            button.destroy();
            done();
        });

    });

    /**
     * test_author_windy
     */
    it("doubleClick触发事件", function (done) {
        var button = BI.Test.createWidget({
            type: "bi.button",
            text: "CCC",
            trigger: "dblclick",
            handler: function () {
                this.setText("click");
            }
        });
        BI.nextTick(function () {
            button.element.dblclick();
            expect(button.element.children(".bi-text").text()).to.equal("click");
            button.destroy();
            done();
        });

    });

    /**
     * test_author_windy
     */
    it("LongClick触发事件", function (done) {
        var clickNum = 0;
        var button = BI.Test.createWidget({
            type: "bi.button",
            text: "CCC",
            trigger: "lclick",
            listeners: [{
                eventName: BI.Button.EVENT_CHANGE,
                action: function () {
                    clickNum++;
                }
            }]
        });
        BI.nextTick(function () {
            button.element.mousedown();
            BI.delay(function () {
                expect(clickNum).to.equal(2);
                button.destroy();
                done();
            }, 360);
        });

    });
});
