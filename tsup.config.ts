import { defineConfig } from 'tsup'

export default defineConfig({
  // 入口文件
  entry: {
    index: 'src/index.ts',
    converter: 'src/converter.ts',
  },

  // 输出格式
  format: ['esm', 'cjs'],

  // 生成类型定义文件
  dts: true,

  // 代码分割
  splitting: false,

  // 生成 sourcemap
  sourcemap: true,

  // 清理输出目录
  clean: true,

  // 压缩代码（生产环境建议开启）
  minify: false,

  // 外部依赖（只排除真正的外部依赖，不排除 workspace 包）
  // 不列出 @md/core 和 @md/shared，它们会被打包进来
  external: [
    // 只排除真正的 npm 包
    'marked',
    'highlight.js',
    'reading-time',
    'front-matter',
    'isomorphic-dompurify',
    'mermaid',
    'csstype',
    'es-toolkit',
    'fflate',
    'postcss',
  ],

  // 目标环境
  target: 'es2020',

  // 输出目录
  outDir: 'dist',

  // 保留模块的导入导出结构
  treeshake: true,

  // 打包所有依赖（包括 @md/* workspace 包）
  noExternal: [
    '@md/core',
    '@md/shared',
  ],

  // CJS 导出配置，避免默认导出警告
  cjsInterop: true,
})
