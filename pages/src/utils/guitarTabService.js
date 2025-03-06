// 吉他谱数据服务
// 负责从静态JSON文件获取吉他谱数据结构

// 静态数据文件路径
const DATA_FILE_PATH = '/data/tabs-data.json';

// 全局缓存
let cachedTabsData = null;
let cachedLastUpdated = null;

/**
 * 从静态JSON文件加载吉他谱数据
 * @returns {Promise<Object>} - 吉他谱数据结构
 */
async function loadTabsData() {
  // 如果已有缓存数据，直接返回
  if (cachedTabsData) {
    return cachedTabsData;
  }
  
  try {
    const response = await fetch(DATA_FILE_PATH);
    if (!response.ok) {
      throw new Error(`加载数据文件失败: ${response.statusText}`);
    }
    
    const data = await response.json();
    cachedTabsData = data.data;
    cachedLastUpdated = data.lastUpdated;
    
    console.log(`数据已加载，最后更新时间: ${cachedLastUpdated}`);
    return cachedTabsData;
  } catch (error) {
    console.error('加载吉他谱数据出错:', error);
    return {
      fingerStyle: { name: '指弹', artists: [] },
      singing: { name: '弹唱', artists: [] }
    };
  }
}

/**
 * 获取数据最后更新时间
 * @returns {Promise<string>} - 最后更新时间字符串
 */
export async function getLastUpdated() {
  if (!cachedLastUpdated) {
    await loadTabsData();
  }
  return cachedLastUpdated;
}

/**
 * 获取指定目录下的所有文件和文件夹
 * @param {string} path - 仓库中的路径，例如 'fingerStyle'
 * @returns {Promise<Array>} - 目录内容数组
 */
export async function getDirectoryContents(path) {
  await loadTabsData();
  
  // 解析路径
  const pathParts = path.split('/').filter(part => part);
  
  // 如果是顶级分类（fingerStyle或singing）
  if (pathParts.length === 1 && cachedTabsData[pathParts[0]]) {
    const category = cachedTabsData[pathParts[0]];
    return category.artists.map(artist => ({
      name: artist.name,
      path: artist.path,
      type: 'dir'
    }));
  }
  
  // 如果是艺术家目录
  if (pathParts.length === 2) {
    const [category, artist] = pathParts;
    const artistData = cachedTabsData[category]?.artists.find(a => a.name === artist);
    
    if (artistData) {
      return artistData.songs.map(song => ({
        name: song.name,
        path: song.path,
        type: 'dir'
      }));
    }
  }
  
  // 如果是歌曲目录
  if (pathParts.length === 3) {
    const [category, artist, song] = pathParts;
    const artistData = cachedTabsData[category]?.artists.find(a => a.name === artist);
    const songData = artistData?.songs.find(s => s.name === song);
    
    if (songData) {
      return songData.files.map(file => ({
        name: file.name,
        path: file.path,
        download_url: file.download_url,
        type: 'file'
      }));
    }
  }
  
  return [];
}

/**
 * 构建吉他谱数据结构
 * @returns {Promise<Object>} - 吉他谱数据结构
 */
export async function buildGuitarTabsData() {
  // 直接返回已加载的数据
  return await loadTabsData();
}

/**
 * 从URL获取并解析吉他谱文件
 * @param {string} url - 文件URL
 * @returns {Promise<ArrayBuffer>} - 文件内容
 */
export async function fetchTabFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取文件失败: ${response.statusText}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error('获取文件出错:', error);
    throw error;
  }
} 