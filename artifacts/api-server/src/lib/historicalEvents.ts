export type HistoricalEvent = {
  date: string;
  headline: string;
  sentiment: "bullish" | "bearish" | "neutral";
  marketShock: number;       // added to every stock's daily return (-0.05 = crash, +0.02 = boom)
  volatilityBoost: number;   // extra volatility multiplier added for this day
};

// Every event maps to exactly one calendar date (YYYY-MM-DD).
// marketShock and volatilityBoost are applied on top of the level's existing multipliers.
const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // 2015
  { date: "2015-01-25", headline: "Anti-austerity Syriza wins Greek election — European markets rattle", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.4 },
  { date: "2015-02-11", headline: "SpaceX sticks the landing — tech investors cheer", sentiment: "bullish", marketShock: 0.005, volatilityBoost: 0.1 },
  { date: "2015-03-24", headline: "Germanwings crash devastates airline sector", sentiment: "bearish", marketShock: -0.006, volatilityBoost: 0.2 },
  { date: "2015-04-25", headline: "Nepal magnitude 7.8 earthquake — commodities spike", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.2 },
  { date: "2015-07-14", headline: "Iran Nuclear Deal reached — oil drops, markets gain", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.3 },
  { date: "2015-09-18", headline: "Volkswagen Dieselgate scandal erupts — auto stocks crash", sentiment: "bearish", marketShock: -0.018, volatilityBoost: 0.5 },
  { date: "2015-11-13", headline: "Paris terrorist attacks kill 130 — global markets sell off", sentiment: "bearish", marketShock: -0.025, volatilityBoost: 0.8 },
  { date: "2015-12-12", headline: "Paris Climate Agreement adopted — clean energy rallies", sentiment: "bullish", marketShock: 0.004, volatilityBoost: 0.1 },

  // 2016
  { date: "2016-02-01", headline: "WHO declares Zika virus global health emergency", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.3 },
  { date: "2016-02-11", headline: "Gravitational waves detected — scientific stocks surge", sentiment: "bullish", marketShock: 0.004, volatilityBoost: 0.1 },
  { date: "2016-03-15", headline: "AlphaGo beats world Go champion 4-1 — AI stocks soar", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.2 },
  { date: "2016-04-03", headline: "Panama Papers expose offshore billions — finance stocks crater", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.5 },
  { date: "2016-06-23", headline: "BREXIT: UK votes to leave EU — worst day for markets in years", sentiment: "bearish", marketShock: -0.042, volatilityBoost: 1.5 },
  { date: "2016-07-06", headline: "Pokémon GO launches — mobile gaming and AR stocks spike", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.1 },
  { date: "2016-11-08", headline: "Trump shocks world, wins US presidency — markets surge on deregulation hopes", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 1.0 },

  // 2017
  { date: "2017-05-22", headline: "Manchester Arena bombing — defence and security stocks move", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.4 },
  { date: "2017-09-03", headline: "North Korea detonates most powerful nuclear test yet", sentiment: "bearish", marketShock: -0.018, volatilityBoost: 0.7 },
  { date: "2017-10-01", headline: "Las Vegas mass shooting — markets edge lower on uncertainty", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.3 },
  { date: "2017-10-05", headline: "#MeToo movement erupts — media and entertainment stocks fall", sentiment: "bearish", marketShock: -0.006, volatilityBoost: 0.2 },
  { date: "2017-12-06", headline: "US recognises Jerusalem as Israel's capital — Middle East tensions surge", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.4 },

  // 2018
  { date: "2018-04-27", headline: "Historic North-South Korea summit — peace rally", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.2 },
  { date: "2018-05-08", headline: "US quits Iran Nuclear Deal — oil spikes, markets fall", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2018-06-12", headline: "Trump–Kim Singapore summit — geopolitical risk fades", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2018-08-02", headline: "Apple becomes first US company worth $1 trillion — tech soars", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.2 },
  { date: "2018-10-02", headline: "Journalist Khashoggi murdered in Saudi consulate — markets shaken", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2018-11-17", headline: "Yellow Vests protests erupt in France — European markets slide", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.3 },

  // 2019
  { date: "2019-04-15", headline: "Notre-Dame Cathedral fire — markets unmoved but sentiment dips", sentiment: "bearish", marketShock: -0.004, volatilityBoost: 0.1 },
  { date: "2019-06-09", headline: "One million protest in Hong Kong — China trade fears spike", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.5 },
  { date: "2019-10-27", headline: "ISIS leader al-Baghdadi killed — geopolitical risk premium falls", sentiment: "bullish", marketShock: 0.005, volatilityBoost: 0.2 },
  { date: "2019-12-18", headline: "US House impeaches Trump — markets shrug it off", sentiment: "neutral", marketShock: -0.003, volatilityBoost: 0.2 },
  { date: "2019-12-31", headline: "WHO notified of mysterious pneumonia cases in Wuhan, China", sentiment: "neutral", marketShock: -0.002, volatilityBoost: 0.1 },

  // 2020
  { date: "2020-01-03", headline: "US drone kills Iranian General Soleimani — oil spikes, markets fall", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.6 },
  { date: "2020-01-26", headline: "Kobe Bryant killed in helicopter crash — markets subdued", sentiment: "bearish", marketShock: -0.004, volatilityBoost: 0.1 },
  { date: "2020-01-31", headline: "UK officially leaves the European Union", sentiment: "neutral", marketShock: -0.005, volatilityBoost: 0.3 },
  { date: "2020-03-11", headline: "WHO DECLARES COVID-19 A GLOBAL PANDEMIC — MARKETS COLLAPSE", sentiment: "bearish", marketShock: -0.085, volatilityBoost: 3.0 },
  { date: "2020-05-25", headline: "George Floyd killing sparks global racial justice protests", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.6 },
  { date: "2020-08-04", headline: "Massive Beirut port explosion — supply chain fears", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.3 },
  { date: "2020-11-03", headline: "Biden wins US presidency — markets rally on stability hopes", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.5 },
  { date: "2020-12-08", headline: "First person vaccinated against COVID-19 — markets explode higher", sentiment: "bullish", marketShock: 0.022, volatilityBoost: 0.3 },

  // 2021
  { date: "2021-01-06", headline: "Pro-Trump mob storms US Capitol — markets sell off sharply", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.8 },
  { date: "2021-03-23", headline: "Container ship blocks Suez Canal — global supply chain paralysed", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.4 },
  { date: "2021-08-15", headline: "Taliban takes Kabul — defence stocks surge, markets uncertain", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2021-09-07", headline: "El Salvador adopts Bitcoin as legal tender — crypto mania surges", sentiment: "bullish", marketShock: 0.014, volatilityBoost: 0.3 },
  { date: "2021-10-28", headline: "Facebook rebrands to Meta, bets billions on the metaverse", sentiment: "neutral", marketShock: -0.003, volatilityBoost: 0.2 },
  { date: "2021-12-25", headline: "James Webb Space Telescope launches — tech and science stocks rally", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.1 },

  // 2022
  { date: "2022-01-15", headline: "Tonga volcano triggers global tsunami warning — commodities spike", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.4 },
  { date: "2022-02-24", headline: "RUSSIA INVADES UKRAINE — MARKETS IN FREEFALL, ENERGY PRICES EXPLODE", sentiment: "bearish", marketShock: -0.052, volatilityBoost: 2.5 },
  { date: "2022-06-24", headline: "Supreme Court overturns Roe v. Wade — political uncertainty spikes", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.4 },
  { date: "2022-09-08", headline: "Queen Elizabeth II dies — UK markets fall, global mood sombre", sentiment: "bearish", marketShock: -0.006, volatilityBoost: 0.2 },
  { date: "2022-10-27", headline: "Elon Musk completes $44B Twitter takeover — tech stocks volatile", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.3 },
  { date: "2022-11-30", headline: "OpenAI releases ChatGPT — AI revolution begins, tech stocks surge", sentiment: "bullish", marketShock: 0.026, volatilityBoost: 0.4 },

  // 2023
  { date: "2023-02-06", headline: "Catastrophic earthquake kills 50,000 in Turkey and Syria", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.4 },
  { date: "2023-05-05", headline: "WHO declares COVID-19 no longer a global emergency — recovery confirmed", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.2 },
  { date: "2023-10-07", headline: "Hamas attacks Israel — Middle East war erupts, oil spikes", sentiment: "bearish", marketShock: -0.022, volatilityBoost: 0.9 },
  { date: "2023-12-12", headline: "COP28 agrees to transition away from fossil fuels — clean energy rallies", sentiment: "bullish", marketShock: 0.004, volatilityBoost: 0.1 },

  // 2024
  { date: "2024-03-07", headline: "Sweden joins NATO — Western defence stocks gain", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2024-05-30", headline: "Trump convicted on 34 felony counts — markets price political chaos", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2024-07-13", headline: "Trump survives assassination attempt — extreme market volatility", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 1.0 },
  { date: "2024-07-21", headline: "Biden drops out of 2024 race — political uncertainty spikes", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.5 },
  { date: "2024-09-27", headline: "Israel kills Hezbollah leader Nasrallah — Middle East escalation", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.6 },
  { date: "2024-11-05", headline: "Trump wins again — markets surge on deregulation and tax cut hopes", sentiment: "bullish", marketShock: 0.022, volatilityBoost: 0.7 },

  // 2025
  { date: "2025-01-20", headline: "Trump inaugurated for second term — markets cautiously optimistic", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2025-01-25", headline: "Middle East airstrikes escalate — oil surges, markets sell off", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.7 },
  { date: "2025-04-01", headline: "Pope Francis dies — global markets pause in sombre reflection", sentiment: "bearish", marketShock: -0.003, volatilityBoost: 0.1 },
];

// Build a lookup map for O(1) date access
const EVENT_MAP = new Map<string, HistoricalEvent>(
  HISTORICAL_EVENTS.map(e => [e.date, e])
);

export function getHistoricalEvent(date: string): HistoricalEvent | null {
  return EVENT_MAP.get(date) ?? null;
}
