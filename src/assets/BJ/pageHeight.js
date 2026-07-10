function changeAmbassador(ambassadorPage, pageLink) {
    var index = ambassadorPage;
    window.parent.postMessage({
        'switchPageByIndex': index
    }, '*');
    window.location.href = pageLink
}

window.onload = function() {
    // Set the iframe block height every sec.
    // message: ambassadorPageHeight
    var ambassadorPageHeight = window.setInterval(() => {
        window.parent.postMessage({
            'ambassadorPageHeight': document.body.scrollHeight + 30
        }, '*');
    }, 500);

    // Clear interval after 30 sec, if not getting response
    setTimeout(() => window.clearInterval(ambassadorPageHeight), 30000);

    // Listen to the response
    var messageListenerCallback = function(e) {
        // message: hasSetAmbassadorPageHeight
        // clear interval when getting response
        if (e.data === 'hasSetAmbassadorPageHeight') {
            window.clearInterval(ambassadorPageHeight);
        }
        // message: setNavigationPosition
        if (e.data.hasOwnProperty('setNavigationPosition')) {
            const setNavigationPosition = e.data['setNavigationPosition'];
            document.querySelector('.ambassador-navigation').style.top = setNavigationPosition;
        }
    };
    window.addEventListener("message", messageListenerCallback);
};