package main 

import (
	"log"
	"time"
	"strconv"
	"fmt"
	"encoding/json" 
	"net/http"
	"github.com/gorilla/mux"
	"github.com/influxdata/influxdb/client/v2"
)

const (
	MyDB = "telegraf"
	STATIC_DIR = "/static/"
)


func influxDBClient() client.Client {
    c, err := client.NewHTTPClient(client.HTTPConfig{
        Addr:     "http://influxdb:8086",
    })
    if err != nil {
        log.Fatalln("Error: ", err)
	}
	fmt.Println("Connected to db")
    return c
}

var dbClient = influxDBClient();
   

func getHumidity(w http.ResponseWriter,r*http.Request){
	q := client.NewQuery("SELECT hum FROM dht22 WHERE time > (now() - 5m)", MyDB, "s")
	if response, err := dbClient.Query(q); err == nil && response.Error() == nil {
		valeursTemp := response.Results 
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(valeursTemp)
	}
}

func getTemperature(w http.ResponseWriter,r*http.Request){
	 
	q := client.NewQuery("SELECT temp FROM dht22 WHERE time > (now() - 5m)", MyDB, "s")
	if response, err := dbClient.Query(q); err == nil && response.Error() == nil {
		valeursTemp := response.Results
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(valeursTemp)	 
	}
}

func getHumidityMqtt(w http.ResponseWriter,r*http.Request){
	q := client.NewQuery("SELECT hum FROM mqttdht22 WHERE time > (now() - 5m)", MyDB, "s")
	if response, err := dbClient.Query(q); err == nil && response.Error() == nil {
		valeursTemp := response.Results 
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(valeursTemp)
	}
}

func getTemperatureMqtt(w http.ResponseWriter,r*http.Request){
	 
	q := client.NewQuery("SELECT temp FROM mqttdht22 WHERE time > (now() - 5m)", MyDB, "s")
	if response, err := dbClient.Query(q); err == nil && response.Error() == nil {
		valeursTemp := response.Results
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(valeursTemp)	 
	}
}

func writeTemp(c client.Client, temp int) {
	temp_tags := map[string]string{"sensor": "temperature"}
	temp_fields:= map[string]interface{}{
		"temp": temp,
	}
	
	// Create a new point batch
	bp, err := client.NewBatchPoints(client.BatchPointsConfig{
		Database:  MyDB,
		Precision: "s",
	})
	
	if err != nil {
		log.Fatal(err)
	}

	pt, err := client.NewPoint("dht22", temp_tags, temp_fields, time.Now())
	if err != nil {
		fmt.Println("Error: ", err.Error())
	}
	bp.AddPoint(pt)
	c.Write(bp)

}

func writeHum(c client.Client, hum int) {
	temp_tags := map[string]string{"sensor": "humidity"}
	temp_fields:= map[string]interface{}{
		"hum": hum,
	}
	
	// Create a new point batch
	bp, err := client.NewBatchPoints(client.BatchPointsConfig{
		Database:  MyDB,
		Precision: "s",
	})
	
	if err != nil {
		log.Fatal(err)
	}

	pt, err := client.NewPoint("dht22", temp_tags, temp_fields, time.Now())
	if err != nil {
		fmt.Println("Error: ", err.Error())
	}
	bp.AddPoint(pt)
	c.Write(bp)

}

func postState(w http.ResponseWriter,r*http.Request) {
	w.Header().Set("Content-Type", "application/json")
	temp, err := strconv.Atoi(r.FormValue("temp"))
	fmt.Println(temp, err)
	if err != nil {
		temp = 0
	}
	hum, err := strconv.Atoi(r.FormValue("hum"))
	fmt.Println(hum, err)
	if err != nil {
		hum = 0
	}
	writeTemp(dbClient, temp)
	writeHum(dbClient,hum)
}

func main() {
	//Initialisation des routes
	defer dbClient.Close()
	
	q := client.NewQuery("CREATE DATABASE sensor", "", "")
	if response, err := dbClient.Query(q); err == nil && response.Error() == nil {
		fmt.Println(response.Results)
	}

	r:= mux.NewRouter()
	//Manipulation des routes
	r.HandleFunc("/api/humidity", getHumidity).Methods("GET")
	r.HandleFunc("/api/temperature", getTemperature).Methods("GET")
	r.HandleFunc("/api/mqtthumidity", getHumidityMqtt).Methods("GET")
	r.HandleFunc("/api/mqtttemperature", getTemperatureMqtt).Methods("GET")
	r.HandleFunc("/api/state", postState).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("."+STATIC_DIR)))

	
	
	//Pour les erreurs, on peut afficher un message dans le log par exemple 
	log.Fatal(http.ListenAndServe(":8080",r))
}
