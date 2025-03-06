# 吉他谱收藏网站

这是一个用于展示吉他谱收藏的静态网站，基于Vue.js和Tailwind CSS构建。

## 功能特点

- 美观的用户界面，响应式设计
- 分类浏览（指弹、弹唱）
- 按艺术家浏览曲目
- 支持查看和下载PDF、图片等格式的吉他谱

## 开发指南

### 环境要求

- Node.js 16+
- npm 8+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 部署

项目使用GitHub Actions自动部署到GitHub Pages。每当主分支有更新时，会自动构建并部署最新版本。

## 自定义

- 修改`src/utils/guitarTabService.js`中的仓库信息
- 替换`src/assets/guitar-hero.jpg`为你喜欢的吉他背景图片
- 根据需要调整UI组件和样式

## 许可证

MIT 