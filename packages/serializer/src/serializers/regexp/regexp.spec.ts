import { regExpSerializer } from "./regexp";

describe("RegExp", () => {
    it("should serialize", () => {
        expect(regExpSerializer.serialize(/bar/g)).toEqual(["bar", "g"]);
    });
});
