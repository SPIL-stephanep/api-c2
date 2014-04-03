(function(d, id) {
    var js,
        head = d.getElementsByTagName('head')[0];

    if (d.getElementById(id)) return;

    js = d.createElement('script');
    js.id = id;
    js.src = '//cdn.gameplayer.io/api/js/game.js';
    head.appendChild(js);
}(document, 'unifiedgameapi');