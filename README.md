# @md/converter

Markdown 转 HTML 转换器包，提供独立的 Markdown 渲染功能。

## 📚 文档导航

- 📦 [安装指南](./INSTALL.md) - 详细的安装步骤和系统要求
- ⚡ [快速上手](./QUICKSTART.md) - 5分钟快速开始，代码示例
- 💻 [使用指南](./USAGE.md) - 如何在其他项目中使用
- 📖 [API 文档](#api-文档) - 完整的 API 参考（本文档）
- 🔧 [故障排查](./TROUBLESHOOTING.md) - 常见问题和解决方案
- 🧪 [示例代码](./examples/) - 实际使用案例

## 特性

- 🚀 独立运行，不依赖任何 UI 框架
- 🎨 完整的主题定制支持
- 📊 自动统计字数和阅读时间
- 📑 自动提取标题生成目录
- 🔧 灵活的配置选项
- 💪 完整的 TypeScript 类型支持
- 📦 支持 ESM 和 CommonJS

## 安装

### 从 GitHub 安装（推荐）

```bash
# 使用 npm
npm install git+https://github.com/liao666brant/md2html.git

# 使用 pnpm
pnpm add git+https://github.com/liao666brant/md2html.git

# 使用 yarn
yarn add git+https://github.com/liao666brant/md2html.git
```

### 从 npm 安装（如果已发布）

```bash
pnpm add @zleap/md2html
```

> **注意：** 从 GitHub 安装时，包会自动执行构建（通过 `prepare` 脚本）。首次安装可能需要几分钟时间。

## 本地开发构建

如果你克隆了源码并想本地构建：

```bash
cd packages/converter
pnpm install
pnpm build
```

详细说明见 [START.md](./START.md)

## 使用方法

### 方式 1: 使用类（推荐用于复杂场景）

```typescript
import { MarkdownConverter } from '@md/converter'

// 创建转换器实例
const converter = new MarkdownConverter()

// 初始化配置
converter.init({
  primaryColor: `#3f51b5`,
  size: `16px`,
  isShowLineNumber: true,
  isMacCodeBlock: false,
})

// 渲染 Markdown
const html = converter.render(`# Hello\n\nThis is **markdown**`, {
  isCountStatus: true,
  isCiteStatus: false,
})

// 获取额外信息
console.log(converter.readingTime) // { chars: 28, words: 5, minutes: 1 }
console.log(converter.titleList) // [{ url: '#0', title: 'Hello', level: 1 }]

// 或使用 getResult() 获取完整结果
const result = converter.getResult()
console.log(result.html)
console.log(result.readingTime)
console.log(result.titleList)
```

### 方式 2: 使用函数式 API（推荐用于简单场景）

```typescript
import { convertMarkdownToHtml } from '@md/converter'

const { html, readingTime, titleList } = convertMarkdownToHtml(
  `# Hello\n\nThis is **markdown**`,
  {
    primaryColor: `#3f51b5`,
    size: `18px`,
    isCountStatus: true,
  }
)

console.log(html)
console.log(readingTime)
console.log(titleList)
```

## API 文档

### MarkdownConverter 类

#### 方法

##### `init(options?: RendererInitOptions): this`

初始化渲染器，支持链式调用。

**参数：**

- `cssContent?: string` - 自定义 CSS 内容
- `theme?: any` - 主题配置对象
- `fonts?: string` - 字体族，默认为系统字体
- `size?: string` - 字体大小，默认 `'16px'`
- `primaryColor?: string` - 主题色，默认 `'#3f51b5'`
- `isUseIndent?: boolean` - 是否使用段落缩进，默认 `false`
- `isUseJustify?: boolean` - 是否使用两端对齐，默认 `false`
- `isMacCodeBlock?: boolean` - 是否使用 Mac 风格代码块，默认 `false`
- `isShowLineNumber?: boolean` - 是否显示代码行号，默认 `true`

##### `render(content: string, options?: RenderOptions): string`

渲染 Markdown 内容为 HTML。

**参数：**

- `content: string` - Markdown 文本内容
- `options?: RenderOptions` - 渲染选项
  - `isCiteStatus?: boolean` - 是否显示引用，默认 `false`
  - `legend?: string` - 图例模式，默认 `'alt'`
  - `isCountStatus?: boolean` - 是否显示字数统计，默认 `true`
  - 其他选项同 `init()`

**返回值：** `string` - 渲染后的 HTML

##### `updateTheme(options: Partial<RendererInitOptions>): void`

更新主题配置。

##### `getRenderer(): ReturnType<typeof initRenderer> | null`

获取底层渲染器实例。

##### `reset(): void`

重置渲染器状态。

##### `getResult(): ConvertResult`

获取完整的渲染结果对象。

#### 属性

- `output: string` - 渲染后的 HTML 内容
- `readingTime: ReadingStats` - 阅读时间统计
- `titleList: TitleItem[]` - 标题列表

### convertMarkdownToHtml 函数

```typescript
function convertMarkdownToHtml(
  content: string,
  options?: RendererInitOptions & RenderOptions
): ConvertResult
```

快速转换 Markdown 为 HTML 的函数式 API。

**返回值类型：**

```typescript
interface ConvertResult {
  html: string
  readingTime: ReadingStats
  titleList: TitleItem[]
}
```

## 类型定义

```typescript
interface ReadingStats {
  chars: number // 字符数
  words: number // 单词数
  minutes: number // 预计阅读时间（分钟）
}

interface TitleItem {
  url: string // 锚点链接
  title: string // 标题文本
  level: number // 标题级别（1-6）
}
```

## 示例

### 自定义主题

```typescript
import { MarkdownConverter } from '@md/converter'
import { themeMap } from '@md/shared/configs'

const converter = new MarkdownConverter()

converter.init({
  theme: themeMap.dark,
  primaryColor: `#00bcd4`,
  size: `18px`,
  fonts: `Georgia, serif`,
})

const html = converter.render(markdownContent)
```

### 动态更新主题

```typescript
const converter = new MarkdownConverter()
converter.init({ primaryColor: `#3f51b5` })

// 渲染内容
converter.render(content)

// 稍后更新主题
converter.updateTheme({ primaryColor: `#f44336` })

// 重新渲染
converter.render(content)
```

### 批量处理多个文档

```typescript
import { convertMarkdownToHtml } from '@md/converter'

const documents = [`# Doc 1`, `# Doc 2`, `# Doc 3`]

const results = documents.map(doc =>
  convertMarkdownToHtml(doc, {
    primaryColor: `#3f51b5`,
    size: `16px`,
  })
)

results.forEach((result, index) => {
  console.log(`Document ${index + 1}:`)
  console.log(`  Words: ${result.readingTime.words}`)
  console.log(`  Reading time: ${result.readingTime.minutes} min`)
  console.log(`  Headings: ${result.titleList.length}`)
})
```

## 依赖

### 核心依赖（自动安装）

- `@md/core` - 核心渲染引擎（已打包）
- `@md/shared` - 共享工具和类型（已打包）

### Peer Dependencies

以下依赖会在安装时自动安装：

- `marked` - Markdown 解析器
- `highlight.js` - 代码高亮
- `reading-time` - 阅读时间计算
- `front-matter` - Front Matter 解析
- `isomorphic-dompurify` - XSS 防护
- `mermaid` - 图表渲染（可选）
- `csstype` - CSS 类型定义
- `es-toolkit` - 工具函数
- `fflate` - 压缩库
- `postcss` - CSS 处理

## 故障排查

遇到问题？查看 [故障排查指南](./TROUBLESHOOTING.md) 获取常见问题的解决方案。

特别是如果遇到：
- `TypeError: util.inherits is not a function` - [查看解决方案](./TROUBLESHOOTING.md#-问题-1-typeerror-utilinherits-is-not-a-function)
- 导入失败 - [查看解决方案](./TROUBLESHOOTING.md#-问题-2-导入失败-cannot-find-module)
- 构建失败 - [查看解决方案](./TROUBLESHOOTING.md#-问题-3-构建失败)

## 许可证

MIT
