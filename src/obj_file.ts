import {point, Tuple, vector} from './tuple';
import {parseArg} from './util';
import {Group, Shape, SmoothTriangle, Triangle} from './shapes';
import {Material} from './material';
import {Matrix} from './matrix';

interface GroupArray {
    [index: string]: Group;
}

export class Parser {

    groups: GroupArray = {};

    public readonly vertices: Tuple[];
    public readonly normals: Tuple[];
    public readonly ignoredCount: number;

    constructor(public readonly lines: string[]) {
        let skipped = 0;
        let verts: Tuple[] = [];
        let norms: Tuple[] = [];
        let triangles: Shape[] = [];
        let group_name = 'default_group';
        lines.map(l => l.toString()).forEach(l => {
            if (l.startsWith('v ')) {
                let tokens: string[] = l.trim().split(' ');
                if (tokens.length != 4) {
                    skipped++;
                } else {
                    verts.push(point(parseArg(tokens[1]), parseArg(tokens[2]), parseArg(tokens[3])));
                }
            } else if (l.startsWith('vn ')) {
                let tokens: string[] = l.trim().split(' ');
                if (tokens.length != 4) {
                    skipped++;
                } else {
                    norms.push(vector(parseArg(tokens[1]), parseArg(tokens[2]), parseArg(tokens[3])));
                }
            } else if (l.startsWith('f ')) {
                let tokens: string[] = l.trim().split(' ');
                if (tokens.length < 4) {
                    skipped++;
                } else {
                    const hasNormalData = tokens[1].includes('/');

                    for (let j = 2; j < tokens.length - 1; ++j) {
                        if (hasNormalData) {
                            const t1 = tokens[1].split('/');
                            const t2 = tokens[j].split('/');
                            const t3 = tokens[j + 1].split('/');
                            const smoothTriangle = new SmoothTriangle(
                                verts[parseArg(t1[0]) - 1],
                                verts[parseArg(t2[0]) - 1],
                                verts[parseArg(t3[0]) - 1],
                                norms[parseArg(t1[2]) - 1],
                                norms[parseArg(t2[2]) - 1],
                                norms[parseArg(t3[2]) - 1]);
                            triangles.push(smoothTriangle);
                        } else {
                            triangles.push(new Triangle(
                                verts[parseArg(tokens[1]) - 1],
                                verts[parseArg(tokens[j]) - 1],
                                verts[parseArg(tokens[j + 1]) - 1])
                            );
                        }
                    }
                }
            } else if (l.startsWith('g ')) {
                this.groups[group_name] = new Group(Matrix.identity(), new Material(), triangles);
                group_name = l.slice(2).trim();
                triangles = [];
            } else if (l.startsWith('vn ')) {
                let tokens: string[] = l.trim().split(' ');
                if (tokens.length != 4) {
                    skipped++;
                } else {
                    norms.push(vector(parseArg(tokens[1]), parseArg(tokens[2]), parseArg(tokens[3])));
                }
            } else {
                skipped++;
            }
        });

        this.ignoredCount = skipped;
        this.vertices = verts;
        this.normals = norms;
        this.groups[group_name] = new Group(Matrix.identity(), new Material(), triangles);
    }

    public getGroup(name?: string): Group {
        if (name) {
            return this.groups[name];
        }
        let grps: Group[] = [];
        for(let g in this.groups) {
            if (this.groups[g].children.length > 0) {
                grps.push(this.groups[g]);
            }
        }
        return new Group(Matrix.identity(), new Material(), grps);
    }

}

export class ObjFile {
    constructor(public readonly data: String) {
    }

    public get parser(): Parser {
        return new Parser(this.data.split('\n'));
    }

}
