// generateTabsData.js
// 从GitHub仓库获取所有吉他谱数据并生成JSON文件

const fs = require('fs');
const path = require('path');
const https = require('https');

// GitHub仓库信息
const REPO_OWNER = 'ronething';
const REPO_NAME = 'guitartabs';
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
const CONTENT_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master`;

// 从环境变量或命令行参数获取GitHub Token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('错误: 未设置GITHUB_TOKEN环境变量');
  process.exit(1);
}

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'User-Agent': 'Node.js'
};

/**
 * 发送HTTP请求获取数据
 * @param {string} url - API URL
 * @returns {Promise<Object>} - 响应数据
 */
async function fetchData(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`请求失败: ${res.statusCode} ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`解析JSON失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * 获取指定目录下的所有文件和文件夹
 * @param {string} path - 仓库中的路径
 * @returns {Promise<Array>} - 目录内容数组
 */
async function getDirectoryContents(path) {
  try {
    const data = await fetchData(`${API_BASE}/contents/${path}`);
    return data;
  } catch (error) {
    console.error(`获取目录内容出错 (${path}):`, error.message);
    return [];
  }
}

/**
 * 构建吉他谱数据结构
 * @returns {Promise<Object>} - 吉他谱数据结构
 */
async function buildGuitarTabsData() {
  try {
    console.log('开始构建吉他谱数据...');
    
    // 获取指弹和弹唱分类
    const categories = {
      fingerStyle: { name: '指弹', artists: [] },
      singing: { name: '弹唱', artists: [] }
    };

    // 处理每个分类
    for (const categoryKey of Object.keys(categories)) {
      console.log(`正在处理分类: ${categoryKey}`);
      const artists = await getDirectoryContents(categoryKey);
      
      // 过滤出文件夹（艺术家）
      const artistFolders = artists.filter(item => item.type === 'dir');
      
      for (const artist of artistFolders) {
        console.log(`  - 艺术家: ${artist.name}`);
        const songs = await getDirectoryContents(`${categoryKey}/${artist.name}`);
        const songFolders = songs.filter(item => item.type === 'dir');
        
        const artistData = {
          name: artist.name,
          path: `${categoryKey}/${artist.name}`,
          songs: []
        };
        
        for (const song of songFolders) {
          console.log(`    - 歌曲: ${song.name}`);
          const files = await getDirectoryContents(`${categoryKey}/${artist.name}/${song.name}`);
          
          const songData = {
            name: song.name,
            path: `${categoryKey}/${artist.name}/${song.name}`,
            files: files.map(file => ({
              name: file.name,
              path: `${categoryKey}/${artist.name}/${song.name}/${file.name}`,
              download_url: `${CONTENT_BASE}/${categoryKey}/${artist.name}/${song.name}/${file.name}`,
              type: file.name.split('.').pop().toLowerCase()
            }))
          };
          
          artistData.songs.push(songData);
        }
        
        categories[categoryKey].artists.push(artistData);
      }
    }
    
    return categories;
  } catch (error) {
    console.error('构建吉他谱数据出错:', error);
    return {
      fingerStyle: { name: '指弹', artists: [] },
      singing: { name: '弹唱', artists: [] }
    };
  }
}

/**
 * 生成数据并保存到JSON文件
 */
async function generateTabsDataFile() {
  console.log('开始生成吉他谱数据文件...');
  try {
    // 创建输出目录
    const outputDir = path.resolve(__dirname, '../pages/public/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 构建数据
    const tabsData = await buildGuitarTabsData();
    
    // 生成带有时间戳的数据
    const dataWithTimestamp = {
      lastUpdated: new Date().toISOString(),
      data: tabsData
    };
    
    // 写入JSON文件
    fs.writeFileSync(
      path.join(outputDir, 'tabs-data.json'),
      JSON.stringify(dataWithTimestamp, null, 2)
    );
    
    console.log('数据文件生成成功!');
  } catch (error) {
    console.error('生成数据文件失败:', error);
    process.exit(1);
  }
}

// 执行生成
generateTabsDataFile(); 
