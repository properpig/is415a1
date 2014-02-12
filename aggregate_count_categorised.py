import csv, json

print("reading csv")

# define the categories each crime should fall under
violent_crimes = ["ASSAULT", "ROBBERY", "KIDNAPPING"]
property_crimes = ["VANDALISM", "VEHICLE THEFT", "LARCENY/THEFT", "BURGLARY", "ARSON", "TRESPASS"]
qol_crimes = ["PROSTITUTION", "DRUNKENNESS", "DRUG/NARCOTIC", "DRIVING UNDER THE INFLUENCE", "WEAPON LAWS", "SEX OFFENSES, NON FORCIBLE", "SEX OFFENSES, FORCIBLE", "GAMBLING", "DISORDERLY CONDUCT"]

try:
  # open the crime file for reading
  crimeFile = open('data/crime.csv', 'rb')

  crimeRecords = list(csv.reader(crimeFile))

  # get the headers
  crimeHeaders = crimeRecords[0]

  # create a dictionary to store all counts by category by pdDistrict
  crimeDict = {}
  # crimeDict['subtotals'] = {}

  for record in crimeRecords[1:]:
    # 1:Category, 6:PdDistrict
    if record[6] not in crimeDict:
      # create a dict for it. this will store count by categories
      crimeDict[record[6]] = {}
      crimeDict[record[6]]['violent'] = 0
      crimeDict[record[6]]['property'] = 0
      crimeDict[record[6]]['qol'] = 0
      crimeDict[record[6]]['others'] = 0

      # and a breakdown of the crime in each category
      crimeDict[record[6]]['breakdown'] = {}
      crimeDict[record[6]]['breakdown']['violent'] = {}
      crimeDict[record[6]]['breakdown']['property'] = {}
      crimeDict[record[6]]['breakdown']['qol'] = {}
      crimeDict[record[6]]['breakdown']['others'] = {}

      crimeDict[record[6]]['total'] = 0

    if record[1] in violent_crimes:
      crimeDict[record[6]]['violent'] += 1
      if record[1] not in crimeDict[record[6]]['breakdown']['violent']:
        crimeDict[record[6]]['breakdown']['violent'][record[1]] = 0
      crimeDict[record[6]]['breakdown']['violent'][record[1]] += 1
    elif record[1] in property_crimes:
      crimeDict[record[6]]['property'] += 1
      if record[1] not in crimeDict[record[6]]['breakdown']['property']:
        crimeDict[record[6]]['breakdown']['property'][record[1]] = 0
      crimeDict[record[6]]['breakdown']['property'][record[1]] += 1
    elif record[1] in qol_crimes:
      crimeDict[record[6]]['qol'] += 1
      if record[1] not in crimeDict[record[6]]['breakdown']['qol']:
        crimeDict[record[6]]['breakdown']['qol'][record[1]] = 0
      crimeDict[record[6]]['breakdown']['qol'][record[1]] += 1
    else:
      if record[1] != "NON-CRIMINAL":
        crimeDict[record[6]]['others'] += 1
        if record[1] not in crimeDict[record[6]]['breakdown']['others']:
          crimeDict[record[6]]['breakdown']['others'][record[1]] = 0
        crimeDict[record[6]]['breakdown']['others'][record[1]] += 1

    # add it to the total count too
    if record[1] != "NON-CRIMINAL":
      crimeDict[record[6]]['total'] += 1

  # close the file
  crimeFile.close()

  # for key in crimeDict:
  #   print key
  #   for category in crimeDict[key]:
  #     print "  " + category + ": ", crimeDict[key][category]

  # manually add the location of the centerpoint
  crimeDict["RICHMOND"]['location'] = [-122.4826,37.7764]
  crimeDict["CENTRAL"]['location'] = [-122.4091,37.7988]
  crimeDict["NORTHERN"]['location'] = [-122.4273,37.7889]
  crimeDict["INGLESIDE"]['location'] = [-122.4332,37.7277]
  crimeDict["TENDERLOIN"]['location'] = [-122.4131,37.7837]
  crimeDict["MISSION"]['location'] = [-122.4231,37.7584]
  crimeDict["TARAVAL"]['location'] = [-122.4844,37.7374]
  crimeDict["BAYVIEW"]['location'] = [-122.3900,37.7346]
  crimeDict["PARK"]['location'] = [-122.4478,37.7663]
  crimeDict["SOUTHERN"]['location'] = [-122.3947,37.7845]

  # create subtotals for each crime category
  for district in crimeDict:
    crimeDict[district]['subtotals'] = {}
    for category in crimeDict[district]['breakdown']:
      crimeDict[district]['subtotals'][category] = 0
      for crimetype in crimeDict[district]['breakdown'][category]:
        crimeDict[district]['subtotals'][category] += crimeDict[district]['breakdown'][category][crimetype]


  # write the output to a json file
  crimeCountsFile = open('data/crimecount.json', 'w')

  crimeCountsFile.write(json.dumps(crimeDict))

  # close the file
  crimeCountsFile.close()
  print json.dumps(crimeDict)

except IOError:
  print("Error opening the file.")