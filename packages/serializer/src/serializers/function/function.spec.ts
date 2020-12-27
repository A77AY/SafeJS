import { functionSerializer } from "./function";

describe("Function", () => {
    it("should serialize", () => {
        const fnStr = 'function (){   return "a"; }';
        expect(functionSerializer.serialize(eval(`(${fnStr}).toString()`))).toBe(fnStr);
    });
});
