import {Color} from "./color";

export class Pattern {
    constructor(public readonly a: Color, public readonly b: Color) {

    }
}

export function stripe_pattern(a: Color, b: Color) : Pattern {
    return new Pattern(a, b);
}