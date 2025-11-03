# 故障排查指南

## 常见问题和解决方案

### ❌ 问题 1: `TypeError: util.inherits is not a function`

**错误信息：**
```
TypeError: util2.inherits is not a function
```

**原因：**
这个错误通常发生在以下情况：
1. 使用旧版本的包（未正确配置外部依赖）
2. Node.js 版本过低
3. 依赖未正确安装

**解决方案：**

#### 方案 1: 确保使用最新版本（推荐）

```bash
# 删除旧版本
npm uninstall @zleap/md2html

# 重新安装最新版本
npm install git+https://github.com/liao666brant/md2html.git
```

#### 方案 2: 确保 Node.js 版本正确

```bash
# 检查 Node.js 版本
node --version

# 应该 >= 22.16.0
# 如果版本过低，请升级 Node.js
```

#### 方案 3: 确保依赖正确安装

```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### 方案 4: 手动安装依赖

如果自动安装失败，手动安装所有依赖：

```bash
npm install \
  csstype \
  es-toolkit \
  fflate \
  front-matter \
  highlight.js \
  isomorphic-dompurify \
  marked \
  mermaid \
  postcss \
  reading-time
```

### ❌ 问题 2: 导入失败 `Cannot find module`

**错误信息：**
```
Error: Cannot find module '@zleap/md2html'
```

**解决方案：**

确保在 `package.json` 中正确配置：

```json
{
  "dependencies": {
    "@zleap/md2html": "git+https://github.com/liao666brant/md2html.git"
  }
}
```

然后运行：
```bash
npm install
```

### ❌ 问题 3: 构建失败

**错误信息：**
```
Error: Build failed
```

**解决方案：**

如果从 GitHub 安装时构建失败：

```bash
# 克隆仓库
git clone https://github.com/liao666brant/md2html.git
cd md2html

# 安装依赖
npm install

# 手动构建
npm run build

# 在你的项目中使用本地路径
cd your-project
npm install file:../md2html
```

### ❌ 问题 4: TypeScript 类型错误

**错误信息：**
```
Could not find a declaration file for module '@zleap/md2html'
```

**解决方案：**

确保安装了完整的包（包含 dist 目录）：

```bash
# 检查 dist 目录是否存在
ls node_modules/@zleap/md2html/dist

# 如果不存在，重新安装
npm install git+https://github.com/liao666brant/md2html.git
```

### ❌ 问题 5: ESM/CommonJS 兼容性问题

**错误信息：**
```
require() of ES Module not supported
```

**解决方案：**

#### 使用 ESM（推荐）

在 `package.json` 中设置：
```json
{
  "type": "module"
}
```

然后使用 import：
```javascript
import { convertMarkdownToHtml } from '@zleap/md2html'
```

#### 使用 CommonJS

```javascript
const { convertMarkdownToHtml } = require('@zleap/md2html')
```

### ❌ 问题 6: 内存溢出

**错误信息：**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**解决方案：**

处理大文件时增加 Node.js 内存限制：

```bash
# 设置 4GB 内存
export NODE_OPTIONS="--max-old-space-size=4096"

# 运行你的脚本
node your-script.js
```

或者分批处理：

```javascript
import { MarkdownConverter } from '@zleap/md2html'

const converter = new MarkdownConverter()
converter.init()

for (const file of largeFiles) {
  converter.render(file)
  // 处理结果...
  converter.reset() // 重要：释放内存
}
```

### ❌ 问题 7: 在浏览器中使用失败

**错误信息：**
```
Module not found: Can't resolve 'fs'
```

**原因：**
这个包依赖 Node.js 模块（如 `fs`、`path`），不能直接在浏览器中使用。

**解决方案：**

#### 方案 1: 使用服务端渲染

```javascript
// server.js (Node.js)
import express from 'express'
import { convertMarkdownToHtml } from '@zleap/md2html'

const app = express()
app.post('/convert', express.json(), (req, res) => {
  const { html } = convertMarkdownToHtml(req.body.markdown)
  res.json({ html })
})
```

#### 方案 2: 配置 Webpack/Vite polyfills

如果必须在浏览器中使用，需要配置 polyfills：

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      'fs': 'browserify-fs',
      'path': 'path-browserify',
      // ... 其他 polyfills
    }
  }
}
```

**注意：** 不推荐在浏览器中使用，因为包体积较大且性能不佳。

### ❌ 问题 8: 标题提取失败（titleList 为空）

**原因：**
在 Node.js 环境中没有 DOM，无法提取标题。

**解决方案：**

#### 方案 1: 使用 jsdom

```bash
npm install jsdom
```

```javascript
import { JSDOM } from 'jsdom'
import { convertMarkdownToHtml } from '@zleap/md2html'

// 设置全局 document
const dom = new JSDOM('')
global.document = dom.window.document

const result = convertMarkdownToHtml(markdown)
console.log(result.titleList) // 现在可以正常工作
```

#### 方案 2: 手动解析标题

```javascript
const result = convertMarkdownToHtml(markdown)

// 使用正则表达式从 HTML 中提取标题
const titleRegex = /<h([1-6])[^>]*>([^<]+)<\/h\1>/g
const titles = []
let match

while ((match = titleRegex.exec(result.html)) !== null) {
  titles.push({
    level: parseInt(match[1]),
    title: match[2],
    url: `#${titles.length}`
  })
}

console.log(titles)
```

### ❌ 问题 9: 渲染结果不符合预期

**解决方案：**

1. **检查配置：**

```javascript
import { MarkdownConverter } from '@zleap/md2html'

const converter = new MarkdownConverter()

// 确保初始化
converter.init({
  primaryColor: '#3f51b5',
  size: '16px',
  // ... 其他配置
})

// 确保传入正确的选项
const html = converter.render(markdown, {
  isShowLineNumber: true,
  isMacCodeBlock: false,
  // ... 其他选项
})
```

2. **查看实际输出：**

```javascript
const result = convertMarkdownToHtml(markdown)
console.log('HTML:', result.html)
console.log('Reading time:', result.readingTime)
console.log('Titles:', result.titleList)
```

3. **使用调试模式：**

```javascript
const converter = new MarkdownConverter()
converter.init(options)

try {
  const html = converter.render(markdown)
  console.log('Render success')
} catch (error) {
  console.error('Render failed:', error)
  console.error('Options:', options)
  console.error('Markdown length:', markdown.length)
}
```

### 📝 最佳实践避免问题

1. **始终使用最新版本**
2. **确保 Node.js >= 22.16.0**
3. **使用 try-catch 包裹转换代码**
4. **复用 MarkdownConverter 实例**
5. **处理大文件时注意内存管理**
6. **在服务端使用，避免在浏览器中使用**

### 🆘 获取帮助

如果以上解决方案都无效：

1. 检查 [GitHub Issues](https://github.com/liao666brant/md2html/issues)
2. 创建新的 Issue，包含：
   - 错误信息完整堆栈
   - Node.js 版本（`node --version`）
   - npm 版本（`npm --version`）
   - 操作系统版本
   - 完整的复现步骤
   - package.json 内容

### 📚 相关文档

- [README](./README.md) - 完整文档
- [QUICKSTART](./QUICKSTART.md) - 快速开始
- [USAGE](./USAGE.md) - 使用指南
- [examples](./examples/) - 示例代码

