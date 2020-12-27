import { symbolSerializer } from "./symbol";

describe("Symbol", () => {
    it("should determine", () => {
        expect(symbolSerializer.determine(Symbol())).toBeTruthy();
    });

    it("should serialize", () => {
        expect(symbolSerializer.serialize(Symbol())).toBe(null);
    });
});
