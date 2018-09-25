import { storage } from 'frontend/services/storage';

export function editorInitialState() {
    return {
        code: storage.loadCode()
    }
}

export type EditorState = ReturnType<typeof editorInitialState>;
