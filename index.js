const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
            `http://api.openweathermap.org/data/2.5/weather?q=Agra&appid=a6ede2c9f9a80b33b36b863d8900c55a`
        )
            .on('data', (chunk) => {   //streams example-> youTube loads the data step by step ..didn't wait for the entire data to load
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8000, "127.0.0.1");