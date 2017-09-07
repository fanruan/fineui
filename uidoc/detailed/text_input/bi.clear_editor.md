# bi.clear_editor

## 带清除按钮的输入框

{% method %}
[source](https://jsfiddle.net/fineui/ppgph3qu/)

{% common %}
```javascript
BI.createWidget({
	type: 'bi.clear_editor',
	cls: "bi-border",
	element: '#wrapper',
	width: 300,
	watermark:"带清除按钮的输入框",
});
```

{% endmethod %}

##API

| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----|
| hgap    | 效果相当于文本框左右padding值 |  number  |   —  |     4   |
| vgap    | 效果相当于文本框上下padding值 |  number  | — |      2  |
| lgap    | 效果相当于文本框left-padding值     |    number   |   —     |  0    |
| rgap    | 效果相当于文本框right-padding值     |    number  |    —   |  0    |
| tgap    |效果相当于文本框top-padding值     |    number   | — |  0    |
| bgap    |  效果相当于文本框bottom-padding值     |    number  | —  |  0    |
| validationChecker    | 输入较验函数      | function |   —   | — |
| quitChecker    | 是否允许退出编辑函数      |   function    | — |     —  |
| allowBlank    |  是否允许空值     |    boolean    | true,false |  false    |
| watermark    |   文本框placeholder    |   string   | —  |  null    |
| value    |   文本框默认值    |    string   |  —   | " " |
| errorText    |  错误提示     |  string     | — | null      |
| width    |   文本框宽度    |    number   | —  |  —   |
| height    |   文本框高度    |    number   | — |  30    |



## 事件
| 事件    | 说明           |
| :------ |:------------- |
|BI.ClearEditor.EVENT_CLEAR| 点击清空按钮触发 |

### 其他事件详见[Input](../../base/editor/editor.md)


---

