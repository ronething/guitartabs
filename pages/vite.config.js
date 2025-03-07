import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const domain = 'https://tabs.online-guitartuner.com'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 改用函数方式处理sitemap和robots.txt
    {
      name: 'vite-plugin-simple-sitemap',
      apply: 'build',
      closeBundle: async () => {
        const fs = await import('fs');
        
        // 获取当前日期作为lastmod值
        const today = new Date().toISOString().split('T')[0];
        
        // 定义网站URLs数组，便于维护和扩展
        const urls = [
          { url: '/', changefreq: 'weekly', priority: '1.0' },
          { url: '/en/', changefreq: 'weekly', priority: '0.9' },
          { url: '/zh/', changefreq: 'weekly', priority: '0.9' },
          { url: '/fingerstyle/', changefreq: 'weekly', priority: '0.8' },
          { url: '/singing/', changefreq: 'weekly', priority: '0.8' },
          // 可以在这里添加更多URL
        ];
        
        // 生成sitemap.xml
        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

        // 动态生成URL条目
        urls.forEach(item => {
          sitemapContent += `  <url>
    <loc>${domain}${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>
`;
        });
        
        sitemapContent += '</urlset>';
        
        // 生成robots.txt
        const robots = `# robots.txt for ${domain}
User-agent: *
Allow: /

# 不允许爬虫访问特定目录（如有需要）
# Disallow: /admin/
# Disallow: /private/

# Sitemap
Sitemap: ${domain}/sitemap.xml`;
        
        // 创建dist目录（如果不存在）
        if (!fs.existsSync('./dist')) {
          fs.mkdirSync('./dist', { recursive: true });
        }
        
        // 输出到dist目录
        fs.writeFileSync('./dist/sitemap.xml', sitemapContent);
        fs.writeFileSync('./dist/robots.txt', robots);
        console.log('✅ sitemap.xml and robots.txt have been generated');
      }
    }
  ],
  server: {
    historyApiFallback: true, // 支持Vue Router的历史模式
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // 确保在GitHub Pages上正确加载资源
}) 
