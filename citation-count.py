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
    
    raise RuntimeError("Setore non trovato")


def get_classification(journal, citations, db):
    if not journal in db:
        return -1

    jdata = db[journal]

    for j in range(len(jdata)):
        if not ("NO" in jdata[j]) and citations >= int(jdata[j]):
            return j
        
    return len(jdata)

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
    

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("È necessario indicare come argomento export.xslx, il file Excel ottenuto")
        print("esportando le proprie pubblicazioni seguendo questi passi:")
        print("")
        print(" 1. Cercarsi su https://arpi.unipi.it/browse?type=author")
        print(" 2. Selezionare un numero sufficiente di risultati per pagina per vedere tutte le proprie pubblicazioni")
        print(" 3. Cliccare su Esportazione > Excel")
        print("")
        print("P.S.: Conviene ordinare le pubblicazioni in modo decrescente, così da non escludere quelle rilevanti per la VQR")
        print("anche nel caso se ne abbiano > 100")

        sys.exit(1)

    years = [ 2015, 2016, 2017, 2018, 2019 ]

    class_names = [
        "X",
        "A",
        "B",
        "C",
        "D",
        "E",
    ]

    print("Inserire il settore (e.g, MAT01, ..., MAT08): ", end = "")
    sector = input()



    db_mcq = { year: db for (year, db) in zip(
        years, 
        map(lambda x : get_journals_classification(x, sector, "MCQ-SCOPUS", "article_MCQ"), years)
    ) }

    db_sjr = { year: db for (year, db) in zip(
        years, 
        map(lambda x : get_journals_classification(x, sector, "SJR-SNIP", "article_SJR"), years)
    ) }

    db_snip = { year: db for (year, db) in zip(
        years, 
        map(lambda x : get_journals_classification(x, sector, "SJR-SNIP", "article_SNIP"), years)
    ) }

    data = pandas.read_excel(sys.argv[1])

    # We prepare the data for the output
    out = {
      'Titolo': [], 
      'MCQ': [],
      'SJR': [],
      'SNIP': [],
      'Anno': [],
      'Rivista': [],
      '# citazioni': [],
      '# autocitazioni': [],
      'Autori': []
    }

    print("\033[1mMCQ SJR SNIP Titolo                                   Anno  #cit. #autocit. Rivista                  Autori \033[0m")

    for j in range(len(data)):
        scopus_id = data["Identificativo Scopus"][j]
        year = data["Data pubblicazione"][j]

        journal = data["Rivista"][j]

        if year < 2015 or year >= 2020 or not isinstance(journal, str):
            continue
        else:
            journal = journal.lower()

        (cit, self_cit) = get_scopus_citations(scopus_id)
        cl_mcq = get_classification(journal, cit, db_mcq[year])
        cl_sjr = get_classification(journal, cit, db_sjr[year])
        cl_snip = get_classification(journal, cit, db_snip[year])

        # Se le autocitazioni superano il 50% formattiamo in rosso
        if self_cit >= cit / 2:
          self_cit_s = "\033[31;1m" + str(self_cit).rjust(8) + "\033[0m"
        else:
          self_cit_s = str(self_cit).rjust(8)

        class_mcq = class_names[cl_mcq+1]
        class_sjr = class_names[cl_sjr+1]
        class_snip = class_names[cl_snip+1]

        print("%s   %s   %s    %s  %s  %s  %s  %s  %s" % (
          format_class(class_mcq), format_class(class_sjr), format_class(class_snip),
          truncate(data["Titolo"][j], 40), year, str(cit).rjust(4), self_cit_s, 
          truncate(journal, 24), data['Autori'][j])
        )

        out['Titolo'].append(data["Titolo"][j])
        out['Anno'].append(year)
        out['# citazioni'].append(cit)
        out['# autocitazioni'].append(self_cit)
        out['Rivista'].append(journal)
        out['Autori'].append(data['Autori'][j])
        out['MCQ'].append(class_mcq)
        out['SJR'].append(class_sjr)
        out['SNIP'].append(class_snip)

    df = pandas.DataFrame(data = out)

    print("")
    if os.path.exists('output.xlsx'):
      print("Il file output.xlsx esiste già, sovrascriverlo? [yn] ", end = '')
      ans = input()

      if ans.lower() == 'n':
        sys.exit(0)

    df.to_excel("output.xlsx")
    print("> I dati sono stati salvati in output.xlsx")