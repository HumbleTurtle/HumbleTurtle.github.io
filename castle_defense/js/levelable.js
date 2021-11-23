class Levelable {

    _name;
    _description;
    _level;
    _base_lvl_exp;    
    _current_xp;

    constructor(name, description, level, current_xp, base_lvl_exp) { 
        this._name = name;
        this._description = description;
        this._level = level;
        this._current_xp = current_xp;
        this._base_lvl_exp = base_lvl_exp;
    }

    get next_level_xp () {
        return this._base_lvl_exp + 1.1 ** this._level ;
    }

    get name(){
        return this._name;
    }

    get description() {
        return this._description;
    }

    get level(){
        return this._level;
    }

    get current_xp() {
        return this._current_xp;
    }

    get percentage_to_next_level() {
        return this.current_xp / this.next_level_xp;
    }
    
    level_up() {
        this._level += 1;
        this._current_xp = 0;
    }

    addExperience(experience) {
        let xp_to_add = experience;
        let level_up = false;

        this._current_xp += xp_to_add;

        while (this._current_xp >= this.next_level_xp) {
            this._current_xp -= this.next_level_xp;
            this._level += 1;

            level_up = true;
        }
        return level_up;
    }
}

export default Levelable;