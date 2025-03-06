// 吉他谱数据服务
// 负责从GitHub仓库获取吉他谱数据结构

const REPO_OWNER = 'ronething' // 替换为你的GitHub用户名
const REPO_NAME = 'guitartabs' // 替换为你的仓库名称
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
const CONTENT_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master`
const headers = {
  'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
}

/**
 * 获取指定目录下的所有文件和文件夹
 * @param {string} path - 仓库中的路径，例如 'fingerStyle'
 * @returns {Promise<Array>} - 目录内容数组
 */
export async function getDirectoryContents(path) {
  // 检查缓存
  const cacheKey = `dir_cache_${path}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  // 如果缓存存在且未过期 24 小时，返回缓存数据
  const _timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
  console.log("timestamp is ",_timestamp)

  if (cachedData && Date.now() - parseInt(_timestamp) < 24 * 3600 * 1000) {
    console.log('使用缓存数据')
    return JSON.parse(cachedData);
  }
  
  try {
    const response = await fetch(`${API_BASE}/contents/${path}`, { headers });
    if (!response.ok) {
      throw new Error(`获取目录内容失败: ${response.statusText}`)
    }
    const data = await response.json();
    console.log('获取新数据');
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(`${cacheKey}_timestamp`, Date.now());
    
    return data;
  } catch (error) {
    console.error('获取目录内容出错:', error)
    return []
  }
}

/**
 * 构建吉他谱数据结构
 * @returns {Promise<Object>} - 吉他谱数据结构
 */
export async function buildGuitarTabsData() {
  try {
    // 获取指弹和弹唱分类
    const categories = {
      fingerStyle: { name: '指弹', artists: [] },
      singing: { name: '弹唱', artists: [] }
    }

    // 处理每个分类
    for (const categoryKey of Object.keys(categories)) {
      const artists = await getDirectoryContents(categoryKey)
      
      // 过滤出文件夹（艺术家）
      const artistFolders = artists.filter(item => item.type === 'dir')
      
      for (const artist of artistFolders) {
        const songs = await getDirectoryContents(`${categoryKey}/${artist.name}`)
        const songFolders = songs.filter(item => item.type === 'dir')
        
        const artistData = {
          name: artist.name,
          path: `${categoryKey}/${artist.name}`,
          songs: []
        }
        
        for (const song of songFolders) {
          const files = await getDirectoryContents(`${categoryKey}/${artist.name}/${song.name}`)
          
          const songData = {
            name: song.name,
            path: `${categoryKey}/${artist.name}/${song.name}`,
            files: files.map(file => ({
              name: file.name,
              path: `${categoryKey}/${artist.name}/${song.name}/${file.name}`,
              download_url: `${CONTENT_BASE}/${categoryKey}/${artist.name}/${song.name}/${file.name}`,
              type: file.name.split('.').pop().toLowerCase()
            }))
          }
          
          artistData.songs.push(songData)
        }
        
        categories[categoryKey].artists.push(artistData)
      }
    }
    
    return categories
  } catch (error) {
    console.error('构建吉他谱数据出错:', error)
    return {
      fingerStyle: { name: '指弹', artists: [] },
      singing: { name: '弹唱', artists: [] }
    }
  }
}

/**
 * 从URL获取并解析吉他谱文件
 * @param {string} url - 文件URL
 * @returns {Promise<ArrayBuffer>} - 文件内容
 */
export async function fetchTabFile(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`获取文件失败: ${response.statusText}`)
    }
    return await response.arrayBuffer()
  } catch (error) {
    console.error('获取文件出错:', error)
    throw error
  }
} 