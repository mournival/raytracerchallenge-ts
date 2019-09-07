import {Tuple} from './tuple';

export class Matrix {
    static readonly EPSILON = 0.0001;
    data: number[][] = [];

    constructor(row: number, col: number) {
        for (let c = 0; c < col; ++c) {
            let newRow = [];
            for (let r = 0; r < row; ++r) {
                newRow.push(0);
            }
            this.data.push(newRow);
        }
    }

    // static add(lhs: Matrix, rhs: Matrix): Matrix {
    //     const ldata = lhs.data;
    //     const rdata = rhs.data;
    //     if ((lrDim != rrDim) || (ldata[0].length != rdata[0].length))
    //         throw 'Can\'t add matrices of different dimensions';
    //
    //     const m = new Matrix(lrDim, ldata[0].length);
    //     for (let r = 0; r < lrDim; ++r)
    //         for (let c = 0; c < ldata[0].length; ++c)
    //             m.data[r][c] = ldata[r][c] + rdata[r][c];
    //
    //     return m;
    // }
    //
    // static copy(m: Matrix): Matrix {
    //     return Matrix.add(m, new Matrix(m.rDim, m.data[0].length));
    // }

    static equals(lhs: Matrix, rhs: Matrix): boolean {
        if (lhs.rDim !== rhs.rDim ||
            lhs.data[0].length !== rhs.data[0].length
        ) {
            return false;
        }
        for (let r = 0; r < lhs.rDim; ++r) {
            for (let c = 0; c < lhs.data[0].length; ++c) {
                if (Math.abs(lhs.get(r, c) - rhs.get(r, c)) > Matrix.EPSILON) {
                    return false;
                }
            }
        }
        return true;
    }

    static multiply(lhs: Matrix, rhs: Matrix): Matrix {
        let product = new Matrix(4, 4);

        for (let r = 0; r < 4; ++r) {
            for (let c = 0; c < 4; ++c) {
                product.data[r][c] = Matrix.dot4(lhs, r, rhs, c);
            }
        }

        return product;
    }

    static multiplyVector(lhs: Matrix, rhs: Tuple): Tuple {
        return new Tuple(
            this.vectorDot(lhs, rhs, 0),
            this.vectorDot(lhs, rhs, 1),
            this.vectorDot(lhs, rhs, 2),
            this.vectorDot(lhs, rhs, 3)
        );
    }

    static dot4(lhs: Matrix, row: number, rhs: Matrix, col: number): number {
        let sum = 0;
        for (let i = 0; i < 4; ++i) {
            sum += lhs.data[row][i] * rhs.data[i][col];
        }
        return sum;
    }

    static identity(dim = 4): Matrix {
        let m = new Matrix(dim, dim);
        for (let i = 0; i < dim; ++i) {
            m.data[i][i] = 1;
        }
        return m;
    }

    private static vectorDot(lhs: Matrix, rhs: Tuple, r: number) {
        return lhs.data[r][0] * rhs.x +
            lhs.data[r][1] * rhs.y +
            lhs.data[r][2] * rhs.z +
            lhs.data[r][3] * rhs.w;
    }

    public get inverse(): Matrix {
        if (!this.invertible) {
            throw 'Cannot invert this matrix';
        }

        const m_prime = new Matrix(this.rDim, this.cDim);
        const det = this.det;
        for (let r = 0; r < this.rDim; ++r) {
            for (let c = 0; c < this.cDim; ++c) {
                const cofactorC = this.cofactor(r, c);
                m_prime.data[c][r] = cofactorC / det;
            }
        }
        return m_prime;
    }

    public get invertible(): boolean {
        return Math.abs(this.det) > Matrix.EPSILON;
    }

    public get det(): number {
        if (this.rDim === 2) {
            return this.det2();
        }

        let dt: number = 0;
        for (let c = 0; c < this.cDim; ++c) {
            dt = dt + this.data[0][c] * this.cofactor(0, c);
        }
        return dt;
    }

    private det2(): number {
        const d = this.data;
        return d[0][0] * d[1][1] - d[0][1] * d[1][0];
    }

    public get transpose(): Matrix {
        let mPrime = new Matrix(this.cDim, this.rDim);
        for (let r = 0; r < this.rDim; ++r) {
            for (let c = 0; c < this.cDim; ++c) {
                mPrime.data[c][r] = this.data[r][c];
            }
        }
        return mPrime;
    }

    public cofactor(r: number, c: number): number {
        const coeff = (r + c) % 2 === 0 ? 1 : -1;
        return coeff * this.minor(r, c);
    }

    public minor(r: number, c: number): number {
        return this.subMatrix(r, c).det;
    }

    public subMatrix(row: number, col: number): Matrix {
        const mMinor = new Matrix(this.rDim - 1, this.cDim
            - 1);

        for (let r = 0; r < this.rDim; ++r) {
            if (r != row) {
                for (let c = 0; c < this.cDim; ++c) {
                    if (c != col) {
                        mMinor.data[r < row ? r : r - 1][c < col ? c : c - 1] = this.data[r][c];
                    }
                }
            }
        }
        return mMinor;
    }

    public get cDim(): number {
        return this.data[0].length;
    }

    public get rDim(): number {
        return this.data.length;
    }

    get(row: number, col: number): number {
        return this.data[row][col];
    }

    set(row: number, col: number, value: number): void {
        this.data[row][col] = value;
    }

}

export function translation(x: number, y: number, z: number): Matrix {
    const m = Matrix.identity(4);
    m.set(0, 3, x);
    m.set(1, 3, y);
    m.set(2, 3, z);
    return m;
}

export function scaling(x: number, y: number, z: number): Matrix {
    const m = new Matrix(4, 4);
    m.set(0, 0, x);
    m.set(1, 1, y);
    m.set(2, 2, z);
    m.set(3, 3, 1);
    return m;
}

export function rotation_x(r_x: number): Matrix {
    const m = Matrix.identity(4);
    const cos = Math.cos(r_x);
    m.set(1, 1, cos);
    m.set(2, 2, cos);

    const sin = Math.sin(r_x);
    m.set(1, 2, -sin);
    m.set(2, 1, sin);

    return m;
}

export function rotation_y(r_y: number): Matrix {
    const m = Matrix.identity(4);
    const cos = Math.cos(r_y);
    m.set(0, 1, cos);
    m.set(2, 2, cos);

    const sin = Math.sin(r_y);
    m.set(0, 2, sin);
    m.set(2, 1, -sin);

    return m;
}

export function rotation_z(r_z: number): Matrix {
    const m = Matrix.identity(4);
    const cos = Math.cos(r_z);
    m.set(0, 0, cos);
    m.set(1, 1, cos);

    const sin = Math.sin(r_z);
    m.set(0, 1, -sin);
    m.set(1, 0, sin);

    return m;
}

export function shearing(x_y: number, x_z: number, y_x: number, y_z: number, z_x: number, z_y: number): Matrix {
    const m = Matrix.identity(4);
    m.set(0, 1, x_y);
    m.set(0, 2, x_z);

    m.set(1, 0, y_x);
    m.set(1, 2, y_z);

    m.set(2, 0, z_x);
    m.set(2, 1, z_y);

    return m;
}
