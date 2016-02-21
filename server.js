var $ = require('jquery');
var http = require('http');

function getInfoFromIndeed(occu, callback) {
    var options = {
        host: 'api.indeed.com',
        port: 80,
        path: '/ads/apisearch?publisher=7699004885042305&q='+ occu + '&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=3000000&fromage=&filter=1&latlong=1&co=us&format=json&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2'
    };

    http.get(options, function(resp){
        var res = "";
        resp.setEncoding('utf8');
        resp.on('data', function(chunk){
            res += chunk;
        }).on('end', function() {
            console.dir(res);
            res = JSON.parse(res)["results"];
            //console.dir(res);
            callback(res);
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
}

var jobid_2_occr = require('./occupations/occupations.json');
var id_to_top10 = require('./occupations/pairs.json');

console.log(jobid_2_occr["9110"]);

var states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC', 'AS', 'GU', 'MP', 'PR', 'UM', 'VI'];

//number of potential spouses in each state
var counts = {};

function make_counts(entry) {
    var cnt_state = entry['state'];
    counts[cnt_state] += 1;
}

function aggregator( indeed_result ) {
    indeed_result.forEach( make_counts );
}

function doSomething(job_id) {
    var top_10 = id_to_top10[job_id];
    top_10.forEach( function(occupation_spouse) {
        getInfoFromIndeed(occupation_spouse, aggregator);
    });
}

doSomething("9110");


