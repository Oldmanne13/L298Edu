//% color=#0fbc11 icon="\uf2db" block="L298Edu"
namespace L298Edu {

    // ---------------- P1-tilstand (Servo / NeoPixel) ----------------
    export enum P1Mode {
        //% block="Servo"
        Servo = 0,
        //% block="NeoPixel"
        NeoPixel = 1
    }
    let p1Mode: P1Mode = P1Mode.Servo

    /**
     * Vælg hvilken funktion P1 skal have.
     */
    //% block="P1 → %mode"
    //% group="P1"
    //% advanced=true
    export function setP1Mode(mode: P1Mode): void {
        pins.digitalWritePin(DigitalPin.P1, 0)
        p1Mode = mode
    }

    function ensureMode(expected: P1Mode): boolean {
        return p1Mode == expected
    }

    // ---------------- Motorer (BASIS) ----------------
    //% block="A frem %speed"
    //% speed.min=0 speed.max=1023
    //% group="Motor"
    export function motorAFrem(speed: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.analogWritePin(AnalogPin.P2, speed)
    }

    //% block="A baglæns %speed"
    //% speed.min=0 speed.max=1023
    //% group="Motor"
    export function motorABaglæns(speed: number): void {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.analogWritePin(AnalogPin.P2, speed)
    }

    //% block="Stop A"
    //% group="Motor"
    export function stopMotorA(): void {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P13, 0)   // ← rettet
        pins.analogWritePin(AnalogPin.P2, 0)
    }

    //% block="B frem %speed"
    //% speed.min=0 speed.max=1023
    //% group="Motor"
    export function motorBFrem(speed: number): void {
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.analogWritePin(AnalogPin.P8, speed)
    }

    //% block="B baglæns %speed"
    //% speed.min=0 speed.max=1023
    //% group="Motor"
    export function motorBBaglæns(speed: number): void {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.analogWritePin(AnalogPin.P8, speed)
    }

    //% block="Stop B"
    //% group="Motor"
    export function stopMotorB(): void {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.analogWritePin(AnalogPin.P8, 0)
    }

    //% block="A+B frem %speed"
    //% speed.min=0 speed.max=1023
    //% group="Motor"
    export function motorABFrem(speed: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.analogWritePin(AnalogPin.P2, speed)
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.analogWritePin(AnalogPin.P8, speed)
    }

    //% block="A+B baglæns %speed"
    //% speed.min=0 speed.max=1023
    //% group="Motor"
    export function motorABBaglæns(speed: number): void {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.analogWritePin(AnalogPin.P8, speed)
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.analogWritePin(AnalogPin.P2, speed)
    }

    // ---------------- Servo på P1 (AVANCERET) ----------------
    /**
     * Drej servo på P1 til vinkel (0–180°). Kræver at P1 er sat til Servo.
     */
    //% block="Servo P1: %vinkel °"
    //% vinkel.min=0 vinkel.max=180
    //% group="P1"
    //% advanced=true
    export function servoP1(vinkel: number): void {
        if (!ensureMode(P1Mode.Servo)) return
        pins.servoWritePin(AnalogPin.P1, vinkel)
    }

    // ---------------- NeoPixel på P1 (AVANCERET) ----------------
    /**
     * Initialisér WS2812 (NeoPixel) på P1 og returnér en strip.
     * Sætter P1 til NeoPixel-tilstand.
     */
    //% block="WS2812 P1: %n LED"
    //% n.min=1 n.max=300
    //% group="P1"
    //% advanced=true
    export function ws2812P1(n: number): neopixel.Strip {
        p1Mode = P1Mode.NeoPixel
        return neopixel.create(DigitalPin.P1, n, NeoPixelMode.RGB)
    }

    // ---------------- Ultralyd (AVANCERET) ----------------
    /**
     * Mål afstand i cm med HC-SR04 (P16 trigger, P10 echo).
     */
    //% block="Afstand (cm)"
    //% group="Sensor"
    //% advanced=true
    export function afstandCm(): number {
        basic.clearScreen()
        led.enable(false)

        pins.setPull(DigitalPin.P16, PinPullMode.PullNone)
        pins.digitalWritePin(DigitalPin.P16, 0)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P16, 1)
        control.waitMicros(10)
        pins.digitalWritePin(DigitalPin.P16, 0)

        const tid = pins.pulseIn(DigitalPin.P10, PulseValue.High)
        return Math.round(tid / 58)
    }
}
