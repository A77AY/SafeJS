import { ConstantExtraSerializer } from "../../types";

export const negativeInfinitySerializer: ConstantExtraSerializer<number> = {
    determine: (v) => v === Number.NEGATIVE_INFINITY,
    deserialize: () => Number.NEGATIVE_INFINITY,
};
