# Istruzioni

Questo script è pensato per calcolare le pre-classificazioni per la VQR 2015-2019, GEV1, 
Università di Pisa. Probabilmente si può adattare per chiunque usi IRIS, ma non garantisco.

Il primo step è scaricare la lista delle proprie pubblicazioni da IRIS, nel caso UniPi andando
su [ARPI](https://arpi.unipi.it/browse?type=author), cercandosi e scaricando la lista di tutte
le proprie pubblicazioni fra 2015 e 2019 ordinandole in ordine decrescente ed eventualmente
allungando la lista, poi cliccando su "Esportazione > Excel". 

A questo punto, si può scaricare lo script con 
```
$ sudo apt-get install python3-pandas python3-requests
$ git clone https://github.com/robol/citation-count.git
$ cd citation-count 
```
e poi si esegue puntandolo al file scaricato prima, ad esempio:
```
$ python3 citation-count.py ~/Downloads/exports.xslx
```
