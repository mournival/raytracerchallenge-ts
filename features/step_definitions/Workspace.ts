import {Tuple} from '../../src/tuple';
import {Color} from '../../src/color';
import {Canvas} from '../../src/canvas';
import {Matrix} from '../../src/matrix';
import {Ray} from '../../src/ray';
import {Sphere} from '../../src/sphere';
import {Intersection} from '../../src/intersection';
import {Light} from '../../src/light';
import {Material} from '../../src/material';
import {World} from '../../src/world';
import {Camera} from '../../src/camera';
import {InterceptableShape, Shape} from '../../src/shape';

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
    [index: string]: InterceptableShape;
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

}

export function shouldEqualMsg(actual: Object, expected: Object): string {
    return JSON.stringify(actual) + ' should equal ' + JSON.stringify(expected);
}

export function parseArg(s: string): number {
    if (typeof s === 'number')
        return s;

    s = s.trim();

    // int
    if (s.match(/^[+-]?\d+$/))
        return parseInt(s);

    // simple float
    if (s.match(/^([+-]?\d*?\.\d*)$/))
        return parseFloat(s);

    // √
    if (s.match(/^√\d+\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return Math.sqrt(parseInt(matchArray[0].slice(1))) / parseInt(matchArray[1]);
    }
    if (s.match(/^-√\d+\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return -Math.sqrt(parseInt(matchArray[0].slice(2))) / parseInt(matchArray[1]);
    }

    // π
    if (s.match(/^π\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return Math.PI / parseInt(matchArray[1]);
    }

    // rational
    if (s.match(/^[+-]?\d+\s*\/\s*\d+$/)) {
        const matchArray = s.split('/');
        return parseInt(matchArray[0]) / parseInt(matchArray[1]);
    }
    if (s.match(/^√\d+$/)) {
        const matchArray = s.split('/');
        return Math.sqrt(parseInt(matchArray[0].slice(1)));
    }

    // irrational ratio
    throw 'Parse error: ' + s;

}