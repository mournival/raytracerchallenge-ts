export type VectorElement = 'x' | 'y' | 'z' | 'w';

export class Tuple {
    static readonly EPSILON = 0.0001;

    static equals(lhs: Tuple, rhs: Tuple): boolean {
        // console.log(lhs);
        // console.log(rhs);

        return Math.abs(lhs.x - rhs.x) < Tuple.EPSILON &&
            Math.abs(lhs.y - rhs.y) < Tuple.EPSILON &&
            Math.abs(lhs.z - rhs.z) < Tuple.EPSILON &&
            Math.abs(lhs.w - rhs.w) < Tuple.EPSILON;
    }

    static add(lhs: Tuple, rhs: Tuple): Tuple {
        return new Tuple(
            lhs.x + rhs.x,
            lhs.y + rhs.y,
            lhs.z + rhs.z,
            lhs.w + rhs.w,
        );
    }

    static subtract(lhs: Tuple, rhs: Tuple): Tuple {
        return new Tuple(
            lhs.x - rhs.x,
            lhs.y - rhs.y,
            lhs.z - rhs.z,
            lhs.w - rhs.w,
        );
    }

    static isPoint(t: Tuple): boolean {
        return 1.0 - Tuple.EPSILON < t.w &&
            t.w < 1.0 + Tuple.EPSILON;
    }

    static isVector(t: Tuple): boolean {
        return Math.abs(t.w) < Tuple.EPSILON;
    }

    static multiply(t: Tuple, s: number): Tuple {
        return new Tuple(t.x * s, t.y * s, t.z * s, t.w * s);
    }

    static divide(t: Tuple, s: number): Tuple {
        return new Tuple(t.x / s, t.y / s, t.z / s, t.w / s);
    }

    static negate(t: Tuple): Tuple {
        return Tuple.multiply(t, -1);
    }

    static magnitude(t: Tuple): number {
        return Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z);
    }

    static normalize(t: Tuple): Tuple {
        return Tuple.divide(t, Tuple.magnitude(t));
    }

    static dot(lhs: Tuple, rhs: Tuple): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    }

    static cross(lhs: Tuple, rhs: Tuple): Tuple {
        return vector(
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x
        )
    }

    static reflect(v: Tuple, n: Tuple): Tuple {
        const vDotn = Tuple.dot(v, n);
        const coeff = 2 * vDotn;
        const a = Tuple.multiply(n, coeff);
        return Tuple.subtract(v, a);
    }

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number,
        public readonly w: number
    ) {
    }

    getElements(e: VectorElement): number {
        switch (e) {
            case 'x':
                return this.x;
            case 'y' :
                return this.y;
            case  'z':
                return this.z;
            default:
                return this.w;

        }
    }
}

export function point(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 1.0);
}

export function vector(x: number, y: number, z: number): Tuple {
    return new Tuple(x, y, z, 0.0);
}
