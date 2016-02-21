
function makeChart(data) {
    var map = AmCharts.makeChart( "chartdiv", {
        type: "map",
        "theme": "light",

        colorSteps: 10,

        dataProvider: {
            map: "usaLow",
            areas: data
        },

        areasSettings: {
            autoZoom: true
        },

        valueLegend: {
            right: 10,
            minValue: "little",
            maxValue: "a lot!"
        },

        "export": {
            "enabled": true
        }

    } );

}

