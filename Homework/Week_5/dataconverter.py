# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict
men2008 = []
women2008 = []
youthmen2008 = []
youthwomen2008 = []
men2017 = []
women2017 = []
youthmen2017 = []
youthwomen2017 = []    

with open("unempdata.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    for line in reader:
        men2008.append(line[1])
        women2008.append(line[2])
        youthmen2008.append(line[3])
        youthwomen2008.append(line[4])
        men2017.append(line[6])
        women2017.append(line[7])
        youthmen2017.append(line[8])
        youthwomen2017.append(line[9])

year2008 = {}
year2017 = {}

year2008["men2008"] = men2008
year2008["women2008"] = women2008
year2008["youthmen2008"] = youthmen2008
year2008["youthwomen2008"] = youthwomen2008

year2017["men2017"] = men2017
year2017["women2017"] = women2017
year2017["youthmen2017"] = youthmen2017
year2017["youthwomen2017"] = youthwomen2017

almostdata = {}
almostdata["year2008"] = year2008
almostdata["year2017"] = year2017

data = [almostdata]

# write dict with data to json data file
with open("unempdata.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
    
    
