# 安装指南

## 📦 安装方式

### 方式 1: 从 GitHub 安装（推荐）

这是最简单的方式，适合大多数场景：

```bash
npm install git+https://github.com/liao666brant/md2html.git
```

**优点：**
- ✅ 自动安装所有依赖
- ✅ 自动构建
- ✅ 始终获取最新版本

**注意：**
- 首次安装可能需要几分钟（需要构建）
- 需要 Git 和 Node.js >= 22.16.0

### 方式 2: 从本地路径安装（开发/测试）

如果你在本地开发或测试：

```bash
# 克隆仓库
git clone https://github.com/liao666brant/md2html.git
cd md2html

# 安装依赖并构建
npm install
npm run build

# 在你的项目中引用
cd /path/to/your/project
npm install file:/path/to/md2html
```

或者在 `package.json` 中：

```json
{
  "dependencies": {
    "@zleap/md2html": "file:../path/to/md2html"
  }
}
```

### 方式 3: 从 npm 安装（如果已发布）

如果包已发布到 npm：

```bash
npm install @zleap/md2html
```

## 🔧 安装后验证

### 1. 检查包是否安装成功

```bash
npm list @zleap/md2html
```

应该显示：
```
your-project@1.0.0 /path/to/your/project
└── @zleap/md2html@1.0.0
```

### 2. 检查文件是否完整

```bash
ls node_modules/@zleap/md2html/dist
```

应该包含：
- `index.js`
- `index.cjs`
- `index.d.ts`
- `converter.js`
- `converter.cjs`
- `converter.d.ts`
- 以及对应的 `.map` 文件

### 3. 测试导入

创建 `test.js`:

```javascript
import { convertMarkdownToHtml } from '@zleap/md2html'

console.log('✅ 导入成功!')

const result = convertMarkdownToHtml('# Hello')
console.log('✅ 转换成功!')
console.log('HTML 长度:', result.html.length)
```

运行：
```bash
node test.js
```

如果看到成功消息，说明安装正确！

## 📋 系统要求

### 必需

- **Node.js**: >= 22.16.0
- **npm**: >= 10.x（或 pnpm >= 8.x / yarn >= 4.x）
- **操作系统**: macOS, Linux, Windows

### 推荐

- **内存**: >= 4GB（处理大文件时）
- **磁盘空间**: >= 100MB

### 检查版本

```bash
# 检查 Node.js 版本
node --version
# 应该显示 v22.16.0 或更高

# 检查 npm 版本
npm --version
# 应该显示 10.x 或更高
```

## 🚨 常见安装问题

### 问题 1: Node.js 版本过低

**错误：**
```
error Unsupported engine
```

**解决：**
```bash
# 使用 nvm 升级 Node.js
nvm install 22
nvm use 22

# 或使用 n
npm install -g n
n 22
```

### 问题 2: 构建失败

**错误：**
```
npm ERR! Build failed
```

**解决：**
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install git+https://github.com/liao666brant/md2html.git
```

### 问题 3: 权限错误

**错误：**
```
EACCES: permission denied
```

**解决：**
```bash
# 不要使用 sudo！修复 npm 权限
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 重新安装
npm install git+https://github.com/liao666brant/md2html.git
```

### 问题 4: Git 未安装

**错误：**
```
Error: git is not installed
```

**解决：**
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# 下载并安装 Git from https://git-scm.com/
```

### 问题 5: 依赖安装失败

**错误：**
```
npm ERR! peer dep missing
```

**解决：**
```bash
# 手动安装所有依赖
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

# 然后重新安装包
npm install git+https://github.com/liao666brant/md2html.git
```

## 📦 在不同包管理器中使用

### npm

```bash
npm install git+https://github.com/liao666brant/md2html.git
```

### pnpm

```bash
pnpm add git+https://github.com/liao666brant/md2html.git
```

### yarn

```bash
yarn add git+https://github.com/liao666brant/md2html.git
```

### bun

```bash
bun add git+https://github.com/liao666brant/md2html.git
```

## 🔄 更新到最新版本

### 更新已安装的包

```bash
# npm
npm update @zleap/md2html

# 或强制重新安装最新版本
npm install git+https://github.com/liao666brant/md2html.git --force

# pnpm
pnpm update @zleap/md2html

# yarn
yarn upgrade @zleap/md2html
```

### 检查当前版本

```bash
npm list @zleap/md2html
```

## 🗑️ 卸载

```bash
npm uninstall @zleap/md2html
```

## 📝 在项目中配置

### package.json 配置

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@zleap/md2html": "git+https://github.com/liao666brant/md2html.git"
  },
  "engines": {
    "node": ">=22.16.0"
  }
}
```

### .npmrc 配置（可选）

创建 `.npmrc` 文件来配置 npm：

```ini
# 使用最新版本
save-exact=false

# 自动安装 peer dependencies
auto-install-peers=true

# 提升依赖
shamefully-hoist=true
```

## 🔐 私有仓库安装

如果仓库是私有的：

### 使用 SSH

```bash
npm install git+ssh://git@github.com:liao666brant/md2html.git
```

### 使用 Personal Access Token

```bash
npm install git+https://<token>@github.com/liao666brant/md2html.git
```

### 配置 Git 凭证

```bash
# 配置 Git 凭证缓存
git config --global credential.helper cache

# 或使用 SSH key
ssh-add ~/.ssh/id_rsa
```

## 📚 下一步

安装成功后：

1. 查看 [快速开始](./QUICKSTART.md) 学习基本用法
2. 查看 [使用指南](./USAGE.md) 了解详细功能
3. 查看 [示例代码](./examples/) 获取实际案例
4. 查看 [API 文档](./README.md) 了解完整 API

## 🆘 获取帮助

如果遇到安装问题：

1. 查看 [故障排查指南](./TROUBLESHOOTING.md)
2. 检查 [GitHub Issues](https://github.com/liao666brant/md2html/issues)
3. 创建新的 Issue 寻求帮助

