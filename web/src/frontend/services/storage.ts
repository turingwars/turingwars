
const CODE_STORAGE_KEY = 'tw-editor-code';

class Storage {

    public saveCode(code: string): void {
        localStorage.setItem(CODE_STORAGE_KEY, code);
    }

    public clearCode(): void {
        localStorage.removeItem(CODE_STORAGE_KEY)
    }

    public loadCode(): string | null {
        return localStorage.getItem(CODE_STORAGE_KEY);
    }
}

export const storage = new Storage();