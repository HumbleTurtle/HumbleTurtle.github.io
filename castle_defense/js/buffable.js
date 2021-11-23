// buffable class levelable
class Buffable {
    
    _value;
    _name;
    _description;    
    _modifiers;

    constructor(name, description, value) {
        this._name = name;
        this._description = description;
        this._modifiers = [];
        this._value = value || {};
    }

    get value () {
        return this._value;
    }

    set value (value) {
        this._value = value;
    }

    get name () {
        return this._name
    }

    get buffedValue() {
        var self = this;
        var value = self.value;
        
        this._modifiers.forEach(modifier => {
            value = modifier.apply( value );
        });
        
        return value;
    }

    addBuff(modifier) {
        this._modifiers.push(modifier);
    }


}

export default Buffable;