import {binding, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {SmoothTriangle} from '../../src/shapes/smooth-triangle';
import {point, Tuple, vector} from '../../src/tuple';
import {expect} from 'chai';
import {parseArg} from '../../src/util';

@binding([Workspace])
class SmoothTrianglesSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← smooth_triangle\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public givenSmoothTriangleByVertexIds(shapeId: string, p1Id: string, p2Id: string, p3Id: string, n1Id: string, n2Id: string, n3Id: string) {
        this.workspace.shapes[shapeId] = new SmoothTriangle(
            this.workspace.tuples[p1Id],
            this.workspace.tuples[p2Id],
            this.workspace.tuples[p3Id],
            this.workspace.tuples[n1Id],
            this.workspace.tuples[n2Id],
            this.workspace.tuples[n3Id]
        );
    }


    @then(/^([\w\d_]+).(n[123]) = \2$/)
    public thenVertexIs(smoothTriangleId: string, vertexId: string) {
        let actual: Tuple;
        switch (vertexId) {
            case 'n1':
                actual = (this.workspace.shapes[smoothTriangleId] as SmoothTriangle).n1;
                break;
            case 'n2':
                actual = (this.workspace.shapes[smoothTriangleId] as SmoothTriangle).n2;
                break;
            case 'n3':
                actual = (this.workspace.shapes[smoothTriangleId] as SmoothTriangle).n3;
                break;
            default:
                throw new Error('Unexpected normal id');
                actual = vector(0, 0, 0);
        }
        const expected = this.workspace.tuples[vertexId];
        expect(Tuple.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^(\w+)\[(\d+)].u = ([^,]+)$/)
    public thenIntersectionU(intersectionsId: string, intersectionIndex: string, value: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].u;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @then(/^(\w+)\[(\d+)].v = ([^,]+)$/)
    public thenIntersectionV(intersectionsId: string, intersectionIndex: string, value: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)].v;
        const expected = parseArg(value);
        expect(actual).to.be.closeTo(expected, 0.0001);
    }

    @when(/^([\w\d_]+) ← normal_at\((\w+), point\(([^,]+), ([^,]+), ([^,]+)\), i\)$/)
    public whenNormalAtUV(normalId: string, shapeId: string, x: string, y: string, z: string) {
        this.workspace.tuples[normalId] = this.workspace.shapes[shapeId].normal_at(
            point(parseArg(x), parseArg(y), parseArg(z)),
            this.workspace.intersection['i']
        );
    }

}

export = SmoothTrianglesSteps;