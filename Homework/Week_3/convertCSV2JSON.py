# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json

# read data and convert into dict
data = {}
index = 0
with open("C:/Users/Nadja/Documents/GitHub/Data_Processing/Homework/Week_3/averagerain2017.csv", "r") as fp:
    for line in fp:
        data[index] = (line.split(",")[1].strip())
        index = index + 1

# write dict with data to json data file
with open("data.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
