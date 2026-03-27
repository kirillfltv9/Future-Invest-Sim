export type HistoricalEvent = {
  date: string;
  headline: string;
  sentiment: "bullish" | "bearish" | "neutral";
  marketShock: number;
  volatilityBoost: number;
};

const HISTORICAL_EVENTS: HistoricalEvent[] = [

  // ─── 2015 ──────────────────────────────────────────────────────────────────
  { date: "2015-01-20", headline: "Houthi rebels seize Yemen's presidential palace — oil risk premium ticks up", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.28 },
  { date: "2015-01-25", headline: "Anti-austerity Syriza wins Greek election — European debt fears return", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.4 },
  { date: "2015-02-12", headline: "Minsk II ceasefire signed in Ukraine — geopolitical risk briefly eases", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.15 },
  { date: "2015-03-24", headline: "Germanwings crash kills 150 — airline sector falls", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.18 },
  { date: "2015-03-26", headline: "Saudi Arabia launches military intervention in Yemen — oil nudges higher", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.28 },
  { date: "2015-04-21", headline: "Google 'Mobilegeddon' update punishes non-mobile sites — tech stocks adjust", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.12 },
  { date: "2015-04-25", headline: "Nepal magnitude 7.8 earthquake — commodities and insurance stocks swing", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.18 },
  { date: "2015-06-08", headline: "Apple Music launches, entering the streaming war — digital media stocks shift", sentiment: "neutral", marketShock: 0.004, volatilityBoost: 0.1 },
  { date: "2015-07-14", headline: "Iran Nuclear Deal reached — oil softens on supply expectations, markets tick up", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.22 },
  { date: "2015-07-29", headline: "Windows 10 launches with Edge browser — Microsoft gains", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.12 },
  { date: "2015-08-10", headline: "Google restructures under new Alphabet holding company — investors cheer clarity", sentiment: "bullish", marketShock: 0.013, volatilityBoost: 0.18 },
  { date: "2015-09-18", headline: "Volkswagen Dieselgate scandal erupts — auto stocks tumble worldwide", sentiment: "bearish", marketShock: -0.017, volatilityBoost: 0.58 },
  { date: "2015-09-30", headline: "Russia officially enters Syrian Civil War — Middle East tension ticks up", sentiment: "bearish", marketShock: -0.011, volatilityBoost: 0.4 },
  { date: "2015-11-13", headline: "Paris terrorist attacks kill 130 — global markets sell off", sentiment: "bearish", marketShock: -0.021, volatilityBoost: 0.75 },
  { date: "2015-12-12", headline: "Paris Climate Agreement signed by 196 nations — clean energy stocks gain", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.12 },
  { date: "2015-12-16", headline: "Fed raises rates for first time since 2006 — markets settle after volatility", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.4 },

  // ─── 2016 ──────────────────────────────────────────────────────────────────
  { date: "2016-02-01", headline: "WHO declares Zika virus global health emergency — travel and pharma stocks swing", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.28 },
  { date: "2016-03-15", headline: "Google DeepMind's AlphaGo beats world Go champion — AI enthusiasm builds", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.18 },
  { date: "2016-04-03", headline: "Panama Papers expose global offshore tax evasion — financial sector falls", sentiment: "bearish", marketShock: -0.014, volatilityBoost: 0.46 },
  { date: "2016-06-13", headline: "Microsoft buys LinkedIn for $26.2 billion — tech M&A enthusiasm rises", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.18 },
  { date: "2016-06-23", headline: "BREXIT: UK votes Leave — pound collapses, markets sell off hard", sentiment: "bearish", marketShock: -0.035, volatilityBoost: 1.5 },
  { date: "2016-07-06", headline: "Pokémon GO takes the world by storm — mobile and gaming stocks jump", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.18 },
  { date: "2016-07-15", headline: "Military coup attempt in Turkey suppressed — emerging markets rattle briefly", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2016-08-02", headline: "Instagram launches Stories — Facebook gains, Snapchat fears rise", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.12 },
  { date: "2016-11-08", headline: "Trump wins US presidency — markets swing wildly before surging on deregulation hopes", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 1.05 },

  // ─── 2017 ──────────────────────────────────────────────────────────────────
  { date: "2017-01-20", headline: "Donald Trump inaugurated — deregulation and tax cut rally continues", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.22 },
  { date: "2017-04-07", headline: "US fires 59 Tomahawk missiles at Syria — defence stocks up, market uneasy", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.35 },
  { date: "2017-05-22", headline: "Manchester Arena bombing kills 22 — European sentiment dips", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.28 },
  { date: "2017-06-05", headline: "Qatar diplomatic crisis — Gulf states cut ties, LNG markets volatile", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.28 },
  { date: "2017-09-03", headline: "North Korea detonates its most powerful nuclear test — Asian markets fall", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.63 },
  { date: "2017-10-01", headline: "Las Vegas mass shooting — markets edge lower briefly", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.22 },
  { date: "2017-10-05", headline: "#MeToo erupts globally — media and entertainment stocks under pressure", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.22 },
  { date: "2017-12-06", headline: "US recognises Jerusalem as Israel's capital — Middle East sentiment falls", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.28 },
  { date: "2017-12-22", headline: "Trump signs $1.5 trillion US tax cut — markets hit fresh highs", sentiment: "bullish", marketShock: 0.015, volatilityBoost: 0.18 },

  // ─── 2018 ──────────────────────────────────────────────────────────────────
  { date: "2018-01-11", headline: "Facebook demotes publisher content — media stocks dip, social ad model questioned", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.18 },
  { date: "2018-03-28", headline: "Cambridge Analytica: Facebook data scandal deepens — tech stocks slide", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.46 },
  { date: "2018-04-04", headline: "Zuckerberg testifies before Congress — Facebook rebounds on relief", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.28 },
  { date: "2018-04-27", headline: "Historic North-South Korea summit — Korean war risk premium fades", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.18 },
  { date: "2018-05-08", headline: "US quits Iran Nuclear Deal — oil ticks higher, markets soften", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.4 },
  { date: "2018-05-14", headline: "Supreme Court legalises sports betting nationwide — gambling stocks surge", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.18 },
  { date: "2018-05-25", headline: "GDPR takes effect in Europe — compliance costs hit tech, stocks adjust", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.18 },
  { date: "2018-07-06", headline: "US imposes $34B in tariffs on China — US-China trade war officially starts", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.63 },
  { date: "2018-08-02", headline: "Apple becomes first $1 trillion US company — tech sector celebrates", sentiment: "bullish", marketShock: 0.015, volatilityBoost: 0.18 },
  { date: "2018-08-03", headline: "TikTok completes merger with Musical.ly — ByteDance becomes global social media giant", sentiment: "bullish", marketShock: 0.005, volatilityBoost: 0.12 },
  { date: "2018-09-24", headline: "US hits China with $200B more in tariffs — trade war escalates, markets drop", sentiment: "bearish", marketShock: -0.021, volatilityBoost: 0.63 },
  { date: "2018-10-02", headline: "Journalist Khashoggi murdered in Saudi consulate — political risk spikes", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2018-11-17", headline: "Yellow Vests riots in France — European consumer and political stocks fall", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.28 },

  // ─── 2019 ──────────────────────────────────────────────────────────────────
  { date: "2019-01-03", headline: "Apple issues rare revenue warning — tech rout, worst open since 2000", sentiment: "bearish", marketShock: -0.021, volatilityBoost: 0.75 },
  { date: "2019-04-15", headline: "Notre-Dame Cathedral burns — European sentiment darkens briefly", sentiment: "bearish", marketShock: -0.005, volatilityBoost: 0.12 },
  { date: "2019-06-09", headline: "One million march in Hong Kong — China crackdown fears hit Asian markets", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.46 },
  { date: "2019-09-14", headline: "Drone attack destroys Saudi Aramco facilities — oil jumps, energy stocks surge", sentiment: "bearish", marketShock: -0.017, volatilityBoost: 0.75 },
  { date: "2019-10-27", headline: "ISIS leader al-Baghdadi killed by US forces — geopolitical risk eases", sentiment: "bullish", marketShock: 0.006, volatilityBoost: 0.12 },
  { date: "2019-11-12", headline: "Disney+ launches, gains 10M subscribers in a day — streaming stocks soar", sentiment: "bullish", marketShock: 0.013, volatilityBoost: 0.18 },
  { date: "2019-12-18", headline: "US House impeaches President Trump — markets largely shrug", sentiment: "neutral", marketShock: -0.004, volatilityBoost: 0.18 },
  { date: "2019-12-31", headline: "WHO notified of unexplained pneumonia in Wuhan, China", sentiment: "neutral", marketShock: -0.004, volatilityBoost: 0.12 },

  // ─── 2020 ──────────────────────────────────────────────────────────────────
  { date: "2020-01-03", headline: "US drone strike kills Iran's General Soleimani — oil spikes, markets fall", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.63 },
  { date: "2020-01-20", headline: "First US COVID-19 case confirmed — markets start to take notice", sentiment: "bearish", marketShock: -0.007, volatilityBoost: 0.18 },
  { date: "2020-01-31", headline: "UK officially leaves the European Union", sentiment: "neutral", marketShock: -0.005, volatilityBoost: 0.22 },
  { date: "2020-02-24", headline: "🚨 COVID-19 GOES GLOBAL — markets suffer worst day since the financial crisis", sentiment: "bearish", marketShock: -0.068, volatilityBoost: 2.8 },
  { date: "2020-02-27", headline: "🚨 WORST WEEK SINCE 2008 — S&P hemorrhages 11% in 5 days, panic selling everywhere", sentiment: "bearish", marketShock: -0.078, volatilityBoost: 3.2 },
  { date: "2020-03-09", headline: "🚨 BLACK MONDAY: Oil war + pandemic — circuit breakers trip, Dow -2,013 points", sentiment: "bearish", marketShock: -0.135, volatilityBoost: 5.0 },
  { date: "2020-03-11", headline: "🚨 PANDEMIC DECLARED: WHO officially calls COVID-19 a global pandemic — total meltdown", sentiment: "bearish", marketShock: -0.095, volatilityBoost: 4.0 },
  { date: "2020-03-12", headline: "🚨 CIRCUIT BREAKERS: Trading halted twice — worst single day since Black Monday 1987", sentiment: "bearish", marketShock: -0.155, volatilityBoost: 6.0 },
  { date: "2020-03-16", headline: "🚨 CATASTROPHIC: Dow -2,997 points — worst point drop in history, economy shutting down", sentiment: "bearish", marketShock: -0.190, volatilityBoost: 7.0 },
  { date: "2020-03-18", headline: "🚨 FREEFALL: Markets in historic collapse — unemployment to skyrocket, stimulus desperate", sentiment: "bearish", marketShock: -0.088, volatilityBoost: 3.8 },
  { date: "2020-03-20", headline: "🚨 LOCKDOWNS WORLDWIDE — economies shuttered, no bottom in sight", sentiment: "bearish", marketShock: -0.072, volatilityBoost: 3.2 },
  { date: "2020-03-27", headline: "US passes $2.2 trillion CARES Act — largest economic rescue in US history", sentiment: "bullish", marketShock: 0.028, volatilityBoost: 0.8 },
  { date: "2020-04-20", headline: "Oil price turns NEGATIVE for first time in history — energy sector in chaos", sentiment: "bearish", marketShock: -0.025, volatilityBoost: 1.15 },
  { date: "2020-05-25", headline: "George Floyd killing sparks global protests — uncertainty weighs on markets", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2020-06-15", headline: "Zoom hits 300 million daily users — 'stay-at-home' tech stocks soar", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.22 },
  { date: "2020-07-15", headline: "Twitter hacked: Musk, Obama, Gates accounts used in Bitcoin scam", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.22 },
  { date: "2020-08-04", headline: "Beirut port explosion — one of largest non-nuclear blasts ever recorded", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.28 },
  { date: "2020-08-05", headline: "Instagram launches Reels to compete with TikTok — Meta gains", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.12 },
  { date: "2020-11-03", headline: "Biden defeats Trump — markets rally on political stability hopes", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.46 },
  { date: "2020-11-09", headline: "Pfizer announces 90% effective COVID vaccine — markets erupt in relief rally", sentiment: "bullish", marketShock: 0.035, volatilityBoost: 0.75 },
  { date: "2020-12-08", headline: "First person vaccinated against COVID-19 — the end of the pandemic in sight", sentiment: "bullish", marketShock: 0.018, volatilityBoost: 0.28 },

  // ─── 2021 ──────────────────────────────────────────────────────────────────
  { date: "2021-01-06", headline: "Pro-Trump mob storms US Capitol — democracy shock hits global markets", sentiment: "bearish", marketShock: -0.017, volatilityBoost: 0.75 },
  { date: "2021-01-27", headline: "WallStreetBets forces GameStop short squeeze — hedge funds crushed, volatility spikes", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.75 },
  { date: "2021-02-01", headline: "Military coup in Myanmar — emerging markets soften on democratic concerns", sentiment: "bearish", marketShock: -0.008, volatilityBoost: 0.22 },
  { date: "2021-03-23", headline: "Container ship blocks Suez Canal — global supply chain concerns mount", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.35 },
  { date: "2021-05-10", headline: "Israel-Hamas conflict erupts in Gaza — Middle East risk premium rises", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2021-08-15", headline: "Taliban captures Kabul — US 20-year Afghanistan war ends in collapse", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2021-09-07", headline: "El Salvador makes Bitcoin legal tender — crypto markets jump", sentiment: "bullish", marketShock: 0.013, volatilityBoost: 0.35 },
  { date: "2021-10-04", headline: "Facebook, WhatsApp, Instagram go dark for 6 hours — Meta stock falls", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.35 },
  { date: "2021-10-28", headline: "Facebook rebrands to Meta, pledges billions on the metaverse", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.22 },
  { date: "2021-11-26", headline: "Omicron COVID variant discovered — markets drop on new lockdown fears", sentiment: "bearish", marketShock: -0.029, volatilityBoost: 1.15 },
  { date: "2021-12-25", headline: "James Webb Space Telescope launches — science and space tech stocks nudge up", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.12 },

  // ─── 2022 ──────────────────────────────────────────────────────────────────
  { date: "2022-02-21", headline: "Putin recognises breakaway Ukraine regions — war looks imminent, markets fall", sentiment: "bearish", marketShock: -0.021, volatilityBoost: 0.75 },
  { date: "2022-02-24", headline: "RUSSIA INVADES UKRAINE — largest European war since WWII, markets collapse", sentiment: "bearish", marketShock: -0.044, volatilityBoost: 2.3 },
  { date: "2022-03-16", headline: "Fed raises rates 0.25% — first hike since 2018, rate hike cycle begins", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2022-05-05", headline: "Fed raises rates 0.5% — biggest hike since 2000, growth stocks punished", sentiment: "bearish", marketShock: -0.017, volatilityBoost: 0.63 },
  { date: "2022-06-13", headline: "Bitcoin crashes below $23,000 — crypto winter officially begins", sentiment: "bearish", marketShock: -0.025, volatilityBoost: 0.98 },
  { date: "2022-06-24", headline: "US Supreme Court overturns Roe v. Wade — political uncertainty weighs on sentiment", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.35 },
  { date: "2022-07-05", headline: "US inflation hits 9.1% — worst in 40 years, recession fears grip markets", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.63 },
  { date: "2022-08-25", headline: "Midjourney AI enters open beta — AI art revolution begins, tech excitement builds", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.12 },
  { date: "2022-09-08", headline: "Queen Elizabeth II dies after 70-year reign — UK markets fall, global mood sombre", sentiment: "bearish", marketShock: -0.006, volatilityBoost: 0.18 },
  { date: "2022-09-21", headline: "Putin orders mobilisation of 300,000 — Russia-Ukraine war escalates dangerously", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.75 },
  { date: "2022-10-27", headline: "Elon Musk completes $44B Twitter takeover — fires half the staff, chaos ensues", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.28 },
  { date: "2022-11-08", headline: "Democrats outperform in US midterms — markets rally on policy gridlock", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.22 },
  { date: "2022-11-11", headline: "FTX crypto exchange collapses — $8 billion hole, Sam Bankman-Fried arrested", sentiment: "bearish", marketShock: -0.029, volatilityBoost: 1.15 },
  { date: "2022-11-14", headline: "Ukraine liberates Kherson city — war tide turns, European markets stabilise", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.22 },
  { date: "2022-11-30", headline: "OpenAI releases ChatGPT — fastest-growing app ever, AI revolution erupts", sentiment: "bullish", marketShock: 0.024, volatilityBoost: 0.4 },

  // ─── 2023 ──────────────────────────────────────────────────────────────────
  { date: "2023-02-06", headline: "Catastrophic 7.8 earthquake kills 50,000 in Turkey and Syria", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.35 },
  { date: "2023-02-07", headline: "Microsoft integrates ChatGPT into Bing — AI search war starts, Google scrambles", sentiment: "bullish", marketShock: 0.017, volatilityBoost: 0.35 },
  { date: "2023-03-10", headline: "Silicon Valley Bank collapses — largest US bank failure since 2008", sentiment: "bearish", marketShock: -0.035, volatilityBoost: 1.38 },
  { date: "2023-03-19", headline: "UBS emergency-buys Credit Suisse — European banking crisis narrowly avoided", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.8 },
  { date: "2023-03-21", headline: "Google launches Bard AI chatbot — tech stocks rally on AI race excitement", sentiment: "bullish", marketShock: 0.013, volatilityBoost: 0.22 },
  { date: "2023-05-05", headline: "WHO declares COVID-19 no longer a global health emergency — pandemic is over", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.12 },
  { date: "2023-05-10", headline: "First Republic Bank fails — third major US bank collapse of 2023", sentiment: "bearish", marketShock: -0.017, volatilityBoost: 0.63 },
  { date: "2023-06-05", headline: "Apple reveals Vision Pro spatial computer — AR/VR stocks jump on the reveal", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.28 },
  { date: "2023-06-24", headline: "Wagner Group briefly mutinies, marches toward Moscow before turning back", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2023-07-05", headline: "Meta launches Threads — 100 million users in 5 days, Twitter rival is real", sentiment: "bullish", marketShock: 0.012, volatilityBoost: 0.18 },
  { date: "2023-09-27", headline: "ChatGPT gains vision and voice — AI becomes truly multimodal, Nvidia rises", sentiment: "bullish", marketShock: 0.015, volatilityBoost: 0.22 },
  { date: "2023-10-07", headline: "Hamas launches massive attack on Israel — Middle East war erupts, oil ticks up", sentiment: "bearish", marketShock: -0.020, volatilityBoost: 0.8 },
  { date: "2023-11-06", headline: "OpenAI launches GPT Store for custom AI agents — AI economy accelerating", sentiment: "bullish", marketShock: 0.012, volatilityBoost: 0.18 },
  { date: "2023-11-17", headline: "OpenAI board fires then rehires Sam Altman — Silicon Valley chaos, AI stocks volatile", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.46 },
  { date: "2023-12-06", headline: "Google unveils Gemini AI model — Nvidia, Microsoft, AI stocks hit fresh highs", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.28 },
  { date: "2023-12-12", headline: "COP28 agrees to transition away from fossil fuels — clean energy rallies", sentiment: "bullish", marketShock: 0.005, volatilityBoost: 0.12 },

  // ─── 2024 ──────────────────────────────────────────────────────────────────
  { date: "2024-01-11", headline: "US and UK begin strikes on Houthi targets in Yemen — shipping fear rises", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.46 },
  { date: "2024-01-18", headline: "Samsung launches Galaxy AI phones — on-device AI race heats up, chip stocks gain", sentiment: "bullish", marketShock: 0.010, volatilityBoost: 0.18 },
  { date: "2024-02-15", headline: "OpenAI reveals Sora — AI generates photorealistic video, media stocks nervous", sentiment: "bullish", marketShock: 0.017, volatilityBoost: 0.28 },
  { date: "2024-02-21", headline: "Nvidia reports blowout earnings — AI chip demand insatiable, stock surges", sentiment: "bullish", marketShock: 0.025, volatilityBoost: 0.46 },
  { date: "2024-03-07", headline: "Sweden joins NATO — Nordic defence stocks gain, alliance strengthened", sentiment: "bullish", marketShock: 0.007, volatilityBoost: 0.18 },
  { date: "2024-04-13", headline: "Iran fires 300+ drones and missiles at Israel — largest direct Middle East attack ever", sentiment: "bearish", marketShock: -0.028, volatilityBoost: 1.27 },
  { date: "2024-05-13", headline: "OpenAI releases GPT-4o with instant voice — AI assistants go mainstream", sentiment: "bullish", marketShock: 0.016, volatilityBoost: 0.22 },
  { date: "2024-05-30", headline: "Trump found guilty on all 34 felony counts — political shockwave hits markets", sentiment: "bearish", marketShock: -0.012, volatilityBoost: 0.46 },
  { date: "2024-06-10", headline: "Apple unveils Apple Intelligence at WWDC — AI iPhone supercycle story begins", sentiment: "bullish", marketShock: 0.021, volatilityBoost: 0.28 },
  { date: "2024-07-13", headline: "Assassination attempt on Donald Trump — shocking footage, markets briefly panic", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.75 },
  { date: "2024-07-21", headline: "Biden announces he will not seek re-election — political uncertainty spikes", sentiment: "bearish", marketShock: -0.009, volatilityBoost: 0.4 },
  { date: "2024-09-17", headline: "Hezbollah pager bomb attack kills hundreds in Lebanon — conflict escalates", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.46 },
  { date: "2024-09-27", headline: "Israel kills Hezbollah leader Nasrallah — Middle East war widens", sentiment: "bearish", marketShock: -0.013, volatilityBoost: 0.58 },
  { date: "2024-10-01", headline: "Iran fires 180 ballistic missiles at Israel — direct attack, oil jumps, stocks fall", sentiment: "bearish", marketShock: -0.021, volatilityBoost: 0.98 },
  { date: "2024-11-05", headline: "Trump wins US presidency again — markets surge on deregulation and tax cut hopes", sentiment: "bullish", marketShock: 0.021, volatilityBoost: 0.75 },
  { date: "2024-12-08", headline: "Assad regime collapses in Syria — rebels take Damascus, Middle East map redrawn", sentiment: "bearish", marketShock: -0.010, volatilityBoost: 0.4 },

  // ─── 2025 ──────────────────────────────────────────────────────────────────
  { date: "2025-01-15", headline: "Korean Peninsula tensions peak with artillery exchanges near the border", sentiment: "bearish", marketShock: -0.016, volatilityBoost: 0.63 },
  { date: "2025-01-20", headline: "Trump inaugurated for second term — sweeping executive orders signed on day one", sentiment: "bullish", marketShock: 0.008, volatilityBoost: 0.18 },
  { date: "2025-01-25", headline: "Coalition strikes on Iranian nuclear sites — 'Twelve-Day War' begins, oil surges", sentiment: "bearish", marketShock: -0.024, volatilityBoost: 1.15 },
  { date: "2025-02-10", headline: "Grand Truce signed in Panmunjom — Korean conflict cooled, Asia markets stabilise", sentiment: "bullish", marketShock: 0.009, volatilityBoost: 0.28 },
  { date: "2025-03-05", headline: "Naval skirmish in South China Sea between China and Philippines — tension rises", sentiment: "bearish", marketShock: -0.015, volatilityBoost: 0.63 },
];

const EVENT_MAP = new Map<string, HistoricalEvent>(
  HISTORICAL_EVENTS.map(e => [e.date, e])
);

export function getHistoricalEvent(date: string): HistoricalEvent | null {
  return EVENT_MAP.get(date) ?? null;
}
