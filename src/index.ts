/**
 * @md/converter
 * Markdown 转 HTML 转换器包
 *
 * 提供独立的 Markdown 渲染功能，不依赖任何 UI 框架
 */

export {
  convertMarkdownToHtml,
  type ConvertResult,
  MarkdownConverter,
  type ReadingStats,
  type RendererInitOptions,
  type RenderOptions,
  type TitleItem,
} from './converter'

export { default } from './converter'
