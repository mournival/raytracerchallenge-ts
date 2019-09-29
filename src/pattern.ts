import {Color} from './color';
import {Tuple} from './tuple';
import {Shape} from './shape';
import {Matrix} from './matrix';

export type PatternFunction = (p: Tuple) => Color;

export class Pattern {

    private readonly transformInv: Matrix;
    constructor(public readonly a: Color, public readonly b: Color, private patternFunction: PatternFunction, public readonly transform = Matrix.identity()) {
        this.transformInv = transform.inverse;
    }

    pattern_at(p: Tuple, object?: Shape): Color {
        if (!object) {
            return this.patternFunction(p);
        }

        const object_point = Matrix.multiplyVector(object.transform.inverse, p);
        const pattern_point = Matrix.multiplyVector(this.transformInv, object_point);

        return this.pattern_at(pattern_point);
    }

    replace(transformation: Matrix): Pattern {
        return new Pattern(this.a, this.b, this.patternFunction, transformation);
    }

}

//
function stripe_function(a: Color, b: Color): PatternFunction {
    return (p: Tuple) => Math.floor(p.x) % 2 === 0 ? a : b;
}

export function stripe_pattern(a: Color, b: Color, transform = Matrix.identity()): Pattern {
    return new Pattern(a, b, stripe_function(a, b), transform);
}

//
function test_function(): PatternFunction {
    return (p: Tuple) => new Color(p.x, p.y, p.z);
}

export function test_pattern() {
    return new Pattern(Color.WHITE, Color.BLACK, test_function());
}

//
function gradient_function(a: Color, b: Color): PatternFunction {
    return (p: Tuple) => Color.add(a,
        Color.multiplyScalar(
            Color.subtract(b, a),
            p.x - Math.floor(p.x)));
}

export function gradient_pattern(a: Color, b: Color, transform = Matrix.identity()): Pattern {
    return new Pattern(a, b, gradient_function(a, b), transform);
}

//
function ring_function(a: Color, b: Color): PatternFunction {
    return (p: Tuple) => Math.floor(p.x * p.x + p.z * p.z) % 4 == 0 ? a : b;
}

export function ring_pattern(a: Color, b: Color, transform = Matrix.identity()) {
    return new Pattern(a, b, ring_function(a, b), transform);
}

//
function checkers_function(a: Color, b: Color): PatternFunction {
    return (p: Tuple) => (Math.floor(p.x) + Math.floor(p.y) + Math.floor(p.z)) % 2 == 0 ? a : b;
}

export function checkers_pattern(a: Color, b: Color, transform = Matrix.identity()) {
    return new Pattern(a, b, checkers_function(a, b), transform);
}
