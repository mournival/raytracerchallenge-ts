import {Tuple} from "./tuple";

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

    static equals(lhs: Matrix, rhs: Matrix): boolean {
        if (lhs.data.length !== rhs.data.length ||
            lhs.data[0].length !== rhs.data[0].length
        ) {
            return false;
        }
        for (let r = 0; r < lhs.data.length; ++r) {
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

    static transpose(m: Matrix): Matrix {
        let mPrime = new Matrix(m.data[0].length, m.data.length);
        for (let r = 0; r < 4; ++r) {
            for (let c = 0; c < 4; ++c) {
                mPrime.data[c][r] = m.data[r][c];
            }
        }
        return mPrime;
    }

    static determinant(m: Matrix): number {
        if (m.data.length === 2) {
            return Matrix.det2(m);
        }

        let dt: number = 0;
        for (let c = 0; c < m.data[0].length; ++c) {
            dt = dt + m.data[0][c] * Matrix.cofactor(m, 0, c);
        }
        return dt;
    }

    static subMatrix(m: Matrix, rrow: number, rcol: number): Matrix {
        const mMinor = new Matrix(m.data.length - 1, m.data[0].length - 1);

        for (let r = 0; r < m.data.length; ++r) {
            for (let c = 0; c < m.data[0].length; ++c) {
                if (r != rrow && c != rcol) {
                    mMinor.data[r < rrow ? r : r - 1][c < rcol ? c : c - 1] = m.data[r][c];
                }
            }
        }
        return mMinor;
    }

    static minor(m: Matrix, r: number, c: number): number {
        return Matrix.determinant(Matrix.subMatrix(m, r, c));
    }

    static cofactor(m: Matrix, r: number, c: number): number {
        const coeff = (r + c) % 2 === 0 ? 1 : -1;
        return coeff * Matrix.minor(m, r, c);
    }

    static isInvertible(m: Matrix): boolean {
        return Math.abs(Matrix.determinant(m)) > Matrix.EPSILON;
    }

    static inverse(m: Matrix): Matrix {
        if (!Matrix.isInvertible(m)) {
            throw "Cannot invert this matrix";
        }

        const m_prime = new Matrix(m.data.length, m.data[0].length);
        const det = Matrix.determinant(m);
        for (let r = 0; r < m.data.length; ++r) {
            for (let c = 0; c < m.data[0].length; ++c) {
                const cofactorC = Matrix.cofactor(m, r, c);
                m_prime.data[c][r] = cofactorC / det;
            }
        }
        return m_prime;
    }

    // static add(lhs: Matrix, rhs: Matrix): Matrix {
    //     const ldata = lhs.data;
    //     const rdata = rhs.data;
    //     if ((ldata.length != rdata.length) || (ldata[0].length != rdata[0].length))
    //         throw 'Can\'t add matrices of different dimensions';
    //
    //     const m = new Matrix(ldata.length, ldata[0].length);
    //     for (let r = 0; r < ldata.length; ++r)
    //         for (let c = 0; c < ldata[0].length; ++c)
    //             m.data[r][c] = ldata[r][c] + rdata[r][c];
    //
    //     return m;
    // }
    //
    // static copy(m: Matrix): Matrix {
    //     return Matrix.add(m, new Matrix(m.data.length, m.data[0].length));
    // }

    private static vectorDot(lhs: Matrix, rhs: Tuple, r: number) {
        return lhs.data[r][0] * rhs.x +
            lhs.data[r][1] * rhs.y +
            lhs.data[r][2] * rhs.z +
            lhs.data[r][3] * rhs.w;
    }

    private static det2(m: Matrix): number {
        const d = m.data;
        return d[0][0] * d[1][1] - d[0][1] * d[1][0];
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