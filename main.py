# coding=utf-8
# 构建 readme

import os
import codecs
from pathlib import Path

# const
Finger = 'fingerStyle'
Singer = 'singing'


class DirectionTree(object):
    """
    ## 指弹  1

    ### 歌手 2

    #### 歌曲名 3

    - 文件列表 README.md url 4

    ## 弹唱
    """

    def __init__(self, pathname='.', filename='README.md'):
        self.pathname = Path(pathname)
        self.filename = filename
        self.tree = ''

    def generate_tree(self):
        for i in self.pathname.iterdir():
            if i.name == Finger or i.name == Singer:
                self.generate_tree_sub(sub_path=i, level=1)

    def generate_tree_sub(self, sub_path, level):
        if sub_path.is_file():
            if level == 4:
                if sub_path.suffix == '.md' or sub_path.suffix == '.pdf':
                    url = sub_path.parent.parent.joinpath(
                        sub_path.parent, sub_path)
                    self.tree += f'- [{sub_path.name}](./{url})\n\n'
        elif sub_path.is_dir():
            if level == 1:
                self.tree += f'## {sub_path.name}\n\n'
            elif level == 2:
                self.tree += f'### {sub_path.name}\n\n'
            elif level == 3:
                self.tree += f'#### {sub_path.name}\n\n'
            else:
                pass

            for cp in sub_path.iterdir():
                self.generate_tree_sub(cp, level+1)

    def save_file(self):
        with open(self.filename, 'w', encoding='utf-8') as f:
            f.write(self.tree)


if __name__ == "__main__":
    dir_tree = DirectionTree()
    dir_tree.generate_tree()
    # print(dir_tree.tree)
    dir_tree.save_file()
