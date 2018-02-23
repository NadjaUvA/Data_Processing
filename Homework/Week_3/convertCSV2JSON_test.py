import json

fp = open("averagerain2017", "r")
data = {}
data[i] = {
	'name' : 'bob'
	'number' : 123
}
fp.close()

# json.dump(data, fn, indent = 4)
string_data = json.dumps(data)

