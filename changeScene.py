import os
import re
import shutil

# 需要替换的字符串  key:旧api   value：新api

apiReplaceStr = {

}

# 需要优先替换的字符串
apiReplaceStrFirst = {

}

apiRegexList = {

}

sceneFirstReplaceStr = {
    r",{\\\"apiName\\\":\\\"hairsetMesh\\\",\\\"value\\\":\\\"\\\",\\\"saveFileType\\\":\\\"v1\\\"}":"",
    r",{\\\"apiName\\\":\\\"facesetMesh\\\",\\\"value\\\":\\\"\\\",\\\"saveFileType\\\":\\\"v1\\\"}":"",
}

sceneReplaceStr = {

    # 资源废弃修改 start

    '"Asset":"BlockingArea"' : '"Asset":"BlockingVolume"',
    '"Asset":"PostProcessAdvance"' : '"Asset":"PostProcess"',
    '"Asset":"NavMeshVolume"' : '"Asset":"NavigationVolume"',
    '"Asset":"RelativeEffect"' : '"Asset":"Effect"',
    '"Asset":"Thruster"' : '"Asset":"PhysicsThruster"',
    '"Asset":"PhysicsSports"' : '"Asset":"IntegratedMover"',
    '"Asset":"ProjectileLauncher"' : '"Asset":"ObjectLauncher"',
    '"Asset":"Camera"' : '"Asset":"MetaWorld_JSActor"',
    '"Asset":"HumanoidObject"' : '"Asset":"Character"',
    '"Asset":"104"' : '"Asset":"Sound"',
    '"Asset":"109"' : '"Asset":"PlayerStart"',
    '"Asset":"113"' : '"Asset":"Trigger"',
    '"Asset":"116"' : '"Asset":"Interactor"',
    '"Asset":"4301"' : '"Asset":"PointLight"',
    '"Asset":"117"' : '"Asset":"BlockingVolume"',
    '"Asset":"4306"' : '"Asset":"Effect"',
    '"Asset":"20191"' : '"Asset":"PhysicsThruster"',
    '"Asset":"20193"' : '"Asset":"NavigationVolume"',
    '"Asset":"21151"' : '"Asset":"PostProcess"',
    '"Asset":"108547"' : '"Asset":"ObjectLauncher"',
    '"Asset":"119918"' : '"Asset":"IntegratedMover"',
    '"Asset":"28449"' : '"Asset":"Character"',
    '"Asset":"31969"' : '"Asset":"Character"',
    '"Asset":"124744"' : '"Asset":"Character"',
    '"Asset":"110"' : '"Asset":"Character"',
    '"Asset":"8444"' : '"Asset":"Character"',
    '"Asset":"14971"' : '"Asset":"SkyBox"',
    '"Asset":"12683"' : '"Asset":"SwimmingVolume"',
    '"Asset":"16037"' : '"Asset":"UIWidget"',
    '"Asset":"16038"' : '"Asset":"WheeledVehicle4W"',
    '"Asset":"20504"' : '"Asset":"PhysicsFulcrum"',
    '"Asset":"20194"' : '"Asset":"NavModifierVolume"',
    '"Asset":"20638"' : '"Asset":"HotWeapon"',
    '"Asset":"25782"' : '"Asset":"Anchor"',
    '"Asset":"67455"' : '"Asset":"PhysicsImpulse"',
    '"Asset":"NPC"': '"Asset":"Character"',
    '"Asset":"HumanoidObject_V2"':'"Asset":"Character"',

    '"Asset": "HumanoidObject_V2"' : '"Asset":"Character"',
    '"Asset": "NPC"' : '"Asset":"Character"',
    '"Asset": "BlockingArea"' : '"Asset":"BlockingVolume"',
    '"Asset": "PostProcessAdvance"' : '"Asset":"PostProcess"',
    '"Asset": "NavMeshVolume"' : '"Asset":"NavigationVolume"',
    '"Asset": "RelativeEffect"' : '"Asset":"Effect"',
    '"Asset": "Thruster"' : '"Asset":"PhysicsThruster"',
    '"Asset": "PhysicsSports"' : '"Asset":"IntegratedMover"',
    '"Asset": "ProjectileLauncher"' : '"Asset":"ObjectLauncher"',
    '"Asset": "Camera"' : '"Asset":"MetaWorld_JSActor"',
    '"Asset": "HumanoidObject"' : '"Asset":"Character"',
    '"Asset": "104"' : '"Asset":"Sound"',
    '"Asset": "109"' : '"Asset":"PlayerStart"',
    '"Asset": "113"' : '"Asset":"Trigger"',
    '"Asset": "116"' : '"Asset":"Interactor"',
    '"Asset": "4301"' : '"Asset":"PointLight"',
    '"Asset": "117"' : '"Asset":"BlockingVolume"',
    '"Asset": "4306"' : '"Asset":"Effect"',
    '"Asset": "20191"' : '"Asset":"PhysicsThruster"',
    '"Asset": "20193"' : '"Asset":"NavigationVolume"',
    '"Asset": "21151"' : '"Asset":"PostProcess"',
    '"Asset": "108547"' : '"Asset":"ObjectLauncher"',
    '"Asset": "119918"' : '"Asset":"IntegratedMover"',
    '"Asset": "28449"' : '"Asset":"Character"',
    '"Asset": "31969"' : '"Asset":"Character"',
    '"Asset": "124744"' : '"Asset":"Character"',
    '"Asset": "110"' : '"Asset":"Character"',
    '"Asset": "8444"' : '"Asset":"Character"',
    '"Asset": "14971"' : '"Asset":"SkyBox"',
    '"Asset": "12683"' : '"Asset":"SwimmingVolume"',
    '"Asset": "16037"' : '"Asset":"UIWidget"',
    '"Asset": "16038"' : '"Asset":"WheeledVehicle4W"',
    '"Asset": "20504"' : '"Asset":"PhysicsFulcrum"',
    '"Asset": "20194"' : '"Asset":"NavModifierVolume"',
    '"Asset": "20638"' : '"Asset":"HotWeapon"',
    '"Asset": "25782"' : '"Asset":"Anchor"',
    '"Asset": "67455"' : '"Asset":"PhysicsImpulse"',
    
    # 资源废弃修改 end

    "BP_HumanoidObject_V2" : "BP_Npc",
    '"ScriptAsset":"Camera"' : '"ScriptAsset":"CameraSetting"',
    '"ScriptAsset": "Camera"' : '"ScriptAsset": "CameraSetting"',
    "HumanoidObject_V2":"Character",

}


sceneRegexList = {

    r'"Asset":"HumanoidObject_V2"':'"Asset":"Character"',

    r'"Asset":"NPC"': '"Asset":"Character"', 

    r',"NPC",': ',"Character",', 

    r'"characterEditorDataJson":"{\\"realData\\":\\"\[{\\\\\\"apiName\\\\\\":\\\\\\"changeCharacter\\\\\\",\\\\\\"value\\\\\\":\\\\\\"(\w+)\\\\\\",\\\\\\"saveFileType\\\\\\":\\\\\\"(\w+)\\\\\\"},{\\\\\\"apiName\\\\\\":\\\\\\"trunksetMesh\\\\\\",\\\\\\"value\\\\\\":\\\\\\"(\d+)\\\\\\",\\\\\\"saveFileType\\\\\\":\\\\\\"(\w+)\\\\\\"}]\\",\\"characterType\\":\\"(\w+)\\",\\"basicStance\\":\\"(\d+)\\",\\"version\\":\\"2.1\\"}"'
    : '"characterEditorDataJson":"{\\"data\\":[14352639,\\3],\\"littleEndian\\":1,\\"basicStance\\":\\"\\6\\",\\"version\\":\\"2.2\\"}"',

}



scenefileNameList = []



apifileNameList = []



def delete_dir(dir_path):


    # 先判断该文件夹是否存在，若不存在，结束函数，若存在，则返回列表


    if os.path.exists(dir_path):


        dir_list = os.listdir(dir_path)  # os.listdir 函数用来列出指定文件夹里的文件名
    else:

        return


    for i in dir_list:

        # 构造文件路径

        full_path = os.path.join(dir_path, i)

        # 对列表里的每一项进行判别，对文件夹路径进行递归，对文件路径进行删除

        if os.path.isdir(full_path):

            delete_dir(full_path)
        else:

            os.remove(full_path)



    # 执行删除文件夹操作

    os.rmdir(dir_path)


def file_name(file_dir):   


    for root, dirs, files in os.walk(file_dir):   

        # root: 当前目录路径

        # dirs: 当前路径下的所有子目录 

        # files: 当前路径下的所有非目录子文件 

        for fileName in files:

            if os.path.splitext(fileName)[1] == '.level' or os.path.splitext(fileName)[1] == '.prefab' or fileName == 'All_Json':

                scenefileNameList.append(os.path.join(root,fileName))

    return 

def replace(content):


    # 替换字符串
    for k, v in sceneFirstReplaceStr.items():

        content = content.replace(k, v)


    for k, v in sceneRegexList.items():

        content = re.sub(k, v, content)


    for k, v in sceneReplaceStr.items():

        content = content.replace(k, v)


    return content



def replaceApi(content):

    for k, v in apiReplaceStrFirst.items():

        content = content.replace(k, v)

    for k, v in apiRegexList.items():

        content = re.sub(k, v, content)

    for k, v in apiReplaceStr.items():

        content = content.replace(k, v)


    return content

def main():


    file_name(os.getcwd())


    if not os.path.exists('场景备份文件夹'):

            os.makedirs('场景备份文件夹')


    count = 0
    for fileName in scenefileNameList:

        try:
            with open(fileName, 'r',encoding='utf-8') as f:

                content = f.read()
                content = replace(content)
                f.close()
        except UnicodeDecodeError:
            with open(fileName, 'r',encoding='utf-16') as f:

                content = f.read()
                content = replace(content)
                f.close()



        #备份旧的文件
        count += 1

        shutil.copy(fileName,'场景备份文件夹')

        name = os.path.basename(fileName)
        
        print("正在修改场景文件",count,"/",len(scenefileNameList),"---->",name)

        #写入新的文件字符串

        with open(fileName,'w',encoding='utf-8') as f2:

            f2.write(content)

            f2.close()


if __name__ == '__main__':
    main()

    print("替换完毕！")

    # 调用函数，删除场景备份文件夹

    delete_dir('场景备份文件夹')
