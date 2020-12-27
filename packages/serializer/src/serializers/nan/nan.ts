import { ConstantExtraSerializer } from "../../types";

export const nanSerializer: ConstantExtraSerializer<number> = {
    determine: (v) => Number.isNaN(v),
    deserialize: () => NaN,
};
