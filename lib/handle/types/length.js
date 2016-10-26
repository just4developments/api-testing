module.exports = class LengthType extends CustomType {
    constructor(from, to) {
        super('Length');
        this.id = Math.random();
        this.from = from;
        this.to = to;
        if (to === undefined) {
            this.value = from;
            this.more = `(${from})`;
        } else {
            this.value = [from, to];
            this.more = `(${from === Any ? 'Any' : from}, ${to === Any ? 'Any' : to})`;
        }
    }
    isValid(a) {
        var isOk = true;
        if (this.value instanceof Array) {
            if (this.value[0] !== Any) {
                isOk &= a.length >= this.value[0];
            }
            if (this.value[1] !== Any) {
                isOk &= a.length <= this.value[1];
            }
        } else {
            isOk = this.value === a.length;
        }
        return isOk;
    }
};