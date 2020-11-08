var help = ["I need somebody ♪♫", "Not just anybody ♪♫", "You know I need someone. ♪♫", "HEEEEEELP ♪♫"];
var helpIndex = 0;
var mainTerm;

$(function () {
    var timer;
    var prompt;
    var i;
    var anim = false;
    var animSpinner = false;
    var spinnerFrames =
    [
        "%#你的&$^(@#%",
        ")(@!*闻起@$^&*(",
        "(!@*&#^@*^$&*@",
        "&@*(#)^!@&(*亲",
        "}{:@!是一@#@只仓",
        "母[亲!*仓鼠%#",
        "是ae一#$et只",
        "亲@%来dU3种",
        "你@#$%父GASD",
        "你父!@#$gas@#",
        "你@$#%父asd%@"
    ];
    function typed(finish_typing) {
        return function (term, message, delay, finish) {
            anim = true;
            var prompt = term.get_prompt();
            var c = 0;
            if (message.length > 0) {
                term.set_prompt('');
                var interval = setInterval(function () {
                    term.insert(message[c++]);
                    if (c == message.length) {
                        clearInterval(interval);
                        // execute in next interval
                        setTimeout(function () {
                            // swap command with prompt
                            finish_typing(term, message, prompt);
                            anim = false;
                            finish && finish();
                        }, delay);
                    }
                }, delay);
            }
        };
    }
    var typed_prompt = typed(function (term, message, prompt) {
        // swap command with prompt
        term.set_command('');
        term.set_prompt(message + ' ');
    });
    var typed_message = typed(function (term, message, prompt) {
        term.set_command('');
        term.echo(message);
        term.set_prompt(prompt);
    });

    $("#terminal").terminal(function (cmd, term) {
        mainTerm = term;
        processCommand(cmd.trim(), term);

    }, {
        name: 'mainterm',
        greetings: "",
        onInit: function (term) {
            var msg = "Y Terminal 0.2";
            typed_message(term, msg, 50, function () {
            });
        },
        keydown: function (e) {
            //disable keyboard when animating
            if (anim || animSpinner) {
                return false;
            }
        }
    });

    function processCommand(cmd, term) {
        if (cmd.toLowerCase().startsWith("youtube")) {
            var params = cmd.split(" ");
            if (params.length > 1) {
                var messageid = params[1];
                $.showYtVideo({
                    videoId: messageid
                });
            }
        } else if (cmd.toLowerCase() === "greetings") {
            $.showYtVideo({
                videoId: "_I7wYEkr59c"
            });
        } else if (cmd.toLowerCase() === "fuck you") {
            $.showYtVideo({
                videoId: "dQw4w9WgXcQ"
            });
        } else if (cmd.toLowerCase() === "help") {
            var msg = help[(helpIndex % 4)];
            helpIndex++;
            term.set_prompt('> ');
            typed_message(term, msg, 50, function () {
            });
        } else if (cmd.toLowerCase() === "hello") {
            var msg = "Hello World!";
            term.set_prompt('> ');
            typed_message(term, msg, 50, function () {
            });
        } else if (cmd.toLowerCase() === "hi") {
            var msg = "Greetings";
            term.set_prompt('> ');
            typed_message(term,
                msg,
                50,
                function() {
                });
        } else {
            serverDecrypt(cmd);
        }
    }

    function serverDecrypt(input) {
        var uri = 'http://y2thez.com/YAccessPorts/YHubPort13/Process?';
        startSpinner();
        $.getJSON(uri, {
            Input: input
        })
        .done(function (data) {
            stopSpinner();
                if (data && data.Output) {
                    messageDecrypted(data.Output);
                } else {
                    decryptionFailed('Deryption Failed');
                }
            })
            .fail(function() {
                stopSpinner();
                decryptionFailed('Decryption Port Unreachable.');
            });
        
    }

    function startSpinner() {
        animSpinner = true;
        i = 0;
        function set() {
            var text = spinnerFrames[i++ % spinnerFrames.length];
            mainTerm.set_prompt(text);
        };
        prompt = mainTerm.get_prompt();
        mainTerm.find('.cursor').hide();
        set();
        timer = setInterval(set, 80);
    }
    function stopSpinner() {
        animSpinner = false;
        setTimeout(function () {
            clearInterval(timer);
            var frame = spinnerFrames[i % spinnerFrames.length];
            mainTerm.echo("");
            mainTerm.find('.cursor').show();

        }, 0);
    }

    function messageDecrypted(msg) {
        if (msg.startsWith("vid")) {
            var params = msg.split(" ");
            if (params.length > 1) {
                var vidId = params[1];
                $.showYtVideo({
                    videoId: vidId
                });
                mainTerm.set_prompt('> ');
            } else {
                printOutput(msg);
            }
        } else {
            printOutput(msg);
        }
    }

    function printOutput(msg) {
        
        typed_message(mainTerm, msg, 50, function () {
            mainTerm.set_prompt('> ');
        });
    }

    function decryptionFailed(msg) {
        printOutput(msg);
    }
});

