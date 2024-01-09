import os
import re
import shutil

apiRegexList = {
    
    # HumanoidV2BehindHairPart
    r'\.behindHair\.getColor\(\)': '.description.advance.hair.backHair.color.color',
    r'\.behindHair\.getGradientColor\(\)': '.description.advance.hair.backHair.color.gradientColor',
    r'\.behindHair\.getGradientIntensity\(\)': '.description.advance.hair.backHair.color.gradientArea',
    r'\.behindHair\.getHeaddressColor\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].color.accessoryColor',
    r'\.behindHair\.getHeaddressDesignColor\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].design.designColor',
    r'\.behindHair\.getHeaddressDesignRotation\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].design.designRotation',
    r'\.behindHair\.getHeaddressDesignTexture\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].design.designStyle',
    r'\.behindHair\.getHeaddressDesignZoom\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].design.designScale',
    r'\.behindHair\.getHeaddressPatternAngle\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].pattern.patternRotation',
    r'\.behindHair\.getHeaddressPatternColor\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].pattern.patternColor',
    r'\.behindHair\.getHeaddressPatternHeight\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].pattern.patternVerticalScale',
    r'\.behindHair\.getHeaddressPatternTexture\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].pattern.patternStyle',
    r'\.behindHair\.getHeaddressPatternWidth\((.*?)\)': '.description.advance.hair.backHair.accessories[\\1].pattern.patternHorizontalScale',
    r'\.behindHair\.getHighlightColor\(\)': '.description.advance.hair.backHair.highlight.highlightStyle', # 等悦吾大哥
    r'\.behindHair\.getHighlightMask\(\)': '.description.advance.hair.backHair.highlight.highlightStyle',
    r'\.behindHair\.getMesh\(\)': '.description.advance.hair.backHair.style',
    r'\.behindHair\.setColor\((.*?)\)': '.description.advance.hair.backHair.color.color = \\1',
    r'\.behindHair\.setGradientColor\((.*?)\)': '.description.advance.hair.backHair.color.gradientColor = \\1',
    r'\.behindHair\.setGradientIntensity\((.*?)\)': '.description.advance.hair.backHair.color.gradientArea = \\1',
    r'\.behindHair\.setHeaddressColor\((.*?)\)': '.description.advance.hair.backHair.accessories[index].color.accessoryColor = \\1',
    r'\.behindHair\.setHeaddressDesignColor\((.*?)\)': '.description.advance.hair.backHair.accessories[index].design.designColor = \\1',
    r'\.behindHair\.setHeaddressDesignRotation\((.*?)\)': '.description.advance.hair.backHair.accessories[index].design.designRotation = \\1',
    r'\.behindHair\.setHeaddressDesignTexture\((.*?)\)': '.description.advance.hair.backHair.accessories[index].design.designStyle = \\1',
    r'\.behindHair\.setHeaddressDesignZoom\((.*?)\)': '.description.advance.hair.backHair.accessories[index].design.designScale = \\1',
    r'\.behindHair\.setHeaddressPatternAngle\((.*?)\)': '.description.advance.hair.backHair.accessories[index].pattern.patternRotation = \\1',
    r'\.behindHair\.setHeaddressPatternColor\((.*?)\)': '.description.advance.hair.backHair.accessories[index].pattern.patternColor = \\1',
    r'\.behindHair\.setHeaddressPatternHeight\((.*?)\)': '.description.advance.hair.backHair.accessories[index].pattern.patternVerticalScale = \\1',
    r'\.behindHair\.setHeaddressPatternIntensity\((.*?)\)': '.description.advance.hair.backHair.accessories[index].pattern.patternVisibility = \\1',
    r'\.behindHair\.setHeaddressPatternTexture\((.*?)\)': '.description.advance.hair.backHair.accessories[index].pattern.patternStyle = \\1',
    r'\.behindHair\.setHeaddressPatternWidth\((.*?)\)': '.description.advance.hair.backHair.accessories[index].pattern.patternHorizontalScale = \\1',
    r'\.behindHair\.setHighlightColor\((.*?)\)': '.description.advance.hair.backHair.highlight.highlightStyle = \\1',
    r'\.behindHair\.setHighlightMask\((.*?)\)': '.description.advance.hair.backHair.highlight.highlightStyle = \\1',
    r'\.behindHair\.setMesh\((.*?)\)': '.description.advance.hair.backHair.style = \\1',

    # HumanoidV2ClothPart 无替换

    # HumanoidV2FrontHairPart
    r'\.frontHair\.getColor\(\)': '.description.advance.hair.frontHair.color.color',
    r'\.frontHair\.getGradientColor\(\)': '.description.advance.hair.frontHair.color.gradientColor',
    r'\.frontHair\.getGradientIntensity\(\)': '.description.advance.hair.frontHair.color.gradientArea',
    r'\.frontHair\.getHeaddressColor\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].color.accessoryColor',
    r'\.frontHair\.getHeaddressDesignColor\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].design.designStyle',
    r'\.frontHair\.getHeaddressDesignRotation\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].design.designRotation',
    r'\.frontHair\.getHeaddressDesignTexture\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].design.designStyle',
    r'\.frontHair\.getHeaddressDesignZoom\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].design.designScale',
    r'\.frontHair\.getHeaddressPatternAngle\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].pattern.patternRotation',
    r'\.frontHair\.getHeaddressPatternColor\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].pattern.patternColor',
    r'\.frontHair\.getHeaddressPatternHeight\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].pattern.patternVerticalScale',
    r'\.frontHair\.getHeaddressPatternIntensity\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].pattern.patternVisibility',
    r'\.frontHair\.getHeaddressPatternTexture\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].pattern.patternStyle',
    r'\.frontHair\.getHeaddressPatternWidth\((.*?)\)': '.description.advance.hair.frontHair.accessories[\\1].pattern.patternHorizontalScale',
    r'\.frontHair\.getHighlightColor\(\)': '.description.advance.hair.frontHair.highlight.highlightStyle', # 等悦吾大哥
    r'\.frontHair\.getHighlightMask\(\)': '.description.advance.hair.frontHair.highlight.highlightStyle',
    r'\.frontHair\.getMesh\(\)': '.description.advance.hair.frontHair.style',
    r'\.frontHair\.setColor\((.*?)\)': '.description.advance.hair.frontHair.color.color = \\1',
    r'\.frontHair\.setGradientColor\((.*?)\)': '.description.advance.hair.frontHair.color.gradientColor = \\1',
    r'\.frontHair\.setGradientIntensity\((.*?)\)': '.description.advance.hair.frontHair.color.gradientArea = \\1',
    r'\.frontHair\.setHeaddressColor\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].design.designColor = \\1',
    r'\.frontHair\.setHeaddressDesignColor\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].design.designColor = \\1',
    r'\.frontHair\.setHeaddressDesignRotation\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].design.designRotation = \\1',
    r'\.frontHair\.setHeaddressDesignTexture\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].design.designStyle = \\1',
    r'\.frontHair\.setHeaddressDesignZoom\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].design.designScale = \\1',
    r'\.frontHair\.setHeaddressPatternAngle\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].pattern.patternRotation = \\1',
    r'\.frontHair\.setHeaddressPatternColor\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].pattern.patternColor = \\1',
    r'\.frontHair\.setHeaddressPatternHeight\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].pattern.patternVerticalScale = \\1',
    r'\.frontHair\.setHeaddressPatternIntensity\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].pattern.patternVisibility = \\1',
    r'\.frontHair\.setHeaddressPatternTexture\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].pattern.patternStyle = \\1',
    r'\.frontHair\.setHeaddressPatternWidth\((.*?)\)': '.description.advance.hair.frontHair.accessories[index].pattern.patternHorizontalScale = \\1',
    r'\.frontHair\.setHighlightColor\((.*?)\)': '.description.advance.hair.frontHair.highlight.highlightStyle = \\1',
    r'\.frontHair\.setHighlightMask\((.*?)\)': '.description.advance.hair.frontHair.highlight.highlightStyle = \\1',
    r'\.frontHair\.setMesh\((.*?)\)': '.description.advance.hair.frontHair.style = \\1',

    # HumanoidV2GlovesPart
    r'\.gloves\.getColor\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].color.areaColor',
    r'\.gloves\.getDesignAngle\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].design.designRotation',
    r'\.gloves\.getDesignColor\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].design.designColor',
    r'\.gloves\.getDesignTexture\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].design.designStyle',
    r'\.gloves\.getMesh\(\)': '.description.advance.clothing.gloves.style',
    r'\.gloves\.getPatternAngle\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].pattern.patternRotation',
    r'\.gloves\.getPatternColor\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].pattern.patternColor',
    r'\.gloves\.getPatternHeight\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].pattern.patternVerticalScale',
    r'\.gloves\.getPatternIntensity\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].pattern.patternVisibility',
    r'\.gloves\.getPatternWidth\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].pattern.patternHorizontalScale',
    r'\.gloves\.getTexture\((.*?)\)': '.description.advance.clothing.gloves.part[\\1].pattern.patternStyle',
    r'\.gloves\.setColor\((.*?)\)': '.description.advance.clothing.gloves.part[index].color.areaColor = \\1',
    r'\.gloves\.setDesignAngle\((.*?)\)': '.description.advance.clothing.gloves.part[index].design.designRotation = \\1',
    r'\.gloves\.setDesignColor\((.*?)\)': '.description.advance.clothing.gloves.part[index].design.designColor = \\1',
    r'\.gloves\.setDesignTexture\((.*?)\)': '.description.advance.clothing.gloves.part[index].design.designStyle = \\1',
    r'\.gloves\.setMesh\((.*?)\)': '.description.advance.clothing.gloves.style = \\1',
    r'\.gloves\.setPatternAngle\((.*?)\)': '.description.advance.clothing.gloves.part[index].pattern.patternRotation = \\1',
    r'\.gloves\.setPatternColor\((.*?)\)': '.description.advance.clothing.gloves.part[index].pattern.patternColor = \\1',
    r'\.gloves\.setPatternHeight\((.*?)\)': '.description.advance.clothing.gloves.part[index].pattern.patternVerticalScale = \\1',
    r'\.gloves\.setPatternIntensity\((.*?)\)': '.description.advance.clothing.gloves.part[index].pattern.patternVisibility = \\1',
    r'\.gloves\.setPatternWidth\((.*?)\)': '.description.advance.clothing.gloves.part[index].pattern.patternHorizontalScale = \\1',
    r'\.gloves\.setTexture\((.*?)\)': '.description.advance.clothing.gloves.part[index].pattern.patternStyle = \\1',


    # HumanoidV2HairPart 无替换

    # HumanoidV2HeadPart
    # r'\.head\.characterFaceShadow' 无替换
    r'\.head\.getBlushColor\(\)': '.description.advance.makeup.blush.blushColor',
    r'\.head\.getBlushTexture\(\)': '.description.advance.makeup.blush.blushStyle',
    r'\.head\.getBrowColor\(\)': '.description.advance.makeup.eyebrows.eyebrowColor',
    r'\.head\.getBrowTexture\(\)': '.description.advance.makeup.eyebrows.eyebrowStyle',
    r'\.head\.getExpression\(\)': '.description.advance.headFeatures.expressions.changeExpression',
    # getEyeHighlightColor getEyeHighlightTexture 无替换
    r'\.head\.getEyeShadowColor\(\)': '.description.advance.makeup.eyeShadow.eyeshaowColor',
    r'\.head\.getEyeShadowTexture\(\)': '.description.advance.makeup.eyeShadow.eyeshadowStyle',
    r'\.head\.getEyeTexture\(\)': '.description.advance.makeup.coloredContacts.style.pupilStyle',
    r'\.head\.getEyelashColor\(\)': '.description.advance.makeup.eyelashes.eyelashColor',
    r'\.head\.getEyelashTexture\(\)': '.description.advance.makeup.eyelashes.eyelashStyle',
    r'\.head\.getFacialTattooColor\((.*?)\)': '.description.advance.makeup.faceDecal[\\1].decalColor',
    r'\.head\.getFacialTattooPositionX\((.*?)\)': '.description.advance.makeup.faceDecal[\\1].decalHorizontalShift',
    r'\.head\.getFacialTattooPositionY\((.*?)\)': '.description.advance.makeup.faceDecal[\\1].decalVerticalShift',
    r'\.head\.getFacialTattooRotation\((.*?)\)': '.description.advance.makeup.faceDecal[\\1].decalOverallRotation',
    r'\.head\.getFacialTattooType\((.*?)\)': '.description.advance.makeup.faceDecal[\\1].decalStyle',
    r'\.head\.getFacialTattooZoom\((.*?)\)': '.description.advance.makeup.faceDecal[\\1].decalOverallScale',
    r'\.head\.getHeadPatternColor\(\)': '.description.advance.makeup.headDecal.decalColor',
    r'\.head\.getHeadPatternTexture\(\)': '.description.advance.makeup.headDecal.decalStyle',
    r'\.head\.getLeftEyeColor\(\)': '.description.advance.makeup.coloredContacts.style.leftPupilColor',
    r'\.head\.getLipstickColor\(\)': '.description.advance.makeup.lipstick.lipstickColor',
    r'\.head\.getLipstickTexture\(\)': '.description.advance.makeup.lipstick.lipstickStyle',
    r'\.head\.getLowerEyeHighlightColor\(\)': '.description.advance.makeup.coloredContacts.highlight.lowerHighlightColor',
    r'\.head\.getLowerEyeHighlightTexture\(\)': '.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle',
    r'\.head\.getMesh\(\)': '.description.advance.headFeatures.head.style',
    r'\.head\.getPupilColor\(\)': '.description.advance.makeup.coloredContacts.decal.pupilColor',
    r'\.head\.getPupilPositionX\(\)': '.description.advance.makeup.coloredContacts.decal.pupilHorizontalPosition',
    r'\.head\.getPupilPositionY\(\)': '.description.advance.makeup.coloredContacts.decal.pupilVerticalPosition',
    # r'\.?head.getPupilRotate\(\)': '.description.advance.makeup.coloredContacts.decal.pupilVerticalPosition', 无替换
    r'\.head\.getPupilScale\(\)': '.description.advance.makeup.coloredContacts.decal.pupilSizeScale',
    r'\.head\.getPupilTexture\(\)': '.description.advance.makeup.coloredContacts.decal.pupilStyle',
    r'\.head\.getRightEyeColor\(\)': '.description.advance.makeup.coloredContacts.style.rightPupilColor',
    r'\.head\.getUpperEyeHighlightColor\(\)': '.description.advance.makeup.coloredContacts.highlight.upperHighlightColor',
    r'\.head\.getUpperEyeHighlightTexture\(\)': '.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle',
    r'\.head\.setBlushColor\((.*?)\)': '.description.advance.makeup.blush.blushColor = \\1',
    r'\.head\.setBlushTexture\((.*?)\)': '.description.advance.makeup.blush.blushStyle = \\1',
    r'\.head\.setBrowColor\((.*?)\)': '.description.advance.makeup.eyebrows.eyebrowColor = \\1',
    r'\.head\.setBrowTexture\((.*?)\)': '.description.advance.makeup.eyebrows.eyebrowStyle = \\1',
    #  setEyeHighlightColor setEyeHighlightTexture 无替换
    r'\.head\.setEyeShadowColor\((.*?)\)': '.description.advance.makeup.eyeShadow.eyeshaowColor = \\1',
    r'\.head\.setEyeShadowTexture\((.*?)\)': '.description.advance.makeup.eyeShadow.eyeshadowStyle = \\1',
    r'\.head\.setEyeTexture\((.*?)\)': '.description.advance.makeup.coloredContacts.style.pupilStyle = \\1',
    r'\.head\.setEyelashColor\((.*?)\)': '.description.advance.makeup.eyelashes.eyelashColor = \\1',
    r'\.head\.setEyelashTexture\((.*?)\)': '.description.advance.makeup.eyelashes.eyelashStyle = \\1',
    r'\.head\.setFacialTattooColor\((.*?)\)': '.description.advance.makeup.faceDecal[index].decalColor = \\1',
    r'\.head\.setFacialTattooPositionX\((.*?)\)': '.description.advance.makeup.faceDecal[index].decalHorizontalShift = \\1',
    r'\.head\.setFacialTattooPositionY\((.*?)\)': '.description.advance.makeup.faceDecal[index].decalVerticalShift = \\1',
    r'\.head\.setFacialTattooRotation\((.*?)\)': '.description.advance.makeup.faceDecal[index].decalOverallRotation = \\1',
    r'\.head\.setFacialTattooType\((.*?)\)': '.description.advance.makeup.faceDecal[index].decalStyle = \\1',
    r'\.head\.setFacialTattooZoom\((.*?)\)': '.description.advance.makeup.faceDecal[index].decalOverallScale = \\1',
    r'\.head\.setHeadPatternColor\((.*?)\)': '.description.advance.makeup.headDecal.decalColor = \\1',
    r'\.head\.setHeadPatternTexture\((.*?)\)': '.description.advance.makeup.headDecal.decalStyle = \\1',
    r'\.head\.setLeftEyeColor\((.*?)\)': '.description.advance.makeup.coloredContacts.style.leftPupilColor = \\1',
    r'\.head\.setLipstickColor\((.*?)\)': '.description.advance.makeup.lipstick.lipstickColor = \\1',
    r'\.head\.setLipstickTexture\((.*?)\)': '.description.advance.makeup.lipstick.lipstickStyle = \\1',
    r'\.head\.setLowerEyeHighlightColor\((.*?)\)': '.description.advance.makeup.coloredContacts.highlight.lowerHighlightColor = \\1',
    r'\.head\.setLowerEyeHighlightTexture\((.*?)\)': '.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle = \\1',
    r'\.head\.setMesh\((.*?)\)': '.description.advance.headFeatures.head.style = \\1',
    r'\.head\.setPupilColor\((.*?)\)': '.description.advance.makeup.coloredContacts.decal.pupilColor = \\1',
    r'\.head\.setPupilPositionX\((.*?)\)': '.description.advance.makeup.coloredContacts.decal.pupilHorizontalPosition = \\1',
    r'\.head\.setPupilPositionY\((.*?)\)': '.description.advance.makeup.coloredContacts.decal.pupilVerticalPosition = \\1',
    # setPupilRotate 无替换
    r'\.head\.setPupilScale\((.*?)\)': '.description.advance.makeup.coloredContacts.decal.pupilSizeScale = \\1',
    r'\.head\.setPupilTexture\((.*?)\)': '.description.advance.makeup.coloredContacts.decal.pupilStyle = \\1',
    r'\.head\.setRightEyeColor\((.*?)\)': '.description.advance.makeup.coloredContacts.style.rightPupilColor = \\1',
    r'\.head\.setUpperEyeHighlightColor\((.*?)\)': '.description.advance.makeup.coloredContacts.highlight.upperHighlightColor = \\1',
    r'\.head\.setUpperEyeHighlightTexture\((.*?)\)': '.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle = \\1',

    # HumanoidV2LowerClothPart
    r'\.lowerCloth\.getColor\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].color.areaColor',
    r'\.lowerCloth\.getDesignAngle\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].design.designRotation',
    r'\.lowerCloth\.getDesignColor\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].design.designColor',
    r'\.lowerCloth\.getDesignTexture\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].design.designStyle',
    r'\.lowerCloth\.getMesh\(\)': '.description.advance.clothing.lowerCloth.style',
    r'\.lowerCloth\.getPatternAngle\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].pattern.patternRotation',
    r'\.lowerCloth\.getPatternColor\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].pattern.patternColor',
    r'\.lowerCloth\.getPatternHeight\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].pattern.patternVerticalScale',
    r'\.lowerCloth\.getPatternIntensity\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].pattern.patternVisibility',
    r'\.lowerCloth\.getPatternWidth\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].pattern.patternHorizontalScale',
    r'\.lowerCloth\.getTexture\((.*?)\)': '.description.advance.clothing.lowerCloth.part[\\1].pattern.patternStyle',
    r'\.lowerCloth\.setColor\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].color.areaColor = \\1',
    r'\.lowerCloth\.setDesignAngle\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].design.designRotation = \\1',
    r'\.lowerCloth\.setDesignColor\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].design.designColor = \\1',
    r'\.lowerCloth\.setDesignTexture\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].design.designStyle = \\1',
    r'\.lowerCloth\.setMesh\((.*?)\)': '.description.advance.clothing.lowerCloth.style = \\1',
    r'\.lowerCloth\.setPatternAngle\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].pattern.patternRotation = \\1',
    r'\.lowerCloth\.setPatternColor\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].pattern.patternColor = \\1',
    r'\.lowerCloth\.setPatternHeight\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].pattern.patternVerticalScale = \\1',
    r'\.lowerCloth\.setPatternIntensity\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].pattern.patternVisibility = \\1',
    r'\.lowerCloth\.setPatternWidth\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].pattern.patternHorizontalScale = \\1',
    r'\.lowerCloth\.setTexture\((.*?)\)': '.description.advance.clothing.lowerCloth.part[index].pattern.patternStyle = \\1',

    # HumanoidV2Shape
    r'\.shape\.getBreastHorizontalPosition\(\)': '.description.advance.bodyFeatures.breast.breastHorizontalShift',
    r'\.shape\.getBreastLength\(\)': '.description.advance.bodyFeatures.breast.breastLength',
    r'\.shape\.getBreastScale\(\)': '.description.advance.bodyFeatures.breast.breastOverallScale',
    r'\.shape\.getBreastStretch\(\)': '.description.advance.bodyFeatures.chest.chestVerticalScale',
    r'\.shape\.getBreastVerticalPosition\(\)': '.description.advance.bodyFeatures.breast.breastVerticalShift',
    r'\.shape\.getBrowGap\(\)': '.description.advance.headFeatures.eyebrows.eyebrowHorizontalShift',
    r'\.shape\.getBrowHeight\(\)': '.description.advance.headFeatures.eyebrows.eyebrowVerticalShift',
    r'\.shape\.getBrowInboardShape\(\)': '.description.advance.headFeatures.eyebrows.eyebrowInnerVerticalShift',
    r'\.shape\.getBrowOutsideShape\(\)': '.description.advance.headFeatures.eyebrows.eyebrowOuterVerticalShift',
    r'\.shape\.getBrowRotation\(\)': '.description.advance.headFeatures.eyebrows.eyebrowOverallRotation',
    r'\.shape\.getCanthusHorizontalPosition\(\)': '.description.advance.headFeatures.eyes.eyeCorners.outerEyeCornerVerticalShift',
    r'\.shape\.getCanthusVerticalPosition\(\)': '.description.advance.headFeatures.eyes.eyeCorners.innerEyeCornerHorizontalShift',
    r'\.shape\.getCharacterHeight\(\)': '.description.advance.bodyFeatures.body.height',
    r'\.shape\.getCheekBoneRange\(\)': '.description.advance.headFeatures.faceShape.cheekbone.cheekboneFrontalShift',
    r'\.shape\.getCheekBoneWidth\(\)': '.description.advance.headFeatures.faceShape.cheekbone.cheekboneHorizontalScale',
    r'\.shape\.getCheekHeight\(\)': '.description.advance.headFeatures.faceShape.cheek.cheekVerticalShift',
    r'\.shape\.getCheekRange\(\)': '.description.advance.headFeatures.faceShape.cheek.cheekFrontalShift',
    r'\.shape\.getCheekWidth\(\)': '.description.advance.headFeatures.faceShape.cheek.cheekHorizontalScale',
    r'\.shape\.getEarRoll\(\)': '.description.advance.headFeatures.ears.earHorizontalRotation',
    r'\.shape\.getEarScale\(\)': '.description.advance.headFeatures.ears.earOverallScale',
    r'\.shape\.getEarYaw\(\)': '.description.advance.headFeatures.ears.earFrontalRotation',
    r'\.shape\.getEyesGap\(\)': '.description.advance.headFeatures.eyes.overall.eyeHorizontalShift',
    r'\.shape\.getEyesHeight\(\)': '.description.advance.headFeatures.eyes.overall.eyeVerticalShift',
    r'\.shape\.getEyesLength\(\)': '.description.advance.headFeatures.eyes.overall.eyeVerticalScale',
    r'\.shape\.getEyesRange\(\)': '.description.advance.headFeatures.eyes.overall.eyeFrontalShift',
    r'\.shape\.getEyesRotation\(\)': '.description.advance.headFeatures.eyes.overall.eyeOverallRotation',
    r'\.shape\.getEyesWidth\(\)': '.description.advance.headFeatures.eyes.overall.eyeHorizontalScale',
    r'\.shape\.getFaceWidth\(\)': '.description.advance.headFeatures.faceShape.overall.faceHorizontalScale',
    r'\.shape\.getFootScale\(\)': '.description.advance.bodyFeatures.feet.feetOverallScale',
    r'\.shape\.getGroinThickness\(\)': '.description.advance.bodyFeatures.hips.hipFrontalScale',
    r'\.shape\.getGroinWidth\(\)': '.description.advance.bodyFeatures.hips.hipHorizontalScale',
    r'\.shape\.getHandScale\(\)': '.description.advance.bodyFeatures.hands.handOverallScale',
    r'\.shape\.getHeadScale\(\)': '.description.advance.headFeatures.head.headOverallScale',
    r'\.shape\.getJawLength\(\)': '.description.advance.headFeatures.faceShape.jawline.jawlineVerticalShift',
    r'\.shape\.getJawRange\(\)': '.description.advance.headFeatures.faceShape.chin.chinFrontalShift',
    r'\.shape\.getJawSmooth\(\)': '.description.advance.headFeatures.faceShape.jawline.jawlineRoundness',
    r'\.shape\.getJawVertexHeight\(\)': '.description.advance.headFeatures.faceShape.chin.chinTipVerticalShift',
    r'\.shape\.getJawVertexRange\(\)': '.description.advance.headFeatures.faceShape.chin.chinTipFrontalShift',
    r'\.shape\.getJawVertexWidth\(\)': '.description.advance.headFeatures.faceShape.chin.chinTipHorizontalScale',
    r'\.shape\.getLowerArmsStretch\(\)': '.description.advance.bodyFeatures.arms.forearmVerticalScale',
    r'\.shape\.getLowerArmsThickness\(\)': '.description.advance.bodyFeatures.arms.forearmFrontalScale',
    r'\.shape\.getLowerArmsWidth\(\)': '.description.advance.bodyFeatures.arms.forearmHorizontalScale',
    r'\.shape\.getLowerFaceRange\(\)': '.description.advance.headFeatures.faceShape.overall.lowerFaceFrontalShift',
    r'\.shape\.getLowerFaceWidth\(\)': '.description.advance.headFeatures.faceShape.overall.lowerFaceHorizontalScale',
    r'\.shape\.getLowerJawRange\(\)': '.description.advance.headFeatures.faceShape.jawline.jawFrontalShift',
    r'\.shape\.getLowerJawWidth\(\)': '.description.advance.headFeatures.faceShape.jawline.jawHorizontalScale',
    r'\.shape\.getLowerMouthThickness\(\)': '.description.advance.headFeatures.mouth.lips.lowerLipThickness',
    r'\.shape\.getLowerStretch\(\)': '.description.advance.headFeatures.ears.earLowerScale',
    r'\.shape\.getMouthHeight\(\)': '.description.advance.headFeatures.mouth.overall.mouthVerticalShift',
    r'\.shape\.getMouthRange\(\)': '.description.advance.headFeatures.mouth.overall.mouthFrontalShift',
    r'\.shape\.getMouthShape\(\)': '.description.advance.headFeatures.mouth.mouthCorners.mouthCornerVerticalShift',
    r'\.shape\.getMouthWidth\(\)': '.description.advance.headFeatures.mouth.overall.mouthHorizontalScale',
    r'\.shape\.getNeckStretch\(\)': '.description.advance.bodyFeatures.neck.neckVerticalScale',
    r'\.shape\.getNeckThickness\(\)': '.description.advance.bodyFeatures.neck.neckFrontalScale',
    r'\.shape\.getNeckWidth\(\)': '.description.advance.bodyFeatures.neck.neckHorizontalScale',
    r'\.shape\.getNoseHeight\(\)': '.description.advance.headFeatures.nose.noseBridge.noseBridgeFrontalShift',
    r'\.shape\.getNoseProtrusion\(\)': '.description.advance.headFeatures.nose.noseTip.noseTipVerticalShift',
    r'\.shape\.getNoseVerticalPosition\(\)': '.description.advance.headFeatures.nose.overall.noseOverallVerticalShift',
    r'\.shape\.getPupilHeight\(\)': '.description.advance.headFeatures.eyes.pupils.pupilVerticalScale',
    r'\.shape\.getPupilHorizontalPosition\(\)': '.description.advance.headFeatures.eyes.pupils.pupilHorizontalShift',
    r'\.shape\.getPupilVerticalPosition\(\)': '.description.advance.headFeatures.eyes.pupils.pupilVerticalShift',
    r'\.shape\.getPupilWidth\(\)': '.description.advance.headFeatures.eyes.pupils.pupilHorizontalScale',
    r'\.shape\.getRibThickness\(\)': '.description.advance.bodyFeatures.ribs.ribFrontalScale',
    r'\.shape\.getRibWidth\(\)': '.description.advance.bodyFeatures.ribs.ribHorizontalScale',
    r'\.shape\.getShankScaleX\(\)': '.description.advance.bodyFeatures.legs.calfHorizontalScale',
    r'\.shape\.getShankScaleZ\(\)': '.description.advance.bodyFeatures.legs.calfFrontalScale',
    r'\.shape\.getShankStretch\(\)': '.description.advance.bodyFeatures.legs.calfVerticalScale',
    r'\.shape\.getShoulderArmThickness\(\)': '.description.advance.bodyFeatures.arms.shoulderFrontalScale',
    r'\.shape\.getShoulderArmWidth\(\)': '.description.advance.bodyFeatures.arms.shoulderHorizontalScale',
    r'\.shape\.getShoulderThickness\(\)': '.description.advance.bodyFeatures.chest.chestFrontalScale',
    r'\.shape\.getShoulderWidth\(\)': '.description.advance.bodyFeatures.chest.chestHorizontalScale',
    r'\.shape\.getThighStretch\(\)': '.description.advance.bodyFeatures.legs.thighVerticalScale',
    r'\.shape\.getThighThicknessX\(\)': '.description.advance.bodyFeatures.legs.thighHorizontalScale',
    r'\.shape\.getThighThicknessZ\(\)': '.description.advance.bodyFeatures.legs.thighFrontalScale',
    r'\.shape\.getUpperArmsStretch\(\)': '.description.advance.bodyFeatures.arms.upperArmVerticalScale',
    r'\.shape\.getUpperArmsThickness\(\)': '.description.advance.bodyFeatures.arms.upperArmFrontalScale',
    r'\.shape\.getUpperArmsWidth\(\)': '.description.advance.bodyFeatures.arms.upperArmHorizontalScale',
    r'\.shape\.getUpperFaceRange\(\)': '.description.advance.headFeatures.faceShape.overall.upperFaceFrontalShift',
    r'\.shape\.getUpperMouthThickness\(\)': '.description.advance.headFeatures.mouth.lips.upperLipThickness',
    r'\.shape\.getUpperStretch\(\)': '.description.advance.headFeatures.ears.earUpperScale',
    r'\.shape\.getWaistStretch\(\)': '.description.advance.bodyFeatures.waist.waistVerticalScale',
    r'\.shape\.getWaistThickness\(\)': '.description.advance.bodyFeatures.waist.waistFrontalScale',
    r'\.shape\.getWaistWidth\(\)': '.description.advance.bodyFeatures.waist.waistHorizontalScale',

    r'\.shape\.setBreastHorizontalPosition\((.*?)\)': '.description.advance.bodyFeatures.breast.breastHorizontalShift = \\1',
    r'\.shape\.setBreastLength\((.*?)\)': '.description.advance.bodyFeatures.breast.breastLength = \\1',
    r'\.shape\.setBreastScale\((.*?)\)': '.description.advance.bodyFeatures.breast.breastOverallScale = \\1',
    r'\.shape\.setBreastStretch\((.*?)\)': '.description.advance.bodyFeatures.chest.chestVerticalScale = \\1',
    r'\.shape\.setBreastVerticalPosition\((.*?)\)': '.description.advance.bodyFeatures.breast.breastVerticalShift = \\1',
    r'\.shape\.setBrowGap\((.*?)\)': '.description.advance.headFeatures.eyebrows.eyebrowHorizontalShift = \\1',
    r'\.shape\.setBrowHeight\((.*?)\)': '.description.advance.headFeatures.eyebrows.eyebrowVerticalShift = \\1',
    r'\.shape\.setBrowInboardShape\((.*?)\)': '.description.advance.headFeatures.eyebrows.eyebrowInnerVerticalShift = \\1',
    r'\.shape\.setBrowOutsideShape\((.*?)\)': '.description.advance.headFeatures.eyebrows.eyebrowOuterVerticalShift = \\1',
    r'\.shape\.setBrowRotation\((.*?)\)': '.description.advance.headFeatures.eyebrows.eyebrowOverallRotation = \\1',
    r'\.shape\.setCanthusHorizontalPosition\((.*?)\)': '.description.advance.headFeatures.eyes.eyeCorners.outerEyeCornerVerticalShift = \\1',
    r'\.shape\.setCanthusVerticalPosition\((.*?)\)': '.description.advance.headFeatures.eyes.eyeCorners.innerEyeCornerHorizontalShift = \\1',
    r'\.shape\.setCharacterHeight\((.*?)\)': '.description.advance.bodyFeatures.body.height = \\1',
    r'\.shape\.setCheekBoneRange\((.*?)\)': '.description.advance.headFeatures.faceShape.cheekbone.cheekboneFrontalShift = \\1',
    r'\.shape\.setCheekBoneWidth\((.*?)\)': '.description.advance.headFeatures.faceShape.cheekbone.cheekboneHorizontalScale = \\1',
    r'\.shape\.setCheekHeight\((.*?)\)': '.description.advance.headFeatures.faceShape.cheek.cheekVerticalShift = \\1',
    r'\.shape\.setCheekRange\((.*?)\)': '.description.advance.headFeatures.faceShape.cheek.cheekFrontalShift = \\1',
    r'\.shape\.setCheekWidth\((.*?)\)': '.description.advance.headFeatures.faceShape.cheek.cheekHorizontalScale = \\1',
    r'\.shape\.setEarRoll\((.*?)\)': '.description.advance.headFeatures.ears.earHorizontalRotation = \\1',
    r'\.shape\.setEarScale\((.*?)\)': '.description.advance.headFeatures.ears.earOverallScale = \\1',
    r'\.shape\.setEarYaw\((.*?)\)': '.description.advance.headFeatures.ears.earFrontalRotation = \\1',
    r'\.shape\.setEyesGap\((.*?)\)': '.description.advance.headFeatures.eyes.overall.eyeHorizontalShift = \\1',
    r'\.shape\.setEyesHeight\((.*?)\)': '.description.advance.headFeatures.eyes.overall.eyeVerticalShift = \\1',
    r'\.shape\.setEyesLength\((.*?)\)': '.description.advance.headFeatures.eyes.overall.eyeVerticalScale = \\1',
    r'\.shape\.setEyesRange\((.*?)\)': '.description.advance.headFeatures.eyes.overall.eyeFrontalShift = \\1',
    r'\.shape\.setEyesRotation\((.*?)\)': '.description.advance.headFeatures.eyes.overall.eyeOverallRotation = \\1',
    r'\.shape\.setEyesWidth\((.*?)\)': '.description.advance.headFeatures.eyes.overall.eyeHorizontalScale = \\1',
    r'\.shape\.setFaceWidth\((.*?)\)': '.description.advance.headFeatures.faceShape.overall.faceHorizontalScale = \\1',
    r'\.shape\.setFootScale\((.*?)\)': '.description.advance.bodyFeatures.feet.feetOverallScale = \\1',
    r'\.shape\.setGroinThickness\((.*?)\)': '.description.advance.bodyFeatures.hips.hipFrontalScale = \\1',
    r'\.shape\.setGroinWidth\((.*?)\)': '.description.advance.bodyFeatures.hips.hipHorizontalScale = \\1',
    r'\.shape\.setHandScale\((.*?)\)': '.description.advance.bodyFeatures.hands.handOverallScale = \\1',
    r'\.shape\.setHeadScale\((.*?)\)': '.description.advance.headFeatures.head.headOverallScale = \\1',
    r'\.shape\.setJawLength\((.*?)\)': '.description.advance.headFeatures.faceShape.jawline.jawlineVerticalShift = \\1',
    r'\.shape\.setJawRange\((.*?)\)': '.description.advance.headFeatures.faceShape.chin.chinFrontalShift = \\1',
    r'\.shape\.setJawSmooth\((.*?)\)': '.description.advance.headFeatures.faceShape.jawline.jawlineRoundness = \\1',
    r'\.shape\.setJawVertexHeight\((.*?)\)': '.description.advance.headFeatures.faceShape.chin.chinTipVerticalShift = \\1',
    r'\.shape\.setJawVertexRange\((.*?)\)': '.description.advance.headFeatures.faceShape.chin.chinTipFrontalShift = \\1',
    r'\.shape\.setJawVertexWidth\((.*?)\)': '.description.advance.headFeatures.faceShape.chin.chinTipHorizontalScale = \\1',
    r'\.shape\.setLowerArmsStretch\((.*?)\)': '.description.advance.bodyFeatures.arms.forearmVerticalScale = \\1',
    r'\.shape\.setLowerArmsThickness\((.*?)\)': '.description.advance.bodyFeatures.arms.forearmFrontalScale = \\1',
    r'\.shape\.setLowerArmsWidth\((.*?)\)': '.description.advance.bodyFeatures.arms.forearmHorizontalScale = \\1',
    r'\.shape\.setLowerFaceRange\((.*?)\)': '.description.advance.headFeatures.faceShape.overall.lowerFaceFrontalShift = \\1',
    r'\.shape\.setLowerFaceWidth\((.*?)\)': '.description.advance.headFeatures.faceShape.overall.lowerFaceHorizontalScale = \\1',
    r'\.shape\.setLowerJawRange\((.*?)\)': '.description.advance.headFeatures.faceShape.jawline.jawFrontalShift = \\1',
    r'\.shape\.setLowerJawWidth\((.*?)\)': '.description.advance.headFeatures.faceShape.jawline.jawHorizontalScale = \\1',
    r'\.shape\.setLowerMouthThickness\((.*?)\)': '.description.advance.headFeatures.mouth.lips.lowerLipThickness = \\1',
    r'\.shape\.setLowerStretch\((.*?)\)': '.description.advance.headFeatures.ears.earLowerScale = \\1',
    r'\.shape\.setMouthHeight\((.*?)\)': '.description.advance.headFeatures.mouth.overall.mouthVerticalShift = \\1',
    r'\.shape\.setMouthRange\((.*?)\)': '.description.advance.headFeatures.mouth.overall.mouthFrontalShift = \\1',
    r'\.shape\.setMouthShape\((.*?)\)': '.description.advance.headFeatures.mouth.mouthCorners.mouthCornerVerticalShift = \\1',
    r'\.shape\.setMouthWidth\((.*?)\)': '.description.advance.headFeatures.mouth.overall.mouthHorizontalScale = \\1',
    r'\.shape\.setNeckStretch\((.*?)\)': '.description.advance.bodyFeatures.neck.neckVerticalScale = \\1',
    r'\.shape\.setNeckThickness\((.*?)\)': '.description.advance.bodyFeatures.neck.neckFrontalScale = \\1',
    r'\.shape\.setNeckWidth\((.*?)\)': '.description.advance.bodyFeatures.neck.neckHorizontalScale = \\1',
    r'\.shape\.setNoseHeight\((.*?)\)': '.description.advance.headFeatures.nose.noseBridge.noseBridgeFrontalShift = \\1',
    r'\.shape\.setNoseProtrusion\((.*?)\)': '.description.advance.headFeatures.nose.noseTip.noseTipVerticalShift = \\1',
    r'\.shape\.setNoseVerticalPosition\((.*?)\)': '.description.advance.headFeatures.nose.overall.noseOverallVerticalShift = \\1',
    r'\.shape\.setPupilHeight\((.*?)\)': '.description.advance.headFeatures.eyes.pupils.pupilVerticalScale = \\1',
    r'\.shape\.setPupilHorizontalPosition\((.*?)\)': '.description.advance.headFeatures.eyes.pupils.pupilHorizontalShift = \\1',
    r'\.shape\.setPupilVerticalPosition\((.*?)\)': '.description.advance.headFeatures.eyes.pupils.pupilVerticalShift = \\1',
    r'\.shape\.setPupilWidth\((.*?)\)': '.description.advance.headFeatures.eyes.pupils.pupilHorizontalScale = \\1',
    r'\.shape\.setRibThickness\((.*?)\)': '.description.advance.bodyFeatures.ribs.ribFrontalScale = \\1',
    r'\.shape\.setRibWidth\((.*?)\)': '.description.advance.bodyFeatures.ribs.ribHorizontalScale = \\1',
    r'\.shape\.setShankScaleX\((.*?)\)': '.description.advance.bodyFeatures.legs.calfHorizontalScale = \\1',
    r'\.shape\.setShankScaleZ\((.*?)\)': '.description.advance.bodyFeatures.legs.calfFrontalScale = \\1',
    r'\.shape\.setShankStretch\((.*?)\)': '.description.advance.bodyFeatures.legs.calfVerticalScale = \\1',
    r'\.shape\.setShoulderArmThickness\((.*?)\)': '.description.advance.bodyFeatures.arms.shoulderFrontalScale = \\1',
    r'\.shape\.setShoulderArmWidth\((.*?)\)': '.description.advance.bodyFeatures.arms.shoulderHorizontalScale = \\1',
    r'\.shape\.setShoulderThickness\((.*?)\)': '.description.advance.bodyFeatures.chest.chestFrontalScale = \\1',
    r'\.shape\.setShoulderWidth\((.*?)\)': '.description.advance.bodyFeatures.chest.chestHorizontalScale = \\1',
    r'\.shape\.setThighStretch\((.*?)\)': '.description.advance.bodyFeatures.legs.thighVerticalScale = \\1',
    r'\.shape\.setThighThicknessX\((.*?)\)': '.description.advance.bodyFeatures.legs.thighHorizontalScale = \\1',
    r'\.shape\.setThighThicknessZ\((.*?)\)': '.description.advance.bodyFeatures.legs.thighFrontalScale = \\1',
    r'\.shape\.setUpperArmsStretch\((.*?)\)': '.description.advance.bodyFeatures.arms.upperArmVerticalScale = \\1',
    r'\.shape\.setUpperArmsThickness\((.*?)\)': '.description.advance.bodyFeatures.arms.upperArmFrontalScale = \\1',
    r'\.shape\.setUpperArmsWidth\((.*?)\)': '.description.advance.bodyFeatures.arms.upperArmHorizontalScale = \\1',
    r'\.shape\.setUpperFaceRange\((.*?)\)': '.description.advance.headFeatures.faceShape.overall.upperFaceFrontalShift = \\1',
    r'\.shape\.setUpperMouthThickness\((.*?)\)': '.description.advance.headFeatures.mouth.lips.upperLipThickness = \\1',
    r'\.shape\.setUpperStretch\((.*?)\)': '.description.advance.headFeatures.ears.earUpperScale = \\1',
    r'\.shape\.setWaistStretch\((.*?)\)': '.description.advance.bodyFeatures.waist.waistVerticalScale = \\1',
    r'\.shape\.setWaistThickness\((.*?)\)': '.description.advance.bodyFeatures.waist.waistFrontalScale = \\1',
    r'\.shape\.setWaistWidth\((.*?)\)': '.description.advance.bodyFeatures.waist.waistHorizontalScale = \\1',

    # HumanoidV2ShoePart
    r'\.shoe\.getColor\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].color.areaColor',
    r'\.shoe\.getDesignAngle\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].design.designRotation',
    r'\.shoe\.getDesignColor\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].design.designColor',
    r'\.shoe\.getDesignTexture\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].design.designStyle',
    r'\.shoe\.getMesh\(\)': '.description.advance.clothing.shoes.style',
    r'\.shoe\.getPatternAngle\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].pattern.patternRotation',
    r'\.shoe\.getPatternColor\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].pattern.patternColor',
    r'\.shoe\.getPatternHeight\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].pattern.patternVerticalScale',
    r'\.shoe\.getPatternIntensity\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].pattern.patternVisibility',
    r'\.shoe\.getPatternWidth\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].pattern.patternHorizontalScale',
    r'\.shoe\.getTexture\((.*?)\)': '.description.advance.clothing.shoes.part[\\1].pattern.patternStyle',

    r'\.shoe\.setColor\((.*?)\)': '.description.advance.clothing.shoes.part[index].color.areaColor = \\1',
    r'\.shoe\.setDesignAngle\((.*?)\)': '.description.advance.clothing.shoes.part[index].design.designRotation = \\1',
    r'\.shoe\.setDesignColor\((.*?)\)': '.description.advance.clothing.shoes.part[index].design.designColor = \\1',
    r'\.shoe\.setDesignTexture\((.*?)\)': '.description.advance.clothing.shoes.part[index].design.designStyle = \\1',
    r'\.shoe\.setMesh\((.*?)\)': '.description.advance.clothing.shoes.style = \\1',
    r'\.shoe\.setPatternAngle\((.*?)\)': '.description.advance.clothing.shoes.part[index].pattern.patternRotation = \\1',
    r'\.shoe\.setPatternColor\((.*?)\)': '.description.advance.clothing.shoes.part[index].pattern.patternColor = \\1',
    r'\.shoe\.setPatternHeight\((.*?)\)': '.description.advance.clothing.shoes.part[index].pattern.patternVerticalScale = \\1',
    r'\.shoe\.setPatternIntensity\((.*?)\)': '.description.advance.clothing.shoes.part[index].pattern.patternVisibility = \\1',
    r'\.shoe\.setPatternWidth\((.*?)\)': '.description.advance.clothing.shoes.part[index].pattern.patternHorizontalScale = \\1',
    r'\.shoe\.setTexture\((.*?)\)': '.description.advance.clothing.shoes.part[index].pattern.patternStyle = \\1',

    #  HumanoidV2UpperClothPart
    r'\.upperCloth\.getColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].color.areaColor',
    r'\.upperCloth\.getDesignAngle\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].design.designRotation',
    r'\.upperCloth\.getDesignColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].design.designColor',
    r'\.upperCloth\.getDesignTexture\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].design.designStyle',
    r'\.upperCloth\.getMesh\(\)': '.description.advance.clothing.upperCloth.style',
    r'\.upperCloth\.getPatternAngle\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].pattern.patternRotation',
    r'\.upperCloth\.getPatternColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].pattern.patternColor',
    r'\.upperCloth\.getPatternHeight\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].pattern.patternVerticalScale',
    r'\.upperCloth\.getPatternIntensity\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].pattern.patternVisibility',
    r'\.upperCloth\.getPatternWidth\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].pattern.patternHorizontalScale',
    r'\.upperCloth\.getTexture\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].pattern.patternStyle',
    r'\.upperCloth\.getUpperClothClothColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[\\1].color.areaColor',
    r'\.upperCloth\.setColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].color.areaColor = \\1',
    r'\.upperCloth\.setDesignAngle\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].design.designRotation = \\1',
    r'\.upperCloth\.setDesignColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].design.designColor = \\1',
    r'\.upperCloth\.setDesignTexture\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].design.designStyle = \\1',
    r'\.upperCloth\.setMesh\((.*?)\)': '.description.advance.clothing.upperCloth.style = \\1',
    r'\.upperCloth\.setPatternAngle\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].pattern.patternRotation = \\1',
    r'\.upperCloth\.setPatternColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].pattern.patternColor = \\1',
    r'\.upperCloth\.setPatternHeight\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].pattern.patternVerticalScale = \\1',
    r'\.upperCloth\.setPatternIntensity\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].pattern.patternVisibility = \\1',
    r'\.upperCloth\.setPatternWidth\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].pattern.patternHorizontalScale = \\1',
    r'\.upperCloth\.setTexture\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].pattern.patternStyle = \\1',
    r'\.upperCloth\.setUpperClothClothColor\((.*?)\)': '.description.advance.clothing.upperCloth.part[index].color.areaColor = \\1',

    # characterbase
    # '.appearanceReady': ''  #无替换方案
    r'\.appearanceType': '.characterType',
    r'\.onLoadAppearanceDataAllCompleted':'.onDescriptionComplete',
    r'\.onLoadDecorationsAllCompleted': '.onDescriptionComplete', # 回调参数不一致
    r'\.onMeshChanged': '.onDescriptionChange', # 回调参数不一致
    r'\.onSetAppearanceDataCompleted\.': '.onDescriptionComplete', # 回调参数不一致
    r'\.onTextureChanged': '.onDescriptionChange', # 回调参数不一致
    r'\.setAppearance\(': '.setDescription(', #参数不一致

    # DefaultData 无替换

    # FourFootStandard 
    r'\.getWholeBody': '.description.base.wholeBody',
    r'\.setWholeBody': '.description.base.wholeBody = ', # 参数不一致 没有同步的参数 

    # HumanoidV2
    r'\.appearanceSync\(\)':'.syncDescription()',
    r'\.attach\(': '.attachToSlot(',
    r'\.changeSomatotype': '.description.advance.base.characterSetting.somatotype = ', # 参数不一致 没有同步的参数 
    r'\.clearAppearance\(\)':'.clearDescription()',
    r'\.detach\(': '.detachFromSlot(',
    r'\.getBodyTattooColor\((.*?)\)': '.description.advance.makeup.bodyDecal[\\1].decalColor()',
    r'\.getBodyTattooPositionX\((.*?)\)': '.description.advance.makeup.bodyDecal[\\1].decalHorizontalShift',
    r'\.getBodyTattooPositionY\((.*?)\)': '.description.advance.makeup.bodyDecal[\\1].decalVerticalShift',
    r'\.getBodyTattooRotation\((.*?)\)': '.description.advance.makeup.bodyDecal[\\1].decalOverallRotation',
    r'\.getBodyTattooType\((.*?)\)': '.description.advance.makeup.bodyDecal[\\1].decalStyle',
    r'\.getBodyTattooZoom\((.*?)\)': '.description.advance.makeup.bodyDecal[\\1].decalOverallScale',
    # getGoods 无替换
    r'\.getSkinColor\(\)': '.description.advance.makeup.skinTone.skinColor',
    # getSkinTexture 无替换
    r'\.getSlotWorldPosition\((.*?)\)': '.getSlotWorldPosition(\\1)',
    r'\.getSomatotype\(\)': '.description.advance.base.characterSetting.somatotype',
    r'\.getVertexPosition\((.*?)\)': '.getVertexPosition(\\1)',
    r'\.setAppearanceData\(': '.setDescription(', # 参数不一致 无回调
    r'\.setBodyTattooColor': '.description.advance.makeup.bodyDecal[index].decalColor = ', # 参数不一致 缺同步
    r'\.setBodyTattooPositionX': '.description.advance.makeup.bodyDecal[index].decalHorizontalShift = ', # 参数不一致 缺同步
    r'\.setBodyTattooPositionY': '.description.advance.makeup.bodyDecal[index].decalVerticalShift = ', # 参数不一致 缺同步
    r'\.setBodyTattooRotation': '.description.advance.makeup.bodyDecal[index].decalOverallRotation = ', # 参数不一致 缺同步
    r'\.setBodyTattooType': '.description.advance.makeup.bodyDecal[index].decalStyle = ', # 参数不一致 缺同步
    r'\.setBodyTattooZoom': '.description.advance.makeup.bodyDecal[index].decalOverallScale = ', # 参数不一致 缺同步
    r'\.setSkinColor': '.description.advance.makeup.skinTone.skinColor = ', # 参数不一致 缺同步

    #getInstance去除 start
    r'\bAccountService.getInstance\(\)':'AccountService',
    r'\bGameObjPool.getInstance\(\)':'GameObjPool',
    r'\bDataCenterC.getInstance\(\)':'DataCenterC',
    r'\bDataCenterS.getInstance\(\)':'DataCenterS',
    r'\bModuleManager.getInstance\(\)':'ModuleService',
    r'\bAdsService.getInstance\(\)':'AdsService',
    r'\bAnalyticsService.getInstance\(\)':'AnalyticsService',
    r'\bDebugService.getInstance\(\)':'DebugService',
    r'\bEffectService.getInstance\(\)':'EffectService',
    r'\bMessageChannelService.getInstance\(\)':'MessageChannelService',
    r'\bPurchaseService.getInstance\(\)':'PurchaseService',
    r'\bRoomService.getInstance\(\)':'RoomService',
    r'\bRouteService.getInstance\(\)':'RouteService',
    r'\bSoundService.getInstance\(\)':'SoundService',
    r'\bUGCService.getInstance\(\)':'UGCService',
    r'\bChatService.getInstance\(\)':'ChatService',
    r'\bUIManager\.instance':'UIService',

    # getInstance去除 end

    
    # 命名空间修改 start

    r"\bModuleManager\.": "ModuleService.",
    r"\bUtil\.": "mw.",
    r"\bType\.": "mw.",
    r"\bCore\.": "mw.",
    r"\bUI\.": "mw.",
    r"\bService\.": "mw.",
    r"\bEvents\.": "mw.",
    r"\bMobileEditor\.": "mw.",
    r"\bExtension\.": "mwext.",
    r"\bNetwork\.": "mw.",
    r"mw\.GameObjPool\.": "GameObjPool.",
    r"\bGameplay\.": "mw.",
    r'\bUtil\.':'mw.',
    r'mw\.EffectService':'EffectService',

    # 命名空间修改 end

    # Camera start

    r'mw\.getCurrentPlayer\(\)':'Player.localPlayer',

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.cameraSystem\b": "Camera.currentCamera",
    r"(\w+)\.(\w+)\.(\w+)\.cameraSystem\b": "Camera.currentCamera",
    r"(\w+)\.(\w+)\.cameraSystem\b": "Camera.currentCamera",
    r"(\w+)\.cameraSystem\b": "Camera.currentCamera",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.startCameraShake\(": "ModifiedCameraSystem.startCameraShake(",
    r"(\w+)\.(\w+)\.(\w+)\.startCameraShake\(": "ModifiedCameraSystem.startCameraShake(",
    r"(\w+)\.(\w+)\.startCameraShake\(": "ModifiedCameraSystem.startCameraShake(",
    r"(\w+)\.startCameraShake\(": "ModifiedCameraSystem.startCameraShake(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.stopCameraShake\(": "Camera.stopShake(",
    r"(\w+)\.(\w+)\.(\w+)\.stopCameraShake\(": "Camera.stopShake(",
    r"(\w+)\.(\w+)\.stopCameraShake\(": "Camera.stopShake(",
    r"(\w+)\.stopCameraShake\(": "Camera.stopShake(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.applySettings\(": "ModifiedCameraSystem.applySettings(",
    r"(\w+)\.(\w+)\.(\w+)\.applySettings\(": "ModifiedCameraSystem.applySettings(",
    r"(\w+)\.(\w+)\.applySettings\(": "ModifiedCameraSystem.applySettings(",
    r"(\w+)\.applySettings\(": "ModifiedCameraSystem.applySettings(",

    r'\.cameraCollisionEnable\b':'.springArm.collisionEnabled',
    r'\.cameraCollisionInterpSpeed\b':'.collisionInterpSpeed',
    r'\.cameraDownLimitAngle\b':'.downAngleLimit',
    r'\.cameraLocationLagEnable\b':'.positionLagEnabled',
    r'\.cameraLocationLagSpeed\b':'.positionLagSpeed',
    r'\.cameraLocationMode\b':'.positionMode',
    r'\.cameraFOV\b':'.fov',
    r'\.cameraLockTarget\(':'.lock(',
    r'\.cancelCameraLockTarget\(':'.unlock(',
    r'\.switchCameraMode\(':'.preset = (',
    r'\.cameraRelativeTransform =':'.localTransform =',
    r'\.cameraSystemRelativeTransform =':'.springArm.localTransform =',
    r'\.cameraWorldTransform =':'.worldTransform =',
    r'\.cameraRelativeTransform=':'.localTransform =',
    r'\.cameraSystemRelativeTransform=':'.springArm.localTransform =',
    r'\.cameraWorldTransform=':'.worldTransform =',
    r'\.cameraRelativeTransform\b':'.localTransform.clone()',
    r'\.cameraSystemRelativeTransform\b':'.springArm.localTransform.clone()',
    r'\.cameraWorldTransform\b':'.worldTransform.clone()',
    r'\.cameraRotationLagEnable\b':'.rotationLagEnabled',
    r'\.cameraRotationLagSpeed\b':'.rotationLagSpeed',
    r'\.cameraSystemWorldTransform\b':'.springArm.worldTransform',
    r'\.cameraUpLimitAngle\b':'.upAngleLimit',
    r'\.currentCameraMode\b':'.preset',
    r'\.fixedCameraZAxis\b':'.fixedElevation',
    r'\.slotOffset\b':'.localTransform.position',
    r'\.targetOffset\b':'.springArm.localTransform.position',
    r'\.targetArmLength\b':'.springArm.length',
    r'\.usePawnControlRotation\b':'.springArm.useControllerRotation',
    r'\.setCameraLockTarget\(':'.lock(',

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.cancelCameraFollowTarget\(": "ModifiedCameraSystem.cancelCameraFollowTarget(",
    r"(\w+)\.(\w+)\.(\w+)\.cancelCameraFollowTarget\(": "ModifiedCameraSystem.cancelCameraFollowTarget(",
    r"(\w+)\.(\w+)\.cancelCameraFollowTarget\(": "ModifiedCameraSystem.cancelCameraFollowTarget(",
    r"(\w+)\.cancelCameraFollowTarget\(": "ModifiedCameraSystem.cancelCameraFollowTarget(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.setCameraFollowTarget\(": "ModifiedCameraSystem.setCameraFollowTarget(",
    r"(\w+)\.(\w+)\.(\w+)\.setCameraFollowTarget\(": "ModifiedCameraSystem.setCameraFollowTarget(",
    r"(\w+)\.(\w+)\.setCameraFollowTarget\(": "ModifiedCameraSystem.setCameraFollowTarget(",
    r"(\w+)\.setCameraFollowTarget\(": "ModifiedCameraSystem.setCameraFollowTarget(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.followTargetEnable\b": "ModifiedCameraSystem.followTargetEnable",
    r"(\w+)\.(\w+)\.(\w+)\.followTargetEnable\b": "ModifiedCameraSystem.followTargetEnable",
    r"(\w+)\.(\w+)\.followTargetEnable\b": "ModifiedCameraSystem.followTargetEnable",
    r"(\w+)\.followTargetEnable\b": "ModifiedCameraSystem.followTargetEnable",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.followTargetInterpSpeed\b": "ModifiedCameraSystem.followTargetInterpSpeed",
    r"(\w+)\.(\w+)\.(\w+)\.followTargetInterpSpeed\b": "ModifiedCameraSystem.followTargetInterpSpeed",
    r"(\w+)\.(\w+)\.followTargetInterpSpeed\b": "ModifiedCameraSystem.followTargetInterpSpeed",
    r"(\w+)\.followTargetInterpSpeed\b": "ModifiedCameraSystem.followTargetInterpSpeed",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.getCurrentSettings\(": "ModifiedCameraSystem.getCurrentSettings(",
    r"(\w+)\.(\w+)\.(\w+)\.getCurrentSettings\(": "ModifiedCameraSystem.getCurrentSettings(",
    r"(\w+)\.(\w+)\.getCurrentSettings\(": "ModifiedCameraSystem.getCurrentSettings(",
    r"(\w+)\.getCurrentSettings\(": "ModifiedCameraSystem.getCurrentSettings(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.getDefaultCameraShakeData\(": "ModifiedCameraSystem.getDefaultCameraShakeData(",
    r"(\w+)\.(\w+)\.(\w+)\.getDefaultCameraShakeData\(": "ModifiedCameraSystem.getDefaultCameraShakeData(",
    r"(\w+)\.(\w+)\.getDefaultCameraShakeData\(": "ModifiedCameraSystem.getDefaultCameraShakeData(",
    r"(\w+)\.getDefaultCameraShakeData\(": "ModifiedCameraSystem.getDefaultCameraShakeData(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.resetOverrideCameraRotation\(": "ModifiedCameraSystem.resetOverrideCameraRotation(",
    r"(\w+)\.(\w+)\.(\w+)\.resetOverrideCameraRotation\(": "ModifiedCameraSystem.resetOverrideCameraRotation(",
    r"(\w+)\.(\w+)\.resetOverrideCameraRotation\(": "ModifiedCameraSystem.resetOverrideCameraRotation(",
    r"(\w+)\.resetOverrideCameraRotation\(": "ModifiedCameraSystem.resetOverrideCameraRotation(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.setOverrideCameraRotation\(": "ModifiedCameraSystem.setOverrideCameraRotation(",
    r"(\w+)\.(\w+)\.(\w+)\.setOverrideCameraRotation\(": "ModifiedCameraSystem.setOverrideCameraRotation(",
    r"(\w+)\.(\w+)\.setOverrideCameraRotation\(": "ModifiedCameraSystem.setOverrideCameraRotation(",
    r"(\w+)\.setOverrideCameraRotation\(": "ModifiedCameraSystem.setOverrideCameraRotation(",

    r"mw\.CameraShake": "Camera", #dhy
    r":\s+CameraShake": ": Camera", #dhy
    r"mw\.CameraSystem": "Camera", #dhy
    r":\s+CameraSystem": ": Camera", #dhy

    # Camera end

    # Animation start

    r'\.onAnimFinished\b':'.onFinish',

    # Animation end

    # BlockingVolume start
    
    r"\.getCurrentPlayerPassable\(": ".getTargetPassable(",
    r"\.setCurrentPlayerPassable\(": ".addPassableTarget(",
    r"\.setNonCharacterActorCanPass\(": ".addPassableTarget(",

    # BlockingVolume end

    # Character start

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.onSkill1Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.(\w+)\.onSkill1Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.onSkill1Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+).onSkill1Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.onSkill2Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.(\w+)\.onSkill2Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.onSkill2Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+).onSkill2Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.onSkill3Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.(\w+)\.onSkill3Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.onSkill3Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+).onSkill3Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.onSkill4Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.(\w+)\.onSkill4Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.onSkill4Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+).onSkill4Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.onSkill5Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.(\w+)\.onSkill5Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+)\.(\w+)\.onSkill5Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",
    r"(\w+).onSkill5Triggered.add\(": "InputUtil.onKeyDown(Keys.One, ",

    # Character end

    # CharacterBase start

    r"\.setNonCharacterActorCanPass\b": ".addMovement",
    r"\.airControl\b": ".driftControl",
    r"\.basicStanceAimOffsetEnable\b": ".currentStance.aimOffsetEnabled",
    r"\.brakingDecelerationFalling\b": ".horizontalBrakingDecelerationFalling",
    r"\.canStepUpOn\b": ".canStandOn",
    r"\.characterName\b": ".displayName",
    r"\.collisionWithOtherCharacterEnable\b": ".collisionWithOtherCharacterEnabled",
    r"\.crouchEnable\b": ".crouchEnabled",
    r"\.headUIVisible\b": ".nameVisible",
    r"\.headUIVisibleRange\b": ".nameDisplayDistance",
    r"\.isPlayingAnimation\b": ".currentAnimation?.isPlaying",
    r"\.jumpEnable\b": ".jumpEnabled",
    r"\.jumpingOutOfWaterEnable\b": ".canJumpOutOfWater",
    r"\.moveEnable\b": ".movementEnabled",
    r"\.movementState\b": ".movementMode",
    r"\.outOfWaterZ\b": ".outOfWaterVerticalSpeed",
    r"\.ragdollEnable\b": ".ragdollEnabled",
    r"\.separateBrakingFrictionEnable\b": ".groundFrictionEnabled",
    r"\.usedCapsuleCorrection\b": ".capsuleCorrectionEnabled",

    r"\.attach\(": ".attachToSlot(",
    r"\.clearAppearance\(": ".clearDescription(",
    r"\.getControlRotator\(": ".getControllerRotation(",
    r"\.setLocallyVisibility\(": ".setVisibility(",
    r"\.addMoveInput\(": ".addMovement(",
    r"\.detachFromGameObject\(\)": ".parent = null",
    r"\.getHeadUIWidget\(\)": ".overheadUI",

    r"\.locallyVisible\s*=[^=]\s*([^;\n]*)": ".setVisibility(\\1)",
    r"\.locallyVisible\b": ".getVisibility()",

    r"(\w+)(\.\w+)\(\)(.\w+).animationStance\s*=[^=]\s*([^;\n]*)": "PlayerManagerExtesion.changeStanceExtesion(\\1\\2()\\3, \\4)",
    r"(\w+)(\.\w+)(.\w+).animationStance\s*=[^=]\s*([^;\n]*)": "PlayerManagerExtesion.changeStanceExtesion(\\1\\2\\3,\\4)",
    r"(\w+)(\.\w+)\(\)(.\w+)\.animationStance\s*=[^=]\s*([^;\n]*);?": "PlayerManagerExtesion.changeStanceExtesion(\\1\\2()\\3, \\4);",
    r"(\w+)(\.\w+)(\.\w+).animationStance\s*=[^=]\s*([^;\n]*);?": "PlayerManagerExtesion.changeStanceExtesion(\\1\\2\\3,\\4);",
    r"(\w+)(\.\w+).animationStance\s*=[^=]([^;\n]*)\s;?": "PlayerManagerExtesion.changeStanceExtesion(\\1\\2,\\3);",
    r"(\w+).animationStance\s*=[^=]\s*([^;\n]*)\s;?": "PlayerManagerExtesion.changeStanceExtesion(\\1,\\2);",

    r"(\w+)(\.\w+)\(\)(.\w+).basicStance\s*=[^=]\s*([^;\n]*)": "PlayerManagerExtesion.changeBaseStanceExtesion(\\1\\2()\\3, \\4)",
    r"(\w+)(\.\w+)(.\w+).basicStance\s*=[^=]\s*([^;\n]*)": "PlayerManagerExtesion.changeBaseStanceExtesion(\\1\\2\\3,\\4)",
    r"(\w+)(\.\w+)\(\)(.\w+)\.basicStance\s*=[^=]\s*([^;\n]*);?": "PlayerManagerExtesion.changeBaseStanceExtesion(\\1\\2()\\3, \\4);",
    r"(\w+)(\.\w+)(\.\w+).basicStance\s*=[^=]\s*([^;\n]*);?": "PlayerManagerExtesion.changeBaseStanceExtesion(\\1\\2\\3,\\4);",
    r"(\w+)(\.\w+).basicStance\s*=[^=]([^;\n]*)\s;?": "PlayerManagerExtesion.changeBaseStanceExtesion(\\1\\2,\\3);",
    r"(\w+).basicStance\s*=[^=]\s*([^;\n]*)\s;?": "PlayerManagerExtesion.changeBaseStanceExtesion(\\1,\\2);",

    r"(\w+)(.\w+)\(\)(.\w+)\.playAnimation\(([^,]+),\s*([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2()\\3, \\4, \\5, \\6)",
    r"(\w+)(.\w+)(.\w+)\.playAnimation\(([^,]+),\s*([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2\\3, \\4, \\5, \\6)",
    r"(\w+)(.\w+)\.playAnimation\(([^,]+),\s*([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2, \\3, \\4, \\5)",
    r"(\w+)\.playAnimation\(([^,]+),\s*([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1, \\2, \\3, \\4)",

    r"(\w+)(.\w+)\(\)(.\w+)\.playAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2()\\3, \\4, \\5)",
    r"(\w+)(.\w+)(.\w+)\.playAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2\\3, \\4, \\5)",
    r"(\w+)(.\w+)\.playAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2, \\3, \\4)",
    r"(\w+)\.playAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1, \\2, \\3)",

    r"(\w+)(.\w+)\(\)(.\w+)\.playAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2()\\3, \\4)",
    r"(\w+)(.\w+)(.\w+)\.playAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2\\3, \\4)",
    r"(\w+)(.\w+)\.playAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1\\2, \\3)",
    r"(\w+)\.playAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcPlayAnimation(\\1, \\2)",

    r"(\w+)(.\w+)\(\)(.\w+)\.loadAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1\\2()\\3, \\4, \\5)",
    r"(\w+)(.\w+)(.\w+)\.loadAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1\\2\\3, \\4, \\5)",
    r"(\w+)(.\w+)\.loadAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1\\2, \\3, \\4)",
    r"(\w+)\.loadAnimation\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1, \\2, \\3)",

    r"(\w+)(.\w+)\(\)(.\w+)\.loadAnimation\(([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1\\2()\\3, \\4)",
    r"(\w+)(.\w+)(.\w+)\.loadAnimation\(([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1\\2\\3, \\4)",
    r"(\w+)(.\w+)\.loadAnimation\(([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1\\2, \\3)",
    r"(\w+)\.loadAnimation\(([^,]+)\)": "PlayerManagerExtesion.loadAnimationExtesion(\\1, \\2)",

    r"(\w+)(.\w+)\(\)(.\w+)\.loadStance\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1\\2()\\3, \\4, \\5)",
    r"(\w+)(.\w+)(.\w+)\.loadStance\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1\\2\\3, \\4, \\5)",
    r"(\w+)(.\w+)\.loadStance\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1\\2, \\3, \\4)",
    r"(\w+)\.loadStance\(([^,]+),\s*([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1, \\2, \\3)",

    r"(\w+)(.\w+)\(\)(.\w+)\.loadStance\(([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1\\2()\\3, \\4)",
    r"(\w+)(.\w+)(.\w+)\.loadStance\(([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1\\2\\3, \\4)",
    r"(\w+)(.\w+)\.loadStance\(([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1\\2, \\3)",
    r"(\w+)\.loadStance\(([^,]+)\)": "PlayerManagerExtesion.loadStanceExtesion(\\1, \\2)",

    r"(\w+)(.\w+)\(\)(.\w+)\.stopAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcStopAnimation(\\1\\2()\\3, \\4)",
    r"(\w+)(.\w+)(.\w+)\.stopAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcStopAnimation(\\1\\2\\3, \\4)",
    r"(\w+)(.\w+)\.stopAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcStopAnimation(\\1\\2, \\3)",
    r"(\w+)\.stopAnimation\(([^,]+)\)": "PlayerManagerExtesion.rpcStopAnimation(\\1, \\2)",

    r"(\w+)(.\w+)\(\)(.\w+)\.stopStance\(([^,]+)\)": "PlayerManagerExtesion.stopStanceExtesion(\\1\\2()\\3, \\4)",
    r"(\w+)(.\w+)(.\w+)\.stopStance\(([^,]+)\)": "PlayerManagerExtesion.stopStanceExtesion(\\1\\2\\3, \\4)",
    r"(\w+)(.\w+)\.stopStance\(([^,]+)\)": "PlayerManagerExtesion.stopStanceExtesion(\\1\\2, \\3)",
    r"(\w+)\.stopStance\(([^,]+)\)": "PlayerManagerExtesion.stopStanceExtesion(\\1, \\2)",

    r"(\w+)(.\w+)\(\)(.\w+)\.stopStance\(\)": "PlayerManagerExtesion.stopStanceExtesion(\\1\\2()\\3)",
    r"(\w+)(.\w+)(.\w+)\.stopStance\(\)": "PlayerManagerExtesion.stopStanceExtesion(\\1\\2\\3)",
    r"(\w+)(.\w+)\.stopStance\(\)": "PlayerManagerExtesion.stopStanceExtesion(\\1\\2)",
    r"(\w+)\.stopStance\(\)": "PlayerManagerExtesion.stopStanceExtesion(\\1)",


    r"mw.Stance\b": "mw.SubStance",

    # Event start

    r"mw\.addClientListener\(":"Event.addClientListener(",
    r"mw\.addExitListener\(":"SystemUtil.onExit.add(",
    r"mw\.addFocusListener\(":"WindowUtil.onFocus.add(",
    r"mw\.addLocalListener\(":"Event.addLocalListener(",
    r"mw\.addOnPauseListener\(":"SystemUtil.onPause.add(",
    r"mw\.addOnResumeListener\(":"SystemUtil.onResume.add(",
    r"mw\.addPlayerJoinedListener\(":"Player.onPlayerJoin.add(",
    r"mw\.addPlayerLeftListener\(":"Player.onPlayerLeave.add(",
    r"mw\.addServerListener\(":"Event.addServerListener(",
    r"mw\.addUnfocusedListener\(":"WindowUtil.onDefocus.add(",
    r"mw\.dispatchLocal\(":"Event.dispatchToLocal(",
    r"mw\.dispatchToAllClient\(":"Event.dispatchToAllClient(",
    r"mw\.dispatchToClient\(":"Event.dispatchToClient(",
    r"mw\.dispatchToServer\(":"Event.dispatchToServer(",

    # Event end

    # GameObject start
    r"\.addDestroyCallback\(": ".onDestroyDelegate.add(",
    r"mw\.GameObject\.asyncFind\(": "GameObject.asyncFindGameObjectById(",
    r"GameObject\.asyncFind\(": "GameObject.asyncFindGameObjectById(",
    r"\.asyncGetScriptByName\(": ".getScriptByName(",
    r"\.attachToGameObject\((.*?)\)": ".parent = \\1",
    r"\.deleteDestroyCallback\(": ".onDestroyDelegate.remove(",
    r"\.detachFromGameObject\(\)": ".parent = null",
    r"mw\.GameObject\.find\(": "GameObject.findGameObjectById(",
    r"GameObject.find\(": "GameObject.findGameObjectById(",
    r"GameObject\.findGameObjectByTag\(": "GameObject.findGameObjectsByTag(",
    r"\.forwardVector": ".worldTransform.getForwardVector()",
    r"\.getBoundingBoxSize\(\)": ".getBoundingBoxExtent()",
    r"\.getChildByGuid\(": ".getChildByGameObjectId(",
    r"\.getChildrenBoxCenter\(": ".getChildrenBoundingBoxCenter(",
    r"mw\.GameObject\.getGameObjectByName\(": "GameObject.findGameObjectByName(",
    r"GameObject\.getGameObjectByName\(": "GameObject.findGameObjectByName(",
    r"mw\.GameObject\.getGameObjectsByName\(": "GameObject.findGameObjectsByName(",
    r"GameObject\.getGameObjectsByName\(": "GameObject.findGameObjectsByName(",
    r"\.getRelativeLocation\(\)": ".localTransform.position",
    r"\.getRelativeRotation\(\)": ".localTransform.rotation",
    r"\.getRelativeScale\(\)": ".localTransform.scale",
    r"\.getScriptByGuid\(": ".getScript(",
    r"\.getTransform\(\)": ".worldTransform.clone()",
    r"\.getUpVector\(": ".worldTransform.getUpVector(",
    r"\.getWorldLocation\(\)": ".worldTransform.position",
    r"\.getWorldRotation\(\)": ".worldTransform.rotation",
    r"\.getWorldScale\(\)": ".worldTransform.scale",
    r"\.ready\(": ".asyncReady(",
    r"\.relativeLocation": ".localTransform.position",
    r"\.relativeRotation": ".localTransform.rotation",
    r"\.relativeScale": ".localTransform.scale",
    r"\.rightVector": ".worldTransform.getRightVector()",
    r"\.setRelativeLocation\(": ".localTransform.position = (",
    r"\.setRelativeRotation\(": ".localTransform.rotation = (",
    r"\.setRelativeScale\(": ".localTransform.scale = (",
    r"\.setTransform\(": ".worldTransform = (",
    r"\.setWorldLocation\(": ".worldTransform.position = (",
    r"\.setWorldRotation\(": ".worldTransform.rotation = (",
    r"\.setWorldScale\(": ".worldTransform.scale = (",
    r"\.upVector": ".worldTransform.getUpVector()",
    r"\.worldLocation": ".worldTransform.position",
    r"\.worldRotation": ".worldTransform.rotation",
    r"\.worldScale": ".worldTransform.scale",

    # GameObject end

    # 交互物 start

    r"\.endInteract\(": ".leave(",

    r"(\w+)(.\w+)\(\)(.\w+)\.enterInteractiveState\(([^,]+)\)\.then": "GeneralManager.modiftEnterInteractiveState(\\1\\2()\\3, \\4).then",
    r"(\w+)(.\w+)(.\w+)\.enterInteractiveState\(([^,]+)\)\.then": "GeneralManager.modiftEnterInteractiveState(\\1\\2\\3, \\4).then",
    r"(\w+)(.\w+)\.enterInteractiveState\(([^,]+)\)\.then": "GeneralManager.modiftEnterInteractiveState(\\1\\2, \\3).then",
    r"(\w+)\.enterInteractiveState\(([^,]+)\)\.then": "GeneralManager.modiftEnterInteractiveState(\\1, \\2).then",
    r"\.enterInteractiveState\(": ".enter(",

    r"(\w+)(.\w+)\(\)(.\w+)\.exitInteractiveState\(([^,]+),\s*([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1\\2()\\3, \\4, \\5)",
    r"(\w+)(.\w+)(.\w+)\.exitInteractiveState\(([^,]+),\s*([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1\\2\\3, \\4, \\5)",
    r"(\w+)(.\w+)\.exitInteractiveState\(([^,]+),\s*([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1\\2, \\3, \\4)",
    r"(\w+)\.exitInteractiveState\(([^,]+),\s*([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1, \\2, \\3)",

    r"(\w+)(.\w+)\(\)(.\w+)\.exitInteractiveState\(([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1\\2()\\3, \\4)",
    r"(\w+)(.\w+)(.\w+)\.exitInteractiveState\(([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1\\2\\3, \\4)",
    r"(\w+)(.\w+)\.exitInteractiveState\(([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1\\2, \\3)",
    r"(\w+)\.exitInteractiveState\(([^,]+)\)": "GeneralManager.modifyExitInteractiveState(\\1, \\2)",

    r"\.getInteractCharacter\(\)": ".getCurrentCharacter()",
    r"\.getInteractiveState\(\)": ".occupied",
    r"\.interactiveCharacter\(\)": ".getCurrentCharacter()",
    r"\.interactiveSlot\b": ".slot",
    r"\.interactiveStance\b": ".animationId",
    r"\.onInteractiveEnded\b": ".onLeave",
    r"\.onInteractiveStarted\b": ".onEnter",
    r"\.onInteractorEnter\b": ".onEnter",
    r"\.onInteractorExit\b": ".onLeave",
    r"\.startInteract\(": ".enter(",

    # 交互物 end

    # EffectService start

    r'EffectService\.stopEffect\(':'EffectService.stop(',
    r'EffectService\.getEffectGameObject\(':'EffectService.getEffectById(',
    r'EffectService\.stopAllEffect\(':'EffectService.stopAll(',
    r'EffectService\.playEffectOnPlayer\(':'GeneralManager.rpcPlayEffectOnPlayer(',
    r'EffectService\.playEffectOnGameObject\(':'GeneralManager.rpcPlayEffectOnGameObject(',
    r'EffectService\.playEffectAtLocation\(':'GeneralManager.rpcPlayEffectAtLocation(',
    r'EffectService\.playEffectAtLocation\(':'GeneralManager.rpcPlayEffectAtLocation(',
    r'EffectManager\.stopEffect\(':'EffectService.stop(',
    r'EffectManager\.getEffectGameObject\(':'EffectService.getEffectById(',
    r'EffectManager\.stopAllEffect\(':'EffectService.stopAll(',
    r'EffectManager\.playEffectOnPlayer\(':'GeneralManager.rpcPlayEffectOnPlayer(',
    r'EffectManager\.playEffectOnGameObject\(':'GeneralManager.rpcPlayEffectOnGameObject(',
    r'EffectManager\.playEffectAtLocation\(':'GeneralManager.rpcPlayEffectAtLocation(',

    # EffectService end

    # Model start

    r'\.gravityEnable\b':'.gravityEnabled',
    r'\.isSimulatingPhysics\b':'.physicsEnabled',
    r'\.massEnable\b':'.massEnabled',
    r'\.massInKg\b':'.mass',
    r'\.setOutlineAndColor\(':'.setOutline(',

    # Model end

    # player start

    r'\.customTimeDilation\b':'.character.customTimeDilation',

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.addNetworkDisconnectListener\(": "Player.onPlayerDisconnect.add(",
    r"(\w+)\.(\w+)\.(\w+)\.addNetworkDisconnectListener\(": "Player.onPlayerDisconnect.add(",
    r"(\w+)\.(\w+)\.addNetworkDisconnectListener\(": "Player.onPlayerDisconnect.add(",
    r"(\w+).addNetworkDisconnectListener\(": "Player.onPlayerDisconnect.add(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.addNetworkReconnectListener\(": "Player.onPlayerReconnect.add(",
    r"(\w+)\.(\w+)\.(\w+)\.addNetworkReconnectListener\(": "Player.onPlayerReconnect.add(",
    r"(\w+)\.(\w+)\.addNetworkReconnectListener\(": "Player.onPlayerReconnect.add(",
    r"(\w+).addNetworkReconnectListener\(": "Player.onPlayerReconnect.add(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.removeNetworkDisconnectListener\(": "Player.onPlayerDisconnect.remove(",
    r"(\w+)\.(\w+)\.(\w+)\.removeNetworkDisconnectListener\(": "Player.onPlayerDisconnect.remove(",
    r"(\w+)\.(\w+)\.removeNetworkDisconnectListener\(": "Player.onPlayerDisconnect.remove(",
    r"(\w+).removeNetworkDisconnectListener\(": "Player.onPlayerDisconnect.remove(",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\.removeNetworkReconnectListener\(": "Player.onPlayerReconnect.remove(",
    r"(\w+)\.(\w+)\.(\w+)\.removeNetworkReconnectListener\(": "Player.onPlayerReconnect.remove(",
    r"(\w+)\.(\w+)\.removeNetworkReconnectListener\(": "Player.onPlayerReconnect.remove(",
    r"(\w+).removeNetworkReconnectListener\(": "Player.onPlayerReconnect.remove(",

    r'\.getPlayerID\(\)':'.playerId',
    r'\.getTeamId\(\)':'.teamId',
    r'\.getPlayerID\(\)':'.playerId',
    r'\.getPlayerID\(\)':'.playerId',
    r'\.getUserId\(\)':'.userId',
    r'\bAccountService\.userId\b':'AccountService.getUserId()',

    # player end

    # Sound start

    r'\.onSoundFinished\b':'.onFinish',
    r'\.onSoundPaused\b':'.onPause',
    r'\.onSoundStarted\b':'.onPlay',
    r'\.outerRadius\b':'.falloffDistance',
    r'\.shapeExtents\b':'.attenuationShapeExtents',
    r'\.soundDistance\b':'.falloffDistance',
    r'\.spatialization\b':'.isSpatialization',
    r'\.uiSound\b':'.isUISound',
    r'\.volumeMultiplier\b':'.volume',

    # Sound end

    # Transform start

    r'\.inverseTransformLocation\(':'.inverseTransformPosition(',
    r'\.transformLocation\(':'.transformPosition(',

    # Transform end

    # Trigger start

    r'\.isBoxShape\(\)':'.shape == TriggerShapeType.Box',
    r'\.isSphereShape\(\)':'.shape == TriggerShapeType.Sphere',
    r'\.isInArea\(':'.checkInArea(',
    r'\.setCollisionEnabled\(':'.enabled = (',

    # Trigger end

    # 属性修改 start

    r"\.AudioPlayState\b": ".SoundPlayState",

    r'instanceof\s+mw\.CharacterBase\b': 'instanceof mw.Character',

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.Character\b": r"PlayerManagerExtesion.isCharacter(\1.\2.\3.\4)",
    r"(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.Character\b": r"PlayerManagerExtesion.isCharacter(\1.\2.\3)",
    r"(\w+)\.(\w+)\s+instanceof\s+mw\.Character\b": r"PlayerManagerExtesion.isCharacter(\1.\2)",
    r"(\w+)\s+instanceof\s+mw\.Character\b": r"PlayerManagerExtesion.isCharacter(\1)",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.NPC\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3.\4)",
    r"(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.NPC\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3)",
    r"(\w+)\.(\w+)\s+instanceof\s+mw\.NPC\b": r"PlayerManagerExtesion.isNpc(\1.\2)",
    r"(\w+)\s+instanceof\s+mw\.NPC\b": r"PlayerManagerExtesion.isNpc(\1)",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.Humanoid\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3.\4)",
    r"(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.Humanoid\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3)",
    r"(\w+)\.(\w+)\s+instanceof\s+mw\.Humanoid\b": r"PlayerManagerExtesion.isNpc(\1.\2)",
    r"(\w+)\s+instanceof\s+mw\.Humanoid\b": r"PlayerManagerExtesion.isNpc(\1)",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.HumanoidV2\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3.\4)",
    r"(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.HumanoidV2\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3)",
    r"(\w+)\.(\w+)\s+instanceof\s+mw\.HumanoidV2\b": r"PlayerManagerExtesion.isNpc(\1.\2)",
    r"(\w+)\s+instanceof\s+mw\.HumanoidV2\b": r"PlayerManagerExtesion.isNpc(\1)",

    r"(\w+)\.(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.AICharacter\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3.\4)",
    r"(\w+)\.(\w+)\.(\w+)\s+instanceof\s+mw\.AICharacter\b": r"PlayerManagerExtesion.isNpc(\1.\2.\3)",
    r"(\w+)\.(\w+)\s+instanceof\s+mw\.AICharacter\b": r"PlayerManagerExtesion.isNpc(\1.\2)",
    r"(\w+)\s+instanceof\s+mw\.AICharacter\b": r"PlayerManagerExtesion.isNpc(\1)",

    r"mw\.NPC\b":"mw.Character",

    r"mw\.Humanoid\b": "mw.Character",

    r"mw\.CharacterBase\b": "mw.Character",

    r"mw\.SomatotypeFourFootStandard\b" : "mw.FourFootStandard",

    r"mw\.AICharacter\b" : "mw.Character",

    r"mw\.CameraMode\b" : "mw.CameraPreset",

    r"mw\.HumanoidObject_V2\b":"mw\.Character",

    r"mw\.HumanoidObject\b":"mw\.Character",

    r"(\w+)\.(\w+)\.getAppearance\(\)\.getSomatotype\(\)" : r"\1.\2.description.advance.base.characterSetting.somatotype",
    r"(\w+)(\.\w+)\(\)(.\w+)\.getAppearance\(\)\.getSomatotype\(\)": r"\1\2()\3.description.advance.base.characterSetting.somatotype",

    r"(\w+)\.(\w+)\.loadSlotAndEditorDataByGuid\(([^)]+)\)" : "\\1.\\2.description.base.wholeBody = \\3",

    r"(\w+)(.\w+)\.locallyVisible\s*=\s*(\w+)": "\\1\\2.setVisibility(\\3 ? Type.PropertyStatus.On : Type.PropertyStatus.Off)",


    # 禁行区
    r"\.BlockingArea\b": ".BlockingVolume",#dhy

    # 补充
    r'DataStorage\.asyncGetCustomData\(': 'DataStorage.asyncGetData(',
    r'DataStorage\.asyncSetCustomData\(': 'DataStorage.asyncSetData(',
    r'\.particleLength\b': '.timeLength',



}

# 需要替换的字符串  key:旧api   value：新api

apiReplaceStr = {

    'mw.Particle':'mw.Effect',

    # Spawn start

    'GameObjPool.spawn(':'SpawnManager.modifyPoolSpawn(',
    'GameObjPool.asyncSpawn(':'SpawnManager.modifyPoolAsyncSpawn(',
    'GameObjPool.spawn<':'SpawnManager.modifyPoolSpawn<',
    'GameObjPool.asyncSpawn<':'SpawnManager.modifyPoolAsyncSpawn<',
    'mw.GameObject.spawnGameObject(' : "SpawnManager.wornSpawn(",
    'mw.AdvancedVehicle.spawnGameObject(' : "SpawnManager.wornSpawn<mw.AdvancedVehicle>(",
    'mw.Effect.spawnGameObject(' : "SpawnManager.wornSpawn<mw.Effect>(",
    'mw.Sound.spawnGameObject(' : "SpawnManager.wornSpawn<mw.Sound>(",
    'mw.Trigger.spawnGameObject(' : "SpawnManager.wornSpawn<mw.Trigger>(",
    'mw.UIWidget.spawnGameObject(' : "SpawnManager.wornSpawn<mw.UIWidget>(",
    'mw.Interactor.spawnGameObject(' : "SpawnManager.wornSpawn<mw.Interactor>(",
    'mw.IntegratedMover.spawnGameObject(' : "SpawnManager.wornSpawn<mw.IntegratedMover>(",

    'mw.GameObject.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn(",
    'mw.AdvancedVehicle.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.AdvancedVehicle>(",
    'mw.Effect.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.Effect>(",
    'mw.Sound.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.Sound>(",
    'mw.Trigger.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.Trigger>(",
    'mw.UIWidget.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.UIWidget>(",
    'mw.Interactor.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.Interactor>(",
    'mw.IntegratedMover.asyncSpawnGameObject(' : "SpawnManager.wornAsyncSpawn<mw.IntegratedMover>(",

    'mw.GameObject.spawn(' : "SpawnManager.spawn(",
    'mw.AdvancedVehicle.spawn(' : "SpawnManager.spawn<mw.AdvancedVehicle>(",
    'mw.Effect.spawn(' : "SpawnManager.spawn<mw.Effect>(",
    'mw.Sound.spawn(' : "SpawnManager.spawn<mw.Sound>(",
    'mw.Trigger.spawn(' : "SpawnManager.spawn<mw.Trigger>(",
    'mw.UIWidget.spawn(' : "SpawnManager.spawn<mw.UIWidget>(",
    'mw.Interactor.spawn(' : "SpawnManager.spawn<mw.Interactor>(",
    'mw.IntegratedMover.spawn(' : "SpawnManager.spawn<mw.IntegratedMover>(",
    'mw.GameObject.spawn<' : 'SpawnManager.spawn<',

    'mw.GameObject.asyncSpawn(' : "SpawnManager.asyncSpawn(",
    'mw.AdvancedVehicle.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.AdvancedVehicle>(",
    'mw.Effect.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.Effect>(",
    'mw.Sound.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.Sound>(",
    'mw.Trigger.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.Trigger>(",
    'mw.UIWidget.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.UIWidget>(",
    'mw.Interactor.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.Interactor>(",
    'mw.IntegratedMover.asyncSpawn(' : "SpawnManager.asyncSpawn<mw.IntegratedMover>(",
    'mw.GameObject.asyncSpawn<' : 'SpawnManager.asyncSpawn<',

    # Spawn end

    # Gameplaystatic start

    'mw.addOutlineEffect(':'GeneralManager.modifyaddOutlineEffect(',
    'mw.angleCheck(':'MathUtil.angleCheck(',
    'mw.asyncFindPathToLocation(':'Navigation.findPath(',
    'mw.asyncGetCurrentPlayer(':'Player.asyncGetLocalPlayer(',
    'mw.boxOverlap(':'GeneralManager.modiftboxOverlap(',
    'mw.boxOverlapInLevel(':'GeneralManager.modifyboxOverlapInLevel(',
    'mw.clearFollow(':'Navigation.stopFollow(',
    'mw.clearMoveTo(':'Navigation.stopNavigateTo(',
    'mw.cylinderOverlap(':'QueryUtil.capsuleOverlap(',
    'mw.follow(':'Navigation.follow(',
    'mw.getClickGameObjectByScene(':'ScreenUtil.getGameObjectByScreenPosition(',
    'mw.getCurrentPlayer()':'Player.localPlayer',
    'mw.getGameObjectByScenePosition(':'ScreenUtil.getGameObjectByScreenPosition(',
    'mw.getPlayer(':'Player.getPlayer(',
    'mw.getShootDir(':'GeneralManager.modifyGetShootDir(',
    'mw.getSightBeadLocation(':'ScreenUtil.getSightBeadPosition(',
    'mw.lineTrace(':'QueryUtil.lineTrace(',
    'mw.moveTo(':'Navigation.navigateTo(',
    'mw.setGlobalAsyncTimeout(':'ScriptingSettings.setGlobalAsyncTimeout(',
    'mw.setGlobalTimeDilation(':'EnvironmentSettings.setGlobalTimeDilation(',
    'mw.sphereOverlap(':'QueryUtil.sphereOverlap(',
    'mw.getAllPlayers()':'Player.getAllPlayers()',
    'InputUtil.projectWorldLocationToWidgetPosition(':'InputUtil.projectWorldPositionToWidgetPosition(',
    'mw.projectWorldLocationToWidgetPosition':'GeneralManager.modifyProjectWorldLocationToWidgetPosition',

    'DataStorage.asyncGetData(':'GeneralManager.asyncRpcGetData(',
    'mw.AdsService.show(':'GeneralManager.modifyShowAd(',
    'AdsService.show(':'GeneralManager.modifyShowAd(',

    # Gameplaystatic end

    # UI start

    'mw.UIBehavior' :'mw.UIScript',
    'findUIBehavior':'findUIScript',
    '.setUIbyGUID(':'.setUIbyID(',

    # UI end

    # Tween start

    'mw.TweenUtil.Tween':'mw.Tween',
    'TweenUtil.Tween':'mw.Tween',
    'TweenUtil.Group':'TweenGroup',

    # Tween end

    'mw.CameraLocationMode':'mw.CameraPositionMode',
    'CameraPositionMode.LocationFixed':'CameraPositionMode.PositionFixed',
    'CameraPositionMode.LocationFollow':'CameraPositionMode.PositionFollow',

    # GraphicsSettings start

    'SystemUtil.getGraphicsCPULevel()':'GraphicsSettings.getCPULevel()',
    'SystemUtil.getGraphicsGPULevel()':'GraphicsSettings.getGPULevel()',
    'SystemUtil.getDefaultGraphicsCPULevel()':'GraphicsSettings.getDefaultCPULevel()',
    'SystemUtil.getDefaultGraphicsGPULevel()':'GraphicsSettings.getDefaultGPULevel()',
    'SystemUtil.setGraphicsCPULevel(':'GraphicsSettings.setGraphicsCPULevel(',
    'SystemUtil.setGraphicsGPULevel(':'GraphicsSettings.setGraphicsGPULevel(',
    'Settings.GraphicsSettings':'GraphicsSettings',

    # GraphicsSettings end

    'mw.SlotType':'mw.HumanoidSlotType',
    'mw.InteractiveSlot':'mw.HumanoidSlotType',
    'HumanoidSlotType.Buns':'HumanoidSlotType.Buttocks',
    'mw.StaticMesh':'mw.Model',
    'mw.Mesh':'mw.Model',
    'mw.SpawnInfo':'SpawnInfo',
    'DataCenterC.asyncReady()':'DataCenterC.ready()',
    'ModuleService.asyncReady()':'ModuleService.ready()',
    'DataStorage.DataStorageResultCode':'mw.DataStorageResultCode',
    'Optimization.enableOptimization(':'AvatarSettings.optimizationEnabled =(',

}

# 需要优先替换的字符串
apiReplaceStrFirst = {
    # 注解替换 start
    '@Core.Class':'@Component',
    '@UI.UICallOnly(':'@UIBind(',
    '@UI.UIMarkPath(':'@UIWidgetBind(',
    '@Core.Type':'@Serializable',
    'Core.Type':'Serializable',
    '@Core.Function':'@RemoteFunction',
    '@Decorator.saveProperty':'@Decorator.persistence()',
    '@Core.Property(':'@mw.Property(',
    # 注解替换 end
}


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

            if os.path.splitext(fileName)[1] == '.ts':
                # 判断当前文件名称是否包含Modified027Editor 、config、ui-generate，如果包含，则不进行替换操作
                if 'Modified027Editor' in root:
                    print("当前文件不需要替换",fileName)
                else:
                    # 判断当前路径是否包含JavaScripts 文件夹
                    if 'JavaScripts' in root:
                        apifileNameList.append(os.path.join(root,fileName))
                        

    return 

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

    if not os.path.exists('代码备份文件夹'):

            os.makedirs('代码备份文件夹')

    count = 0

    for apifileName in apifileNameList:

        with open(apifileName, 'r',encoding='utf-8') as f:

            count += 1
            # 判断当前路径是否包含JavaScripts文件夹，如果包含，则进行替换操作

            content = f.read()
            content = replaceApi(content)
            f.close()

        #备份旧的文件
        shutil.copy(apifileName,'代码备份文件夹')
        
        #根据文件路径获取文件名称

        name = os.path.basename(apifileName)

        print("正在修改代码文件",count,"/",len(apifileNameList),"---->",name)

        #写入新的文件字符串

        with open(apifileName,'w',encoding='utf-8') as f2:

            f2.write(content)

            f2.close()

#判断该文件命名是否不需要导入
def isrpcExtesionFile(file_name):
    for k in modifyFile.keys():
        if file_name.startswith(k):
            return True
    return False

#根据当前文件路径获取文件名
def getFileName(file_path):
    file_name = os.path.basename(file_path)
    return file_name

modifyCamera = [
    'ModifiedCameraSystem',
    'CameraModifid'
]
modifyPlayer = [
    'PlayerManagerExtesion',
]
modifySpawn = [
    'SpawnManager',
    'SpawnInfo',
]
modifyStatic = [
    'GeneralManager',
]
modifyFile = {
    'ModifiedCamera':modifyCamera,
    'ModifiedPlayer':modifyPlayer,
    'ModifiedSpawn':modifySpawn,
    'ModifiedStaticAPI':modifyStatic,
}

def addImport():
    # 遍历整个项目文件夹
    for root, dirs, files in os.walk(os.getcwd()):
        # 遍历所有的.ts文件
        for file in files:
            if file.endswith('.ts'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r',encoding='utf-8') as f:
                    content = f.read()
                    if(isrpcExtesionFile(file)):
                        continue
                    for k, v in modifyFile.items():
                        for item in v:
                            if item in content:
                                # 根据文件夹位置添加对应的导入语句
                                relative_path = os.path.relpath(file_path, os.getcwd())
                                levels = relative_path.count('\\')-1
                                import_path = '../' * levels + 'Modified027Editor/'
                                if levels == 0:
                                    import_path = './Modified027Editor/'
                                importFiles = ''
                                for item in v:
                                    importFiles += item + ','
                                import_statement = f"import {{ {importFiles} }} from '{import_path+k}';\n"
                                # 在文件头部添加导入语句
                                content = import_statement + content
                                print(getFileName(file_path), '文件中使用了拓展API','导入成功')
                                break
                with open(file_path,'w',encoding='utf-8') as f:
                    f.write(content)


if __name__ == '__main__':
    main()
    # 调用函数，删除代码备份文件夹

    delete_dir('代码备份文件夹')

    addImport()
    print("替换完毕！")
