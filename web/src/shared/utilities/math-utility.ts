/**
 * Created by vlad on 23/05/17.
 */

export class MathUtility {
    public static sqft2sqm(value: number) {
        return value * 0.0929;
    }

    public static sqm2sqft(value: number) {
        return value * 10.7639;
    }
}