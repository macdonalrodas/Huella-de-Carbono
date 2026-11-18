// Nombres de países en español.
// Los datos de OWID traen los nombres en inglés; el navegador sabe
// traducirlos con Intl.DisplayNames, pero necesita el código de 2 letras
// (ISO 3166-1 alfa-2). Esta tabla convierte el código de 3 letras al de 2.
const ISO3_A_ISO2 = {
  ABW:"AW", AFG:"AF", AGO:"AO", AIA:"AI", ALB:"AL", AND:"AD", ARE:"AE", ARG:"AR", ARM:"AM", ATA:"AQ",
  ATG:"AG", AUS:"AU", AUT:"AT", AZE:"AZ", BDI:"BI", BEL:"BE", BEN:"BJ", BES:"BQ", BFA:"BF", BGD:"BD",
  BGR:"BG", BHR:"BH", BHS:"BS", BIH:"BA", BLR:"BY", BLZ:"BZ", BMU:"BM", BOL:"BO", BRA:"BR", BRB:"BB",
  BRN:"BN", BTN:"BT", BWA:"BW", CAF:"CF", CAN:"CA", CHE:"CH", CHL:"CL", CHN:"CN", CIV:"CI", CMR:"CM",
  COD:"CD", COG:"CG", COK:"CK", COL:"CO", COM:"KM", CPV:"CV", CRI:"CR", CUB:"CU", CUW:"CW", CXR:"CX",
  CYP:"CY", CZE:"CZ", DEU:"DE", DJI:"DJ", DMA:"DM", DNK:"DK", DOM:"DO", DZA:"DZ", ECU:"EC", EGY:"EG",
  ERI:"ER", ESP:"ES", EST:"EE", ETH:"ET", FIN:"FI", FJI:"FJ", FRA:"FR", FRO:"FO", FSM:"FM", GAB:"GA",
  GBR:"GB", GEO:"GE", GHA:"GH", GIN:"GN", GMB:"GM", GNB:"GW", GNQ:"GQ", GRC:"GR", GRD:"GD", GRL:"GL",
  GTM:"GT", GUY:"GY", HKG:"HK", HND:"HN", HRV:"HR", HTI:"HT", HUN:"HU", IDN:"ID", IND:"IN", IRL:"IE",
  IRN:"IR", IRQ:"IQ", ISL:"IS", ISR:"IL", ITA:"IT", JAM:"JM", JOR:"JO", JPN:"JP", KAZ:"KZ", KEN:"KE",
  KGZ:"KG", KHM:"KH", KIR:"KI", KNA:"KN", KOR:"KR", KWT:"KW", LAO:"LA", LBN:"LB", LBR:"LR", LBY:"LY",
  LCA:"LC", LIE:"LI", LKA:"LK", LSO:"LS", LTU:"LT", LUX:"LU", LVA:"LV", MAC:"MO", MAR:"MA", MDA:"MD",
  MDG:"MG", MDV:"MV", MEX:"MX", MHL:"MH", MKD:"MK", MLI:"ML", MLT:"MT", MMR:"MM", MNE:"ME", MNG:"MN",
  MOZ:"MZ", MRT:"MR", MSR:"MS", MUS:"MU", MWI:"MW", MYS:"MY", NAM:"NA", NCL:"NC", NER:"NE", NGA:"NG",
  NIC:"NI", NIU:"NU", NLD:"NL", NOR:"NO", NPL:"NP", NRU:"NR", NZL:"NZ", OMN:"OM", PAK:"PK", PAN:"PA",
  PER:"PE", PHL:"PH", PLW:"PW", PNG:"PG", POL:"PL", PRK:"KP", PRT:"PT", PRY:"PY", PSE:"PS", PYF:"PF",
  QAT:"QA", ROU:"RO", RUS:"RU", RWA:"RW", SAU:"SA", SDN:"SD", SEN:"SN", SGP:"SG", SHN:"SH", SLB:"SB",
  SLE:"SL", SLV:"SV", SOM:"SO", SPM:"PM", SRB:"RS", SSD:"SS", STP:"ST", SUR:"SR", SVK:"SK", SVN:"SI",
  SWE:"SE", SWZ:"SZ", SXM:"SX", SYC:"SC", SYR:"SY", TCA:"TC", TCD:"TD", TGO:"TG", THA:"TH", TJK:"TJ",
  TKM:"TM", TLS:"TL", TON:"TO", TTO:"TT", TUN:"TN", TUR:"TR", TUV:"TV", TWN:"TW", TZA:"TZ", UGA:"UG",
  UKR:"UA", URY:"UY", USA:"US", UZB:"UZ", VCT:"VC", VEN:"VE", VGB:"VG", VNM:"VN", VUT:"VU", WLF:"WF",
  WSM:"WS", YEM:"YE", ZAF:"ZA", ZMB:"ZM", ZWE:"ZW",
};

// Nombres que se prefieren más cortos o más comunes
const AJUSTES = {
  HKG: "Hong Kong",
  MAC: "Macao",
  PSE: "Palestina",
  MMR: "Myanmar",
  BES: "Bonaire, San Eustaquio y Saba",
};

let traductor = null;
try {
  traductor = new Intl.DisplayNames(["es"], { type: "region" });
} catch {
  traductor = null; // navegador sin soporte: se usa el nombre original
}

export function nombreEnEspanol(iso3, nombreOriginal) {
  if (AJUSTES[iso3]) return AJUSTES[iso3];
  const iso2 = ISO3_A_ISO2[iso3];
  if (!iso2 || !traductor) return nombreOriginal;
  const nombre = traductor.of(iso2);
  return nombre && nombre !== iso2 ? nombre : nombreOriginal;
}
