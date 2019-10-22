import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';
import {Canvas} from '../../src/canvas';
import {Matrix} from '../../src/matrix';
import {Ray} from '../../src/ray';
import {Intersection} from '../../src/intersection';
import {Light} from '../../src/light';
import {Material} from '../../src/material';
import {World} from '../../src/world';
import {Camera} from '../../src/camera';
import {Shape} from '../../src/shape';
import {Pattern} from '../../src/pattern';
import {ObjFile, Parser} from '../../src/obj_file';

interface TupleArray {
    [index: string]: Tuple;
}

interface ColorArray {
    [index: string]: Color;
}

interface CanvasArray {
    [index: string]: Canvas;
}

interface MatrixArray {
    [index: string]: Matrix;
}

interface RayArray {
    [index: string]: Ray;
}

interface IntersectionArrayArray {
    [index: string]: Intersection[];
}

interface IntersectionArray {
    [index: string]: Intersection;
}

interface LightsArray {
    [index: string]: Light;
}

interface MaterialsArray {
    [index: string]: Material;
}

interface WorldArray {
    [index: string]: World;
}

interface NumberArray {
    [index: string]: number;
}

interface CameraArray {
    [index: string]: Camera;
}

interface BooleanArray {
    [index: string]: boolean;
}

interface ShapeArray {
    [index: string]: Shape;
}

interface PatternArray {
    [index: string]: Pattern;
}

interface ObjFileArray {
    [index: string]: ObjFile;
}

interface ParserArray {
    [index: string]: Parser;
}

export class Workspace {
    public tuples: TupleArray = {};
    public canvases: CanvasArray = {};
    public colors: ColorArray = {};
    public matrices: MatrixArray = {};
    public rays: RayArray = {};
    public shapes: ShapeArray = {};
    public intersection: IntersectionArray = {};
    public intersections: IntersectionArrayArray = {};
    public lights: LightsArray = {};
    public materials: MaterialsArray = {};
    public worlds: WorldArray = {};
    public numbers: NumberArray = {};
    public cameras: CameraArray = {};
    public tests: BooleanArray = {};
    public patterns: PatternArray = {};
    public objFiles: ObjFileArray = {};
    public parsers: ParserArray = {};

    getTransform(shapeId: string) {
        let actual = new Matrix(0, 0);

        if (this.shapes[shapeId]) {
            actual = this.shapes[shapeId].transform;
        } else if (this.cameras[shapeId]) {
            actual = this.cameras[shapeId].transform;
        } else if (this.patterns[shapeId]) {
            actual = this.patterns[shapeId].transform;
        }
        return actual;
    }
}

export function shouldEqualMsg(actual: Object|null, expected: Object): string {
    return JSON.stringify(actual) + ' should equal ' + JSON.stringify(expected);
    // return actual + ' should equal ' + expected;
}

