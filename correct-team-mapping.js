// Mapare corectă pentru toate echipele în ordinea alfabetică
// Ordinea alfabetică actuală din storage vs maparea corectă din final-team-data.js

const correctTeamMapping = [
  // ID 1: Auratix -> trebuie să aibă jucătorii din final-team-data.js ID 28 (Tankkillerr)
  { storageId: 1, originalId: 28, teamName: "Auratix", captain: "Tankkillerr" },
  
  // ID 2: BaitMD -> echipă nouă adăugată
  { storageId: 2, originalId: "new", teamName: "BaitMD", captain: "NeoK1nG-" },
  
  // ID 3: Barbosii -> trebuie să aibă jucătorii din final-team-data.js ID 25 (btate)
  { storageId: 3, originalId: 25, teamName: "Barbosii", captain: "btate" },
  
  // ID 4: Bloody -> trebuie să aibă jucătorii din final-team-data.js ID 35 (MrPalste)
  { storageId: 4, originalId: 35, teamName: "Bloody", captain: "MrPalste" },
  
  // ID 5: Bobb3rs -> trebuie să aibă jucătorii din final-team-data.js ID 34 (ZanT3X)
  { storageId: 5, originalId: 34, teamName: "Bobb3rs", captain: "ZanT3X" },
  
  // ID 6: BPSP -> trebuie să aibă jucătorii din final-team-data.js ID 39 (M1kee)
  { storageId: 6, originalId: 39, teamName: "BPSP", captain: "M1kee" },
  
  // ID 7: Brigada -> trebuie să aibă jucătorii din final-team-data.js ID 36 (TonyBossuB)
  { storageId: 7, originalId: 36, teamName: "Brigada", captain: "TonyBossuB" },
  
  // ID 8: Brigada Meteor -> trebuie să aibă jucătorii din final-team-data.js ID 38 (yeahmen0)
  { storageId: 8, originalId: 38, teamName: "Brigada Meteor", captain: "yeahmen0" },
  
  // ID 9: Cadian Team -> trebuie să aibă jucătorii din final-team-data.js ID 23 (cadiaN)
  { storageId: 9, originalId: 23, teamName: "Cadian Team", captain: "cadiaN" },
  
  // ID 10: Ciocana Esports -> trebuie să aibă jucătorii din final-team-data.js ID 33 (CoMMaNDeR_MD)
  { storageId: 10, originalId: 33, teamName: "Ciocana Esports", captain: "CoMMaNDeR_MD" },
  
  // ID 11: Ciocălău Team -> trebuie să aibă jucătorii din final-team-data.js ID 22 (vd)
  { storageId: 11, originalId: 22, teamName: "Ciocălău Team", captain: "vd" },
  
  // ID 12: Cipok -> trebuie să aibă jucătorii din final-team-data.js ID 12 (itzHYPEER)
  { storageId: 12, originalId: 12, teamName: "Cipok", captain: "itzHYPEER" },
  
  // ID 13: Coli -> trebuie să aibă jucătorii din final-team-data.js ID 13 (denzy)
  { storageId: 13, originalId: 13, teamName: "Coli", captain: "denzy" },
  
  // ID 14: Crasat -> trebuie să aibă jucătorii din final-team-data.js ID 14 (chazya)
  { storageId: 14, originalId: 14, teamName: "Crasat", captain: "chazya" },
  
  // ID 15: Cucumba -> trebuie să aibă jucătorii din final-team-data.js ID 15 (DrMadness)
  { storageId: 15, originalId: 15, teamName: "Cucumba", captain: "DrMadness" },
  
  // ID 16: Flux Line -> trebuie să aibă jucătorii din final-team-data.js ID 16 (PhXGON)
  { storageId: 16, originalId: 16, teamName: "Flux Line", captain: "PhXGON" },
  
  // ID 17: Golden Five -> trebuie să aibă jucătorii din final-team-data.js ID 17 (Fr0yMan)
  { storageId: 17, originalId: 17, teamName: "Golden Five", captain: "Fr0yMan" },
  
  // ID 18: Into the Beach -> trebuie să aibă jucătorii din final-team-data.js ID 18 (sndeRR)
  { storageId: 18, originalId: 18, teamName: "Into the Beach", captain: "sndeRR" },
  
  // ID 19: Japon -> trebuie să aibă jucătorii din final-team-data.js ID 19 (patan)
  { storageId: 19, originalId: 19, teamName: "Japon", captain: "patan" },
  
  // ID 20: K9 Team -> trebuie să aibă jucătorii din final-team-data.js ID 20 (Alohadron)
  { storageId: 20, originalId: 20, teamName: "K9 Team", captain: "Alohadron" },
  
  // ID 21: Killuminaty -> trebuie să aibă jucătorii din final-team-data.js ID 9 (lazcc)
  { storageId: 21, originalId: 9, teamName: "Killuminaty", captain: "lazcc" },
  
  // ID 22: KostiujeniKlinik -> trebuie să aibă jucătorii din final-team-data.js ID 10 (DumaSula)
  { storageId: 22, originalId: 10, teamName: "KostiujeniKlinik", captain: "DumaSula" },
  
  // ID 23: La Passion -> trebuie să aibă jucătorii din final-team-data.js ID 11 (Feniyxad)
  { storageId: 23, originalId: 11, teamName: "La Passion", captain: "Feniyxad" },
  
  // ID 24: Lean Vision -> trebuie să aibă jucătorii din final-team-data.js ID 24 (Rexodd_)
  { storageId: 24, originalId: 24, teamName: "Lean Vision", captain: "Rexodd_" },
  
  // ID 25: Legalize -> trebuie să aibă jucătorii din final-team-data.js ID 6 (hide-)
  { storageId: 25, originalId: 6, teamName: "Legalize", captain: "hide-" },
  
  // ID 26: LitEnergy -> trebuie să aibă jucătorii din final-team-data.js ID 26 (-ExTaZzy-)
  { storageId: 26, originalId: 26, teamName: "LitEnergy", captain: "-ExTaZzy-" },
  
  // ID 27: LYSQ -> trebuie să aibă jucătorii din final-team-data.js ID 27 (mooghiwara)
  { storageId: 27, originalId: 27, teamName: "LYSQ", captain: "mooghiwara" },
  
  // ID 28: Muligambia -> trebuie să aibă jucătorii din final-team-data.js ID 29 (Huh)
  { storageId: 28, originalId: 29, teamName: "Muligambia", captain: "Huh" },
  
  // ID 29: Neo Egoist League -> trebuie să aibă jucătorii din final-team-data.js ID 30 (-farra)
  { storageId: 29, originalId: 30, teamName: "Neo Egoist League", captain: "-farra" },
  
  // ID 30: Onyx -> trebuie să aibă jucătorii din final-team-data.js ID 31 (aC_)
  { storageId: 30, originalId: 31, teamName: "Onyx", captain: "aC_" },
  
  // ID 31: RCBVR -> trebuie să aibă jucătorii din final-team-data.js ID 32 (BogdanR)
  { storageId: 31, originalId: 32, teamName: "RCBVR", captain: "BogdanR" },
  
  // ID 32: Robotaim -> trebuie să aibă jucătorii din final-team-data.js ID 7 (KROULYSFORD)
  { storageId: 32, originalId: 7, teamName: "Robotaim", captain: "KROULYSFORD" },
  
  // ID 33: Rumina -> trebuie să aibă jucătorii din final-team-data.js ID 8 (NuBekk)
  { storageId: 33, originalId: 8, teamName: "Rumina", captain: "NuBekk" },
  
  // ID 34: Shashlik -> trebuie să aibă jucătorii din final-team-data.js ID 37 (xen0)
  { storageId: 34, originalId: 37, teamName: "Shashlik", captain: "xen0" },
  
  // ID 35: Trigger -> trebuie să aibă jucătorii din final-team-data.js ID 4 (denisZx)
  { storageId: 35, originalId: 4, teamName: "Trigger", captain: "denisZx" },
  
  // ID 36: VeryGoodTeam -> trebuie să aibă jucătorii din final-team-data.js ID 5 (BoreaTaga)
  { storageId: 36, originalId: 5, teamName: "VeryGoodTeam", captain: "BoreaTaga" },
  
  // ID 37: WenDeagle -> trebuie să aibă jucătorii din final-team-data.js ID 3 (Mndfvck)
  { storageId: 37, originalId: 3, teamName: "WenDeagle", captain: "Mndfvck" },
  
  // ID 38: Wenzo -> trebuie să aibă jucătorii din final-team-data.js ID 2 (-nghtmarr)
  { storageId: 38, originalId: 2, teamName: "Wenzo", captain: "-nghtmarr" },
  
  // ID 39: WinSpirit -> echipă nouă adăugată
  { storageId: 39, originalId: "new", teamName: "WinSpirit", captain: "LightStormyx" },
  
  // ID 40: X-one -> trebuie să aibă jucătorii din final-team-data.js ID 21 (-OPIUMVXQ-)
  { storageId: 40, originalId: 21, teamName: "X-one", captain: "-OPIUMVXQ-" },
  
  // ID 41: XPlosion -> trebuie să aibă jucătorii din final-team-data.js ID 1 (Duke_0)
  { storageId: 41, originalId: 1, teamName: "XPlosion", captain: "Duke_0" },
  
  // ID 42: Xtreme Players -> echipă nouă adăugată
  { storageId: 42, originalId: "new", teamName: "Xtreme Players", captain: "w0lf3nstein" }
];

export { correctTeamMapping };