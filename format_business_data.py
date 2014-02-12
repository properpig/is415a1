import csv, json

try:
  # open the file for writing
  businessFile = open('data/Businesses_Registered_in_San_Francisco_-_Active.csv')

  businessRecords = list(csv.reader(businessFile))

  # get the headers
  businessHeaders = businessRecords[0]

  # open a new file for writing
  newBusinessFile = open('data/business.csv', "w")

  newBusinessFileWriter = csv.writer(newBusinessFile)

  #write the headers
  businessHeaders.append("X")
  businessHeaders.append("Y")
  newBusinessFileWriter.writerow(businessHeaders)

  # loop through all records
  for record in businessRecords:
    location = record[-1]
    location = location.split(",")

    if len(location) == 2:
      record.append(location[1][:-1])
      record.append(location[0][1:])
      newBusinessFileWriter.writerow(record)

  # close the file after reading
  businessFile.close();
  newBusinessFile.close();


except IOError:
  print("Error opening the file.")