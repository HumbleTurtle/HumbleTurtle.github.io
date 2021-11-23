import Levelable from "./levelable.js";

class Buff extends Levelable {

    _modifier;
    _base_cost;

    constructor(name, description, modifier=null, cost=10, level=1, next_level_xp=0) {
        super(name, description, level, 0, next_level_xp);
        this._modifier = modifier;
        this._base_cost = cost;
    }

    get cost() {
        return this._base_cost * 1.1 ** this.level;
    }



    get remaining() {
        return this._remaining;
    }

    set remaining(value) {
        this._remaining = value;
        if (this._remaining <= 0) {
            this.remove();
        }
    }

    apply( value ) {
        if ( this._modifier == null ) return value;

        return this._modifier(value, this.level);
    }

    tick() {
        this.remaining--;
    }

    remove() {
        this.remaining = 0;
    }
}

export default Buff;