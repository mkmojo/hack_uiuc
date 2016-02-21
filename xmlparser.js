var http = require('http');

var options = {
    host: 'api.indeed.com',
    port: 80,
    path: '/ads/apisearch?publisher=7699004885042305&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=300&fromage=&filter=1&latlong=1&co=us&format=json&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2'
};

http.get(options, function(resp){
    var res = "";
    resp.setEncoding('utf8');
    resp.on('data', function(chunk){
        res += chunk;
    });
    resp.on('end', function() {
        var test = JSON.parse(res);
        console.dir(test);
        console.log("DEBUG: Parsed!!");
    });
}).on("error", function(e){
    console.log("Got error: " + e.message);
});



