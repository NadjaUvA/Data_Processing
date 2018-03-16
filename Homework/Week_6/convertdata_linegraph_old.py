# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict

young_bel = []
working_bel = []
elderly_bel = []

young_dnk = []
working_dnk = []
elderly_dnk = []

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
        
        
        bel1 = {}
        bel1["year"] = line[0]
        bel1["value"] = line[3] 
        young_bel.append(bel1)
        
        bel2 = {}
        bel2["year"] = line[0]
        bel2["value"] = line[4] 
        working_bel.append(bel2)
        
        bel3 = {}
        bel3["year"] = line[0]
        bel3["value"] = line[5] 
        elderly_bel.append(bel3)
        
        dnk1 = {}
        dnk1["year"] = line[0]
        dnk1["value"] = line[9] 
        young_dnk.append(dnk1)
        
        dnk2 = {}
        dnk2["year"] = line[0]
        dnk2["value"] = line[10] 
        working_dnk.append(dnk2)
        
        dnk3 = {}
        dnk3["year"] = line[0]
        dnk3["value"] = line[11] 
        elderly_dnk.append(dnk3)
        
        fra1 = {}
        fra1["year"] = line[0]
        fra1["value"] = line[15] 
        young_fra.append(bel1)
        
        fra2 = {}
        fra2["year"] = line[0]
        fra2["value"] = line[16] 
        working_fra.append(fra2)
        
        fra3 = {}
        fra3["year"] = line[0]
        fra3["value"] = line[17] 
        elderly_fra.append(fra3)
        
        deu1 = {}
        deu1["year"] = line[0]
        deu1["value"] = line[21] 
        young_deu.append(deu1)
        
        deu2 = {}
        deu2["year"] = line[0]
        deu2["value"] = line[22] 
        working_deu.append(deu2)
        
        deu3 = {}
        deu3["year"] = line[0]
        deu3["value"] = line[23] 
        elderly_deu.append(deu3)
        
        irl1 = {}
        irl1["year"] = line[0]
        irl1["value"] = line[27] 
        young_irl.append(irl1)
        
        irl2 = {}
        irl2["year"] = line[0]
        irl2["value"] = line[28] 
        working_irl.append(irl2)
        
        irl3 = {}
        irl3["year"] = line[0]
        irl3["value"] = line[29] 
        elderly_irl.append(irl3)
        
        lux1 = {}
        lux1["year"] = line[0]
        lux1["value"] = line[33] 
        young_lux.append(lux1)
        
        lux2 = {}
        lux2["year"] = line[0]
        lux2["value"] = line[34] 
        working_lux.append(lux2)
        
        lux3 = {}
        lux3["year"] = line[0]
        lux3["value"] = line[35] 
        elderly_lux.append(lux3)
        
        nld1 = {}
        nld1["year"] = line[0]
        nld1["value"] = line[39] 
        young_nld.append(nld1)
        
        nld2 = {}
        nld2["year"] = line[0]
        nld2["value"] = line[40] 
        working_nld.append(nld2)
        
        nld3 = {}
        nld3["year"] = line[0]
        nld3["value"] = line[41] 
        elderly_nld.append(nld3)
        
        nor1 = {}
        nor1["year"] = line[0]
        nor1["value"] = line[45] 
        young_nor.append(nor1)
        
        nor2 = {}
        nor2["year"] = line[0]
        nor2["value"] = line[46] 
        working_nor.append(nor2)
        
        nor3 = {}
        nor3["year"] = line[0]
        nor3["value"] = line[47] 
        elderly_nor.append(nor3)
        
        gbr1 = {}
        gbr1["year"] = line[0]
        gbr1["value"] = line[51] 
        young_gbr.append(gbr1)
        
        gbr2 = {}
        gbr2["year"] = line[0]
        gbr2["value"] = line[52] 
        working_gbr.append(gbr2)
        
        gbr3 = {}
        gbr3["year"] = line[0]
        gbr3["value"] = line[53] 
        elderly_gbr.append(gbr3)
        
        swe1 = {}
        swe1["year"] = line[0]
        swe1["value"] = line[57] 
        young_swe.append(swe1)
        
        swe2 = {}
        swe2["year"] = line[0]
        swe2["value"] = line[58] 
        working_swe.append(swe2)
        
        swe3 = {}
        swe3["year"] = line[0]
        swe3["value"] = line[59] 
        elderly_swe.append(swe3)

bel1 = {}
bel1["key"] = "young"
bel1["value_pair"] = young_bel

bel2 = {}
bel2["key"] = "working"
bel2["value_pair"] = working_bel

bel3 = {}
bel3["key"] = "elderly"
bel3["value_pair"] = elderly_bel

bel_array = [bel1, bel2, bel3]

deu1 = {}
deu1["key"] = "young"
deu1["value_pair"] = young_deu

deu2 = {}
deu2["key"] = "working"
bel2["value_pair"] = working_deu

deu3 = {}
deu3["key"] = "elderly"
deu3["value_pair"] = elderly_deu

deu_array = [deu1, deu2, deu3]

dnk1 = {}
dnk1["key"] = "young"
dnk1["value_pair"] = young_dnk

dnk2 = {}
dnk2["key"] = "working"
dnk2["value_pair"] = working_dnk

dnk3 = {}
dnk3["key"] = "elderly"
dnk3["value_pair"] = elderly_dnk

dnk_array = [dnk1, dnk2, dnk3]

fra1 = {}
fra1["key"] = "young"
fra1["value_pair"] = young_fra

fra2 = {}
fra2["key"] = "working"
fra2["value_pair"] = working_fra

fra3 = {}
fra3["key"] = "elderly"
fra3["value_pair"] = elderly_fra

fra_array = [fra1, fra2, fra3]

gbr1 = {}
gbr1["key"] = "young"
gbr1["value_pair"] = young_gbr

gbr2 = {}
gbr2["key"] = "working"
gbr2["value_pair"] = working_gbr

gbr3 = {}
gbr3["key"] = "elderly"
gbr3["value_pair"] = elderly_gbr

gbr_array = [gbr1, gbr2, gbr3]

irl1 = {}
irl1["key"] = "young"
irl1["value_pair"] = young_irl

irl2 = {}
irl2["key"] = "working"
irl2["value_pair"] = working_irl

irl3 = {}
irl3["key"] = "elderly"
irl3["value_pair"] = elderly_irl

irl_array = [irl1, irl2, irl3]

lux1 = {}
lux1["key"] = "young"
lux1["value_pair"] = young_lux

lux2 = {}
lux2["key"] = "working"
lux2["value_pair"] = working_lux

lux3 = {}
lux3["key"] = "elderly"
lux3["value_pair"] = elderly_lux

lux_array = [lux1, lux2, lux3]

nld1 = {}
nld1["key"] = "young"
nld1["value_pair"] = young_nld

nld2 = {}
nld2["key"] = "working"
nld2["value_pair"] = working_nld

nld3 = {}
nld3["key"] = "elderly"
nld3["value_pair"] = elderly_nld

nld_array = [nld1, nld2, nld3]

nor1 = {}
nor1["key"] = "young"
nor1["value_pair"] = young_nor

nor2 = {}
nor2["key"] = "working"
nor2["value_pair"] = working_nor

nor3 = {}
nor3["key"] = "elderly"
nor3["value_pair"] = elderly_nor

nor_array = [nor1, nor2, nor3]

swe1 = {}
swe1["key"] = "young"
swe1["value_pair"] = young_swe

swe2 = {}
swe2["key"] = "working"
swe2["value_pair"] = working_swe

swe3 = {}
swe3["key"] = "elderly"
swe3["value_pair"] = elderly_swe

swe_array = [swe1, swe2, swe3]

data = {}
data["BEL"] = bel_array
data["DEU"] = deu_array
data["DNK"] = dnk_array
data["FRA"] = fra_array
data["GBR"] = gbr_array
data["IRL"] = irl_array
data["LUX"] = lux_array
data["NLD"] = nld_array
data["NOR"] = nor_array
data["SWE"] = swe_array    
     
# write dict with data to json data file
with open("linegraph_data.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
    
    
