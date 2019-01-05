
var temperatureData = {};
var humidityData = {};
var temperatureMQTTData = {};
var humidityMQTTData = {};
var dataHumidity = [];
var dataTemperature = [];
var dataMQTTHumidity = [];
var dataMQTTTemperature = [];


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

var ctx3 = document.getElementById('tempMQTT').getContext('2d');
var chart3 = new Chart(ctx3, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        datasets: [{
            label: "Température MQTT",
            backgroundColor: 'rgb(200, 99, 0)',
            borderColor: 'rgb(200, 99, 0)',
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

var ctx4 = document.getElementById('humMQTT').getContext('2d');
var chart4 = new Chart(ctx4, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        datasets: [{
            label: "Humidité MQTT",
            backgroundColor: 'rgb(0, 99, 200)',
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
    req.open('GET', '/api/mqtttemperature', false); 
    req.send(null);
    if (req.status === 200) {
        console.log("Réponse reçue: %s", req.response);
        temperatureMQTTData = JSON.parse(req.response);
    } else {
        console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
    }

    req.open('GET', '/api/mqtthumidity', false); 
    req.send(null);
    if (req.status === 200) {
        console.log("Réponse reçue: %s", req.response);
        humidityMQTTData = JSON.parse(req.response);
    } else {
        console.log("Status de la réponse: %d (%s)", req.status, req.statusText);

    }
    console.log(humidityData);
    if(humidityData[0].Series!=null) {
        dataHumidity = humidityData[0].Series[0].values.map(obj => {
            var res={};
            res.x = new Date(obj[0]*1000);
            res.y = obj[1];
            return res
        });
    }
    if(temperatureData[0].Series!=null) {
        dataTemperature = temperatureData[0].Series[0].values.map(obj => {
            var res={};
            res.x = new Date(obj[0]*1000);
            res.y = obj[1];
            return res
        });
    }
    if(humidityMQTTData[0].Series!=null) {
        dataMQTTHumidity = humidityMQTTData[0].Series[0].values.map(obj => {
            var res={};
            res.x = new Date(obj[0]*1000);
            res.y = obj[1];
            return res
        });
    }
    if(temperatureMQTTData[0].Series!=null) {
        dataMQTTTemperature = temperatureMQTTData[0].Series[0].values.map(obj => {
            var res={};
            res.x = new Date(obj[0]*1000);
            res.y = obj[1];
            return res
        });
    }
    console.log(dataHumidity);
    console.log(dataTemperature);
    chart.data.datasets[0].data = dataTemperature;
    chart2.data.datasets[0].data = dataHumidity;
    chart3.data.datasets[0].data = dataMQTTTemperature;
    chart4.data.datasets[0].data = dataMQTTHumidity;
    chart.update();
    chart2.update();
    chart3.update();
    chart4.update();
}, 5000);

$("#onoff").on('click', function(){
    const req = new XMLHttpRequest();
    req.open('POST', '/api/led', false); 
    req.send('status=sended');
    if (req.status === 200) {
        console.log("La led a changée d'état", req.response);
    }
})

