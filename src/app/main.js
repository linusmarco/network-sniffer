let req = new XMLHttpRequest();
req.addEventListener('load', function() {
    const text = this.responseText
        .split('\n')
        .reverse()
        .join('<br>');
    document.body.innerHTML = text;
});

setInterval(() => {
    req.open('GET', '../logs/current.log?' + new Date().getTime());
    req.send();
}, 1000);
