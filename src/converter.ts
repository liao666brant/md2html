import { renderMarkdown as coreRenderMarkdown, customCssWithTemplate, customizeTheme, initRenderer, postProcessHtml } from '@md/core'
import { themeMap } from '@md/shared/configs'
import { css2json } from '@md/shared/utils'

/**
 * 标题项接口
 */
export interface TitleItem {
  url: string
  title: string
  level: number
}

/**
 * 阅读时间统计接口
 */
export interface ReadingStats {
  chars: number
  words: number
  minutes: number
}

/**
 * 渲染器初始化选项
 */
export interface RendererInitOptions {
  /** 自定义 CSS 内容 */
  cssContent?: string
  /** 主题配置 */
  theme?: any
  /** 字体族 */
  fonts?: string
  /** 字体大小 */
  size?: string
  /** 主题色 */
  primaryColor?: string
  /** 是否使用段落缩进 */
  isUseIndent?: boolean
  /** 是否使用两端对齐 */
  isUseJustify?: boolean
  /** 是否使用 Mac 风格代码块 */
  isMacCodeBlock?: boolean
  /** 是否显示行号 */
  isShowLineNumber?: boolean
}

/**
 * 渲染选项
 */
export interface RenderOptions {
  /** 是否显示引用状态 */
  isCiteStatus?: boolean
  /** 图例模式 */
  legend?: string
  /** 是否使用段落缩进 */
  isUseIndent?: boolean
  /** 是否使用两端对齐 */
  isUseJustify?: boolean
  /** 是否显示字数统计 */
  isCountStatus?: boolean
  /** 是否使用 Mac 风格代码块 */
  isMacCodeBlock?: boolean
  /** 是否显示行号 */
  isShowLineNumber?: boolean
}

/**
 * 渲染结果接口
 */
export interface ConvertResult {
  /** 渲染后的 HTML */
  html: string
  /** 阅读时间统计 */
  readingTime: ReadingStats
  /** 标题列表 */
  titleList: TitleItem[]
}

/**
 * Markdown 转 HTML 转换器类
 * 独立的 Markdown 渲染器，不依赖任何框架
 */
export class MarkdownConverter {
  private renderer: ReturnType<typeof initRenderer> | null = null

  /** 输出的 HTML 内容 */
  public output: string = ``

  /** 阅读时间统计 */
  public readingTime: ReadingStats = {
    chars: 0,
    words: 0,
    minutes: 0,
  }

  /** 文章标题列表（用于生成目录） */
  public titleList: TitleItem[] = []

  /**
   * 初始化渲染器
   * @param options 渲染器初始化选项
   * @returns 返回当前实例，支持链式调用
   */
  public init(options: RendererInitOptions = {}): this {
    const {
      cssContent = ``,
      theme = themeMap.default,
      fonts = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      size = `16px`,
      primaryColor = `#3f51b5`,
      isUseIndent = false,
      isUseJustify = false,
      isMacCodeBlock = false,
      isShowLineNumber = true,
    } = options

    const fontSize = Number(size.replace(`px`, ``))
    const themeConfig = cssContent
      ? customCssWithTemplate(
          css2json(cssContent),
          primaryColor,
          customizeTheme(theme, { fontSize, color: primaryColor }),
        )
      : customizeTheme(theme, { fontSize, color: primaryColor })

    this.renderer = initRenderer({
      theme: themeConfig,
      fonts,
      size,
      isUseIndent,
      isUseJustify,
      isMacCodeBlock,
      isShowLineNumber,
    })

    return this
  }

  /**
   * 渲染 Markdown 内容为 HTML
   * @param content Markdown 文本内容
   * @param options 渲染选项
   * @returns 渲染后的 HTML 字符串
   */
  public render(content: string, options: RenderOptions = {}): string {
    if (!this.renderer) {
      throw new Error(`渲染器未初始化，请先调用 init() 方法`)
    }

    const renderOptions = {
      citeStatus: options.isCiteStatus ?? false,
      legend: options.legend ?? `alt`,
      isUseIndent: options.isUseIndent ?? false,
      isUseJustify: options.isUseJustify ?? false,
      countStatus: options.isCountStatus ?? true,
      isMacCodeBlock: options.isMacCodeBlock ?? false,
      isShowLineNumber: options.isShowLineNumber ?? true,
    }

    // 重置渲染器配置
    this.renderer.reset(renderOptions)

    // 渲染 Markdown
    const { html: baseHtml, readingTime: readingTimeResult } = coreRenderMarkdown(content, this.renderer)

    // 更新统计信息
    this.readingTime.chars = content.length
    this.readingTime.words = readingTimeResult.words
    this.readingTime.minutes = Math.ceil(readingTimeResult.minutes)

    // 后处理 HTML
    this.output = postProcessHtml(baseHtml, readingTimeResult, this.renderer)

    // 提取标题
    this.extractTitles()

    return this.output
  }

  /**
   * 提取文章标题生成目录
   * @private
   */
  private extractTitles(): void {
    if (typeof document === `undefined`) {
      // 非浏览器环境，跳过标题提取
      this.titleList = []
      return
    }

    const div = document.createElement(`div`)
    div.innerHTML = this.output
    const list = div.querySelectorAll<HTMLElement>(`[data-heading]`)

    this.titleList = []
    let i = 0
    for (const item of list) {
      item.setAttribute(`id`, `${i}`)
      this.titleList.push({
        url: `#${i}`,
        title: `${item.textContent}`,
        level: Number(item.tagName.slice(1)),
      })
      i++
    }
    this.output = div.innerHTML
  }

  /**
   * 更新主题配置
   * @param options 主题选项
   */
  public updateTheme(options: Partial<RendererInitOptions>): void {
    if (!this.renderer) {
      console.warn(`渲染器未初始化`)
      return
    }

    const {
      cssContent = ``,
      theme = themeMap.default,
      fonts = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      size = `16px`,
      primaryColor = `#3f51b5`,
    } = options

    const fontSize = Number(size.replace(`px`, ``))
    const newTheme = cssContent
      ? customCssWithTemplate(
          css2json(cssContent),
          primaryColor,
          customizeTheme(theme, { fontSize, color: primaryColor }),
        )
      : customizeTheme(theme, { fontSize, color: primaryColor })

    this.renderer.setOptions({
      theme: newTheme,
      fonts,
      size,
    })
  }

  /**
   * 获取渲染器实例
   * @returns 渲染器 API
   */
  public getRenderer(): ReturnType<typeof initRenderer> | null {
    return this.renderer
  }

  /**
   * 重置渲染器状态
   */
  public reset(): void {
    this.output = ``
    this.readingTime = {
      chars: 0,
      words: 0,
      minutes: 0,
    }
    this.titleList = []
  }

  /**
   * 获取完整的渲染结果
   * @returns 包含 HTML、阅读时间和标题列表的对象
   */
  public getResult(): ConvertResult {
    return {
      html: this.output,
      readingTime: this.readingTime,
      titleList: this.titleList,
    }
  }
}

/**
 * 简化的函数式 API：直接将 Markdown 转换为 HTML
 * @param content Markdown 文本内容
 * @param options 可选配置，合并了初始化和渲染选项
 * @returns 渲染结果对象
 */
export function convertMarkdownToHtml(
  content: string,
  options: RendererInitOptions & RenderOptions = {},
): ConvertResult {
  const converter = new MarkdownConverter()

  // 提取初始化选项
  const initOptions: RendererInitOptions = {
    cssContent: options.cssContent,
    theme: options.theme,
    fonts: options.fonts,
    size: options.size,
    primaryColor: options.primaryColor,
    isUseIndent: options.isUseIndent,
    isUseJustify: options.isUseJustify,
    isMacCodeBlock: options.isMacCodeBlock,
    isShowLineNumber: options.isShowLineNumber,
  }

  // 提取渲染选项
  const renderOptions: RenderOptions = {
    isCiteStatus: options.isCiteStatus,
    legend: options.legend,
    isUseIndent: options.isUseIndent,
    isUseJustify: options.isUseJustify,
    isCountStatus: options.isCountStatus,
    isMacCodeBlock: options.isMacCodeBlock,
    isShowLineNumber: options.isShowLineNumber,
  }

  // 初始化并渲染
  converter.init(initOptions)
  converter.render(content, renderOptions)

  return converter.getResult()
}

/**
 * 默认导出转换器类
 */
export default MarkdownConverter
