import { getConfig } from '../../../config';

export function SQLColumnType_mediumText() {
    return (getConfig().db.type === 'mysql') ? 'mediumtext' : 'text';
}

export function isDuplicateEntryViolation(e: Error) {
    return /UNIQUE constraint failed|ER_DUP_ENTRY/.test(e.message);
}