import csv

print("reading csv")

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

    if record[1] not in crimeDict[record[6]]:
      crimeDict[record[6]][record[1]] = 0

    # # add it to the total count as well
    # if record[1] not in crimeDict['subtotals']:
    #   crimeDict['subtotals'][record[1]] = 0

    crimeDict[record[6]][record[1]] += 1
    # crimeDict['subtotals'][record[1]] += 1

  # close the file
  crimeFile.close()

  for key in crimeDict:
    print key
    for category in crimeDict[key]:
      print "  " + category + ": ", crimeDict[key][category]

except IOError:
  print("Error opening the file.")