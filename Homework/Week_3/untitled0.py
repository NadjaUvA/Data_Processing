# -*- coding: utf-8 -*-
"""
Created on Wed Feb 21 16:30:17 2018

@author: Nadja
"""

# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json

# read data and convert into dict
data = {}
with open("C:/Users/Nadja/Documents/GitHub/Data_Processing/Homework/Week_3/averagerain2017.csv", "r") as fp:
    for line in fp:
        rain = line.strip().split(",")[1]
        data.append({"value": rain})

# write dict with data to json data file
with open("data.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)