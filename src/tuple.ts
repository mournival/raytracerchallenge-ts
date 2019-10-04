import {Util} from "./util";

export type VectorElement = 'x' | 'y' | 'z' | 'w';

export class Tuple {

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number,
        public readonly w: number
    ) {
    }

    public get normalize(): Tuple {
        return Tuple.multiply(this, 1 / this.magnitude);
    }

    public get magnitude(): number {
        return Math.sqrt(Tuple.dot(this, this));
    }

    public get isPoint(): boolean {
        return 1.0 - Util.EPSILON < this.w &&
            this.w < 1.0 + Util.EPSILON;
    }

    public get isVector(): boolean {
        return Math.abs(this.w) < Util.EPSILON;
    }

    public get negative(): Tuple {
        return Tuple.multiply(this, -1);
    }

    static equals(lhs: Tuple, rhs: Tuple): boolean {
        return Math.abs(lhs.x - rhs.x) < Util.EPSILON &&
            Math.abs(lhs.y - rhs.y) < Util.EPSILON &&
            Math.abs(lhs.z - rhs.z) < Util.EPSILON&&
            Math.abs(lhs.w - rhs.w) < Util.EPSILON;
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

    static multiply(t: Tuple, s: number): Tuple {
        return new Tuple(t.x * s, t.y * s, t.z * s, t.w * s);
    }

    static divide(t: Tuple, s: number): Tuple {
        return new Tuple(t.x / s, t.y / s, t.z / s, t.w / s);
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

    getElement(e: VectorElement): number {
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
