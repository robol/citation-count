import citations as cit
import json
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

years = [ 2015, 2016, 2017, 2018, 2019 ]

class_names = [
    "-",
    "A",
    "B",
    "C",
    "D",
    "E",
]

sectors = [ 
  "MAT01",
  "MAT02",
  "MAT03",
  "MAT05",
  "MAT06",
  "MAT07",
  "MAT08"
]

classifications = {
   "mcq": {
     "folder": "MCQ-SCOPUS",
     "sheet": "article_MCQ"
   }, 

   "sjr": {
     "folder": "SJR-SNIP",
     "sheet": "article_SJR"
   },

   "snip": {
     "folder": "SJR-SNIP",
     "sheet": "article_SNIP"
   }
}

sectors_db = {}

for sector in sectors:
  sectors_db[sector] = {}

  for (cl, classification) in classifications.items():
    print("Loading %s / %s ..." % (sector, cl), end = '')
    sectors_db[sector][cl] = { year: db for (year, db) in zip(
        years, 
        map(lambda x : cit.get_journals_classification(x, sector, classification["folder"], classification["sheet"]), years)
    ) }  
    print(" done.")

# We also build a set with all Journal names
print("Building index of Journal names ... ", end = '')
journal_names = set()
for sector in sectors:
  for classification in classifications:
    for year in years:
      for name in sectors_db[sector][classification][year].keys():
        journal_names.add(name)
print(" done.")

@app.route("/")
def index():
  return "Hello"

@app.route("/api/v1/search-journal", methods = [ "POST" ])
def search_journal():
  d = json.loads(request.data)
  name = d["journal"].lower()

  print("Searching %s" % name)
  print(journal_names)

  matching_j = list(filter(lambda x : d["journal"].lower() in x, journal_names))

  return json.dumps(matching_j)

@app.route("/api/v1/journals", methods = [ "GET" ])
def journals():
  return json.dumps(list(journal_names))

@app.route("/api/v1/classify", methods = [ "POST" ])
def classify():
  d = json.loads(request.data)

  journal = d["journal"].lower()
  citations = d["citations"]
  year = d["year"]
  sector = d["sector"]

  cl_mcq = cit.get_classification(journal, citations, sectors_db[sector]["mcq"][year])
  cl_sjr = cit.get_classification(journal, citations, sectors_db[sector]["sjr"][year])
  cl_snip = cit.get_classification(journal, citations, sectors_db[sector]["snip"][year])

  return json.dumps({
    "mcq": class_names[cl_mcq+1],
    "sjr": class_names[cl_sjr+1],
    "snip": class_names[cl_snip+1]
  })



