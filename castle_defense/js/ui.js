import * as Vue from 'https://unpkg.com/vue@3.2.22/dist/vue.esm-browser.js'
import Core from './core.js';

const app = Vue.createApp({

    template: `
    <div class="container" v-if="this.coreData">
        <div class="row">

            <div class="col-sm-3">
                <br>
                <div style="padding:5px 10px">
                    <b>Current HP:</b>
                    <h3>❤️ {{ fNumber( player.CurrentHP ) }}</h3>
                </div>               
                <div style="padding:5px 10px">
                    <b>Money</b>
                    <h3>🤑 {{ fNumber( player.Money ) }}</h3>
                </div>  
                <br>
                <div v-for="key in Object.keys( castle ) ">
                    <div class="col-sm data">
                        {{ castle[key].name }} : {{ fNumber( castle[key].buffedValue ) }} 
                    </div>
                </div>
            </div>

            <div class="col-sm-6">
                <h1>Log</h1>

                <div class="text-log">
                    <div class="" v-for="(message, index) in game.messages">
                        {{ message }}
                    </div>
                </div>
            </div>

            <div class="col-sm-3">
                <div>
                    <div class="data">
                        Wave Level: {{ wave.Level }}
                    </div>
                </div>

                <div>
                    <div class="data">
                        Remaining enemies: <br> {{ fNumber(wave.RemainingEnemies)  }} / {{this.coreData.Wave.EnemiesPerWave}}  <br>
                        <progress :value="remainingEnemiesPercentage" max="100">{{this.remainingEnemiesPercentage}}%</progress>            
                    </div>
                </div>

                <div>
                    <div class="data">
                        Enemy troops reach in: <br> {{ fNumber( wave.ReminingTimeToKillWave )  }} seconds    
                    </div>
                </div>

            </div>
        </div>
        <br>
        <div class="row">      
            <div class="col-sm">
                <h2>Buffs</h2>
                <div class="row">
                    <div class="col-sm-4" v-for="key in Object.keys(buffs)">
                        <div class="buff-card" v-on:click="core.levelUpBuff( buffs[key] )" :class="(player.Money > buffs[key].cost ) ? 'green': 'red' " >
                            <div class="row">
                                <div class="col-sm-7">
                                    <b>{{ buffs[key].name }}</b> <br>
                                    {{ buffs[key].description }}
                                </div>
                                <div class="col-sm-5"> 
                                    <span style="float:right;">{{fNumber(buffs[key].cost)}}💰</span>
                                    <br> 
                                    <span style="float:right;">Lvl. {{ buffs[key].level }}</span>      
                                </div> 
                            </div>            

                        </div>                    
                    </div>
                </div>
            </div>

        </div>
    </div>        
    `,

    data() {
        return {
            core: new Core(),
            coreData: null
        }  
    },

    computed:{

        player () {
            return this.coreData.Player;
        },

        game() {
            return this.coreData.Game;
        },

        castle() {
            return this.coreData.Castle;
        },

        buffs() {
            return this.coreData.Buffs;
        },

        wave() {
            return this.coreData.Wave;
        },

        remainingEnemiesPercentage(){ 
            return 100*this.coreData.Wave.RemainingEnemies/this.coreData.Wave.EnemiesPerWave;
        }
    },

    methods: {
        
        init(){
            this.core.start();
            this.core.addTickListener(this.update);
            this.coreData = {};
            this.update();
        },
        
        fNumber(number) {
            return parseFloat(number).toFixed(0);
        },

        update() {
            Object.assign(this.coreData, this.core.data );
        }

    }
});



export default app;