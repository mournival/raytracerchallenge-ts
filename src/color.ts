export type RGBElement = 'red' | 'green' | 'blue';

export class Color {
    static BLACK = new Color(0, 0, 0);
    static readonly EPSILON = 0.0001;

    constructor(public readonly red: number,
                public readonly green: number,
                public readonly blue: number,
    ) {
    }

    static asString(c: Color): any {
        return c.red + ' ' + c.green + ' ' + c.blue;
    }

    static asPPMString(c: Color): any {
        return Color.mapColor(c.red) + ' ' + Color.mapColor(c.green) + ' ' + Color.mapColor(c.blue);
    }

    static mapColor(n: number): number {
        if (n <= 0) return 0;
        if (n >= 1) return 255;
        return Math.round(255 * n);
    }

    static equals(lhs: Color, rhs: Color): boolean {
        return Math.abs(lhs.red - rhs.red) < Color.EPSILON &&
            Math.abs(lhs.green - rhs.green) < Color.EPSILON &&
            Math.abs(lhs.blue - rhs.blue) < Color.EPSILON;
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

    static multiplyScalar(lhs: Color, rhs: number): Color {
        return new Color(
            lhs.red * rhs,
            lhs.green * rhs,
            lhs.blue * rhs
        );
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