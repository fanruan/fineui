/* 文件管理导航
 Created by dailer on 2017 / 7 / 21.
 */
Demo.FileManager = BI.inherit(BI.Widget, {
    props: {
        baseCls: ""
    },

    render: function () {
        var items = [{
            id: "1",
            value: "1",
            text: "根目录",
            lastModify: 1454316355142
        }, {
            id: "11",
            pId: "1",
            value: "11",
            text: "第一级子目录1",
            lastModify: 1454316355142
        }, {
            id: "12",
            pId: "1",
            value: "12",
            text: "第一级子目录2",
            lastModify: 1454316355142
        }, {
            id: "111",
            pId: "11",
            value: "111",
            text: "第二级子目录",
            lastModify: 1454316355142
        }, {
            id: "121",
            pId: "111",
            buildUrl: "www.baidu.com",
            value: "121",
            text: "文件1",
            lastModify: 1454316355142
        }, {
            id: "122",
            pId: "111",
            buildUrl: "www.baidu.com",
            value: "122",
            text: "文件2",
            lastModify: 1454316355142
        }];
        return {
            type: "bi.file_manager",
            items: items
        };
    }
});
BI.shortcut("demo.file_manager", Demo.FileManager);