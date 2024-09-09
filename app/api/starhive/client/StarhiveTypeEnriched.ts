import {StarhiveAttribute} from "@/app/api/starhive/client/StarhiveAttribute";

export type StarhiveTypeEnriched = {
    readonly id: string
    readonly name: string
    readonly attributes: StarhiveAttribute[]
}
