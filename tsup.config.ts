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

  // 外部依赖（排除所有 npm 包，用户需要自行安装）
  external: [
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
    'dompurify',
  ],

  // 目标环境
  target: 'es2020',

  // 输出目录
  outDir: 'dist',

  // 保留模块的导入导出结构
  treeshake: true,

  // 打包 workspace 包，但不打包它们的依赖
  noExternal: [
    '@md/core',
    '@md/shared',
  ],
  
  // 平台配置
  platform: 'node',
  
  // 添加 shims 来处理 Node.js 内置模块
  shims: true,

  // CJS 导出配置，避免默认导出警告
  cjsInterop: true,
})
