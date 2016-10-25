# express-build
使用babel批量转译当前项目所有js文件，一般用于使用了babel-register的express项目
## 安装
```
npm install express-build -g
```
## 使用
* 在当前项目的根目录创建build.js
```
(() => {
  return {
    // 忽略的目录或文件
    ignore: ['./node_modules', './.git', './.idea', './test.js', './build.js', './dist'],
    // 其他非js文件
    others: {
      // 可以配置回调 str: 文件内容; 返回:处理过的文本
      './bin/www': (str) => str.replace('require(\'babel-register\')', ''),
      // true: 包含
      './package.json': true
    }
  }
})()
```
* 在当前项目的根目录执行
```
express-build
```
*项目根目录会生成dist文件夹，转译后的所有文件会在里面*
