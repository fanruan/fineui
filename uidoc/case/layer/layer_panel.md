# bi.popup_panel

## 可以理解为MultiPopupView和Panel两个面板的结合体，基类[BI.MultiPopupView](case/layer/multi_popup_layer.md)

{% method %}
[source](https://jsfiddle.net/fineui/zhnqvera/)

{% common %}
```javascript

BI.createWidget({
    element: "#wrapper",
    type: "bi.popup_panel",
    title: "测试",
    width: 300
});

```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| title | 标题 | string | — | " "




 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| prependItems | 内部前插入 | items |
| addItems | 内部后插入 | items |
| removeItemAt | 移除指定索引处的item | indexs |
| populate | 刷新列表 | items |
| setNotSelectedValue| 设置未被选中的值 | value,可以是单个值也可以是个数组|
| setValue | 设置value值 | value,可以是单个值也可以是个数组 |
| getNotSelectedValue | 获取没有被选中的值 | —|
| getValue | 获取被选中的值 |—|
| getAllButtons | 获取所有button |—|
| getAllLeaves | 获取所有的叶子节点 | —|
| getSelectedButtons | 获取所有被选中的元素 | —|
| getNotSelectedButtons | 获取所有未被选中的元素 | —|
| getIndexByValue | 根据value值获取value在数组中的索引 | value|
| getNodeById | 根据id获取节点 | id |
| getNodeByValue | 根据value值获取节点 | value |
| empty| 清空组件|—|
| hasPrev| 是否有上一页|—|
| hasNext |  是否有下一页 | —


## 事件
| 事件     | 说明                |
| :------ |:------------- |
|BI.PopupPanel.EVENT_CHANGE | panel的value发生改变触发   |
| BI.PopupPanel.EVENT_CLOSE | panel的关闭事件
| BI.PopupPanel.EVENT_CLICK_TOOLBAR_BUTTON | 点击工具栏事件




---


