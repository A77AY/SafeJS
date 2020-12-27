import { ConstantExtraSerializer } from "../../types";

export const positiveInfinitySerializer: ConstantExtraSerializer<number> = {
    determine: (v) => v === Number.POSITIVE_INFINITY,
    deserialize: () => Number.POSITIVE_INFINITY,
};
