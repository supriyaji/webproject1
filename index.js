const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal,orgval)=>{
    let temparature = tempVal.replace("{%tempval%}", (orgval.main.temp -273.15).toFixed(2));
    temparature = temparature.replace("{%tempmin%}", (orgval.main.temp_min -273.15).toFixed(2));
    temparature = temparature.replace("{%tempmax%}",(orgval.main.temp_max -273.15).toFixed(2));
    temparature = temparature.replace("{%location%}",(orgval.name));
    temparature = temparature.replace(" {%country%}", (orgval.sys.country));
    temparature = temparature.replace("{%tempstatus%}",orgval.weather[0].main);
  return temparature;
};

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=ddd055515cf1c4e4410ff84869d671f7")
        .on("data", (chunk)=>{
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData);
           // console.log(arrData[0].main.temp);
            const realTimeData = arrData.map((val)=> replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
               //console.log(realTimeData);
            })
            .on("end", (err)=>{
                if(err) return console.log("connection closed", err);
                res.end();
            });      
    }
});
server.listen(5000,"127.0.0.1");