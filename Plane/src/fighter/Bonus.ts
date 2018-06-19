module fighter
{
    export class Bonus extends egret.Bitmap
    {   
        private static cacheDict:Object = {};
        public static produce(textureName:string):fighter.Bonus
        {   
        if(fighter.Bonus.cacheDict[textureName]==null)
                    fighter.Bonus.cacheDict[textureName] = [];
                var dict:fighter.Bonus[] = fighter.Bonus.cacheDict[textureName];
                var bonus:fighter.Bonus;
                if(dict.length>0) {
                    bonus = dict.pop();
                } else {
                    bonus = new fighter.Bonus(RES.getRes(textureName),textureName);
                }
                return bonus;
        }   

          public static reclaim(bonus:fighter.Bonus):void
        {
             var textureName: string = bonus.textureName;
            if(fighter.Bonus.cacheDict[textureName]==null)
                fighter.Bonus.cacheDict[textureName] = [];
            var dict:fighter.Bonus[] = fighter.Bonus.cacheDict[textureName];
            if(dict.indexOf(bonus)==-1)
                dict.push(bonus);
        }

        textureName:string;
        
        public constructor(texture:egret.Texture,textureName: string) {
            super(texture);
            this.textureName = textureName;
		}
    }
}