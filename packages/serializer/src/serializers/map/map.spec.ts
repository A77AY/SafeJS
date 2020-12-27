import { mapSerializer } from "./map";

describe("Map", () => {
    it("should serialize", () => {
        expect(mapSerializer.serialize(new Map())).toEqual([]);
    });
});
