/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-17 18:04:45
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-18 17:44:27
 * @FilePath: \vine-valley\JavaScripts\modules\fight\skillobj\PredictorMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Predictor from "./Predictor";

export default class PredictorMgr {
    private static _instance: PredictorMgr;
    public srcPool: Predictor[] = []
    public static get instance(): PredictorMgr {
        if (PredictorMgr._instance == null) {
            PredictorMgr._instance = new PredictorMgr();
        }
        return PredictorMgr._instance;
    }

    public init() {
        for (let i = 0; i < 5; i++) {
            let obj = new Predictor()
            obj.init()
            this.srcPool.push(obj)
        }
    }

    public spawn() {
        let obj = this.srcPool.pop()
        if (!obj) {
            obj = new Predictor()
            obj.init()
        }
        return obj
    }

    public unSpawn(obj: Predictor) {
        obj.state = 0
        this.srcPool.push(obj)
    }

}