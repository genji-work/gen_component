## 从零开始搭建storybook

###### 1. 新建文件
``` shell
mkdir stories
cd stories
```

###### 2. 新建 package.json
``` shell
npm init -y
```

###### 3. 新建 package.json

``` shell
yarn add @storybook/react -D
yarn add babel-loader @babel/core -D
yarn add react react-dom

or

npm install @storybook/react --save-dev
npm install babel-loader @babel/core --save-dev
npm install react react-dom --save
```

###### 4. 配置 npm scripts
``` js
 {
   "scripts": {
     "storybook": "start-storybook"
   }
 }
```

###### 5. 创建配置文件
在项目根目录新建 .storybook/config.js，并放入以下内容

``` js
 import { configure } from '@storybook/react';
 ​
 function loadStories() {
   require('../stories/index.js');
   // You can require as many stories as you need.
 }
 ​
 configure(loadStories, module);
```

###### 6. 在项目根目录新建 stories/index.js，并放入以下内容
``` js
 import React from "react";
 import { storiesOf } from "@storybook/react";
 import { Button } from "@storybook/react/demo";
 ​
 storiesOf("Button", module)
   .add("with text", () => <Button>Hello Button</Button>)
   .add("with emoji", () => (
     <Button>
       <span role="img" aria-label="so cool">
         😀 😎 👍 💯
       </span>
     </Button>
   ));
```

###### 7. 运行
``` shell
npm run storybook
```

####配置 antd + less 环境

###### 依赖安装

``` shell
# antd
 npm i -S antd
 ​
 # less
 npm i -D less style-loader css-loader less-loader # 处理 less 文件的 loader
 ​
 # webpack
 npm i -D webpack-combine-loaders # 支持多个 loader 组合
 npm i -D babel-plugin-import # 支持 antd 按需加载
```

###### webpack 配置
```.storybook/webpack.config.js```

注意

配置过程遇到的问题：antd 不支持用 css-modules 方式的 loader 处理，如果只配置一个 less loader 会导致 antd 和 css-modules 功能冲突，总有一个是没有效果的。为了解决这个问题，根据 antd 文件的路径去过滤相关文件，让两种方式共存，具体可以看下面的配置：

``` javascript
const combineLoaders = require("webpack-combine-loaders");
 ​
 module.exports = ({ config, mode }) => {
   config.module.rules.push(
     {
       test: /\.less$/,
       exclude: /node_modules|antd\.less/, // 支持本地文件的 css-modules 功能，避免和 antd 冲突
       loader: combineLoaders([
         {
           loader: "style-loader"
         },
         {
           loader: "css-loader",
           options: {
             modules: true
           }
         },
         {
           loader: "less-loader"
         }
       ])
     },
     {
       test: /\.less$/,
       include: /node_modules|antd\.less/, // 只处理 antd 的样式文件
       loader: combineLoaders([
         {
           loader: "style-loader"
         },
         {
           loader: "css-loader"
         },
         {
           loader: "less-loader",
           options: {
             javascriptEnabled: true
           }
         }
       ])
     }
   );
   return config;
 };
```

##### storybook 配置
###### 自动处理 stories
```.storybook/config.js```

``` js
 import { configure } from "@storybook/react";
 // storybook 会自动导入 *.stories.jsx 格式的文件
 const req = require.context("../src/stories", true, /\.stories\.jsx$/);
 ​
 function loadStories() {
   req.keys().forEach(req);
 }
 ​
 configure(loadStories, module);
```

##### antd处理
在 ```.storybook/config.js``` 加入
``` js
import 'antd/dist/antd.less';
```
将
```js
import { Button } from "@storybook/react/demo";
```
更换成
```js
import { Button } from 'antd'
```

最后重新执行即可