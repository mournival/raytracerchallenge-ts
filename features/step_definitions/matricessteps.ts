import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix} from "../../src/matrix";
import {Tuple} from "../../src/tuple";

// Float regex: [+-]?\d*?\.?\d*

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
                this.workspace.matrices[matId].set(r, c, parseFloat(data[r][c]));
            }
        }
    };

    @then(/^(\w+)\[(\d+),(\d+)] = ([+-]?\d*?\.?\d*)$/)
    public checkMatrixElement(matId: string, row: string, col: string, expectedValue: string) {
        const actual = this.workspace.matrices[matId].get(parseInt(row), parseInt(col));
        expect(actual).to.be.closeTo(parseFloat(expectedValue), Matrix.EPSILON);
    }

    @given(/the following matrix (\w+):/)
    public givenAMatrix(matId: string, dataTable: { rawTable: [][] }) {
        this.workspace.matrices[matId] = MatricesSteps.createMatrixFromDataTable(dataTable);
    };


    @then(/^A = B$/)
    public matrixAEqualsB() {
        expect(Matrix.equals(this.workspace.matrices['A'], this.workspace.matrices['B'])).to.be.true;
    }

    @then(/^A != B$/)
    public matrixANotEqualsB() {
        expect(Matrix.equals(this.workspace.matrices['A'], this.workspace.matrices['B'])).to.be.false;
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

    @given(/^A ← transpose\(identity_matrix\)$/)
    public givenTransposeIdentity() {
    }

    @then(/^A = identity_matrix$/)
    public transposeI() {
        const actual = Matrix.transpose(Matrix.identity(4));
        const expected = Matrix.identity(4);
        expect(Matrix.equals(actual, expected)).to.be.true;
    }

    private static createMatrixFromDataTable(dataTable: { rawTable: [][] }) {
        const data = dataTable.rawTable;
        const rows = data.length;
        const cols = data[0].length;

        const expected = new Matrix(rows, cols);
        for (let r = 0; r < rows; ++r) {
            for (let c = 0; c < cols; ++c) {
                expected.set(r, c, parseFloat(data[r][c]));
            }
        }
        return expected;
    }


}

export = MatricesSteps;