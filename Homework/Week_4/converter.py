# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict
data = []
with open("hpi_data.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    for line in reader:
        print(line)
        hpidata = {}
        hpidata["region"] = line[0]
        hpidata["life_exp"] = line[1]
        hpidata["footprint"] = line[2]
        hpidata["gdp"] = line[3]
        hpidata["country"] = line[4]
        data.append(hpidata)
        
# write dict with data to json data file
with open("hpidata.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)