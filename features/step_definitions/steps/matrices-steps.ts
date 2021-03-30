import {StepDefinitions} from "jest-cucumber";
import {Matrix, rotation_x, scaling, translation} from "../../../src/matrix";
import {parseArg, Util} from "../../../src/util";
import {Tuple} from "../../../src/tuple";
import {DataTableType, MatrixArray} from "../types";
import {tuples} from "../steps";

export let matrices: MatrixArray;

export const matricesSteps: StepDefinitions = ({given, and, when, then}) => {
    beforeAll(() => {
            matrices = {identity_matrix: Matrix.identity()}
        }
    )

    function parseMatrixTable(cols: string, rows: string, data: DataTableType): Matrix {
        const M = new Matrix(parseInt(cols), parseInt(rows));
        for (let r = 0; r < parseInt(rows); ++r) {
            const row = data[r];
            for (let c = 0; c < parseInt(cols); ++c) {
                M.set(r, c, parseArg(row[`col${c}`]));
            }
        }
        return M;
    }

    given(/the following (\d+)x(\d+) matrix (\w+):/, (rows: string, cols: string, matId: string, data) => {
            matrices[matId] = parseMatrixTable(cols, rows, data);
        }
    )

    given(/inverse\((\w+)\) is the following (\d+)x(\d+) matrix:/, (matId: string, rows: string, cols: string, data) => {
            matrices[matId] = parseMatrixTable(cols, rows, data).inverse
        }
    )

    given(/(\w+) ← identity_matrix/, (matATId: string) => {
        matrices[matATId] = matrices['identity_matrix'];
    })

    given(/the following matrix A:/, (dataTable: DataTableType) => {
        matrices['A'] = createMatrixFromDataTable(dataTable);
    })

    given(/(\w+) ← transpose\((.*)\)/, (matATId: string, matAId: string) => {
        matrices[matATId] = matrices[matAId].transpose;
    })

    given(/^([\w\d_]+) ← submatrix\((\w+), (\d+), (\d+)\)$/, (subMatId: string, matId: string, r: string, c: string) => {
        matrices[subMatId] = matrices[matId].subMatrix(parseInt(r), parseInt(c));
    })

    given(/^([\w\d_]+) ← inverse\((\w+)\)$/, (matBId: string, matAId: string) => {
        matrices[matBId] = matrices[matAId].inverse;
    })

    given(/^([\w\d_]+) ← translation\(([^,]+), ([^,]+), ([^,]+)\)$/, (tId: string, x: string, y: string, z: string) => {
        matrices[tId] = translation(parseArg(x), parseArg(y), parseArg(z));
    })

    given(/^([\w\d_]+) ← scaling\(([^,]+), ([^,]+), ([^,*]+)\)$/, (tId: string, x: string, y: string, z: string) => {
        matrices[tId] = scaling(parseArg(x), parseArg(y), parseArg(z));
    })

    given(/^([\w_]+) ← rotation_x\(π \/ (\d+)\)$/, (tId: string, x: string) => {
        matrices[tId] = rotation_x(Math.PI / parseInt(x));
    })

    and(/the following matrix B:/, (dataTable: DataTableType) => {
        matrices['B'] = createMatrixFromDataTable(dataTable);
    })

    when(/^([\w\d_]+) ← (\w+) \* (\w+)$/, (matCId: string, lhsId: string, rhsId: string) => {
        if (matrices[rhsId]) {
            matrices[matCId] = Matrix.multiply(matrices[lhsId], matrices[rhsId]);
        } else if (tuples[rhsId]) {
            tuples[matCId] = Matrix.multiplyVector(matrices[lhsId], tuples[rhsId]);
        } else {
            throw new Error('Could not figure out which ops to test')
        }
    })

    when(/^T ← C \* B \* A$/, () => {
        matrices['T'] = Matrix.multiply((Matrix.multiply(matrices['C'], matrices['B'])), matrices['A']);
    })

    then(/^(\w+)\[(\d+),(\d+)] = (.*)$/,
        (matId: string, row: string, col: string, expectedValue: string) => {
            const actual = matrices[matId].get(parseInt(row), parseInt(col));
            expect(actual).toBeCloseTo(parseArg(expectedValue), Util.EPSILON);
        })

    then(/^([ABCt]) = ([ABCI]|identity_matrix)$/, (a, b) => {
        expect(Matrix.equals(matrices[a], matrices[b])).toBeTruthy();
    })

    then(/^C \* inverse\(B\) = A$/, () => {
        const actual = Matrix.multiply(matrices['C'], matrices['B'].inverse);
        const expected = matrices['A'];
        expect(Matrix.equals(actual, expected)).toBeTruthy();
    })

    then(/^([AB]) != ([AB])$/, (lhs: string, rhs: string) => {
        expect(Matrix.equals(matrices[lhs], matrices[rhs])).toBeFalsy();
    })

    then(/^(\w+) \* (\w+) is the following 4x4 matrix:$/,
        (matAId: string, matBId: string, dataTable: DataTableType) => {
            const expected = createMatrixFromDataTable(dataTable);
            const actual = Matrix.multiply(matrices[matAId], matrices[matBId]);

            expect(Matrix.equals(actual, expected)).toBeTruthy();
        })

    then(/^(\w+) \* identity_matrix = (\w+)$/, (matAId: string, matBId) => {
        const actual = Matrix.multiply(matrices[matAId], matrices['identity_matrix']);
        const expected = matrices[matBId];
        expect(Matrix.equals(actual, expected)).toBeTruthy();
    })

    then(/^(\w+) = (\w+) \* identity_matrix$/, (matAId: string, matBId: string) => {
        const actual = Matrix.multiply(matrices[matBId], matrices['identity_matrix']);
        const expected = matrices[matAId];
        expect(Matrix.equals(actual, expected)).toBeTruthy();
    })

    then(/^identity_matrix \* (\w+) = (\w+)$/, (tupleAId: string, tupleBId: string) => {
        const actual = Matrix.multiplyVector(matrices['identity_matrix'], tuples[tupleAId]);
        const expected = tuples[tupleBId];
        expect(Tuple.equals(actual, expected)).toBeTruthy();
    })

    then(/^transpose\((\w+)\) is the following matrix:$/, (matAId: string, dataTable: DataTableType) => {
        const actual = matrices[matAId].transpose;
        const expected = createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expected)).toBeTruthy();
    })

    then(/^determinant\((\w+)\) = (.*)$/, (matId: string, value: string) => {
        const actual = matrices[matId].det;
        const expected = parseArg(value);
        expect(actual).toBeCloseTo(expected, Util.EPSILON);
    })

    then(/^submatrix\((\w+), (\d+), (\d+)\) is the following (\d+)x(\d+) matrix:$/,
        (matId: string, r: string, c: string, dimZ: string, dimY: string, dataTable: DataTableType) => {
            const actual = matrices[matId].subMatrix(parseInt(r), parseInt(c));
            const expected = createMatrixFromDataTable(dataTable);
            expect(Matrix.equals(actual, expected)).toBeTruthy();
        })

    then(/^minor\((\w+), (\d+), (\d+)\) = (.*)$/, (matId: string, r: string, c: string, value: string) => {
        const actual = matrices[matId].minor(parseInt(r), parseInt(c));
        const expected = parseArg(value);
        expect(actual).toBeCloseTo(expected, Util.EPSILON);
    })

    then(/^cofactor\((\w+), (\d+), (\d+)\) = (.*)$/, (matId: string, r: string, c: string, value: string) => {
        const actual = matrices[matId].cofactor(parseInt(r), parseInt(c));
        const expected = parseArg(value);
        expect(actual).toBeCloseTo(expected, Util.EPSILON);
    })

    then(/^(\w+) is invertible$/, (matId: string) => {
        const actual = matrices[matId].invertible;
        expect(actual).toBeTruthy();
    })

    then(/^(\w+) is not invertible$/, (matId: string) => {
        const actual = matrices[matId].invertible;
        expect(actual).toBeFalsy();
        try {
            matrices[matId].inverse
        } catch (e) {
            expect(e).toEqual('Cannot invert this matrix')
        }
    })

    then(/^(\w+) is the following 4x4 matrix:$/, (matBId: string, dataTable: DataTableType) => {
        const expected = createMatrixFromDataTable(dataTable);
        const actual = matrices[matBId];
        expect(Matrix.equals(actual, expected)).toBeTruthy();
    })

    function createMatrixFromDataTable(dataTable: DataTableType) {
        const data = dataTable;
        const rows = data.length;
        const cols = Object.keys(data[0]).length;
        const expected = new Matrix(cols, rows);

        for (let r = 0; r < rows; ++r) {
            const row = data[r];
            for (let c = 0; c < cols; ++c) {
                expected.set(r, c, parseArg(row[`col${c}`]));
            }
        }
        return expected;
    }
}