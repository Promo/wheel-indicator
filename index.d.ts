declare module 'wheel-indicator' {
    type ValueOf<T> = T[keyof T];

    type WheelIndicatorEvent = WheelEvent & {
        direction: 'up' | 'down';
    }

    interface Options {
        elem?: HTMLElement | string;
        callback?: (event: WheelIndicatorEvent) => void;
        preventMouse?: boolean;
    }

    export default class WheelIndicator {
        constructor(options: Options);

        destroy(): WheelIndicator;

        getOption(option: keyof Options): ValueOf<Options>;

        setOptions(options: Options): WheelIndicator;

        turnOff(): WheelIndicator;

        turnOn(): WheelIndicator;
    }
}
