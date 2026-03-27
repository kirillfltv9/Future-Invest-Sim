export type HistoricalEvent = {
  date: string;
  headline: string;
  sentiment: "bullish" | "bearish" | "neutral";
  marketShock: number;       // added to every stock's daily return (-0.05 = crash, +0.02 = boom)
  volatilityBoost: number;   // extra volatility multiplier added for this day
};

// Every event maps to exactly one calendar date (YYYY-MM-DD).
// Sources: real economic, tech/internet, political, sports, and war events 2015–2025.
const HISTORICAL_EVENTS: HistoricalEvent[] = [

  // ─── 2015 ──────────────────────────────────────────────────────────────────
  { date: "2015-01-20", headline: "Houthi rebels seize Yemen's presidential palace — oil risk premium returns", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.3 },
  { date: "2015-01-25", headline: "Anti-austerity Syriza party wins Greek election — European debt fears return", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2015-02-12", headline: "Minsk II ceasefire signed in Ukraine — geopolitical risk briefly eases", sentiment: "bullish", marketShock: 0.007, volatilityBoost: 0.2 },
  { date: "2015-03-24", headline: "Germanwings crash kills 150 — airline sector hammered", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.2 },
  { date: "2015-03-26", headline: "Saudi Arabia launches 'Operation Decisive Storm' in Yemen — oil markets spike", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.4 },
  { date: "2015-04-21", headline: "Google 'Mobilegeddon' update launches — mobile-first stocks surge, desktop ad stocks fall", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2015-04-25", headline: "Nepal magnitude 7.8 earthquake — commodities and insurance stocks swing", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.2 },
  { date: "2015-06-08", headline: "Apple Music launches, entering the streaming war — Spotify fears hit music stocks", sentiment: "neutral", marketShock: 0.004, volatilityBoost: 0.1 },
  { date: "2015-07-14", headline: "Iran Nuclear Deal reached — oil drops on supply expectations, markets rally", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.3 },
  { date: "2015-07-29", headline: "Windows 10 launches with Edge browser — Microsoft rallies", sentiment: "bullish", marketShock: 0.007, volatilityBoost: 0.1 },
  { date: "2015-08-10", headline: "Google announces Alphabet restructuring — investors cheer the clarity, tech soars", sentiment: "bullish", marketShock: 0.013, volatilityBoost: 0.2 },
  { date: "2015-09-18", headline: "Volkswagen Dieselgate scandal erupts — auto stocks in freefall worldwide", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.6 },
  { date: "2015-09-30", headline: "Russia officially enters Syrian Civil War — Middle East tension spikes, oil rallies", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2015-11-13", headline: "Paris terrorist attacks kill 130 — global markets sell off sharply", sentiment: "bearish", marketShock: -0.026, volatilityBoost: 0.9 },
  { date: "2015-12-12", headline: "Paris Climate Agreement signed by 196 nations — clean energy stocks rally", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2015-12-16", headline: "Fed raises rates for first time since 2006 — markets volatile then rally on certainty", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.5 },

  // ─── 2016 ──────────────────────────────────────────────────────────────────
  { date: "2016-02-01", headline: "WHO declares Zika virus global health emergency — travel and pharma stocks swing", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.3 },
  { date: "2016-03-15", headline: "Google DeepMind's AlphaGo beats world Go champion 4-1 — AI stocks surge", sentiment: "bullish", marketShock: 0.011, volatilityBoost: 0.2 },
  { date: "2016-04-03", headline: "Panama Papers leak exposes global offshore tax evasion — bank stocks crater", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.5 },
  { date: "2016-05-23", headline: "Battle of Fallujah begins — oil supply risk returns, energy stocks spike", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.2 },
  { date: "2016-06-13", headline: "Microsoft buys LinkedIn for $26.2 billion — tech M&A frenzy grips markets", sentiment: "bullish", marketShock: 0.012, volatilityBoost: 0.2 },
  { date: "2016-06-23", headline: "BREXIT: UK votes Leave — pound collapses to 30-year low, markets in freefall", sentiment: "bearish", marketShock: -0.044, volatilityBoost: 1.8 },
  { date: "2016-07-06", headline: "Pokémon GO takes the world by storm — mobile, AR, and gaming stocks explode", sentiment: "bullish", marketShock: 0.011, volatilityBoost: 0.2 },
  { date: "2016-07-15", headline: "Military coup attempt rocks Turkey — emerging markets sell off, safe havens surge", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.6 },
  { date: "2016-08-02", headline: "Instagram launches Stories — Facebook stock surges, Snapchat fears mount", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.1 },
  { date: "2016-11-08", headline: "Trump shocks the world, wins US presidency — markets first panic then surge wildly", sentiment: "bullish", marketShock: 0.018, volatilityBoost: 1.2 },

  // ─── 2017 ──────────────────────────────────────────────────────────────────
  { date: "2017-01-20", headline: "Donald Trump inaugurated as 45th US president — deregulation rally begins", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.3 },
  { date: "2017-04-04", headline: "Chemical weapons attack in Syria kills dozens — missile strike fears hit markets", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.4 },
  { date: "2017-04-07", headline: "US fires 59 Tomahawk missiles at Syria — defence stocks surge, oil spikes", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.4 },
  { date: "2017-05-22", headline: "Manchester Arena bombing kills 22 — European defence and security stocks move", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.4 },
  { date: "2017-06-05", headline: "Qatar diplomatic crisis erupts — Gulf states sever ties, LNG prices volatile", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.3 },
  { date: "2017-09-03", headline: "North Korea detonates its most powerful nuclear test — Asian markets routed", sentiment: "bearish", marketShock: -0.019, volatilityBoost: 0.8 },
  { date: "2017-10-01", headline: "Las Vegas mass shooting — largest in US history — markets subdued", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.3 },
  { date: "2017-10-05", headline: "#MeToo explodes globally — media, entertainment, and hotel stocks tumble", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.3 },
  { date: "2017-12-06", headline: "US recognises Jerusalem as Israel's capital — Middle East erupts, markets rattled", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.4 },
  { date: "2017-12-22", headline: "Trump signs $1.5 trillion US tax cut into law — markets hit all-time highs", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.2 },

  // ─── 2018 ──────────────────────────────────────────────────────────────────
  { date: "2018-01-11", headline: "Facebook demotes publisher content in favour of friends — media stocks plunge", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.2 },
  { date: "2018-03-28", headline: "Cambridge Analytica: Facebook data scandal deepens — tech privacy rout begins", sentiment: "bearish", marketShock: -0.018, volatilityBoost: 0.5 },
  { date: "2018-04-04", headline: "Zuckerberg testifies before US Congress — Facebook rebounds on relief", sentiment: "bullish", marketShock: 0.007, volatilityBoost: 0.4 },
  { date: "2018-04-27", headline: "Historic North-South Korea summit — geopolitical risk premium falls", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.2 },
  { date: "2018-05-08", headline: "US quits Iran Nuclear Deal — oil spikes to multi-year highs, markets fall", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2018-05-14", headline: "Supreme Court legalises sports betting nationwide — DraftKings and gambling stocks explode", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.2 },
  { date: "2018-05-25", headline: "GDPR takes effect in Europe — tech giants scramble, compliance stocks surge", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.2 },
  { date: "2018-06-12", headline: "Trump–Kim Singapore summit — Korean peninsula risk fades, markets cheer", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2018-07-06", headline: "US imposes $34B in tariffs on China — US-China Trade War officially begins", sentiment: "bearish", marketShock: -0.018, volatilityBoost: 0.6 },
  { date: "2018-08-02", headline: "Apple becomes first $1 trillion US company — tech sector celebrates", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.2 },
  { date: "2018-08-03", headline: "TikTok completes merger with Musical.ly — ByteDance becomes global social media giant", sentiment: "bullish", marketShock: 0.005, volatilityBoost: 0.1 },
  { date: "2018-09-24", headline: "US hits China with $200B more in tariffs — trade war escalates severely", sentiment: "bearish", marketShock: -0.022, volatilityBoost: 0.7 },
  { date: "2018-10-02", headline: "Journalist Khashoggi murdered in Saudi consulate — Saudi assets crater", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2018-11-17", headline: "Yellow Vests riots in France — European markets slide on political instability", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.3 },

  // ─── 2019 ──────────────────────────────────────────────────────────────────
  { date: "2019-01-03", headline: "Apple shocks markets with revenue warning — tech rout, worst start since 2000", sentiment: "bearish", marketShock: -0.024, volatilityBoost: 0.8 },
  { date: "2019-04-15", headline: "Notre-Dame Cathedral burns — European sentiment darkens", sentiment: "bearish", marketShock: -0.005, volatilityBoost: 0.1 },
  { date: "2019-06-09", headline: "One million march in Hong Kong — China crackdown fears hit Asian markets", sentiment: "bearish", marketShock: -0.017, volatilityBoost: 0.5 },
  { date: "2019-07-17", headline: "Instagram begins hiding like counts — social media stocks swing as model questioned", sentiment: "neutral", marketShock: -0.003, volatilityBoost: 0.1 },
  { date: "2019-09-14", headline: "Drone attack destroys Saudi Aramco facilities — oil spikes 15%, energy stocks surge", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.8 },
  { date: "2019-10-27", headline: "ISIS leader Abu Bakr al-Baghdadi killed by US forces — geopolitical risk eases", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.2 },
  { date: "2019-11-12", headline: "Disney+ launches and gains 10 million subscribers in one day — streaming wars ignite", sentiment: "bullish", marketShock: 0.013, volatilityBoost: 0.2 },
  { date: "2019-12-18", headline: "US House impeaches President Trump — markets largely unmoved by political drama", sentiment: "neutral", marketShock: -0.004, volatilityBoost: 0.2 },
  { date: "2019-12-31", headline: "WHO notified of unexplained pneumonia cases in Wuhan, China", sentiment: "neutral", marketShock: -0.003, volatilityBoost: 0.1 },

  // ─── 2020 ──────────────────────────────────────────────────────────────────
  { date: "2020-01-03", headline: "US drone strike kills Iran's General Soleimani — oil spikes, markets crash", sentiment: "bearish", marketShock: -0.018, volatilityBoost: 0.7 },
  { date: "2020-01-14", headline: "Microsoft ends Windows 7 support — security stocks rally, upgrade cycle begins", sentiment: "bullish", marketShock: 0.004, volatilityBoost: 0.1 },
  { date: "2020-01-20", headline: "First US COVID-19 case confirmed — markets begin to notice the outbreak", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.2 },
  { date: "2020-01-31", headline: "UK officially leaves the European Union — Brexit finally completed", sentiment: "neutral", marketShock: -0.005, volatilityBoost: 0.3 },
  { date: "2020-03-11", headline: "🚨 WHO DECLARES COVID-19 GLOBAL PANDEMIC — S&P 500 in worst freefall since 1987", sentiment: "bearish", marketShock: -0.088, volatilityBoost: 3.5 },
  { date: "2020-03-27", headline: "US passes $2.2 trillion CARES Act — largest economic rescue in American history", sentiment: "bullish", marketShock: 0.032, volatilityBoost: 1.0 },
  { date: "2020-04-20", headline: "Oil price goes NEGATIVE for first time in history — energy sector in chaos", sentiment: "bearish", marketShock: -0.028, volatilityBoost: 1.2 },
  { date: "2020-05-25", headline: "George Floyd killed — Black Lives Matter protests erupt across US and world", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.6 },
  { date: "2020-06-15", headline: "Zoom hits 300 million daily meeting participants — 'stay-at-home' stocks soar", sentiment: "bullish", marketShock: 0.018, volatilityBoost: 0.3 },
  { date: "2020-06-15", headline: "India-China troops clash in Galwan Valley — Asia-Pacific markets rattled", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.4 },
  { date: "2020-07-15", headline: "Twitter hacked: Elon Musk, Obama, Gates accounts used for Bitcoin scam", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.3 },
  { date: "2020-08-04", headline: "Beirut port explosion — one of largest non-nuclear blasts in history", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.3 },
  { date: "2020-08-05", headline: "Instagram launches Reels to compete with TikTok — Meta stock surges", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.2 },
  { date: "2020-11-03", headline: "Biden defeats Trump — markets surge on political stability and stimulus hopes", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.6 },
  { date: "2020-11-09", headline: "Pfizer announces 90% effective COVID-19 vaccine — markets explode in relief rally", sentiment: "bullish", marketShock: 0.038, volatilityBoost: 0.8 },
  { date: "2020-12-08", headline: "First person vaccinated against COVID-19 outside a trial — end in sight", sentiment: "bullish", marketShock: 0.022, volatilityBoost: 0.3 },

  // ─── 2021 ──────────────────────────────────────────────────────────────────
  { date: "2021-01-06", headline: "Pro-Trump mob storms the US Capitol — democracy crisis rocks global markets", sentiment: "bearish", marketShock: -0.021, volatilityBoost: 0.9 },
  { date: "2021-01-27", headline: "WallStreetBets forces GameStop short squeeze — hedge funds crushed, market shaken", sentiment: "bearish", marketShock: -0.019, volatilityBoost: 0.8 },
  { date: "2021-02-01", headline: "Military coup in Myanmar — emerging markets sell off on democratic backslide", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.3 },
  { date: "2021-03-23", headline: "Evergreen container ship blocks Suez Canal — global supply chain paralysed", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.4 },
  { date: "2021-04-18", headline: "12 clubs announce European Super League — sports stocks surge then crash in 48 hours", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.4 },
  { date: "2021-05-10", headline: "Israel-Hamas war erupts in Gaza — Middle East risk premium spikes, oil rallies", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2021-08-15", headline: "Taliban sweeps into Kabul — US 20-year Afghanistan war ends in humiliating collapse", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2021-09-07", headline: "El Salvador makes Bitcoin legal tender — crypto markets explode higher", sentiment: "bullish", marketShock: 0.015, volatilityBoost: 0.4 },
  { date: "2021-10-04", headline: "Facebook, WhatsApp, and Instagram go dark for 6 hours — Meta stock craters", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.4 },
  { date: "2021-10-28", headline: "Facebook rebrands to Meta, pledges billions to build the metaverse", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.3 },
  { date: "2021-11-26", headline: "Omicron COVID variant discovered — markets plunge on new lockdown fears", sentiment: "bearish", marketShock: -0.032, volatilityBoost: 1.2 },
  { date: "2021-12-25", headline: "James Webb Space Telescope launches perfectly — science and space tech stocks rally", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.1 },

  // ─── 2022 ──────────────────────────────────────────────────────────────────
  { date: "2022-01-15", headline: "Tonga undersea volcano erupts — one of largest explosions ever recorded", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.3 },
  { date: "2022-02-21", headline: "Putin recognises breakaway Ukraine regions — war looks imminent, markets tank", sentiment: "bearish", marketShock: -0.024, volatilityBoost: 0.9 },
  { date: "2022-02-24", headline: "🚨 RUSSIA INVADES UKRAINE — LARGEST WAR IN EUROPE SINCE WWII, MARKETS COLLAPSE", sentiment: "bearish", marketShock: -0.055, volatilityBoost: 3.0 },
  { date: "2022-03-16", headline: "Fed raises rates 0.25% — first hike since 2018, markets price rate hike cycle", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2022-04-20", headline: "Oil prices surge to $110/barrel — inflation hits 40-year high, consumers squeezed", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.5 },
  { date: "2022-05-05", headline: "Fed raises rates 0.5% — biggest hike since 2000, tech stocks crushed", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.7 },
  { date: "2022-06-13", headline: "Bitcoin crashes below $23,000 — crypto winter begins, Celsius freezes withdrawals", sentiment: "bearish", marketShock: -0.030, volatilityBoost: 1.0 },
  { date: "2022-06-24", headline: "US Supreme Court overturns Roe v. Wade — political and consumer sentiment rattled", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.4 },
  { date: "2022-07-05", headline: "Inflation hits 9.1% in the US — worst reading in 40 years, recession fears grip markets", sentiment: "bearish", marketShock: -0.022, volatilityBoost: 0.7 },
  { date: "2022-08-25", headline: "Midjourney AI image generator enters open beta — AI art revolution begins", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.2 },
  { date: "2022-09-08", headline: "Queen Elizabeth II dies after 70-year reign — UK markets fall, global sentiment sombre", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.2 },
  { date: "2022-09-21", headline: "Putin orders partial mobilisation of 300,000 — Russia-Ukraine war escalates dangerously", sentiment: "bearish", marketShock: -0.022, volatilityBoost: 0.8 },
  { date: "2022-10-27", headline: "Elon Musk completes $44B Twitter takeover — fires half the staff, chaos ensues", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.3 },
  { date: "2022-11-08", headline: "Democrats outperform in midterms — markets rally on gridlock/no radical change", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.3 },
  { date: "2022-11-11", headline: "FTX crypto exchange collapses — $8 billion hole, Sam Bankman-Fried arrested", sentiment: "bearish", marketShock: -0.034, volatilityBoost: 1.2 },
  { date: "2022-11-14", headline: "Ukraine liberates Kherson city — war tide turns, European markets stabilise", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.3 },
  { date: "2022-11-30", headline: "OpenAI releases ChatGPT — fastest-growing consumer app ever, AI revolution erupts", sentiment: "bullish", marketShock: 0.026, volatilityBoost: 0.4 },

  // ─── 2023 ──────────────────────────────────────────────────────────────────
  { date: "2023-02-06", headline: "Catastrophic 7.8 earthquake kills 50,000 in Turkey and Syria — humanitarian crisis", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.4 },
  { date: "2023-02-07", headline: "Microsoft integrates ChatGPT into Bing — AI search war begins, Google panics", sentiment: "bullish", marketShock: 0.020, volatilityBoost: 0.4 },
  { date: "2023-03-10", headline: "Silicon Valley Bank collapses — largest US bank failure since 2008, panic spreads", sentiment: "bearish", marketShock: -0.042, volatilityBoost: 1.5 },
  { date: "2023-03-19", headline: "UBS emergency-buys Credit Suisse — European banking crisis averted, but barely", sentiment: "bearish", marketShock: -0.022, volatilityBoost: 0.9 },
  { date: "2023-03-21", headline: "Google launches Bard AI chatbot — tech stocks rally on AI race excitement", sentiment: "bullish", marketShock: 0.014, volatilityBoost: 0.3 },
  { date: "2023-04-15", headline: "Sudan civil war erupts between army and RSF paramilitary — Africa risk spikes", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.3 },
  { date: "2023-05-05", headline: "WHO declares COVID-19 no longer a global health emergency — pandemic officially over", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.2 },
  { date: "2023-05-10", headline: "First Republic Bank fails — 3rd major US bank collapse of 2023, banking fear peaks", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.7 },
  { date: "2023-06-05", headline: "Apple reveals Vision Pro spatial computer at $3,499 — AR/VR stocks explode", sentiment: "bullish", marketShock: 0.018, volatilityBoost: 0.3 },
  { date: "2023-06-24", headline: "Wagner Group mutiny: Prigozhin's army marches on Moscow before turning back", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.6 },
  { date: "2023-07-05", headline: "Meta launches Threads, a Twitter competitor — 100 million users in 5 days", sentiment: "bullish", marketShock: 0.012, volatilityBoost: 0.2 },
  { date: "2023-09-27", headline: "ChatGPT gains vision and voice — AI becomes truly multimodal, Nvidia soars", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.3 },
  { date: "2023-10-07", headline: "Hamas launches massive terror attack on Israel — Middle East war erupts, oil spikes", sentiment: "bearish", marketShock: -0.023, volatilityBoost: 1.0 },
  { date: "2023-11-06", headline: "OpenAI launches the GPT Store for custom AI chatbots — AI economy accelerates", sentiment: "bullish", marketShock: 0.012, volatilityBoost: 0.2 },
  { date: "2023-11-17", headline: "OpenAI board fires then rehires Sam Altman — Silicon Valley chaos, AI stocks volatile", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.5 },
  { date: "2023-12-06", headline: "Google unveils Gemini AI model — Nvidia, Microsoft, and AI stocks reach all-time highs", sentiment: "bullish", marketShock: 0.018, volatilityBoost: 0.3 },
  { date: "2023-12-12", headline: "COP28 agrees to 'transition away' from fossil fuels for first time — clean energy rallies", sentiment: "bullish", marketShock: 0.005, volatilityBoost: 0.1 },

  // ─── 2024 ──────────────────────────────────────────────────────────────────
  { date: "2024-01-11", headline: "US and UK begin coordinated strikes on Houthi targets in Yemen — shipping fear spikes", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2024-01-18", headline: "Samsung launches Galaxy AI phones — on-device AI race begins, chip stocks rally", sentiment: "bullish", marketShock: 0.012, volatilityBoost: 0.2 },
  { date: "2024-02-15", headline: "OpenAI reveals Sora — AI can generate photorealistic video, Hollywood stocks tremble", sentiment: "bullish", marketShock: 0.020, volatilityBoost: 0.4 },
  { date: "2024-02-21", headline: "Nvidia reports blowout earnings — AI chip demand insatiable, stock surges 16%", sentiment: "bullish", marketShock: 0.028, volatilityBoost: 0.5 },
  { date: "2024-03-07", headline: "Sweden joins NATO — Nordic defence stocks surge, geopolitical balance shifts", sentiment: "bullish", marketShock: 0.007, volatilityBoost: 0.2 },
  { date: "2024-04-01", headline: "Israeli airstrike destroys Iranian consular building in Damascus — war escalation risk", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.5 },
  { date: "2024-04-13", headline: "Iran fires 300+ drones and missiles directly at Israel — largest direct attack in Middle East history", sentiment: "bearish", marketShock: -0.030, volatilityBoost: 1.4 },
  { date: "2024-05-13", headline: "OpenAI releases GPT-4o with instant voice — AI assistants go mainstream, tech soars", sentiment: "bullish", marketShock: 0.018, volatilityBoost: 0.3 },
  { date: "2024-05-30", headline: "Trump found guilty on all 34 felony counts — political shockwave hits markets", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2024-06-10", headline: "Apple unveils Apple Intelligence at WWDC — Siri gets ChatGPT, AI iPhone supercycle begins", sentiment: "bullish", marketShock: 0.022, volatilityBoost: 0.3 },
  { date: "2024-07-13", headline: "Assassination attempt on Donald Trump — shocking footage, markets panic then rally", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 1.0 },
  { date: "2024-07-21", headline: "Biden announces he will not seek re-election — Democratic party in chaos", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.5 },
  { date: "2024-08-06", headline: "Ukraine invades Russia's Kursk region — shocking counter-offensive stuns markets", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.5 },
  { date: "2024-09-17", headline: "Hezbollah pager bomb attack kills hundreds in Lebanon — tech weaponisation fears surge", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.6 },
  { date: "2024-09-27", headline: "Israel kills Hezbollah leader Nasrallah in Beirut — Middle East war widens sharply", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.7 },
  { date: "2024-10-01", headline: "Iran fires 180 ballistic missiles at Israel — direct attack, oil spikes 5%, stocks sell off", sentiment: "bearish", marketShock: -0.025, volatilityBoost: 1.2 },
  { date: "2024-11-05", headline: "Trump wins US presidency for second time — markets explode on deregulation hopes", sentiment: "bullish", marketShock: 0.024, volatilityBoost: 0.8 },
  { date: "2024-12-08", headline: "Assad regime collapses in Syria — rebels take Damascus, Middle East map redrawn", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.5 },

  // ─── 2025 ──────────────────────────────────────────────────────────────────
  { date: "2025-01-15", headline: "Korean Peninsula tensions peak with heavy artillery exchanges near the border", sentiment: "bearish", marketShock: -0.018, volatilityBoost: 0.7 },
  { date: "2025-01-20", headline: "Trump inaugurated for second term — sweeping executive orders signed on day one", sentiment: "bullish", marketShock: 0.007, volatilityBoost: 0.2 },
  { date: "2025-01-25", headline: "Coalition airstrikes on Iranian nuclear sites — 'Twelve-Day War' begins, oil surges", sentiment: "bearish", marketShock: -0.028, volatilityBoost: 1.2 },
  { date: "2025-02-10", headline: "Grand Truce signed in Panmunjom — Korean conflict cooled, Asia markets breathe", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.3 },
  { date: "2025-03-05", headline: "Naval skirmish erupts in South China Sea between China and Philippines", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.7 },
];

// Build a lookup map for O(1) date access
const EVENT_MAP = new Map<string, HistoricalEvent>(
  HISTORICAL_EVENTS.map(e => [e.date, e])
);

export function getHistoricalEvent(date: string): HistoricalEvent | null {
  return EVENT_MAP.get(date) ?? null;
}
