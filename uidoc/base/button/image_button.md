# bi.image_button

## 图片的button,基类[BI.BasicButton](/core/basicButton.md)

{% method %}
[source](https://jsfiddle.net/fineui/yc0g9gLw/)

{% common %}
```javascript

BI.createWidget({
	type: 'bi.image_button',
  src: "http://www.easyicon.net/api/resizeApi.php?id=1206741&size=128",
  width: 100,
  height: 100
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| src |图片路径 |string | |" " |
| iconWidth | 图标宽度  |   number/string|   | "100%"  |
| iconHeight    |   图标高度    |    number/string |    | "100%"|


## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| doClick | 点击事件 | —|
| setWidth | 设置按钮宽度| 宽度width |
| setHeight | 设置按钮高度 | 高度height|
| setImageWidth | 设置图片宽度| 宽度width |
| setImageHeight| 设置图片高度| 高度height|
| getImageWidth | 获取图片宽度| —|
| getImageHeight | 获取图片高度| —|
| setSrc| 设置图片路径| src |
| getSrc |获取图片路径| — |
 


---


