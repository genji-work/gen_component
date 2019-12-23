import { configure } from "@storybook/react";
import 'antd/dist/antd.less';
 // storybook 会自动导入 *.stories.tsx 格式的文件
const req = require.context("../stories", true, /\.stories\.jsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);