import { getConfig } from '../config';

export function SQLColumnType_mediumText() {
    return (getConfig().db.type === 'mysql') ? 'mediumtext' : 'text';
}
