import {Util} from './util';

export type VectorElement = 'x' | 'y' | 'z' | 'w';

export class Tuple {

    private norm = -1;

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
        if (this.norm < 0) {
            this.norm = Math.sqrt(Tuple.dot(this, this))
        }
        return this.norm;
    }

    public get isPoint(): boolean {
        return Util.closeTo(this.w, 1.0);
    }

    public get isVector(): boolean {
        return Util.closeTo(this.w, 0.0);
    }

    public get negative(): Tuple {
        return Tuple.multiply(this, -1);
    }

    static equals(lhs: Tuple | undefined, rhs: Tuple | undefined): boolean {
        if (lhs === undefined || rhs === undefined) {
            return false;
        }
        return Util.closeTo(lhs.x, rhs.x) &&
            Util.closeTo(lhs.y, rhs.y) &&
            Util.closeTo(lhs.z, rhs.z) &&
            Util.closeTo(lhs.w, rhs.w);
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
