const fetch = require("node-fetch");

const COUNT = 10;
const DELAY_MS = 500;

let i = 0;
const interval = setInterval(() => {
    fetch('http://localhost:1000/api/jobs', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({
            name: "Michael",
            date: "2021-Jul-14",
            printHour: 2,
            printMin: 40,
            fileName: 'my_print.gcode',
            fileDesc: 'This is a description about my print',
            printerInfo: 'Ender 3'
        })
    })
    .then(res => {
        console.log(`Post ${i}: ${res.status == 201 ? 'OK' : 'ERR'}`);
        return res.text();
    })
    .then(out => {
        console.log(out);
    });

    if (++i >= COUNT) clearInterval(interval);
}, DELAY_MS);