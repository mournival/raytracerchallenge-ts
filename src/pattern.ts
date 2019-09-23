import {Color} from './color';
import {Tuple} from './tuple';

export class Pattern {
    constructor(public readonly a: Color, public readonly b: Color) {
    }

    stripe_at(p: Tuple) : Color {
        if ( Math.floor(p.x) % 2 === 0)
            return this.a;
        return this.b;
    }
}

export function stripe_pattern(a: Color, b: Color) : Pattern {
    return new Pattern(a, b);
}