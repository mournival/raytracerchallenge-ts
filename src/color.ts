import {Util} from './util';

export type RGBElement = 'red' | 'green' | 'blue';

export class Color {
    static BLACK = new Color(0, 0, 0);
    static RED = new Color(1, 0, 0);

    static WHITE = new Color(1, 1, 1);
    static CLEMSON_ORANGE = new Color(0.9647, 0.4039, 0.2);

    constructor(public readonly red: number,
                public readonly green: number,
                public readonly blue: number,
    ) {
    }

    static mapColor(n: number): number {
        const c = Math.round(255 * n);
        if (c < 0) return 0;
        if (c > 255) return 255;
        return c;
    }

    static equals(lhs: Color, rhs: Color): boolean {
        return Util.closeTo(lhs.red, rhs.red) &&
            Util.closeTo(lhs.green, rhs.green) &&
            Util.closeTo(lhs.blue, rhs.blue);
    }

    static add(lhs: Color, rhs: Color): Color {
        return new Color(
            lhs.red + rhs.red,
            lhs.green + rhs.green,
            lhs.blue + rhs.blue
        );
    }

    static subtract(lhs: Color, rhs: Color): Color {
        return new Color(
            lhs.red - rhs.red,
            lhs.green - rhs.green,
            lhs.blue - rhs.blue
        );
    }

    static multiply(lhs: Color, rhs: Color): Color {
        return new Color(
            lhs.red * rhs.red,
            lhs.green * rhs.green,
            lhs.blue * rhs.blue
        );
    }

    scale(s: number): Color {
        return new Color(
            this.red * s,
            this.green * s,
            this.blue * s
        );
    }

    asString(): string {
        return this.red + ' ' + this.green + ' ' + this.blue;
    }

    asPPMString(): any {
        return Color.mapColor(this.red) + ' ' + Color.mapColor(this.green) + ' ' + Color.mapColor(this.blue);
    }

    getElement(e: RGBElement): number {
        switch (e) {
            case  'red':
                return this.red;
            case 'green':
                return this.green;
            default:
                return this.blue;

        }
    }
}
