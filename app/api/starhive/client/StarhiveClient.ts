import {StarhiveObject} from "./StarhiveObject"

import axios, {AxiosResponse, RawAxiosRequestHeaders} from 'axios'
import {AttributeVisitor} from "./AttributeVisitor"
import {OptionValue} from "./OptionValue"
import {JsonDecoder} from "./JsonDecoder"
import {JsonAttributeValue} from "./JsonAttributeValue"
import {StarhivePage} from "./StarhivePage";
import {ContentMetadata} from "./ContentMetadata";
import {PresignedUrl} from "./PresignedUrl";
import {StreamData} from "./StreamData";
import {Location} from "./Location";
import {User} from "./User";
import {WorkflowState, WorkflowTransition} from "./Workflow";
import {StarhiveType} from "@/app/api/starhive/client/StarhiveType";
import {StarhiveTypeEnriched} from "@/app/api/starhive/client/StarhiveTypeEnriched";
import {StarhiveSpace} from "@/app/api/starhive/client/StarhiveSpace";

type BulkRequest = {
    operations: BulkOperations[]
}

export type BulkResponse = {
    failures: boolean,
    result: (BulkItemResultSuccess | BulkItemResultFailure)[]
}

export type BulkItemResultSuccess = {
    status: 'success',
    operationAction: 'CREATE' | 'PATCH' | 'DELETE',
    index: number
    objectId: string
}

export type BulkItemResultFailure = {
    status: 'failure',
    operationAction: 'CREATE' | 'PATCH' | 'DELETE',
    index: number
    violations: Violations[]
}

export type Violations = {
    fieldIdentifier?: string,
    domain?: string,
    violationType?: string,
    invalidValue?: string
}

type BulkOperations = CreateBulkOperation | UpdateBulkOperation | DeleteBulkOperation

type ObjectData = {
    typeId?: string,
    attributes?: AttributeInput[],
    transitions?: TransitionsInput
}

type CreateBulkOperation = {
    objectOperationType: 'create',
    typeId: string,
    attributes?: AttributeInput[]
    transitions?: TransitionsInput
}

type UpdateBulkOperation = {
    objectOperationType: 'patch',
    objectId: string,
    attributes?: AttributeInput[]
    transitions?: TransitionsInput
}

type DeleteBulkOperation = {
    objectOperationType: 'delete',
    objectId: string
}

type AttributeInput = {
    attributeId: string,
    values: string[]
}

type TransitionsInput = {
    [attributeId: string]: { transitionId: string }
}


export class StarhiveClient {
    private readonly baseUrl: string
    private readonly apiToken: string
    private readonly workspaceId: string
    private readonly client: any
    readonly decoders: Map<string, () => JsonDecoder<any>>

    constructor(apiToken: string, workspaceId: string,
                decoders: Map<string, () => JsonDecoder<any>>, baseUrl: string = "https://api.starhive.com/public/v1") {
        this.apiToken = apiToken
        this.workspaceId = workspaceId
        this.baseUrl = baseUrl
        this.decoders = decoders
        this.client = axios.create({
            baseURL: this.baseUrl,
        })
    }

    /**
     * Retrieves a single object based on the object id.
     * @example
     *import { Newspaper } from "./starhive/schema/Newspaper"
     *const getNewspaper = async ({ objectId }: { objectId: string }) => await client.getObject(objectId, Newspaper.TYPE_ID)
     *
     *const myNewspaperObject = await getNewspaper('d2d61f41-800d-4354-99e8-808d9a45d20f')
     */
    async getObject<T extends StarhiveObject>(id: string, typeId: string): Promise<T> {
        const config = this.getRequestConfig();
        const response: AxiosResponse = await this.client.get(`/object/${id}`, config)
        const decoder = this.decoders.get(typeId)!!();
        return this.parseJsonObject(response.data, decoder)
    }

    createRequestObject<T extends StarhiveObject>(object: T): ObjectData {
        const attributes: AttributeInput[] = []
        const transitions: TransitionsInput = {}
        const objectData: ObjectData = {}
        objectData['attributes'] = attributes
        objectData['transitions'] = transitions
        const visitor: AttributeVisitor = {
            visitBooleanAttribute(attributeId: string, values: boolean[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitDateAttribute(attributeId: string, values: Date[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => new Intl.DateTimeFormat('se', { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(v).map(p => p.value).join(''))
                })
            }, visitDatetimeAttribute(attributeId: string, values: Date[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toISOString())
                })
            }, visitDecimalAttribute(attributeId: string, values: number[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitIntegerAttribute(attributeId: string, values: number[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitOptionAttribute(attributeId: string, values: OptionValue[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.getValue())
                })
            }, visitTextAttribute(attributeId: string, values: string[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitURLAttribute(attributeId: string, values: URL[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitReferenceAttribute(attributeId: string, values: string[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitLocationAttribute(attributeId: string, values: Location[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => JSON.stringify(v))
                })
            }, visitIpAddressAttribute(attributeId: string, values: string[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitEmailAttribute(attributeId: string, values: string[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.toString())
                })
            }, visitUserAttribute(attributeId: string, values: User[] | undefined): void {
                if (values == undefined) return
                attributes.push({
                    attributeId: attributeId,
                    values: values.map(v => v.id)
                })
            }, visitWorkflowAttribute(attributeId: string, value: WorkflowState | undefined, transition: WorkflowTransition | undefined): void {
                if (value == undefined && transition == undefined) return
                if (value) {
                    attributes.push({
                        attributeId: attributeId,
                        values: [value.id]
                    })
                } else if (transition) {
                    attributes.push({
                        attributeId: attributeId,
                        values: [transition.to.id]
                    })
                }
                if (transition) {
                    transitions[attributeId] = {'transitionId': transition.id}
                }
            }
        }
        object.accept(visitor)
        return objectData
    }

    /**
     * Create a Starhive Object
     * @example
     *import { Shoes } from "./starhive/schema/Shoes"
     *type Size = 'XL' | 'L' | 'M' | 'S'
     *type color = 'white' | 'black'
     *const createShoe = async ({ size, color }: { size: Size, color: Color }) => await client.createObject(
     *    Shoes.builder().size(size).color(color).build()
     *  )
     *createShoe({ size: 'XL', color: 'white' })
     */
    async createObject<T extends StarhiveObject>(object: T): Promise<T> {
        try {
            const objectData = this.createRequestObject(object)
            objectData['typeId'] = object.getTypeId()
            const config = this.getRequestConfig();
            const response: AxiosResponse = await this.client.post(`/object`, objectData, config)
            const decoder = this.decoders.get(object.getTypeId())!!
            return this.parseJsonObject(response.data, decoder())
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    /**
     * Update an object within Starhive.
     *
     * The method will remove values (except of type workflow) that are not provided in the argument.
     * In other words if the intention is to only update a single attribute do load the object prior to updating it.
     * @example
     *import { Shoes } from "./starhive/schema/Shoes"
     *type color = 'white' | 'black'
     *const changeColor = async ({ color }: { color: Color }) => await client.patchObject(
     *    Shoes.builder().color(color).build()
     *  )
     *changeColor({ color: 'white' })
     */
    async updateObject<T extends StarhiveObject>(object: T): Promise<T> {
        if (!object.getId()) {
            throw new Error("Object id is missing")
        }
        try {
            const objectData = this.createRequestObject(object)
            const config = this.getRequestConfig();
            const response: AxiosResponse = await this.client.patch(`/object/${object.getId()}`, objectData, config)
            const decoder = this.decoders.get(object.getTypeId())!!
            return this.parseJsonObject(response.data, decoder())
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    /**
     * Creates or updates objects in bulk.
     *
     * If an object has an assigned id it will be treated as an update and if id is null the object will be treated as an object to be created.
     */
    async createOrUpdateObjectsInBulk<T extends StarhiveObject>(objects: T[]): Promise<BulkResponse> {
        const bulkOperations: (UpdateBulkOperation | CreateBulkOperation)[] = objects.map((object) => {
            const objectId = object.getId()
            let request: (UpdateBulkOperation | CreateBulkOperation)
            if (objectId) {
                request = {
                    objectOperationType: 'patch',
                    objectId: objectId
                }
            } else {
                request = {
                    objectOperationType: 'create',
                    typeId: object.getTypeId()
                }
            }
            const objectData = this.createRequestObject(object)
            request['attributes'] = objectData.attributes
            request['transitions'] = objectData.transitions
            return request
        })
        const request: BulkRequest = ({'operations': bulkOperations})
        return this.bulkRequest(request)
    }

    /**
     * Delete objects in bulk.
     *
     * This uses the Starhive public bulk API that has a limitation of how many objects can be deleted at the same time. Currently that limitation is 80.
     */
    async deleteObjectsInBulk(objectIds: string[]): Promise<BulkResponse> {
        const deleteOperations: DeleteBulkOperation[] = objectIds.map((id) => ({
            'objectOperationType': 'delete',
            'objectId': id
        }))
        const request: BulkRequest = ({'operations': deleteOperations})
        return this.bulkRequest(request)
    }

    private async bulkRequest(request: BulkRequest): Promise<BulkResponse> {
        const config = this.getRequestConfig()
        const response = await this.client.post(`/object/bulk`, request, config)
        return response.data as BulkResponse
    }

    private getRequestConfig() {
        return {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'starhive-workspace-id': this.workspaceId,
            } as RawAxiosRequestHeaders,
        }
    }

    /**
     * Search for objects of a given Starhive Type with the default pagination parameters.
     *
     * With this method you can search Objects of a specific Type using a {@link https://help.starhive.com/space/DOC/6094851/Filtering+by+StarQL | starQL} query.
     * @example
     * import { Shoes } from "./starhive/schema/Shoes"
     * const getShoes = async (starQL: string) => {
     *   return await client.search(Shoes.TYPE_ID, starQL)
     * }
     * const result = getShoes('Name = Zoom')
     */
    async search<T extends StarhiveObject>(typeId: string, query: string, offset: number = 0, limit: number = 50): Promise<StarhivePage<T>> {
        const config = this.getRequestConfig();
        const response: AxiosResponse = await this.client.get(`/search?typeId=${typeId}&offset=${offset}&limit=${limit}&query=${encodeURIComponent(query)}`, config)
        const total = parseInt(response.data.total)
        const pageSize = parseInt(response.data.pageSize)
        const isLast = JSON.parse(response.data.isLast)
        const objects = response.data.result.map((jsonObject: any) => {
            const decoder = this.decoders.get(jsonObject.typeId)!!();
            return this.parseJsonObject(jsonObject, decoder)
        });
        return new StarhivePage<T>(total, pageSize, isLast, objects)
    }

    private async getUploadUrl(contentMetadata: ContentMetadata): Promise<PresignedUrl> {
        const requestBody = {
            fileName: contentMetadata.fileName,
            fileSize: contentMetadata.fileSizeInBytes,
            contentType: contentMetadata.httpContentType
        }
        let response = await this.client.post(`/content`, requestBody, this.getRequestConfig())
        return new PresignedUrl(response.data.presignedUrl, response.data.contentKey)
    }

    private async uploadData(uploadUrl: PresignedUrl, contentMetadata: ContentMetadata, data: Uint8Array | ArrayBuffer) {
        const response: AxiosResponse = await this.client.put(uploadUrl.presignedUrl, data, {
            headers: {
                'Content-Disposition': `attachment; filename=${encodeURIComponent(contentMetadata.fileName)}`,
                'Content-Length': contentMetadata.fileSizeInBytes,
                'Content-Type': contentMetadata.httpContentType,
            } as RawAxiosRequestHeaders,
        })
    }

    private parseJsonObject<T>(body: any, decoder: JsonDecoder<any>): T {
        decoder.setId(body.id)
        body.attributes.forEach((e: any) => {
            const values = e.values.map((v: any) => new JsonAttributeValue(v.valueId, v.value, v.details))
            decoder.visitJsonAttribute(e.attributeId, values)
        })
        return decoder.build() as T
    }

    /**
     * Upload media data from memory to Starhive in order to be able to use it as an attribute value.
     * @example
     * const media =
     Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"...</svg>`, 'utf8')
     * const contentType = 'image/svg+xml'
     *
     * const newProduct = Product
     *   .builder()
     *   .name('My product')
     *   .date(new Date())
     *   .brand("My Brand")
     *   .addMediaData(await client.uploadInMemoryStreamData('article', media.length, contentType, media))
     *   .build()
     */
    async uploadInMemoryStreamData(name: string, size: number, contentType: string, data: Uint8Array | ArrayBuffer): Promise<StreamData> {
        let metadata = new ContentMetadata(name, size, contentType);
        let uploadUrl = await this.getUploadUrl(metadata);
        await this.uploadData(uploadUrl, metadata, data)
        return {
            contentKey: uploadUrl.contentKey
        }
    }


    /**
     * Upload media data from a file to Starhive in order to be able to use it as an attribute value.
     * @example
     * const media = new File([fs.readFileSync("./myfile.jpg")], "myfile.jpg")
     * const contentType = 'image/jpeg'
     *
     * const newProduct = Product
     *   .builder()
     *   .name('My product')
     *   .date(new Date())
     *   .brand("My Brand")
     *   .addMediaData(await client.uploadFileStreamData(file, contentType))
     *   .build()
     */
    async uploadFileStreamData(file: File, contentType: string): Promise<StreamData> {
        const data = await file.arrayBuffer()
        let metadata = new ContentMetadata(file.name, file.size, contentType);
        let uploadUrl = await this.getUploadUrl(metadata);
        await this.uploadData(uploadUrl, metadata, data)
        return {
            contentKey: uploadUrl.contentKey
        }
    }

    async getSpaces(offset: number = 0, limit: number = 50): Promise<StarhivePage<StarhiveSpace>> {
        const config = this.getRequestConfig();
        const response: AxiosResponse = await this.client.get(`/space?offset=${offset}&limit=${limit}`, config)
        const total = parseInt(response.data.total)
        const pageSize = parseInt(response.data.pageSize)
        const isLast = JSON.parse(response.data.isLast)
        const spaces = response.data.result.map((jsonObject: any) => {
            return {id: jsonObject.id, name: jsonObject.name}
        });
        return new StarhivePage<StarhiveSpace>(total, pageSize, isLast, spaces)
    }

    async getTypes(offset: number = 0, limit: number = 50): Promise<StarhivePage<StarhiveType>> {
        const config = this.getRequestConfig();
        const response: AxiosResponse = await this.client.get(`/type?offset=${offset}&limit=${limit}`, config)
        const total = parseInt(response.data.total)
        const pageSize = parseInt(response.data.pageSize)
        const isLast = JSON.parse(response.data.isLast)
        const types = response.data.result.map((jsonObject: any) => {
            return {id: jsonObject.id, name: jsonObject.name}
        });
        return new StarhivePage<StarhiveType>(total, pageSize, isLast, types)
    }

    async getTypesEnriched(offset: number = 0, limit: number = 50): Promise<StarhivePage<StarhiveTypeEnriched>> {
        const config = this.getRequestConfig();
        const response: AxiosResponse = await this.client.get(`/type/enriched?offset=${offset}&limit=${limit}`, config)
        const total = parseInt(response.data.total)
        const pageSize = parseInt(response.data.pageSize)
        const isLast = JSON.parse(response.data.isLast)
        const types = response.data.result.map((jsonObject: any) => {
            const attributes = jsonObject.attributes.map((jsonAttribute: any) => {
                return {
                    id: jsonAttribute.id,
                    name: jsonAttribute.name,
                    attributeTypeId: jsonAttribute.attributeTypeId
                }
            })
            return {id: jsonObject.id, name: jsonObject.name, attributes: attributes}
        });
        return new StarhivePage<StarhiveTypeEnriched>(total, pageSize, isLast, types)
    }

}
