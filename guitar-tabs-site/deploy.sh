#!/bin/sh

# 构建站点
echo "Building site..."
npm run build

# 检查是否有dist目录
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found!"
  exit 1
fi

# 创建临时目录来保存构建产物
echo "Creating temporary directory..."
TMP_DIR=$(mktemp -d)
cp -r dist/* $TMP_DIR/

# 切换到gh-pages分支
echo "Switching to gh-pages branch..."
git checkout gh-pages || git checkout -b gh-pages

# 删除当前分支上的文件（保留.git目录）
echo "Cleaning branch..."
find . -maxdepth 1 ! -name .git ! -name . -exec rm -rf {} \;

# 复制构建产物到当前目录
echo "Copying build files..."
cp -r $TMP_DIR/* .

# 删除临时目录
echo "Cleaning up..."
rm -rf $TMP_DIR

# 添加所有文件到Git
echo "Adding files to git..."
git add .

# 提交更改
echo "Committing changes..."
git commit -m "Deploy: $(date)"

# 推送到远程
echo "Pushing to remote..."
git push origin gh-pages

# 切回原来的分支
echo "Switching back to original branch..."
git checkout -

echo "Deployment complete!" 
