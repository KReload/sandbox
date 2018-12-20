
var temperatureData = {};
var humidityData = {};
var dataHumidity = [];
var dataTemperature = [];


// Ici, la requête sera émise de façon synchrone.

var ctx = document.getElementById('temp').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        datasets: [{
            label: "Température",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'second'
                }
            }]
        }
    }
});

var ctx2 = document.getElementById('hum').getContext('2d');
var chart2 = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        datasets: [{
            label: "Humidité",
            backgroundColor: 'rgb(0, 99, 255)',
            borderColor: 'rgb(0, 99, 132)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'second'
                }
            }]
        }
    }
});

setInterval(function(){
    const req = new XMLHttpRequest();
    req.open('GET', '/api/temperature', false); 
    req.send(null);
    if (req.status === 200) {
        console.log("Réponse reçue: %s", req.response);
        temperatureData = JSON.parse(req.response);
    } else {
        console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
    }

    req.open('GET', '/api/humidity', false); 
    req.send(null);
    if (req.status === 200) {
        console.log("Réponse reçue: %s", req.response);
        humidityData = JSON.parse(req.response);
    } else {
        console.log("Status de la réponse: %d (%s)", req.status, req.statusText);

    }
    console.log(humidityData);
    dataHumidity = humidityData[0].Series[0].values.map(obj => {
        var res={};
        res.x = new Date(obj[0]*1000);
        res.y = obj[1];
        return res
    });
    dataTemperature = temperatureData[0].Series[0].values.map(obj => {
        var res={};
        res.x = new Date(obj[0]*1000);
        res.y = obj[1];
        return res
    });
    console.log(dataHumidity);
    console.log(dataTemperature);
    chart.data.datasets[0].data = dataTemperature;
    chart2.data.datasets[0].data = dataHumidity;
    chart.update();
    chart2.update();
}, 5000);



