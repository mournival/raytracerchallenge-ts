import {binding, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {Triangle} from '../../src/shapes/triangle';
import {point, Tuple, vector} from '../../src/tuple';
import {expect} from 'chai';
import {fail} from 'assert';
import {parseArg} from '../../src/util';

@binding([Workspace])
class TrianglesSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← triangle\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public givenTriangleByVertexIds(shapeId: string, p1Id: string, p2Id: string, p3Id: string) {
        this.workspace.shapes[shapeId] = new Triangle(
            this.workspace.tuples[p1Id],
            this.workspace.tuples[p2Id],
            this.workspace.tuples[p3Id]
        );
    }


    @then(/^([\w\d_]+).(p[123]) = \2$/)
    public thenVertexIs(triangleId: string, vertexId: string) {
        let actual: Tuple;
        switch (vertexId) {
            case 'p1':
                actual = (this.workspace.shapes[triangleId] as Triangle).p1;
                break;
            case 'p2':
                actual = (this.workspace.shapes[triangleId] as Triangle).p2;
                break;
            case 'p3':
                actual = (this.workspace.shapes[triangleId] as Triangle).p3;
                break;
            default:
                fail('Unexpected vertex id');
                actual = vector(0, 0, 0);
        }
        const expected = this.workspace.tuples[vertexId];
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).(e[123]) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenEdgeIs(triangleId: string, edgeId: string, x: string, y: string, z: string) {
        let actual: Tuple;
        switch (edgeId) {
            case 'e1':
                actual = (this.workspace.shapes[triangleId] as Triangle).e1;
                break;
            case 'e2':
                actual = (this.workspace.shapes[triangleId] as Triangle).e2;
                break;
            default:
                fail('Unexpected edge id');
                actual = vector(0, 0, 0);
        }
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w\d_]+).(normal) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenNormalIs(triangleId: string, edgeId: string, x: string, y: string, z: string) {
        const actual = (this.workspace.shapes[triangleId] as Triangle).normal;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @when(/^([\w\d_]+) ← triangle\(point\(([^,]+), ([^,]+), ([^,]+)\), point\(([^,]+), ([^,]+), ([^,]+)\), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/)
    public givenTriangleByPoints(shapeId: string,
                                 p1xId: string, p1yId: string, p1zId: string,
                                 p2xId: string, p2yId: string, p2zId: string,
                                 p3xId: string, p3yId: string, p3zId: string) {
        this.workspace.shapes[shapeId] = new Triangle(
            point(parseArg(p1xId), parseArg(p1yId), parseArg(p1zId)),
            point(parseArg(p2xId), parseArg(p2yId), parseArg(p2zId)),
            point(parseArg(p3xId), parseArg(p3yId), parseArg(p3zId))
        );
    }

    @then(/^([\w\d_]+) = ([\w\d_]+).normal$/)
    public thenNormalVectorIs(normalId: string, triangleId: string) {
        const actual = (this.workspace.shapes[triangleId] as Triangle).normal;
        const expected = this.workspace.tuples[normalId];
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }
}

export = TrianglesSteps;