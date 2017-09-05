# bi.combo_group

## 基类[BI.Widget](/core/widget.md)


## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| trigger | 事件类型 | string |  | "click,hover" |
| direction | combo弹出层位置 | string | top,bottom,left,right,(top,left),(top,right),(bottom,left),(bottom,right) | "right"|
| childern | 子组件 | array | — | [ ] |
| el | 开启弹出层的元素 | object | — | {type: "bi.text_button", text: "", value: ""}|
| popup | 弹出层 | object | — |{el: {type: "bi.button_tree",chooseType: 0,layouts: [{type: "bi.vertical"}]}}|
| isDefaultInit | 是否默认初始化子节点 |boolean | true,false | false |
| isNeedAdjustHeight | 是否需要高度调整 | boolean | true,false | false |
| isNeedAdjustWidth | 是否需要宽度调整 | boolean | true,false | false |
| adjustLength | 调整的距离 | number | — | 0 |



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items  |
| setValue | 设置combo value值| v |
| getValue | 获取combo value值 | — |



---


