import Levelable from "./levelable.js";
import Buffable from "./buffable.js";
import Buff from "./buff.js";

class Core {
    tickListeners = []
    interval = null;
    data = {
        

        Game: {
            tickTime: 200,
            messages: []
        },
    
        Player: {
            Money: 0.0,
            current_hp: 100
        },
        
        Castle: {
            Ralentization: new Buffable("Traps", "Slows down enemy march", 1),
            Attack: new Buffable("Castle Attack", "Defends against enemies marching to the castle", 10.0),
            CastleHP: new Buffable("Castle HP", "Castle remaining defenses ultil fall", 100.0),
            Reparations: new Buffable("Repair speed", "Castle defenses repair speed", 1),
            Income: new Buffable("Income", "Castle income", 1),
            Lands: new Buffable("Population", "Population of the lands", 1)
        },
    
        Buffs: {
            Carpentry: new Buff("Carpentry", "Increases castle repair speed", (val, lvl) => val * 1.1 ** lvl, 10),

            Defenses: new Buff("Defenses", "Increases castle hp", (val, lvl) => val * 1.1 ** lvl),
            Traps: new Buff("Traps", "Decreases enemy advancement speed", (val, lvl) => val * 1.1 ** lvl),
    
            Woodcutting: new Buff("Woodcutting", "Increases castle income", (val, lvl) => val + lvl ** 2),
            Mining: new Buff("Mining", "Increases castle income", (val, lvl) => val + lvl ** 2 ),
            Smithing: new Buff("Smithing", "Increases castle income", (val, lvl) => val + lvl ** 2),
            Alchemy: new Buff("Alchemy", "Increases castle income", (val, lvl) => val + lvl ** 2),
            Fishing: new Buff("Fishing", "Increases castle income", (val, lvl) => val + lvl ** 2),
            Cooking: new Buff("Cooking", "Increases castle income", (val, lvl) => val + lvl ** 2),
            Farming: new Buff("Farming", "Increases castle income", (val, lvl) => val + lvl ** 2),
    
            Lands: new Buff("Lands", "Increases castle max population", (val, lvl) => val + 1.1 * lvl),
            Housing: new Buff("Housing", "Increases castle population", (val, lvl) => val + 1.1 * lvl),
            Troops: new Buff("Troops", "Increases castle attack", (val, lvl) => val + 1.1 * lvl),
        },
    
        Wave: {
            Level: 1.0,
            Frequency: 1/20,
            
            EnemiesPerWave: 10.0,
            EnemiesBaseHP: 2.0,
            EnemiesBaseDamage: 10.0,
            EnemiesBaseDefense: 10.0,
            BaseReachTime: 10.0,
    
            EnemiesPerWaveMultiplier: 1.1,
            EnemiesHPMultiplier: 1.01,
            EnemiesBaseDamageMultiplier: 1.01,
            EnemiesBaseDefenseMultiplier: 1.01,
    
            RemainingEnemies: 10.0,                
            RemainingTimeUltilNextWave: 5.0,
            ReminingTimeToKillWave: 20.0,
        }
    
    }
    get WaveData() {
        return this.data.Wave;
    }

    applyWaveDamage() {
        let damage = this.data.Castle.Attack.buffedValue;

        let totalHP = this.data.Wave.RemainingEnemies * this.data.Wave.EnemiesBaseHP;
        let effectiveDamage = damage - this.data.Wave.EnemiesBaseDefense;

        if (effectiveDamage < 0) {
            effectiveDamage = 0;
        }

        totalHP -= effectiveDamage;
        this.data.Wave.RemainingEnemies = totalHP / this.data.Wave.EnemiesBaseHP;
    }

    applyCastleDamage() {
        let wave = this.data.Wave;
        let damage = wave.EnemiesBaseDamage * wave.RemainingEnemies;

        this.addLog("Castle took " + damage.toFixed(2) +"❌ of damage at level "+ wave.Level + "🤕");
        this.data.Player.CurrentHP -= damage;
    }

    nextWave() {
        this.data.Wave.RemainingEnemies = this.data.Wave.EnemiesPerWave;
        this.data.Wave.Wave += 1;
        this.data.Wave.ReminingTimeToKillWave = this.data.Wave.BaseReachTime + this.data.Castle.Ralentization.buffedValue;
    }

    upgradeWave() {
        this.data.Wave.Level += 1;
        this.data.Wave.EnemiesPerWave = Math.round( this.data.Wave.EnemiesPerWave * this.data.Wave.EnemiesPerWaveMultiplier );
        this.data.Wave.EnemiesBaseHP *= this.data.Wave.EnemiesHPMultiplier;
        this.data.Wave.EnemiesBaseDefense *= this.data.Wave.EnemiesBaseDefenseMultiplier;
        this.data.Wave.EnemiesBaseDamage *= this.data.Wave.EnemiesBaseDamageMultiplier;
    }
    
    levelUpBuff( buff ) {
        let player = this.data.Player;

        if (buff.cost < player.Money ) {
            player.Money -= buff.cost;
            buff.level_up();
            this.addLog( "\""+buff.name + "\" is now at level " + buff.level );
        }
    }

    applyIncomeEarnings() {
        let castle = this.data.Castle;
        let player = this.data.Player;

        player.Money += castle.Income.buffedValue;
    }

    applyReparations() {
        let castle = this.data.Castle;

        this.data.Player.CurrentHP += castle.Reparations.buffedValue;

        if ( this.data.Player.CurrentHP > castle.CastleHP.buffedValue ) {
            this.data.Player.CurrentHP = castle.CastleHP.buffedValue;
        }
    }

    applyTick() {
        let wave = this.data.Wave;

        this.data.Wave.ReminingTimeToKillWave -= this.data.Game.tickTime/1000;

        this.applyIncomeEarnings();
        this.applyReparations();
        this.applyWaveDamage();

        if (this.data.Wave.RemainingEnemies <= 0) {
            this.addLog("Level " + wave.Level + " cleared 👍");

            this.upgradeWave();
            this.nextWave();            
        }

        if (this.data.Wave.ReminingTimeToKillWave <= 0) {
            this.data.Wave.ReminingTimeToKillWave = 0;
            
            this.applyCastleDamage();

            if (this.data.Player.CurrentHP <= 0) {
                this.data.Player.CurrentHP = 0;
                this.addLog("You lost 💀");
                clearInterval(this.interval);
            }
            this.upgradeWave();
            this.nextWave();
        }        

        this.dispatchTickEvent(this);
    }

    addLog(message){
        let messages = this.data.Game.messages;
        messages.unshift(message);

        if (messages.length > 30) messages.length = 30;
    }

    start() {
        var self = this;

        this.data.Player.CurrentHP = this.data.Castle.CastleHP.buffedValue;

        self.nextWave();
        self.interval = setInterval( function() { self.applyTick(); }, this.data.Game.tickTime);
    }

    dispatchTickEvent(data) {
        this.tickListeners.forEach(function(listener) {
            listener(data);
        });
    }

    addTickListener(listener){
        this.tickListeners.push(listener);
    }

    constructor() {
        this.version = '0.0.1';
        let buffs = this.data.Buffs;
        
        let attack = this.data.Castle.Attack;
        attack.addBuff(this.data.Buffs.Troops);

        
        let income = this.data.Castle.Income;        
        /**
            Woodcutting
            Mining
            Smithing
            Alchemy
            Fishing
            Cooking
            Farming
         */
        income.addBuff(this.data.Buffs.Woodcutting);
        income.addBuff(this.data.Buffs.Mining);
        income.addBuff(this.data.Buffs.Smithing);
        income.addBuff(this.data.Buffs.Alchemy);
        income.addBuff(this.data.Buffs.Fishing);
        income.addBuff(this.data.Buffs.Cooking);
        income.addBuff(this.data.Buffs.Farming);

        let lands = this.data.Castle.Lands;
        lands.addBuff(this.data.Buffs.Housing);
        
        let reparations = this.data.Castle.Reparations;        
        reparations.addBuff(this.data.Buffs.Carpentry);
        
        let castleHP = this.data.Castle.CastleHP;
        castleHP.addBuff(this.data.Buffs.Defenses);

        let ralentization = this.data.Castle.Ralentization;
        ralentization.addBuff(this.data.Buffs.Traps);
    }

}

export default Core;