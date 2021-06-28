# -*- coding: utf-8 -*-
"""
Created on Sun Jun 27 18:48:20 2021

@author: anton
"""

import os


AmeriqueNord = ['ca.csv', 'cr.csv', 'gt.csv', 'hn.csv', 'mx.csv', 'pa.csv', 'sv.csv', 'us.csv'] # 8 
AmeriqueSud = ['ar.csv', 'bo.csv', 'br.csv', 'cl.csv', 'co.csv', 'do.csv', 'ec.csv', 'py.csv', 'uy.csv'] #9
OceanieAsie = ['au.csv', 'hk.csv', 'id.csv', 'jp.csv', 'my.csv', 'nz.csv', 'ph.csv', 'sg.csv', 'tw.csv'] #9
EuropeOuest = ['ie.csv', 'be.csv', 'ch.csv', 'de.csv', 'es.csv', 'fr.csv', 'gb.csv', 'it.csv', 'pt.csv']# 9 
EuropeEst = ['at.csv', 'cz.csv', 'gr.csv', 'hu.csv', 'lt.csv', 'lv.csv', 'pl.csv', 'sk.csv', 'tr.csv']# 9
EuropeDuNord = ['dk.csv', 'fi.csv', 'nl.csv', 'se.csv', 'is.csv', 'no.csv'] #6
Anglophone = ['us.csv', 'ca.csv', 'gb.csv', 'au.csv', 'nz.csv'] #5

path = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\'
files = os.listdir('C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\')

pathAmeriqueNord = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\AmeriqueNord.csv'
pathAmeriqueSud = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\AmeriqueSud.csv'
pathOceanieAsie = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\OceanieAsie.csv'
pathEuropeOuest = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\EuropeOuest.csv'
pathEuropeEst = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\EuropeEst.csv'
pathEuropeNord = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\EuropeNord.csv'
pathAnglophone = 'C:\\Users\\anton\\Desktop\\Cours\\E21 Poly\\INF8808E_2021_Public\\INF8808E\\Projet\\code\\src\\assets\\data\\Anglophone.csv'

def newFile(pathCONTINENT, CONTINENT): 
    fout=open(pathCONTINENT,"a", encoding='utf8')
    # first file:
    for line in open(path+CONTINENT[0], encoding='utf8'):
        fout.write(line)
    # now the rest:    
    for file in CONTINENT[1:]:
        f = open(path + file, encoding='utf8')
        f.__next__() # skip the header
        for line in f:
             fout.write(line)
        f.close() # not really needed
        print(f"file {file} done")
    fout.close()

def giveCountries():
    array= []
    intr = input("Dire FIN pour finir ")
    while ( intr != "FIN"):
        array.append(intr)
        intr = input("Dire FIN pour finir ")
    print(array)
    return(array)