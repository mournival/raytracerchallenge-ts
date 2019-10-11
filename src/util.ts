export class Util {
    public static readonly EPSILON = 0.0001;

    static closeTo(lhs: number, rhs: number) {
        return Math.abs(lhs - rhs) < Util.EPSILON;
    }
}
