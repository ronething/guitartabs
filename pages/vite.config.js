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
        
        // 生成sitemap.xml
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${domain}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/en/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/zh/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${domain}/fingerstyle/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/singing/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
        
        // 生成robots.txt
        const robots = `# robots.txt for ${domain}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${domain}/sitemap.xml`;
        
        // 输出到dist目录
        fs.writeFileSync('./dist/sitemap.xml', sitemap);
        fs.writeFileSync('./dist/robots.txt', robots);
        console.log('✅ sitemap.xml and robots.txt have been generated');
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // 确保在GitHub Pages上正确加载资源
}) 
