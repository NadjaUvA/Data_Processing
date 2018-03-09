# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict
date = []
men_usa = []
women_usa = []
youthmen_usa = []
youthwomen_usa = []
men_canada = []
women_canada = []
youthmen_canada = []
youthwomen_canada = []    

with open("unemp_us_can.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    for line in reader:
        date.append(line[0])
        men_usa.append(line[1])
        women_usa.append(line[2])
        youthmen_usa.append(line[3])
        youthwomen_usa.append(line[4])
        men_canada.append(line[5])
        women_canada.append(line[6])
        youthmen_canada.append(line[7])
        youthwomen_canada.append(line[8])

USA = {}
CAN = {}

USA["date_usa"] = date
USA["men_usa"] = men_usa
USA["women_usa"] = women_usa
USA["youthmen_usa"] = youthmen_usa
USA["youthwomen_usa"] = youthwomen_usa

CAN["date_canada"] = date
CAN["men_canada"] = men_canada
CAN["women_canada"] = women_canada
CAN["youthmen_canada"] = youthmen_canada
CAN["youthwomen_canada"] = youthwomen_canada

almostdata = {}
almostdata["usa"] = USA
almostdata["canada"] = CAN

data = [almostdata]

# write dict with data to json data file
with open("unempdata_us_can.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
    
    
