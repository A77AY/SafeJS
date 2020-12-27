import { dateSerializer } from "./date";

describe("Date", () => {
    it("should serialize", () => {
        const date = "1992-12-10T12:32:21.000Z";
        expect(dateSerializer.serialize(new Date(date))).toBe("1992-12-10T12:32:21.000Z");
    });
});
