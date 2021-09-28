//Using JQuery
$(function (){

    const socket = io();

    //obtaining DOM elements from the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    const $actions = $('#actions')

    //obtaining DOM elements from the Nickname Form
    const $nickForm = $('#nickForm');
    const $nickname = $('#nickname');
    const $nickError = $('#nickError');

    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new-user', $nickname.val(), data => {
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else{
                $nickError.html(`
                    <div class="alert alert-danger">
                        That user already exists
                    </div>
                `);
            }
            $nickname.val('');
        });
    });

    //events
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send-message',$messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    $messageBox.keydown(() => {
        const data = $messageBox.val();
        socket.emit('chat:typing', data);
    });

    $messageBox.keyup(() => {
        setTimeout(()=> {socket.emit('chat:no-typing');},1000);
    });


    socket.on('new-message', data => {
        $actions.html('');
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]} </p>`;
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $actions.html('');
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`)
    });

    socket.on('load old msgs', msgs =>{
        for (let i = 0; i < msgs.length; i++) {
            displayMessage(msgs[i]);
        }
    });

    function displayMessage (data){
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`)
    }

    socket.on('chat:typing', (data) => {
        $actions.html(`<p><em>   ${data} is typing... </em></p>`)
    });

    socket.on('chat:no-typing', () => {
        $actions.html('');
    });

});
