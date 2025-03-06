#!/bin/bash
mkdir -p guitar-tabs-site/.github/workflows
cat > guitar-tabs-site/.github/workflows/deploy.yml << 'EOL'
name: Build and Deploy

on:
  push:
    branches:
      - master
    paths:
      - 'fingerStyle/**'
      - 'singing/**'
      - 'guitar-tabs-site/**'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          cache-dependency-path: guitar-tabs-site/package-lock.json

      - name: Install Dependencies
        run: |
          cd guitar-tabs-site
          npm ci

      - name: Build
        run: |
          cd guitar-tabs-site
          npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: guitar-tabs-site/dist
          branch: gh-pages
EOL
echo "Created GitHub Actions workflow file" 