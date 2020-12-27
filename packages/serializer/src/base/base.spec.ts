import { BaseSerializer } from "./base-serializer";
import { BaseDeserializer } from "./base-deserializer";
import {
    mapSerializer,
    undefinedSerializer,
    positiveInfinitySerializer,
    negativeInfinitySerializer,
    nanSerializer,
    dateSerializer,
    regExpSerializer,
    symbolSerializer,
    setSerializer,
} from "../serializers";

describe("Base Serializer/Deserializer", () => {
    it("should serialize/deserialize simple JSON", () => {
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
        const serialized = BaseSerializer.serialize(json);

        expect(serialized).toBe(
            JSON.stringify([
                {
                    "0": 0,
                    "1": 1,
                    null: null,
                    true: true,
                    false: false,
                    integer: 1234567890,
                    number: 1234567890.0123458,
                    minus: -1234567890.0123458,
                    string: "hello world!",
                    empty: "",
                    object: { empty: {} },
                    array: [[]],
                },
            ])
        );
        expect(BaseDeserializer.deserialize(serialized)).toEqual(json);
    });

    it("should serialize/deserialize recursive objects", () => {
        const recursiveObject = { recursive1: null, secondLevel: { recursive2: null } };
        recursiveObject.recursive1 = recursiveObject;
        recursiveObject.secondLevel.recursive2 = recursiveObject;
        const serialized = BaseSerializer.serialize(recursiveObject);

        expect(serialized).toBe(JSON.stringify(["°0", { recursive1: "°0", secondLevel: { recursive2: "°0" } }]));
        expect(BaseDeserializer.deserialize(serialized)).toEqual(recursiveObject);
    });

    it("should serialize/deserialize undefined, NaN, +-Infinity", () => {
        const serializers = {
            map: mapSerializer,
            und: undefinedSerializer,
            pos: positiveInfinitySerializer,
            neg: negativeInfinitySerializer,
            nan: nanSerializer,
        };
        const constants = {
            undefined: undefined,
            nan: NaN,
            positiveInfinity: Infinity,
            negativeInfinity: -Infinity,
            array: [undefined, NaN, Infinity, -Infinity],
        };
        const serialized = BaseSerializer.serialize(constants, serializers);

        expect(serialized).toBe(
            JSON.stringify([
                {
                    undefined: "°0",
                    nan: "°1",
                    positiveInfinity: "°2",
                    negativeInfinity: "°3",
                    array: ["°0", "°1", "°2", "°3"],
                },
                "und",
                "nan",
                "pos",
                "neg",
            ])
        );
        expect(BaseDeserializer.deserialize(serialized, serializers)).toEqual(constants);
    });

    it("should serialize/deserialize Date, RegExp", () => {
        const serializers = {
            date: dateSerializer,
            regExp: regExpSerializer,
        };
        const es5 = {
            date: new Date("2000-12-17T01:23:10Z"),
            regExp: /\d/,
        };
        const serialized = BaseSerializer.serialize(es5, serializers);

        expect(serialized).toBe(
            JSON.stringify([
                { date: ["°0", "2000-12-17T01:23:10.000Z"], regExp: ["°1", ["\\d", ""]] },
                "date",
                "regExp",
            ])
        );
        expect(BaseDeserializer.deserialize(serialized, serializers)).toEqual(es5);
    });

    it("should serialize/deserialize Symbol, Map, Set", () => {
        const serializers = {
            symbolSerializer,
            mapSerializer,
            setSerializer,
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
        const serialized = BaseSerializer.serialize(es2015, serializers);

        expect(serialized).toBe(
            JSON.stringify([
                {
                    symbol: ["°0", "test"],
                    set: ["°1", [1, "a"]],
                    recursiveSet: "°2",
                    map: [
                        "°3",
                        [
                            [2, "b"],
                            ["c", 3],
                        ],
                    ],
                    recursiveMap: "°4",
                },
                "symbolSerializer",
                "setSerializer",
                ["°1", ["°2"]],
                "mapSerializer",
                ["°3", [[0, "°4"]]],
            ])
        );
        const deserialized = BaseDeserializer.deserialize(serialized, serializers);
        expect({
            ...deserialized,
            symbol: deserialized.symbol.toString(),
        }).toEqual({
            ...es2015,
            symbol: es2015.symbol.toString(),
        });
    });
});
