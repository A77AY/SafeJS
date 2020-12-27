import { setSerializer } from "./set";

describe("Set", () => {
    it("should determine", () => {
        expect(setSerializer.determine(new Set())).toBeTruthy();
    });
});
