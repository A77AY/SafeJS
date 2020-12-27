import { Serializer } from "./serializer";

const json = {
    null: null,
    true: true,
    false: false,
    0: 0,
    1: 1,
    integer: 1234567890,
    number: 1234567890.0123456789,
    minus: -1234567890.0123456789,
    string: "hello world!",
    empty: "",
    object: { empty: {} },
    array: [[]],
};

const recursiveObject = { recursive1: null, secondLevel: { recursive2: null } };
recursiveObject.recursive1 = recursiveObject;
recursiveObject.secondLevel.recursive2 = recursiveObject;

const constants = {
    undefined: undefined,
    nan: NaN,
    positiveInfinity: Infinity,
    negativeInfinity: -Infinity,
    array: [undefined, NaN, Infinity, -Infinity],
};

const es5 = {
    date: new Date("2000-12-17T01:23:10Z"),
    regExp: /\d/,
};

const recursiveMap = new Map();
recursiveMap.set(0, recursiveMap);
const recursiveSet = new Set();
recursiveSet.add(recursiveSet);
const es2015 = {
    symbol: Symbol("test"),

    set: new Set<any>([1, "a"]),
    recursiveSet,

    map: new Map<any, any>([
        [2, "b"],
        ["c", 3],
    ]),
    recursiveMap,
};

describe("Serializer", () => {
    it("should serialize/deserialize simple JSON", () => {
        const serializer = new Serializer({ preset: "none" });
        expect(serializer.deserialize(serializer.serialize(json))).toEqual(json);
    });

    it("should serialize/deserialize JS types to null by default", () => {
        const serializer = new Serializer({ preset: "none" });
        expect(serializer.deserialize(serializer.serialize(constants))).toEqual({
            undefined: undefined,
            nan: null,
            positiveInfinity: null,
            negativeInfinity: null,
            array: [null, null, null, null],
        });
    });

    it("should serialize/deserialize recursive objects", () => {
        const serializer = new Serializer({ preset: "none" });
        expect(serializer.deserialize(serializer.serialize(recursiveObject))).toEqual(recursiveObject);
    });

    it("should serialize/deserialize JS constants & JSON", () => {
        const serializer = new Serializer({ preset: "constants" });
        expect(
            serializer.deserialize(
                serializer.serialize({
                    ...json,
                    ...constants,
                })
            )
        ).toEqual({
            ...json,
            ...constants,
        });
    });

    it("should serialize/deserialize ES5 types & constants", () => {
        const serializer = new Serializer({ preset: "es5" });
        expect(
            serializer.deserialize(
                serializer.serialize({
                    ...json,
                    ...constants,
                    ...es5,
                })
            )
        ).toEqual({
            ...json,
            ...constants,
            ...es5,
        });
    });

    it("should serialize/deserialize ES2015 & ES5 types", () => {
        const serializer = new Serializer({ preset: "es2015" });
        const deserialized = serializer.deserialize(serializer.serialize({ ...json, ...constants, ...es5, ...es2015 }));
        expect({
            ...deserialized,
            symbol: deserialized.symbol.toString(),
        }).toEqual({
            ...json,
            ...constants,
            ...es5,
            ...es2015,
            symbol: es2015.symbol.toString(),
        });
    });
});
