/**
 * @Author: zhaolei
 * @Date: 2022-08-19 14:52:03
 * @LastEditors: zhaolei
 * @Description: $1
 */

declare module "ue";
declare module "puerts";
declare var global;
declare function getEn(go: mw.GameObject, configId: number): void;
/**
 * 输出Log
 * @param content 内容
 */
declare function oTrace(...content: any[]): void;
/**
 * 输出Warning
 * @param content 内容
 */
declare function oTraceWarning(...content: any[]): void;
/**
 * 输出Error
 * @param content 内容
 */
declare function oTraceError(...content: any[]): void;
