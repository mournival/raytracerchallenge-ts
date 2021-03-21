import {before, binding, given, then} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix} from '../../src/matrix';
import {Tuple} from '../../src/tuple';
import {fail} from 'assert';
import {parseArg, Util} from '../../src/util';

@binding([Workspace])
class MatricesSteps {

    constructor(protected workspace: Workspace) {
    }

    private static createMatrixFromDataTable(dataTable: { rawTable: [][] }) {
        const data = dataTable.rawTable;
        const rows = data[0].length;
        const cols = data.length;

        const expected = new Matrix(rows, cols);
        for (let c = 0; c < cols; ++c) {
            for (let r = 0; r < rows; ++r) {
                expected.set(c, r, parseArg(data[c][r]));
            }
        }
        return expected;
    }

    @before()
    public beforeAllScenarios(): void {
        this.workspace.matrices['identity_matrix'] = Matrix.identity(4);
    }

    @given(/the following (\d+)x(\d+) matrix (\w+):/)
    public givenANxMMatrix(rows: string, cols: string, matId: string, dataTable: { rawTable: [][] }) {
        this.workspace.matrices[matId] = new Matrix(parseInt(rows), parseInt(cols));
        let data = dataTable.rawTable;
        for (let r = 0; r < parseInt(rows); ++r) {
            for (let c = 0; c < parseInt(cols); ++c) {
                this.workspace.matrices[matId].set(r, c, parseArg(data[r][c]));
            }
        }
    };

    @then(/^(\w+)\[(\d+),(\d+)] = (.*)$/)
    public checkMatrixElement(matId: string, row: string, col: string, expectedValue: string) {
        const actual = this.workspace.matrices[matId].get(parseInt(row), parseInt(col));
        expect(actual).to.be.closeTo(parseArg(expectedValue), Util.EPSILON);
    }

    @given(/the following matrix (\w+):/)
    public givenAMatrix(matId: string, dataTable: { rawTable: [][] }) {
        this.workspace.matrices[matId] = MatricesSteps.createMatrixFromDataTable(dataTable);
    };

    @then(/^A = B$/)
    public matrixAEqualsB() {
        expect(Matrix.equals(this.workspace.matrices['A'], this.workspace.matrices['B'])).to.be.true;
    }

    @then(/^C = B$/)
    public matrixCEqualsB() {
        expect(Matrix.equals(this.workspace.matrices['C'], this.workspace.matrices['B'])).to.be.true;
    }

    @then(/^matrix (\w+) != (\w+)$/)
    public matrixANotEqualsB(lhs: string, rhs: string) {
        expect(Matrix.equals(this.workspace.matrices[lhs], this.workspace.matrices[rhs])).to.be.false;
    }

    @then(/^(\w+) \* (\w+) is the following 4x4 matrix:$/)
    public matrixMultiplicationEquals(matAId: string, matBId: string, dataTable: { rawTable: [][] }) {
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        const actual = Matrix.multiply(this.workspace.matrices[matAId], this.workspace.matrices[matBId]);

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^(\w+) \* identity_matrix = (\w+)$/)
    public multiplyIdentityMatrixEqualsSame(matAId: string, matBId: string) {
        const A = this.workspace.matrices[matAId];
        const actual = Matrix.multiply(A, Matrix.identity(4));

        expect(Matrix.equals(actual, A)).to.be.true;
    }

    @then(/^identity_matrix \* ([\w\d_]+) = (\w+)$/)
    public multiplyIdentityMatrixVectorEqualsSame(vectorAId: string, vectorBId: string) {
        const a = this.workspace.tuples[vectorAId];
        const actual = Matrix.multiplyVector(Matrix.identity(4), a);
        expect(Tuple.equals(actual, a)).to.be.true;
    }

    @then(/^transpose\((\w+)\) is the following matrix:$/)
    public transposeM(matAId: string, dataTable: { rawTable: [][] }) {
        const actual = this.workspace.matrices[matAId].transpose;
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← transpose\((\w+)\)$/)
    public givenTransposeIdentity(matAId: string, matBId: string) {
        this.workspace.matrices[matAId] = this.workspace.matrices[matBId].transpose;
    }

    @then(/^([\w\d_]+) = identity_matrix$/)
    public mEqualsI(matId: string) {
        const actual = this.workspace.matrices[matId];
        const expected = Matrix.identity(4);
        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^determinant\((\w+)\) = (.*)$/)
    public thenDeterminantEquals(matId: string, value: string) {
        const actual = this.workspace.matrices[matId].det;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, Util.EPSILON);
    }

    @then(/^submatrix\((\w+), (\d+), (\d+)\) is the following (\d+)x(\d+) matrix:$/)
    public subMatrixEquals(matId: string, r: string, c: string, dimZ: string, dimY: string, dataTable: { rawTable: [][] }) {
        const actual = this.workspace.matrices[matId].subMatrix(parseInt(r), parseInt(c));
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← submatrix\((\w+), (\d+), (\d+)\)$/)
    public createSubmatrix(subMatId: string, matId: string, r: string, c: string) {
        return this.workspace.matrices[subMatId] = this.workspace.matrices[matId].subMatrix(parseInt(r), parseInt(c));
    }

    @then(/^minor\((\w+), (\d+), (\d+)\) = (.*)$/)
    public minorEquals(matId: string, r: string, c: string, value: string) {
        const actual = this.workspace.matrices[matId].minor(parseInt(r), parseInt(c));
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, Util.EPSILON);
    }

    @then(/^cofactor\((\w+), (\d+), (\d+)\) = (.*)$/)
    public cofactorEquals(matId: string, r: string, c: string, value: string) {
        const actual = this.workspace.matrices[matId].cofactor(parseInt(r), parseInt(c));
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, Util.EPSILON);
    }

    @then(/^(\w+) is invertible$/)
    public isInvertible(matId: string) {
        const actual = this.workspace.matrices[matId].invertible;
        expect(actual).to.be.true;
    }

    @then(/^(\w+) is not invertible$/)
    public isNotInvertible(matId: string) {
        const actual = this.workspace.matrices[matId].invertible;
        expect(actual).to.be.false;
    }

    @given(/^([\w\d_]+) ← inverse\((\w+)\)$/)
    public givenInverse(matBId: string, matAId: string) {
        this.workspace.matrices[matBId] = this.workspace.matrices[matAId].inverse;
    }

    @then(/^(\w+) is the following 4x4 matrix:$/)
    public matrixResultEquals(matBId: string, dataTable: { rawTable: [][] }) {
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        const actual = this.workspace.matrices[matBId];
        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^inverse\((\w+)\) is the following (\d+)x(\d+) matrix:$/)
    public inverseEquals(matId: string, dimR: string, dimC: string, dataTable: { rawTable: [][] }) {
        const actual = this.workspace.matrices[matId].inverse;

        const expectedR = parseInt(dimR);
        expect(expectedR).to.be.eq(actual.rDim);
        const expectedC = parseInt(dimC);
        expect(expectedC).to.be.eq(actual.cDim);

        const expectedA = MatricesSteps.createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expectedA)).to.be.true;
    }

    @given(/^([\w\d_]+) ← (\w+) \* (\w+)$/)
    public givenAProduct(matCId: string, lhsId: string, rhsId: string) {
        if (this.workspace.matrices[rhsId]) {
            this.workspace.matrices[matCId] = Matrix.multiply(this.workspace.matrices[lhsId], this.workspace.matrices[rhsId]);
        } else if (this.workspace.tuples[rhsId]) {
            this.workspace.tuples[matCId] = Matrix.multiplyVector(this.workspace.matrices[lhsId], this.workspace.tuples[rhsId]);
        } else {
            fail('Could not figure out which ops to test')
        }
    }

    @given(/^([\w\d_]+) ← (\w+) \* (\w+) \* (\w+)$/)
    public givenAChainedProduct(matCId: string, m1Id: string, m2Id: string, m3Id: string) {
        this.workspace.matrices[matCId] = Matrix.multiply(
            Matrix.multiply(this.workspace.matrices[m1Id], this.workspace.matrices[m2Id]), this.workspace.matrices[m3Id]);
    }

    @then(/^(\w+) \* inverse\((\w+)\) = (\w+)$/)
    public multiplyByInverseEquals(matCId: string, matBId: string, matAId: string,) {
        const expected = this.workspace.matrices[matAId];
        const actual = Matrix.multiply(this.workspace.matrices[matCId], this.workspace.matrices[matBId].inverse);
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @given(/^([\w\d_]+) ← identity_matrix\((\w+)\)$/)
    public givenIdentity(matId: string, dim: string) {
        this.workspace.matrices[matId] = Matrix.identity(parseInt(dim));
    }


}

export = MatricesSteps;