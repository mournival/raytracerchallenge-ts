import {Color} from './color';
import {Tuple} from './tuple';
import {Shape} from './shape';
import {Matrix} from './matrix';

export abstract class Pattern {
    constructor(public readonly a: Color, public readonly b: Color, public readonly transform = Matrix.identity()) {
    }

    abstract pattern_at(p: Tuple): Color;

    abstract replace(transformation: Matrix): Pattern;

}

export class StripePattern extends Pattern {

    pattern_at(p: Tuple): Color {
        return Math.floor(p.x) % 2 === 0 ? this.a : this.b;
    }

    replace(transformation: Matrix): Pattern {
        return new StripePattern(this.a, this.b, transformation);
    }

}

export class TestPattern extends Pattern {
    pattern_at(p: Tuple): Color {
        return new Color(p.x, p.y, p.z);
    }

    replace(transformation: Matrix): Pattern {
        return new TestPattern(this.a, this.b, transformation);
    }

}

export function stripe_pattern(a: Color, b: Color, transform = Matrix.identity()): Pattern {
    return new StripePattern(a, b, transform);
}

export function pattern_at_shape(pattern: Pattern, object: Shape, world_point: Tuple): Color {
    const object_point = Matrix.multiplyVector(object.transform.inverse, world_point);
    const pattern_point = Matrix.multiplyVector(pattern.transform.inverse, object_point);

    return pattern.pattern_at(pattern_point);
}

export function test_pattern() {
    return new TestPattern(Color.WHITE, Color.BLACK);
}
