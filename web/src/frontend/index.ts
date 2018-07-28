import { CreateMatchRequest } from '../dto/CreateMatchRequest';
import { CreateMatchResponse } from '../dto/CreateMatchResponse';

function beep() {
    ($ as any).playSound('/sounds/beep-21.mp3');
}

let player1Id: string | undefined;
let player2Id: string | undefined;

$('td.player1').mouseenter(beep);
$('td.player2').mouseenter(beep);
$('td.player1').click(beep);
$('td.player2').click(beep);
$('#editChamp').click(beep);

$('td').click(function() {
    let toRemove = '';
    if ($(this).hasClass('player1')) {
        toRemove = 'player1';
        player1Id = $(this).attr('data-player-id');
        $('#editChamp').removeClass('disabled');
        $('#editChamp').attr('href', '/champion#' + player1Id);
    } else {
        toRemove = 'player2';
        player2Id = $(this).attr('data-player-id');
    }

    $('td.' + toRemove).removeClass('selected');
    $(this).addClass('selected');

    if (player1Id != null && player2Id != null) {
        setTimeout(() => {
            $('#start').css('display', 'block');
            $('#start').css('font-size', '80px');

            $('#start')
                .stop()
                .animate(
                    { 'font-size': 60 },
                    {
                    duration: 200,
                    specialEasing: {
                        width: 'linear',
                        height: 'easeOutBounce'
                    }
                    }
                );
        }, 1);
    }

    $(this).css('font-size', 30);
    $(this)
        .stop()
        .animate({ 'font-size': 20 }, 100);
});

$('#start')
    .mouseenter(function() {
        $(this)
            .stop()
            .animate({ 'font-size': 70 }, 100);
    })
    .mouseleave(function() {
        $(this)
            .stop()
            .animate({ 'font-size': 60 }, 200);
    })
    .click(function() {
        beep();
        $(this)
            .stop()
            .animate({ 'font-size': 65 }, 50)
            .animate({ 'font-size': 70 }, 50);
        createGame();
    });

function createGame() {
    const request: CreateMatchRequest = new CreateMatchRequest();
    request.champions = [ player1Id as string, player2Id as string ];
    $.post('/api/create-game', request, (res: CreateMatchResponse) => {
        window.location.href = res.url;
    });
}
