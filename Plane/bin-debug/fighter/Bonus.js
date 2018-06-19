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
    var Bonus = (function (_super) {
        __extends(Bonus, _super);
        function Bonus(texture, textureName) {
            var _this = _super.call(this, texture) || this;
            _this.textureName = textureName;
            return _this;
        }
        Bonus.produce = function (textureName) {
            if (fighter.Bonus.cacheDict[textureName] == null)
                fighter.Bonus.cacheDict[textureName] = [];
            var dict = fighter.Bonus.cacheDict[textureName];
            var bonus;
            if (dict.length > 0) {
                bonus = dict.pop();
            }
            else {
                bonus = new fighter.Bonus(RES.getRes(textureName), textureName);
            }
            return bonus;
        };
        Bonus.reclaim = function (bonus) {
            var textureName = bonus.textureName;
            if (fighter.Bonus.cacheDict[textureName] == null)
                fighter.Bonus.cacheDict[textureName] = [];
            var dict = fighter.Bonus.cacheDict[textureName];
            if (dict.indexOf(bonus) == -1)
                dict.push(bonus);
        };
        Bonus.cacheDict = {};
        return Bonus;
    }(egret.Bitmap));
    fighter.Bonus = Bonus;
    __reflect(Bonus.prototype, "fighter.Bonus");
})(fighter || (fighter = {}));
//# sourceMappingURL=Bonus.js.map