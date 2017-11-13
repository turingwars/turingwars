import { IAPIParseError } from '../dto/APIParseError';
import { CreateOrUpdateChampionRequest } from '../dto/CreateOrUpdateChampionRequest';

declare const CHAMPION_ID: string;
declare const editor: any;

$('#submitButton').click((evt) => {
    evt.preventDefault();
    const newChampion = new CreateOrUpdateChampionRequest();
    newChampion.id = CHAMPION_ID;
    newChampion.code = editor.getValue();
    newChampion.name = $('#editName').val() as any;

    const errorMarks: any[] = [];

    $.post({
        url: '/api/create-champion',
        data: JSON.stringify(newChampion),
        headers: {
            'Content-Type': 'application/json'
        },
        success: () => {
            window.location.href = '/';
        },
        error: (e) => {
            const casted = e.responseJSON as IAPIParseError;

            if (casted.compilerError) {
                for (const err of casted.compilerError.errors) {
                    const pos = err.pos;

                    const from = { line: pos.line, ch: pos.ch - 1 };
                    const to = { line: pos.line, ch: pos.ch};

                    errorMarks.push(editor.markText(from, to, {className: 'syntax-error', title: err.message}));
                }
            }
        }
    });
});
