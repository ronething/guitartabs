# coding=utf-8
# 构建 readme

import os
import codecs
import datetime
from pathlib import Path
from urllib import parse

# 常量定义
Finger = 'fingerStyle'
Singer = 'singing'

class DirectionTree(object):
    """
    生成吉他谱项目的README.md文件
    结构如下:
    
    # 吉他谱收藏
    
    > 最后更新时间: 2023-04-01
    
    ## 指弹 (20首)
    
    | 演奏者 | 曲目 | 类型 | 
    |-------|------|-----|
    | 井草圣二 | [new day new life](url) | PDF |
    
    ## 弹唱 (15首)
    ...
    """

    def __init__(self, pathname='.', filename='README.md'):
        self.pathname = Path(pathname)
        self.filename = filename
        self.tree = ''
        self.stats = {
            Finger: {"count": 0, "artists": set(), "songs": []},
            Singer: {"count": 0, "artists": set(), "songs": []}
        }
    
    def generate_tree(self):
        # 添加标题和更新时间
        now = datetime.datetime.now()
        self.tree = f'# 吉他谱收藏\n\n'
        self.tree += f'> 最后更新时间: {now.strftime("%Y-%m-%d %H:%M")}\n\n'
        
        # 遍历指弹和弹唱目录
        for i in self.pathname.iterdir():
            if i.name == Finger or i.name == Singer:
                category_songs = []
                self.collect_stats(i, i.name, [], category_songs)
                
                # 添加分类标题和统计信息
                category_name = "指弹" if i.name == Finger else "弹唱"
                artist_count = len(self.stats[i.name]["artists"])
                song_count = self.stats[i.name]["count"]
                
                self.tree += f'## {category_name} ({song_count}首 / {artist_count}位艺术家)\n\n'
                
                # 添加表格头
                self.tree += '| 演奏者 | 曲目 | 类型 |\n'
                self.tree += '|-------|------|-----|\n'
                
                # 按艺术家名称排序
                category_songs.sort(key=lambda x: x[0])
                
                # 添加表格内容
                for artist, song, file_path, file_type in category_songs:
                    url = parse.quote(str(file_path))
                    self.tree += f'| {artist} | [{song}](./{url}) | {file_type.upper()} |\n'
                
                self.tree += '\n'
    
    def collect_stats(self, path, category, breadcrumbs, result_list):
        """收集统计信息并构建歌曲列表"""
        if path.is_file():
            if path.suffix.lower() in ['.md', '.pdf', '.jpg', '.png']:
                if len(breadcrumbs) >= 2:  # 至少有艺术家和歌曲名
                    artist = breadcrumbs[0]
                    song = breadcrumbs[1]
                    
                    self.stats[category]["count"] += 1
                    self.stats[category]["artists"].add(artist)
                    
                    file_type = path.suffix[1:]  # 移除点号
                    result_list.append((artist, song, path, file_type))
        
        elif path.is_dir():
            # 如果是艺术家或歌曲目录，添加到面包屑
            if path.name != category:
                new_breadcrumbs = breadcrumbs + [path.name]
            else:
                new_breadcrumbs = breadcrumbs
                
            for child in path.iterdir():
                self.collect_stats(child, category, new_breadcrumbs, result_list)

    def save_file(self):
        with open(self.filename, 'w', encoding='utf-8') as f:
            f.write(self.tree)


if __name__ == "__main__":
    dir_tree = DirectionTree()
    dir_tree.generate_tree()
    dir_tree.save_file()
