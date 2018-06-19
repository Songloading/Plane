var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var fighter;
(function (fighter) {
    /**
     * 主游戏容器
     */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this) || this;
            /**我的子弹*/
            _this.myBullets = [];
            _this.myBulletsBonus = [];
            _this.mybonus = [];
            _this.bonusTimer = new egret.Timer(5000);
            /**存在的Bonus */
            /**敌人的飞机*/
            _this.enemyFighters = [];
            /**触发创建敌机的间隔*/
            _this.enemyFightersTimer = new egret.Timer(1000);
            /**敌人的子弹*/
            _this.enemyBullets = [];
            /**我的成绩*/
            _this.myScore = 0;
            _this._lastTime = egret.getTimer();
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        /**初始化*/
        GameContainer.prototype.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        };
        /**创建游戏场景*/
        GameContainer.prototype.createGameScene = function () {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //背景
            this.bg = new fighter.BgMap(); //创建可滚动的背景
            this.addChild(this.bg);
            //开始按钮
            this.btnStart = fighter.createBitmapByName("btnStart"); //开始按钮
            this.btnStart.x = (this.stageW - this.btnStart.width) / 2; //居中定位
            this.btnStart.y = (this.stageH - this.btnStart.height) / 2; //居中定位
            this.btnStart.touchEnabled = true; //开启触碰
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
            this.addChild(this.btnStart);
            //我的飞机
            this.myFighter = new fighter.Airplane(RES.getRes("f1"), 100);
            this.myFighter.y = this.stageH - this.myFighter.height - 50;
            this.addChild(this.myFighter);
            this.scorePanel = new fighter.ScorePanel();
            //预创建
            this.preCreatedInstance();
        };
        /**预创建一些对象，减少游戏时的创建消耗*/
        GameContainer.prototype.preCreatedInstance = function () {
            var i = 0;
            var objArr = [];
            for (i = 0; i < 20; i++) {
                var bullet = fighter.Bullet.produce("b1");
                objArr.push(bullet);
            }
            for (i = 0; i < 20; i++) {
                bullet = objArr.pop();
                fighter.Bullet.reclaim(bullet);
            }
            for (i = 0; i < 20; i++) {
                var bullet = fighter.Bullet.produce("b2");
                objArr.push(bullet);
            }
            for (i = 0; i < 20; i++) {
                bullet = objArr.pop();
                fighter.Bullet.reclaim(bullet);
            }
            for (i = 0; i < 20; i++) {
                var enemyFighter = fighter.Airplane.produce("f2", 1000);
                objArr.push(enemyFighter);
            }
            for (i = 0; i < 20; i++) {
                enemyFighter = objArr.pop();
                fighter.Airplane.reclaim(enemyFighter, "f2");
            }
        };
        /**游戏开始*/
        GameContainer.prototype.gameStart = function () {
            this.myScore = 0;
            this.removeChild(this.btnStart);
            this.bg.start();
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.myFighter.x = (this.stageW - this.myFighter.width) / 2;
            this.myFighter.fire(); //开火
            this.myFighter.blood = 10;
            this.myFighter.addEventListener("createBullet", this.createBulletHandler, this);
            this.bonusTimer.addEventListener(egret.TimerEvent.TIMER, this.createBonusHandler, this);
            //   this.myFighter.addEventListener("createBullet", this.DeviceRotationRate,1);
            this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
            this.enemyFightersTimer.start();
            if (this.scorePanel.parent == this)
                this.removeChild(this.scorePanel);
        };
        /**响应Touch*/
        GameContainer.prototype.touchHandler = function (evt) {
            if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
                var tx = evt.localX;
                tx = Math.max(0, tx);
                tx = Math.min(this.stageW - this.myFighter.width, tx);
                this.myFighter.x = tx;
            }
        };
        GameContainer.prototype.createBonusHandler = function (evt) {
            var bonus;
            bonus = fighter.Bonus.produce("P1");
            bonus.x = Math.random() * (this.stageW - bonus.width);
            bonus.y = -bonus.height - Math.random() * 300;
            this.mybonus.push(bonus);
            this.addChild(bonus);
        };
        /**创建子弹(包括我的子弹和敌机的子弹)*/
        GameContainer.prototype.createBulletHandler = function (evt) {
            var bullet;
            if (evt.target == this.myFighter) {
                var bulletBonus;
                for (var i = 0; i < 3; i++) {
                    bullet = fighter.Bullet.produce("b1");
                    bulletBonus = fighter.Bullet.produce("b3");
                    bullet.y = this.myFighter.y + 30;
                    if (i == 0) {
                        bullet.x = this.myFighter.x + this.myFighter.width - 22;
                    }
                    else if (i == 1) {
                        bullet.x = this.myFighter.x + 10;
                    }
                    else if (i == 2) {
                        bullet.x = this.myFighter.x + 5;
                        bullet.y = this.myFighter.y + 20;
                    }
                    //bullet.x = i==0?(this.myFighter.x+10):(this.myFighter.x+this.myFighter.width-22);
                    this.addChildAt(bullet, this.numChildren - 1 - this.enemyFighters.length);
                    this.myBullets.push(bullet);
                }
                bulletBonus.x = this.myFighter.x + 10;
                bulletBonus.y = this.myFighter.y + 30;
                this.addChildAt(bulletBonus, this.numChildren - 1 - this.enemyFighters.length);
                this.myBulletsBonus.push(bulletBonus);
            }
            else {
                var theFighter = evt.target;
                bullet = fighter.Bullet.produce("b2");
                bullet.x = theFighter.x + 28;
                bullet.y = theFighter.y + 10;
                this.addChildAt(bullet, this.numChildren - 1 - this.enemyFighters.length);
                this.enemyBullets.push(bullet);
            }
        };
        /**创建敌机*/
        GameContainer.prototype.createEnemyFighter = function (evt) {
            var enemyFighter = fighter.Airplane.produce("f2", 1000);
            enemyFighter.x = Math.random() * (this.stageW - enemyFighter.width);
            enemyFighter.y = -enemyFighter.height - Math.random() * 300;
            enemyFighter.addEventListener("createBullet", this.createBulletHandler, this);
            enemyFighter.fire();
            this.addChildAt(enemyFighter, this.numChildren - 1);
            this.enemyFighters.push(enemyFighter);
        };
        /**游戏画面更新*/
        GameContainer.prototype.gameViewUpdate = function (evt) {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset = 60 / fps;
            //bonus movement
            var k = 0;
            var bonus;
            var bonuscount = this.mybonus.length;
            for (; k < bonuscount; k++) {
                bonus = this.mybonus[k];
                if (bonus.y < -bonus.height) {
                    fighter.Bonus.reclaim(bonus);
                    this.mybonus.splice(k, 1);
                    k--;
                    bonuscount--;
                }
                bonus.y -= 5 * speedOffset;
            }
            //我的子弹运动
            var i = 0;
            var bullet;
            var myBulletsCount = this.myBullets.length;
            var j = 0;
            var bulletBonus;
            var myBulletsBonusCount = this.myBulletsBonus.length;
            for (; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                if (bullet.y < -bullet.height) {
                    this.removeChild(bullet);
                    fighter.Bullet.reclaim(bullet);
                    this.myBullets.splice(i, 1);
                    i--;
                    myBulletsCount--;
                }
                bullet.y -= 12 * speedOffset;
            }
            for (; j < myBulletsBonusCount; j++) {
                bulletBonus = this.myBulletsBonus[j];
                if (bulletBonus.y < -bulletBonus.height) {
                    //this.removeChild(bulletBonus);
                    fighter.Bullet.reclaim(bulletBonus);
                    this.myBulletsBonus.splice(j, 1);
                    i--;
                    myBulletsBonusCount--;
                }
                bulletBonus.y -= 12 * speedOffset;
                bulletBonus.x -= 2 * speedOffset;
            }
            //敌人飞机运动
            var theFighter;
            var enemyFighterCount = this.enemyFighters.length;
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFighters[i];
                if (theFighter.y > this.stage.stageHeight) {
                    this.removeChild(theFighter);
                    fighter.Airplane.reclaim(theFighter, "");
                    //theFighter.removeEventListener("createBullet",this.createEnemyBulletHandler,this);
                    theFighter.stopFire();
                    this.enemyFighters.splice(i, 1);
                    i--;
                    enemyFighterCount--;
                }
                theFighter.y += 4 * speedOffset;
            }
            //敌人子弹运动
            var enemyBulletsCount = this.enemyBullets.length;
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (bullet.y > this.stage.stageHeight) {
                    this.removeChild(bullet);
                    fighter.Bullet.reclaim(bullet);
                    this.enemyBullets.splice(i, 1);
                    i--;
                    enemyBulletsCount--; //数组长度已经改变
                }
                bullet.y += 8 * speedOffset;
            }
            this.gameHitTest();
        };
        /**游戏碰撞检测*/
        GameContainer.prototype.gameHitTest = function () {
            var i, j;
            var bullet;
            var bulletbonus;
            var theFighter;
            var myBulletsCount = this.myBullets.length;
            var myBulletsBonusCount = this.myBulletsBonus.length;
            var enemyFighterCount = this.enemyFighters.length;
            var enemyBulletsCount = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets = [];
            var delFighters = [];
            //我的子弹可以消灭敌机
            for (i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                for (j = 0; j < enemyFighterCount; j++) {
                    theFighter = this.enemyFighters[j];
                    if (fighter.GameUtil.hitTest(theFighter, bullet)) {
                        theFighter.blood -= 2;
                        if (delBullets.indexOf(bullet) == -1)
                            delBullets.push(bullet);
                        if (theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1)
                            delFighters.push(theFighter);
                    }
                }
            }
            for (i = 0; i < myBulletsBonusCount; i++) {
                bulletbonus = this.myBulletsBonus[i];
                for (j = 0; j < enemyFighterCount; j++) {
                    theFighter = this.enemyFighters[j];
                    if (fighter.GameUtil.hitTest(theFighter, bulletbonus)) {
                        theFighter.blood -= 2;
                        // if(delBullets.indexOf(bulletbonus)==-1)
                        //     delBullets.push(bulletbonus);
                        if (theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1)
                            delFighters.push(theFighter);
                    }
                }
            }
            //敌人的子弹可以减我血
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (fighter.GameUtil.hitTest(this.myFighter, bullet)) {
                    this.myFighter.blood -= 1;
                    if (delBullets.indexOf(bullet) == -1)
                        delBullets.push(bullet);
                }
            }
            //敌机的撞击可以消灭我
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFighters[i];
                if (fighter.GameUtil.hitTest(this.myFighter, theFighter)) {
                    this.myFighter.blood -= 10;
                }
            }
            if (this.myFighter.blood <= 0) {
                this.gameStop();
            }
            else {
                while (delBullets.length > 0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if (bullet.textureName == "b1")
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                    else
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
                    fighter.Bullet.reclaim(bullet);
                }
                this.myScore += delFighters.length;
                while (delFighters.length > 0) {
                    theFighter = delFighters.pop();
                    theFighter.stopFire();
                    theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
                    this.removeChild(theFighter);
                    this.enemyFighters.splice(this.enemyFighters.indexOf(theFighter), 1);
                    fighter.Airplane.reclaim(theFighter, "");
                }
            }
        };
        /**游戏结束*/
        GameContainer.prototype.gameStop = function () {
            this.addChild(this.btnStart);
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.myFighter.stopFire();
            this.myFighter.removeEventListener("createBullet", this.createBulletHandler, this);
            this.enemyFightersTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyFighter, this);
            this.enemyFightersTimer.stop();
            //清理子弹
            var i = 0;
            var bullet;
            while (this.myBullets.length > 0) {
                bullet = this.myBullets.pop();
                this.removeChild(bullet);
                fighter.Bullet.reclaim(bullet);
            }
            while (this.enemyBullets.length > 0) {
                bullet = this.enemyBullets.pop();
                this.removeChild(bullet);
                fighter.Bullet.reclaim(bullet);
            }
            //清理飞机
            var theFighter;
            while (this.enemyFighters.length > 0) {
                theFighter = this.enemyFighters.pop();
                theFighter.stopFire();
                theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
                this.removeChild(theFighter);
                fighter.Airplane.reclaim(theFighter, "");
            }
            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        };
        return GameContainer;
    }(egret.DisplayObjectContainer));
    fighter.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "fighter.GameContainer");
    // createEnemyBulletHandler(){
    // }
})(fighter || (fighter = {}));
//# sourceMappingURL=GameContainer.js.map