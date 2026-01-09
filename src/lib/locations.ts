export const locations = [...new Set([
  "All",
  // Luxembourg City Districts
  "Beggen", "Belair", "Bonnevoie-Nord", "Bonnevoie-Sud", "Cents", "Cessange", "Clausen", "Dommeldange", "Eich", "Gare", "Gasperich", "Grund", "Hamm", "Hollerich", "Kirchberg", "Limpertsberg", "Merl", "Mühlenbach", "Neudorf", "Pfaffenthal", "Pulvermühl", "Rollingergrund", "Ville Haute", "Weimerskirch", "Weimershof",
  // Canton Capellen
  "Capellen", "Clemency", "Dippach", "Garnich", "Hobscheid", "Kehlen", "Koerich", "Kopstal", "Mamer", "Septfontaines", "Steinfort", "Bascharage", "Fingig", "Goeblange", "Grass", "Greisch", "Hivange", "Holzem", "Kahler", "Keispelt", "Kleinbettingen", "Linger", "Meispelt", "Nospelt", "Olm", "Roodt", "Schouweiler", "Simmern",
  // Canton Esch-sur-Alzette
  "Belvaux", "Bergem", "Bettembourg", "Differdange", "Dudelange", "Esch-sur-Alzette", "Frisange", "Kayl", "Leudelange", "Mondercange", "Pétange", "Reckange-sur-Mess", "Roeser", "Rumelange", "Sanem", "Schifflange", "Abweiler", "Aspelt", "Bivange", "Burange", "Crauthem", "Fennange", "Foetz", "Hellange", "Huncherange", "Kockelscheuer", "Lamadelaine", "Livange", "Mondorf-les-Bains", "Niederkorn", "Noertzange", "Oberkorn", "Peppange", "Pontpierre", "Rodange", "Soleuvre", "Tétange", "Wickrange",
  // Canton Grevenmacher
  "Betzdorf", "Biwer", "Flaxweiler", "Grevenmacher", "Junglinster", "Manternach", "Mertert", "Wormeldange", "Ahn", "Berg", "Berbourg", "Boudler", "Boudlerbach", "Bourglinster", "Breinert", "Brouch", "Canach", "Ehnen", "Eisenborn", "Eschweiler", "Gonderange", "Godbrange", "Gostingen", "Hagelsdorf", "Imbringen", "Lellig", "Machtum", "Mensdorf", "Munschecker", "Niederdonven", "Oberdonven", "Oetrange", "Potaschberg", "Rodenbourg", "Roodt-sur-Syre", "Wasserbillig", "Wecker", "Weydig",
  // Canton Luxembourg
  "Bertrange", "Contern", "Hesperange", "Luxembourg", "Niederanven", "Sandweiler", "Schuttrange", "Steinsel", "Strassen", "Walferdange", "Weiler-la-Tour", "Alzingen", "Bereldange", "Ernster", "Fentange", "Findel", "Hostert", "Howald", "Itzig", "Moutfort", "Müllendorf", "Munsbach", "Neuhäusgen", "Oberanven", "Rameldange", "Schrassig", "Senningen", "Senningerberg", "Syren", "Uebersyren", "Waldhof",
  // Canton Mersch
  "Bissen", "Boevange-sur-Attert", "Colmar-Berg", "Fischbach", "Heffingen", "Larochette", "Lintgen", "Lorentzweiler", "Mersch", "Nommern", "Tuntange", "Angelsberg", "Blaschette", "Bofferdange", "Buschdorf", "Essingen", "Gosseldange", "Grevenknapp", "Hunsdorf", "Marienthal", "Moesdorf", "Pettingen", "Prettingen", "Reckange", "Reuland", "Rollingen", "Schoenfels", "Schrondweiler", "Stegen",
  // Canton Clervaux
  "Clervaux", "Consthum", "Heinerscheid", "Hosingen", "Kiischpelt", "Munshausen", "Parc Hosingen", "Troisvierges", "Weiswampach", "Wincrange", "Antoniushaff", "Asselborn", "Binsfeld", "Boevange", "Brachtenbach", "Breidfeld", "Bockholtz", "Boxhorn", "Cinqfontaines", "Derenbach", "Dorscheid", "Drinklange", "Eisenbach", "Grindhausen", "Hachiville", "Hamiville", "Hautbellain", "Huldange", "Kalborn", "Leithum", "Lieler", "Marnach", "Mecher", "Neidhausen", "Reuler", "Roder", "Rodershausen", "Rumlange", "Sassel", "Siebenaler", "Stockem", "Stolzembourg", "Urspelt", "Wahlhausen", "Weicherdange", "Weiler", "Wemperhardt", "Wilwerdange",
  // Canton Diekirch
  "Bettendorf", "Bourscheid", "Diekirch", "Ermsdorf", "Erpeldange-sur-Sûre", "Ettelbruck", "Feulen", "Mertzig", "Reisdorf", "Schieren", "Vallée de l'Ernz", "Bastendorf", "Beaufort", "Bigelbach", "Brandenburg", "Burden", "Eppeldorf", "Gilsdorf", "Gralingen", "Haller", "Hoesdorf", "Ingeldorf", "Landscheid", "Lipperscheid", "Longsdorf", "Medernach", "Michelau", "Moestroff", "Niederfeulen", "Oberfeulen", "Warken",
  // Canton Echternach
  "Bech", "Berdorf", "Consdorf", "Echternach", "Mompach", "Rosport-Mompach", "Waldbillig", "Altrier", "Bollendorf-Pont", "Born", "Breidweiler", "Christnach", "Dickweiler", "Dillingen", "Geyershof", "Givenich", "Girst", "Grundhof", "Halsdorf", "Herborn", "Hinkel", "Moersdorf", "Mullerthal", "Osweiler", "Rippig", "Rosport", "Scheidgen", "Steinheim", "Weilerbach", "Zittig",
  // Canton Redange
  "Beckerich", "Ell", "Grosbous", "Préizerdaul", "Rambrouch", "Redange-sur-Attert", "Saeul", "Useldange", "Vichten", "Wahl", "Arsdorf", "Bigonville", "Boulaide", "Buschrodt", "Colpach-Bas", "Colpach-Haut", "Ehner", "Elvange", "Everlange", "Folschette", "Grummelscheid", "Holtz", "Hovelange", "Huttange", "Kapweiler", "Koetschette", "Levelange", "Martelange", "Nagem", "Niederpallen", "Noerdange", "Oberpallen", "Ospern", "Perle", "Petit-Nobressart", "Platen", "Perlé", "Pratz", "Reimberg", "Rippweiler", "Schandel", "Schwebach", "Wolwelange",
  // Canton Remich
  "Bous", "Burmerange", "Dalheim", "Lenningen", "Remich", "Schengen", "Stadtbredimus", "Waldbredimus", "Wellenstein", "Assel", "Bech-Kleinmacher", "Ellange", "Emerange", "Filsdorf", "Greiveldange", "Remerschen", "Rolling", "Schwebsange", "Trintange", "Wintrange",
  // Canton Vianden
  "Vianden", "Putscheid", "Tandel", "Bivels", "Fouhren", "Nachtmanderscheid", "Walsdorf",
  // Canton Wiltz
  "Esch-sur-Sûre", "Goesdorf", "Lac de la Haute-Sûre", "Wiltz", "Winseler", "Alscheid", "Bavigne", "Berlé", "Bonnal", "Buderscheid", "Dahl", "Doncols", "Enscherange", "Eschdorf", "Harlange", "Heiderscheid", "Kaundorf", "Kautenbach", "Liefrange", "Lultzhausen", "Merkholtz", "Nothum", "Nocher", "Pommerloch", "Roullingen", "Schleif", "Selscheid", "Surré", "Tarchamps", "Watrange"
])].sort((a, b) => {
  if (a === "All") return -1
  if (b === "All") return 1
  return a.localeCompare(b)
})