/**
 * @author windy
 * @version 2.0
 * Created by windy on 2019/9/25
 */

// describe("tree_value_chooser_pane", function () {
//
//     var items = [{pId: "0", id: "0_0", text: "中国", value: "", open: true}, {
//         pId: "0_0",
//         id: "0_0_0",
//         text: "安徽省( 共1个 )",
//         value: "安徽省",
//         open: true
//     }, {pId: "0_0_0", id: "0_0_0_0", text: "芜湖市", value: "芜湖市", open: true}, {
//         pId: "0_0",
//         id: "0_0_1",
//         text: "北京市( 共6个 )",
//         value: "北京市",
//         open: true
//     }, {pId: "0_0_1", id: "0_0_1_0", text: "北京市区", value: "北京市区", open: true}, {
//         pId: "0_0_1",
//         id: "0_0_1_1",
//         text: "朝阳区",
//         value: "朝阳区",
//         open: true
//     }, {pId: "0_0_1", id: "0_0_1_2", text: "东城区", value: "东城区", open: true}, {
//         pId: "0_0_1",
//         id: "0_0_1_3",
//         text: "海淀区4内",
//         value: "海淀区4内",
//         open: true
//     }, {pId: "0_0_1", id: "0_0_1_4", text: "海淀区4外", value: "海淀区4外", open: true}, {
//         pId: "0_0_1",
//         id: "0_0_1_5",
//         text: "石景山区",
//         value: "石景山区",
//         open: true
//     }, {pId: "0_0", id: "0_0_2", text: "福建省( 共2个 )", value: "福建省", open: true}, {
//         pId: "0_0_2",
//         id: "0_0_2_0",
//         text: "莆田市",
//         value: "莆田市",
//         open: true
//     }, {pId: "0_0_2", id: "0_0_2_1", text: "泉州市", value: "泉州市", open: true}, {
//         pId: "0_0",
//         id: "0_0_3",
//         text: "甘肃省( 共1个 )",
//         value: "甘肃省",
//         open: true
//     }, {pId: "0_0_3", id: "0_0_3_0", text: "兰州市", value: "兰州市", open: true}, {
//         pId: "0_0",
//         id: "0_0_4",
//         text: "广东省( 共5个 )",
//         value: "广东省",
//         open: true
//     }, {pId: "0_0_4", id: "0_0_4_0", text: "东莞市", value: "东莞市", open: true}, {
//         pId: "0_0_4",
//         id: "0_0_4_1",
//         text: "广州市",
//         value: "广州市",
//         open: true
//     }];
//
//     var itemSelectorGetter = function (array) {
//         return BI.map(array, function (idx, num) {
//             return ".bi-multi-select-popup-view .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
//         });
//     };
//
//     var searchItemSelectorGetter = function (array) {
//         return BI.map(array, function (idx, num) {
//             return ".bi-multi-select-search-pane .bi-loader .bi-button-group .bi-multi-select-item:nth-child(" + num + ")";
//         });
//     };
//
//     /**
//      *   test_author_windy
//      **/
//     it("setValue", function () {
//         var widget = BI.Test.createWidget({
//             type: "bi.tree_value_chooser_pane",
//             width: 220,
//             items: items,
//             // itemsCreator: function (op, callback) {
//             //     callback(items);
//             // }
//         });
//         widget.setSelectedValue({
//             "中国": {
//                 "北京市": {
//                     "朝阳区": {}
//                 }
//             }
//         });
//         expect(widget.getValue()).to.deep.equal({
//             "中国": {
//                 "北京市": {
//                     "朝阳区": {}
//                 }
//             }
//         });
//         widget.destroy();
//     });
//
//     /**
//      *   test_author_windy
//      **/
//     it("getValue", function () {
//         var widget = BI.Test.createWidget({
//             type: "bi.tree_value_chooser_pane",
//             width: 220,
//             itemsCreator: function (op, callback) {
//                 callback(items);
//             },
//             value: {
//                 "中国": {
//                     "北京市": {
//                         "朝阳区": {}
//                     }
//                 }
//             }
//         });
//         widget.setSelectedValue({
//             "中国": {
//                 "北京市": {
//                     "朝阳区": {}
//                 }
//             }
//         });
//         expect(widget.getValue()).to.deep.equal({
//             "中国": {
//                 "北京市": {
//                     "朝阳区": {}
//                 }
//             }
//         });
//         widget.destroy();
//     });
// });