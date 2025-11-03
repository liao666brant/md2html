import { initRenderer } from '@md/core';

/**
 * 标题项接口
 */
interface TitleItem {
    url: string;
    title: string;
    level: number;
}
/**
 * 阅读时间统计接口
 */
interface ReadingStats {
    chars: number;
    words: number;
    minutes: number;
}
/**
 * 渲染器初始化选项
 */
interface RendererInitOptions {
    /** 自定义 CSS 内容 */
    cssContent?: string;
    /** 主题配置 */
    theme?: any;
    /** 字体族 */
    fonts?: string;
    /** 字体大小 */
    size?: string;
    /** 主题色 */
    primaryColor?: string;
    /** 是否使用段落缩进 */
    isUseIndent?: boolean;
    /** 是否使用两端对齐 */
    isUseJustify?: boolean;
    /** 是否使用 Mac 风格代码块 */
    isMacCodeBlock?: boolean;
    /** 是否显示行号 */
    isShowLineNumber?: boolean;
}
/**
 * 渲染选项
 */
interface RenderOptions {
    /** 是否显示引用状态 */
    isCiteStatus?: boolean;
    /** 图例模式 */
    legend?: string;
    /** 是否使用段落缩进 */
    isUseIndent?: boolean;
    /** 是否使用两端对齐 */
    isUseJustify?: boolean;
    /** 是否显示字数统计 */
    isCountStatus?: boolean;
    /** 是否使用 Mac 风格代码块 */
    isMacCodeBlock?: boolean;
    /** 是否显示行号 */
    isShowLineNumber?: boolean;
}
/**
 * 渲染结果接口
 */
interface ConvertResult {
    /** 渲染后的 HTML */
    html: string;
    /** 阅读时间统计 */
    readingTime: ReadingStats;
    /** 标题列表 */
    titleList: TitleItem[];
}
/**
 * Markdown 转 HTML 转换器类
 * 独立的 Markdown 渲染器，不依赖任何框架
 */
declare class MarkdownConverter {
    private renderer;
    /** 输出的 HTML 内容 */
    output: string;
    /** 阅读时间统计 */
    readingTime: ReadingStats;
    /** 文章标题列表（用于生成目录） */
    titleList: TitleItem[];
    /**
     * 初始化渲染器
     * @param options 渲染器初始化选项
     * @returns 返回当前实例，支持链式调用
     */
    init(options?: RendererInitOptions): this;
    /**
     * 渲染 Markdown 内容为 HTML
     * @param content Markdown 文本内容
     * @param options 渲染选项
     * @returns 渲染后的 HTML 字符串
     */
    render(content: string, options?: RenderOptions): string;
    /**
     * 提取文章标题生成目录
     * @private
     */
    private extractTitles;
    /**
     * 更新主题配置
     * @param options 主题选项
     */
    updateTheme(options: Partial<RendererInitOptions>): void;
    /**
     * 获取渲染器实例
     * @returns 渲染器 API
     */
    getRenderer(): ReturnType<typeof initRenderer> | null;
    /**
     * 重置渲染器状态
     */
    reset(): void;
    /**
     * 获取完整的渲染结果
     * @returns 包含 HTML、阅读时间和标题列表的对象
     */
    getResult(): ConvertResult;
}
/**
 * 简化的函数式 API：直接将 Markdown 转换为 HTML
 * @param content Markdown 文本内容
 * @param options 可选配置，合并了初始化和渲染选项
 * @returns 渲染结果对象
 */
declare function convertMarkdownToHtml(content: string, options?: RendererInitOptions & RenderOptions): ConvertResult;

// @ts-ignore
export = MarkdownConverter;
export { type ConvertResult, MarkdownConverter, type ReadingStats, type RenderOptions, type RendererInitOptions, type TitleItem, convertMarkdownToHtml };
