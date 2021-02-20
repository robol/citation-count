import requests, json, pandas, os, sys

journal_path = "./scopus"

# Some names are wrong in the GEV list, I am keeping this here to fix any inconsistency 
# that should arise. 
name_replacements = [ 
    ("siam journal of scientific computing", "siam journal on scientific computing")
]

def get_scopus_citations(id):
    req = requests.get("https://arpi.unipi.it/sur/itemExternalCitation/scopus/get.json?externalId=%s" % id)

    try:
        data = json.loads(req.text)
        return (data["citationCountTotal"], data["selfCitationCountTotal"])
    except:
        return (0, 0)

        
def get_journals_classification(year, sector, folder, sheet):
    db_dir = os.path.join(journal_path, str(year), "Lista %s" % folder)
    for f in os.listdir(db_dir):
        if sector in f:
            # We have found the right file
            d = pandas.read_excel(os.path.join(db_dir, f), sheet_name = sheet)

            # We build a hash table that maps the lower case name of the 
            # journal to an array of the number of citations required to 
            # be in the various categories
            dd = {}
            for j in range(len(d)):
                name = str(d["Source Title"][j]).lower()
                for pair in name_replacements:
                    name = name.replace(pair[0], pair[1])

                dd[name] = [ 
                    str(d["Top 10%"][j]), 
                    str(d['10% - 35%'][j]), 
                    str(d["35% - 60%"][j]), 
                    str(d["60% - 80%"][j]), 
                    str(d["Bottom 20%"][j])
                ]

            return dd
    
    raise RuntimeError("Settore non trovato: %s" % sector)


def get_classification(journal, citations, db):
    if not journal in db:
        return -1

    jdata = db[journal]

    for j in range(len(jdata)):
        if not ("NO" in jdata[j]) and citations >= int(jdata[j]):
            return j
        
    return len(jdata)

def find_journals(db, name):
  return filter(lambda key : name.lower() in key, db.keys())

def truncate(x, n):
    if len(x) >= n: 
        return x[0:n-4] + "..."
    else:
        return x.ljust(n-1)

def format_class(C):
  if C == "A":
    return "\033[32;1mA\033[0m"
  elif C == "B":
    return "\033[33;1mB\033[0m"
  else:
    return C