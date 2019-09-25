import {Color} from './color';
import {Tuple} from './tuple';
import {Shape} from "./shape";
import {Matrix} from "./matrix";

export class Pattern {
    constructor(public readonly a: Color, public readonly b: Color, public readonly transform = Matrix.identity()) {
    }

    stripe_at(p: Tuple): Color {
        return Math.floor(p.x) % 2 === 0 ? this.a : this.b;
    }
}

export function stripe_pattern(a: Color, b: Color, transform = Matrix.identity()): Pattern {
    return new Pattern(a, b, transform);
}

export function stripe_at_object(pattern: Pattern, object: Shape, world_point: Tuple): Color {
    const object_point = Matrix.multiplyVector(object.transform.inverse, world_point);
    const pattern_point = Matrix.multiplyVector(pattern.transform.inverse, object_point);

    return pattern.stripe_at(pattern_point);
}

export function test_pattern() {
    return new Pattern(Color.WHITE, Color.BLACK);
}