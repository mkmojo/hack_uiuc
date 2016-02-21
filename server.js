var $ = require('jquery');
var http = require('http');

var states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC', 'AS', 'GU', 'MP', 'PR', 'UM', 'VI'];

function getInfoFromIndeed(occu,  callback) {
    for(state in states) {
        var options = {
            host: 'api.indeed.com',
            port: 80,
            path: '/ads/apisearch?publisher=7699004885042305&q='+ occu + '&l=' + state + '&sort=&radius=&st=&jt=&start=&limit=3000000&fromage=&filter=1&latlong=1&co=us&format=json&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2'
        };

        http.get(options, function(resp){
            var res = "";
            resp.setEncoding('utf8');
            resp.on('data', function(chunk){
                res += chunk;
            }).on('end', function() {
                // console.dir(res);
                res = JSON.parse(res)["results"];
                callback(res);
            });
        }).on("error", function(e){
            console.log("Got error: " + e.message);
        });
    }

}

var jobid_2_occr = require('./occupations/occupations.json');
var id_2_top10 = require('./occupations/pairs.json');


//number of potential spouses in each state
var counts = {};

function make_counts(entry) {
    var cnt_state = entry['state'];
    if (!counts[cnt_state])
        counts[cnt_state] = 0;
    counts[cnt_state] += 1;
}

function aggregator( last, callback, indeed_result ) {
    indeed_result.forEach( make_counts );
    if(last){
        callback();
    }
}

function doSomething( job_id , callback) {
    var top_10 = id_2_top10[job_id];
    var i = 0;
    top_10.forEach( function(elem) {
        getInfoFromIndeed(elem["occ_spouse"], aggregator.bind(undefined, (i==9), callback));
        i += 1;
    });
}

function processData(data) {
    var obj = [];
    for( key in data ) {
        obj.push({id: "US-"+key, value: data[key]});
    }
    return obj;
}

var express = require('express');
var app = express();

app.get('/query', function(req, res) {
    var job_id = req.query['job_id'];
    console.log(req.query);
    console.log(job_id);
    doSomething(job_id, function() {
        var processed = processData(counts);
        res.send(processed);
    });
});

app.use(express.static('public'));

//respond with "hello world" when a GET request is made to the homepage

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
});

