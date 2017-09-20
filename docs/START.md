
1. bower安装
```
bower install fineui
```
2. 第一个demo

```html
<html>
<head>
      <meta charset="utf-8">
      <title></title>
      <link rel="stylesheet" type="text/css" href="bower_components/dist/bundle.css" />
      <script src="bower_components/dist/bundle.js"></script>
</head>

<body>
      <script>
        $(function(){
            BI.createWidget({
                type:"bi.absolute",
                element: "body",
                items: [{
                    el:{
                        type: "bi.button",
                        text: "这是一个按钮"
                    },
                    left: 100,
                    top: 100
                }]
            })
        })
      </script>
</body>

</html>
```
