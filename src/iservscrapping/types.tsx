export type IservFile = {
    name?: String,
    url?: String,
    type?: "file",
    size?: String
}

export type Task = {
    title?: String,
    from?: String,
    type?: "upload" | "confirmation" | "text",
    description?: String,
    providedFiles?: Array<IservFile>,
    uploadedFiles?: Array<IservFile>,
    uploadedText?: String,
    feedbackText?: String,

}