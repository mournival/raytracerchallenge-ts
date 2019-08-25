import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix} from "../../src/matrix";
import {Tuple} from "../../src/tuple";
import TupleSteps = require("./tuplesteps");

@binding([Workspace])
class MatricesSteps {

    constructor(protected workspace: Workspace) {
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
                this.workspace.matrices[matId].set(r, c, TupleSteps.parseArg(data[r][c]));
            }
        }
    };

    @then(/^(\w+)\[(\d+),(\d+)] = (.*)$/)
    public checkMatrixElement(matId: string, row: string, col: string, expectedValue: string) {
        const actual = this.workspace.matrices[matId].get(parseInt(row), parseInt(col));
        expect(actual).to.be.closeTo(TupleSteps.parseArg(expectedValue), Matrix.EPSILON);
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

    @then(/^A != B$/)
    public matrixANotEqualsB() {
        expect(Matrix.equals(this.workspace.matrices['A'], this.workspace.matrices['B'])).to.be.false;
    }

    @then(/^C!= B$/)
    public matrixCNotEqualsB() {
        expect(Matrix.equals(this.workspace.matrices['C'], this.workspace.matrices['B'])).to.be.false;
    }

    @then(/^(\w+) \* (\w+) is the following 4x4 matrix:$/)
    public matrixMultiplicationEquals(matAId: string, matBId: string, dataTable: { rawTable: [][] }) {
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        const actual = Matrix.multiply(this.workspace.matrices[matAId], this.workspace.matrices[matBId]);
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @then(/^(\w+) \* identity_matrix = (\w+)$/)
    public multiplyIdentityMatrixEqualsSame(matAId: string, matBId: string) {
        const A = this.workspace.matrices[matAId];
        const actual = Matrix.multiply(A, Matrix.identity(4));
        expect(Matrix.equals(actual, A)).to.be.true;
    }

    @then(/^identity_matrix \* (\w+) = (\w+)$/)
    public multiplyIdentityMatrixVectorEqualsSame(vectorAId: string, vectorBId: string) {
        const a = this.workspace.tuples[vectorAId];
        const actual = Matrix.multiplyVector(Matrix.identity(4), a);
        expect(Tuple.equals(actual, a)).to.be.true;
    }

    @then(/^transpose\((\w+)\) is the following matrix:$/)
    public transposeM(matAId: string, dataTable: { rawTable: [][] }) {
        const actual = Matrix.transpose(this.workspace.matrices[matAId]);
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @given(/^(\w+) ← transpose\((\w+)\)$/)
    public givenTransposeIdentity(matAId: string, matBId: string) {
        this.workspace.matrices[matAId] = Matrix.transpose(this.workspace.matrices[matBId]);
    }

    @then(/^A = identity_matrix$/)
    public transposeI() {
        const actual = Matrix.transpose(Matrix.identity(4));
        const expected = Matrix.identity(4);
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @then(/^determinant\((\w+)\) = (.*)$/)
    public thenDeterminantEquals(matId: string, value: string) {
        const actual = Matrix.determinant(this.workspace.matrices[matId]);
        const expected = TupleSteps.parseArg(value);
        expect(actual).to.be.closeTo(expected, Matrix.EPSILON);
    }

    @then(/^submatrix\((\w+), (\d+), (\d+)\) is the following (\d+)x(\d+) matrix:$/)
    public subMatrixEquals(matId: string, r: string, c: string, dimZ: string, dimY: string, dataTable: { rawTable: [][] }) {
        const actual = Matrix.subMatrix(this.workspace.matrices[matId], parseInt(r), parseInt(c));
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @given(/^(\w+) ← submatrix\((\w+), (\d+), (\d+)\)$/)
    public createSubmatrix(subMatId: string, matId: string, r: string, c: string) {
        return this.workspace.matrices[subMatId] = Matrix.subMatrix(this.workspace.matrices[matId], parseInt(r), parseInt(c));
    }

    @then(/^minor\((\w+), (\d+), (\d+)\) = (.*)$/)
    public minorEquals(matId: string, r: string, c: string, value: string) {
        const actual = Matrix.minor(this.workspace.matrices[matId], parseInt(r), parseInt(c));
        const expected = TupleSteps.parseArg(value);
        expect(actual).to.be.closeTo(expected, Matrix.EPSILON);
    }

    @then(/^cofactor\((\w+), (\d+), (\d+)\) = (.*)$/)
    public cofactorEquals(matId: string, r: string, c: string, value: string) {
        const actual = Matrix.cofactor(this.workspace.matrices[matId], parseInt(r), parseInt(c));
        const expected = TupleSteps.parseArg(value);
        expect(actual).to.be.closeTo(expected, Matrix.EPSILON);
    }

    @then(/^(\w+) is invertible$/)
    public isInvertible(matId: string) {
        const actual = Matrix.isInvertible(this.workspace.matrices[matId]);
        expect(actual).to.be.true;
    }

    @then(/^(\w+) is not invertible$/)
    public isNotInvertible(matId: string) {
        const actual = Matrix.isInvertible(this.workspace.matrices[matId]);
        expect(actual).to.be.false;
    }

    @given(/^(\w+) ← inverse\((\w+)\)$/)
    public givenInverse(matBId: string, matAId: string) {
        this.workspace.matrices[matBId] = Matrix.inverse(this.workspace.matrices[matAId]);
    }

    @then(/^(\w+) is the following 4x4 matrix:$/)
    public matrixResultEquals(matBId: string, dataTable: { rawTable: [][] }) {
        const expected = MatricesSteps.createMatrixFromDataTable(dataTable);
        const actual = this.workspace.matrices[matBId];
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @then(/^inverse\((\w+)\) is the following (\d+)x(\d+) matrix:$/)
    public inverseEquals(matId: string, dimR: string, dimC: string, dataTable: { rawTable: [][] }) {
        const actual = Matrix.inverse(this.workspace.matrices[matId]);

        const expectedR = parseInt(dimR);
        expect(expectedR).to.be.eq(actual.data.length);
        const expectedC = parseInt(dimC);
        expect(expectedC).to.be.eq(actual.data[0].length);

        const expectedA = MatricesSteps.createMatrixFromDataTable(dataTable);
        expect(Matrix.equals(actual, expectedA)).to.be.true;
    }

    @given(/^(\w+) ← (\w+) \* (\w+)$/)
    public givenAProduct(matCId: string, matAId: string, matBId: string) {
        this.workspace.matrices[matCId] = Matrix.multiply(this.workspace.matrices[matAId], this.workspace.matrices[matBId]);
    }

    @then(/^(\w+) \* inverse\((\w+)\) = (\w+)$/)
    public multiplyByInverseEquals(matCId: string, matBId: string, matAId: string,) {
        const expected = this.workspace.matrices[matAId];
        const actual = Matrix.multiply(this.workspace.matrices[matCId], Matrix.inverse(this.workspace.matrices[matBId]));
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    @given(/^(\w+) ← identity_matrix\((\w+)\)$/)
    public givenIdentity(matId: string, dim: string) {
        this.workspace.matrices[matId] = Matrix.identity(parseInt(dim));
    }

    private static createMatrixFromDataTable(dataTable: { rawTable: [][] }) {
        const data = dataTable.rawTable;
        const rows = data.length;
        const cols = data[0].length;

        const expected = new Matrix(rows, cols);
        for (let r = 0; r < rows; ++r) {
            for (let c = 0; c < cols; ++c) {
                expected.set(r, c, TupleSteps.parseArg(data[r][c]));
            }
        }
        return expected;
    }


}

export = MatricesSteps;