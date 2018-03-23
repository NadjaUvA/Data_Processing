# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict
data = []

with open("dataset_barchart.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    for line in reader:
        
        bar = {}
        bar["country"] = line[1]
        bar["young"] = line[6]
        bar["working"] = line[7]
        bar["elderly"] = line[8]
        data.append(bar)
      
# write dict with data to json data file
with open("barchart_data.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
    
