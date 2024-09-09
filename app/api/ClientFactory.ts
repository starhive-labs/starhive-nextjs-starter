import {StarhiveClient} from "./starhive/client/StarhiveClient";

export function starhiveApiToken() {
    return process.env.STARHIVE_API_TOKEN
}

export function starhiveWorkspaceId() {
    return process.env.STARHIVE_WORKSPACE_ID
}

export function createClient(): StarhiveClient {
    if (starhiveWorkspaceId() === 'undefined') throw new Error('Workspace id is not set')
    if (starhiveApiToken() === 'undefined') throw new Error('API token is not set')
    return new StarhiveClient(starhiveApiToken()!, starhiveWorkspaceId()!, new Map())
}
