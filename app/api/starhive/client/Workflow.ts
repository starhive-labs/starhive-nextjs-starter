export type WorkflowState = {
    id: string,
    name: string,
    description?: string
}

export type WorkflowTransition = {
    id: string,
    description?: string
    from?: WorkflowState,
    to: WorkflowState
}
