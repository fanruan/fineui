# bi.combo_group

## 基类[BI.Widget](/core/widget.md)


## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| childern | 子组件 | array | — | [ ] |
| popup | 弹出层 | object | — |{el: {type: "bi.button_tree",chooseType: 0,layouts: [{type: "bi.vertical"}]}}|
| isDefaultInit | 是否默认初始化子节点 |boolean | true,false | false |
| isNeedAdjustHeight | 是否需要高度调整 | boolean | true,false | false |
| isNeedAdjustWidth | 是否需要宽度调整 | boolean | true,false | false |
| el | 自定义下拉框trigger | object | — |{type: "bi.text_button", text: "", value: ""}|
| trigger | 下拉列表的弹出方式  | string |  click,hover | "click" |
| adjustLength | 弹出列表和trigger的距离 | number | — | 0 |
| direction | 弹出列表和trigger的位置关系 | string | top &#124; bottom &#124; left &#124; right &#124; top,left &#124; top,right &#124; bottom,left &#124; bottom,right  | "bottom"|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | items  |
| setValue | 设置combo value值| v |
| getValue | 获取combo value值 | — |



---


