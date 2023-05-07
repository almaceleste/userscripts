function parseDuration(duration) {
    const pattern = /(\d+)/g;
    const array = duration.match(pattern);
    // console.log('array:', array);
    if (array[0] >= 60) {
        let minutes = array[0];
        const hours = Math.floor(minutes/60);
        minutes %= 60;          // minutes = minutes % 60 (get the remaining minutes)
        array[0] = minutes;
        array.splice(0, 0, hours);
    }
    for (let i = 1; i < array.length; i++) {
        let e = array[i];
        e = e < 10 ? `0${e}` : e;
        array[i] = e;
    }
    const time = array.join(':');

    return time;
}

function durationToString(duration) {
    const units = ['second', 'minute', 'hour'];         // the units are reversed because we'll use the reversed time array
    const array = duration.split(':');

    array.reverse().forEach((e, i) => {
        const u = units[i];
        const s = e == 1 ? '' : 's';
        array[i] = `${+e} ${u}${s}`;
    });

    return array.reverse().join(', ');
}

let duration = 'PT10M0S';
duration = parseDuration(duration);
console.log('time:', duration);
console.log('string:', durationToString(duration));
duration = 'PT65M1S';
duration = parseDuration(duration);
console.log('time:', duration);
console.log('string:', durationToString(duration));