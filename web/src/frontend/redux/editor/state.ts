
export function editorInitialState() {
    return {
        code: null as string | null
    }
}

export type EditorState = ReturnType<typeof editorInitialState>;
