# bi.sign_initial_editor

## 指定初始值 之后初始值会一直显示的editor 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/9vjghevp/)

{% common %}
```javascript

BI.createWidget({
    element: "#wrapper",
    type: "bi.sign_initial_editor",
    cls: "layout-bg5",
    text: "原始值",
    width: 300
});

```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于文本框左右padding值 |  number  |   —  |     4   |
| vgap    | 效果相当于文本框上下padding值 |  number  | — |      2  |
| lgap    | 效果相当于文本框left-padding值     |    number   |   —     |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |   —    |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   |  —|  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  |   |  0    |
| validationChecker    | 输入较验函数      |function|  —  |   —   |
| quitChecker    | 是否允许退出编辑函数      |   function    | — |   —    |
| allowBlank    |  是否允许空值     |    boolean    | true,false |  true    |
| watermark    |   文本框placeholder    |   string   |  — |  " "    |
| errorText    |  错误提示     |  string/function     | —| " "|
| height| 高度| number |— | 30|
| text    | 文本内容        |    string |  —| " " |
| value    | 文本value值        |    string | — | " " |

 


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setErrorText | 设置错误文本 | text |
| getErrorText | 获取错误文本 | —|
| focus | 文本框获取焦点| — |
| blur | 文本框失焦|—|
| setValue | 设置文本框值|value|
| getLastValidValue | 获取文本框最后一次输入的有效值| —|
| getValue | 获取文本框值|—|
| isEditing | 文本框是否处于编辑状态|—|
| isValid | 文本框值是否有效|—|
| doRedMark | 文本标红  | —  |
| unRedMark | 取消文本标红| —|
| doHighLight | 文本高亮 | —|
| unHighLight | 取消文本高亮 | —|
| setTitle| 设置title | title|
| setWarningTitle| 设置错误title |  title |
| setState | 设置文本框值 |—
| getState | 获取文本框值 | —

## 事件
| 事件     | 说明                |
| :------ |:------------- |
|BI.Editor.EVENT_CHANGE | editor的value发生改变触发   |
|BI.Editor.EVENT_FOCUS |  focus事件          |
|BI.Editor.EVENT_BLUR |  blur事件   |
|BI.Editor.EVENT_CLICK |    点击编辑框触发(不在编辑状态时)     |
|BI.Editor.EVENT_KEY_DOWN |  keyDown时触发 |
|BI.Editor.EVENT_SPACE | 按下空格触发 |
|BI.Editor.EVENT_BACKSPACE | 按下Backspace触发 |
|BI.Editor.EVENT_START | 开始输入触发 |
|BI.Editor.EVENT_PAUSE | 暂停输入触发(输入空白字符) |
|BI.Editor.EVENT_STOP | 停止输入触发 |
|BI.Editor.EVENT_CONFIRM | 确定输入触发（blur时且输入值有效） |
|BI.Editor.EVENT_VALID | 输入值有效的状态事件 |
|BI.Editor.EVENT_ERROR | 输入值无效的状态事件 |
|BI.Editor.EVENT_ENTER | 回车事件 |
|BI.Editor.EVENT_RESTRICT | 回车但是值不合法 |
|BI.Editor.EVENT_REMOVE | 输入为空时按下backspace |
|BI.Editor.EVENT_EMPTY | 输入框为空时触发 |




---


