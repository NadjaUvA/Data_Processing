# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict
year = []

young_bel = []
working_bel = []
elderly_bel = []

young_den = []
working_den = []
elderly_den = []

young_fra = []
working_fra = []
elderly_fra = []

young_deu = []
working_deu = []
elderly_deu = []

young_irl = []
working_irl = []
elderly_irl = []

young_lux = []
working_lux = []
elderly_lux = []

young_nld = []
working_nld = []
elderly_nld = []

young_nor = []
working_nor = []
elderly_nor = []

young_gbr = []
working_gbr = []
elderly_gbr = []

young_swe = []
working_swe = []
elderly_swe = []

with open("dataset_linegraph.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    for line in reader:
        
        year.append(line[0])
        
        young_bel.append(line[3])
        working_bel.append(line[4])
        elderly_bel.append(line[5])
        
        young_fra.append(line[15])
        working_fra.append(line[16])
        elderly_fra.append(line[17])
        
        young_deu.append(line[21])
        working_deu.append(line[22])
        elderly_deu.append(line[23])
        
        young_irl.append(line[27])
        working_irl.append(line[28])
        elderly_irl.append(line[29])
        
        young_lux.append(line[33])
        working_lux.append(line[34])
        elderly_lux.append(line[35])
        
        young_nld.append(line[39])
        working_nld.append(line[40])
        elderly_nld.append(line[41])
        
        young_nor.append(line[45])
        working_nor.append(line[46])
        elderly_nor.append(line[47])
        
        young_gbr.append(line[51])
        working_gbr.append(line[52])
        elderly_gbr.append(line[53])
        
        young_swe.append(line[57])
        working_swe.append(line[58])
        elderly_swe.append(line[59])
        
        young_den.append(line[9])
        working_den.append(line[10])
        elderly_den.append(line[11])

bel = {}
bel["year"] = year
bel["young"] = young_bel
bel["working"] = working_bel
bel["elderly"] = elderly_bel

deu = {}
deu["young"] = young_deu
deu["working"] = working_deu
deu["elderly"] = elderly_deu

den = {}
den["young"] = young_den
den["working"] = working_den
den["elderly"] = elderly_den

fra = {}
fra["young"] = young_fra
fra["working"] = working_fra
fra["elderly"] = elderly_fra

gbr = {}
gbr["young"] = young_gbr
gbr["working"] = working_gbr
gbr["elderly"] = elderly_gbr

irl = {}
irl["young"] = young_irl
irl["working"] = working_irl
irl["elderly"] = elderly_irl

lux = {}
lux["young"] = young_lux
lux["working"] = working_lux
lux["elderly"] = elderly_lux

nld = {}
nld["young"] = young_nld
nld["working"] = working_nld
nld["elderly"] = elderly_nld

nor = {}
nor["young"] = young_nor
nor["working"] = working_nor
nor["elderly"] = elderly_nor

swe = {}
swe["young"] = young_swe
swe["working"] = working_swe
swe["elderly"] = elderly_swe

almostdata = {}
almostdata["BEL"] = bel
almostdata["DEU"] = deu
almostdata["DNK"] = den
almostdata["FRA"] = fra
almostdata["GBR"] = gbr
almostdata["IRL"] = irl
almostdata["LUX"] = lux
almostdata["NLD"] = nld
almostdata["NOR"] = nor
almostdata["SWE"] = swe   

data = [almostdata]


# write dict with data to json data file
with open("linegraph_data.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
    
    
