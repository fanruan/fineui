/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/3
 */

describe("DownListCombo", function () {

    /**
     * test_author_windy
     */
    it("defaultValue", function () {
        var datePane = BI.Test.createWidget({
            type: "bi.down_list_combo",
            adjustLength: 10,
            items: [[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":12},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}],[{"el":{"text":"column 1111","iconCls1":"dot-e-font","value":11},"children":[{"text":"column 1.1","value":21,"cls":"dot-e-font"},{"text":"column 1.2","value":22,"cls":"dot-e-font"}]}]]
        });
    });
});