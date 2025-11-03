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

  // 不设置 external，将所有依赖都打包进来
  // 这样用户不需要安装任何 peer dependencies
  external: [],

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
})
