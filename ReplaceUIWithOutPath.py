from ast import If, IsNot, Not, Str
import json
from math import fabs
from multiprocessing.sharedctypes import Value
import numbers
from operator import is_not
from tokenize import Number, String
from turtle import position
import shutil
import os
import sys
import pathlib
from typing import Any, Dict, List

print("start >>>>>>>>>>>>>")

rootdir = os.getcwd();
##sys.argv[0]
##path = rootdir
ReplaceData = {
    '坐 标':'Transform',
    '角 度':'Angle',
    'Z系数':'Zorder',
    '锚 点':'Constraint',
    '水平方向':'HorizontalOrientation',
    '垂直方向':'VerticalOrientation',
    '自动布局拉伸适配':'AutoLayoutChildStretch',
    '自动布局边距':'AutoLayoutChildPadding',
    '名 字':'Name',
    'ID':'ID',
    '可用性':'Enable',
    '可见性':'Visible',
    '自动大小':'AutoSize',
    '设计分辨率':'DesignSize',
    'TS脚本':'TSScript',
    #'布局':'scriptpath',
    '文 本':'Text',
    '对 齐':'Constraint',
    '占位文本':'Hint',
    '焦点':'Focus',
    '字 体':'Font',
    '字体大小':'FontSize',
    '字体间距':'FontSpace',
    '字体颜色':'FontColor',
    '图片颜色':'ImageColor',
    '图片大小':'ImageSize',
    '图片边距':'ImagePadding',
    '绘制类型':'ImageDrawAs',
    '普通图片':'NormalTexture',
    '按压图片':'PressedTexture',
    '禁用图片':'DisabledTexture',
    '是否有过度模式':'HasTransition',
    '溢出隐藏':'Cliping',
    '布局':'AutoLayout',
    '开启自动布局':'AutoLayoutEnable',
    '图 片':'Image',
    '文本长度':'ContentLimit',
    '内容颜色':'ContentColor',
    '内容限制':'ContentLimit',
    '对齐方式':'TextAlign',
    '垂直对齐方式':'TextVerticalAlign',
    '水平显示':'TextShowMode',
    '自动换行':'WrapRule',
    '可 读':'ReadRule',
    '行高系数':'LineHeightPercentage',
    '填充区图片':'FillTexture',
    '滑动条图片':'SliderTexture',
    '滑动条背景图片':'SliderBgTexture',
    '填充类型':'UIFillStyle',

    '滑动最小值':'UISliderMin',
    '滑动最大值':'UISliderMax',
    '当前值':'CurrentValue',
    '当前百分比':'CurrentPercent',
    '取整':'ToInt',
    '滚动朝向':'ScrolDirection',
    '运动类型':'AnimationType',
    '是否有弹性':'SupportElastic',
    '弹性系数':'ElasticMultiplier',
    '边缘阴影':'ScrollBoxShadow',
    '滚动轴颜色':'ScrollAxisColor',
    '滚动轴宽度':'ScrollbarThickness',
    '始终显示滚动条':'ScrollBarAlwaysShow',
    '显示滚动条':'ScrollBarShow',
    '阴影颜色':'ShadowColor',
    '阴影偏移':'ShadowOffset',
    '进度条锚点类型':'ProgerssAnchor',
    '进度条偏移值':'ProgerssOffset',
    '字体描边颜色':'OutlineColor',
    '字体描边宽度':'OutlineSize',
    '脚本路径':'ScriptPath',
    '脚本ID':'ScriptGUID',
    '字形':'FontGlyph',
    '删除线':'FontStrikeline',
    '下划线':'FontUnderline',
    '摇杆数据':'JoyStickData',
    '默认图片':'JoyStyleNormal',
    '按下时图片':'JoyStyleTouch',
    '禁用时图片':'JoyStyleDisable',
    '摇杆名称':'JoystickName',
    '摇杆中心图片':'JoyCenterImage',
    '摇杆背景图片':'JoyBackGrondImage',
    '控制类型':'JoyControlType',
    '摇杆中心位置':'JoyCenterSize',
    '摇杆中心大小':'JoyVisualSize',
    '摇杆背景大小':'JoyThumbSize',
    '摇杆交互大小':'JoyInteractionSize',
    '摇杆输入缩放比例':'JoyInputScalSize',
    '是否防止重定位':'JoyPreventRecenter',
    '延迟时间':'JoyStartDelay',
    '是否被鼠标控制':'JoyControlByMouse',
    '淡隐时间':'JoyTimeUnitDeactive',
    '复位时间':'JoyTimeUnitReset',
    '激活透明度':'JoyActiveOpacity',
    '未激活透明度':'JoyInactiveOpacity',
    '输入比例':'TouchPadInputScale',
    '事件名称':'EventDelegate',
    '事件绑定':'EventBinds',
    '渲染锚点':'RenderPivot',
    '渲染错切':'RenderShear',
    '渲染透明':'RenderOpacity',
    '渲染缩放':'RenderScale',
    '渲染偏移':'RenderOffset',
    '渲染空白大小':'RenderBlankSizeScale',
}



CommanRedirect = {
            ("字形") :("字 体/字形"),
            ("内容颜色"):("字 体/内容颜色"),
            ("字体颜色"):("字 体/内容颜色"),
            ("阴影颜色"):("字 体/阴影颜色"),
            ("阴影偏移"):("字 体/阴影偏移"),
            ("字体描边颜色"):("字 体/字体描边颜色"),
            ("字体描边宽度"):("字 体/字体描边宽度"),
            ("对齐方式"):("字 体/对齐方式"),
            ("垂直对齐方式"):("字 体/垂直对齐方式"),
            ("是否有惯性"):("是否有弹性"),
            ("FontSize"):("../字体大小"),
}

InputBoxRedirect ={
            ("字形") :("字 体/字形"),
            ("字体颜色"):("字 体/内容颜色"),
            ("阴影颜色"):("字 体/阴影颜色"),
            ("阴影偏移"):("字 体/阴影偏移"),
            ("字体描边颜色"):("字 体/字体描边颜色"),
            ("字体描边宽度"):("字 体/字体描边宽度"),
            ("对齐方式"):("字 体/对齐方式"),
            ("垂直对齐方式"):("字 体/垂直对齐方式"),
            ("是否有惯性"):("是否有弹性"),
            ("FontSize"):("../字体大小"),
}


ReplaceNameMap = {
    # 'MWButton': 'DeprecatedButton',
    # 'MWGameButton': 'MWButton',
    'Template': 'Prefab',
}

def  LoadToJson(filename: Str)->json: 
    _file = open(filename, 'rb')
    #data = _file.read()
    #print(data)
    rootjson = json.load(_file)
    print("Load Json")
    return rootjson

def GetCleanName(Name :str):
    CC = Name.split('_')
    return CC[0]

def appenddic(a:dict,b:dict):
    for key in b:
        if b[key] and  not isinstance(b[key], (int,str,bool,float)):
            a[key] = {}
            appenddic(a[key],b[key])
        a[key] =b[key]

def Redirect(Data:Dict,Parent,OuterKey):
    Child = {}
    for key in Data:
        
        if isinstance(key,str) and key.__contains__('MWInputBox'):
            RedirectMap = InputBoxRedirect
        else:
            RedirectMap = CommanRedirect


        if RedirectMap.get(key):
            print('Redirect %s' % key)
            Dirs = RedirectMap.get(key).split('/')
            if  Dirs.__len__() ==1:
                Child[Dirs[0]] = Data[key]
                continue
            if Dirs.__len__() ==2 and Dirs[0]=='..':
                Parent[Dirs[1]] = Data[key]
                continue
            else:
                if OuterKey!= Dirs[0]:
                    print('Be Replace %s' % key)
                    if not Child.get(Dirs[0]):
                        Child[(Dirs[0])] = {}
                    Child[(Dirs[0])][Dirs[1]] = Data[key]
                    continue
               
        if Data[key] and not isinstance(Data[key], (int,str,bool,float)):
            if Child.get(key):
                print("find child key")
                temp = Redirect(Data[key],Child,key)
                appenddic(Child[key],temp)
                
                #print( json.dumps( temp,ensure_ascii=False))
                
            else:
                Child[key] = Redirect(Data[key],Child,key)
            continue
    
        Child[key] = Data[key]

    return Child    


def DeepCircleJson(Data):
    Child = {}
    for key in Data:
        oldname = GetCleanName(key)
        newname = key
        if ReplaceNameMap.get(oldname):
            print(oldname)
            if isinstance(newname,str):
                newname = newname.replace(oldname,ReplaceNameMap.get(oldname))
            
        if ReplaceData.get(key):
            print(key)
            Newkey = ReplaceData.get(key)
            if Data[key] and  not isinstance(Data[key], (int,str,bool,float)):
                
                Child[Newkey] = DeepCircleJson(Data[key])
                continue
            else:
                Child[Newkey] = Data[key]
            continue
        if Data[key] and  not isinstance(Data[key], (int,str,bool,float)):
            Child[newname] = DeepCircleJson(Data[key])
            continue
        
        Child[key] = Data[key]
    

    return Child




print("-------------------------")
print("-------------------------")
print("-------------------------")
print("-------------------------")
print("-------------------------")



def StartReplace(name):
    root=  LoadToJson(name)

    result1 = Redirect(root,{},'')
    result = DeepCircleJson(result1)
    _file = open(name, 'w', encoding='UTF-8-SIG')
    newfilestr = json.dumps( result,ensure_ascii=False)
    _file.write(newfilestr)
    return result
# NewData = StartReplace()

# newfilestr = json.dumps( NewData,ensure_ascii=False)
# print(newfilestr)

# _file = open('MainMobileEditor2.ui', 'w', encoding='UTF-8-SIG')
# _file.write(newfilestr)


walk_dir = rootdir##sys.argv[1]

print('walk_dir = ' + walk_dir)

#暂不提供 移动prefab文件夹的内容
# shutil.copytree()
# shutil.rmtree()

# If your current working directory may change during script execution, it's recommended to
# immediately convert program arguments to an absolute path. Then the variable root below will
# be an absolute path as well. Example:
# walk_dir = os.path.abspath(walk_dir)
print('walk_dir (absolute) = ' + os.path.abspath(walk_dir))

for root, subdirs, files in os.walk(walk_dir):
    #print('--\nroot = ' + root)

    #for subdir in subdirs:
        #print('\t- subdirectory ' + subdir)

    for filename in files:
        if filename == 'Main.ui':
            continue

        file_path = os.path.join(root, filename)
        if os.path.isfile(file_path):
            suffix = pathlib.Path(filename).suffix
            if suffix == '.ui':
                print('begin handle file abs path %s ' % file_path )
                StartReplace(file_path)
                
            
           
       


