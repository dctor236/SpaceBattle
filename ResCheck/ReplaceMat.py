import os
import time
import chardet


replaceMap = {
    '原材质GUID1': '新材质GUID1',
    '原材质GUID2': '新材质GUID2',
}

floders = ['Prefabs', 'Levels', 'TempPrefabs', 'JavaScripts']
pathList = []
totle = 0


def get_file_encoding(in_path):
    f = open(in_path, 'rb')
    data = f.read()
    file_encoding = chardet.detect(data).get('encoding')
    f.close()
    return file_encoding


def get_all_file_path(in_path):
    if not os.path.exists(in_path):
        return

    path_list = os.listdir(in_path)
    for p in path_list:
        fullpath = os.path.join(in_path, p)
        if os.path.isdir(fullpath):
            get_all_file_path(fullpath)
            continue
        if fullpath.endswith('.mat') or fullpath.endswith('.level') or fullpath.endswith('.prefab'):
            pathList.append(fullpath)


def init_path():
    project = os.path.abspath(os.path.dirname(os.getcwd()))
    print('项目路径:' + project)
    for p in floders:
        get_all_file_path(os.path.join(project, p))


def scan_file(in_path: str):
    if not os.path.exists(in_path):
        return
    encode = get_file_encoding(in_path)
    if encode == 'Windows-1254':
        encode = 'utf-8'
    global totle
    with open(in_path, "r", encoding=encode) as f:
        num = 0
        try:
            content = f.read()
        except:
            print(in_path, '读取异常')
            return
        for k, v in replaceMap.items():
            key = '\"' + k + '\"'
            res = '\"' + v + '\"'
            count = content.count(key)
            if count > 0:
                content = content.replace(key, res)
                print(in_path, "[ "+key+" ]替换为[ "+v+' ] '+str(num)+'个')
            num += count
        totle += num
        if num > 0:
            with open(in_path, "w", encoding=encode) as f:
                f.write(content)


if __name__ == '__main__':
    a = time.time()
    root = os.getcwd()
    if not root.endswith('ResCheck'):
        file = root+'/ResCheck'
        os.chdir(file)
    init_path()
    print(' 替换列表:' + str(replaceMap.__len__()))
    print(' 检测中...')
    for path in pathList:
        scan_file(path)
    if totle > 0:
        print(' 材质替换完成，共'+totle.__str__()+'处')
    else:
        print(' 没有可替换的了')
    a = time.time() - a
    print('use time : ' + str(a))
