export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Oceania";

export const CONTINENTS: Continent[] = [
  "Africa", "Asia", "Europe", "North America", "South America", "Oceania",
];

export type StockDefinition = {
  ticker: string;
  name: string;
  sector: string;
  description: string;
  volatility: number;
  dividendYield: number;
  basePrice: number;
  trend: number;
  assetType: "stock" | "crypto" | "fun" | "currency";
  continent?: Continent;
};

export const STOCKS: StockDefinition[] = [
  // ── TECHNOLOGY ──────────────────────────────────────────────────────────────
  { ticker: "AAPL",  name: "Apple Inc.",             sector: "Technology",             description: "Consumer electronics, software, and services giant",         volatility: 0.018, dividendYield: 0.005, basePrice: 189.5,   trend: 0.0003, assetType: "stock" },
  { ticker: "MSFT",  name: "Microsoft Corp.",         sector: "Technology",             description: "Cloud computing, software, and enterprise solutions",        volatility: 0.016, dividendYield: 0.007, basePrice: 415.2,   trend: 0.0004, assetType: "stock" },
  { ticker: "NVDA",  name: "NVIDIA Corp.",            sector: "Technology",             description: "Graphics processing units and AI chips",                     volatility: 0.030, dividendYield: 0.001, basePrice: 875.4,   trend: 0.0006, assetType: "stock" },
  { ticker: "GOOGL", name: "Alphabet Inc.",           sector: "Technology",             description: "Search, advertising, and cloud services",                    volatility: 0.020, dividendYield: 0.000, basePrice: 175.8,   trend: 0.0003, assetType: "stock" },
  { ticker: "META",  name: "Meta Platforms Inc.",     sector: "Technology",             description: "Social media and virtual reality platforms",                 volatility: 0.028, dividendYield: 0.003, basePrice: 562.1,   trend: 0.0004, assetType: "stock" },
  { ticker: "AMD",   name: "Advanced Micro Devices",  sector: "Technology",             description: "High-performance CPUs and GPUs for PCs and data centers",    volatility: 0.032, dividendYield: 0.000, basePrice: 168.2,   trend: 0.0004, assetType: "stock" },
  { ticker: "INTC",  name: "Intel Corp.",             sector: "Technology",             description: "Global semiconductor and computing solutions maker",          volatility: 0.022, dividendYield: 0.015, basePrice: 31.5,    trend: 0.0001, assetType: "stock" },
  { ticker: "CRM",   name: "Salesforce Inc.",         sector: "Technology",             description: "Cloud-based CRM and enterprise software",                    volatility: 0.026, dividendYield: 0.000, basePrice: 285.6,   trend: 0.0003, assetType: "stock" },
  { ticker: "ORCL",  name: "Oracle Corp.",            sector: "Technology",             description: "Database software, cloud infrastructure and ERP",            volatility: 0.020, dividendYield: 0.014, basePrice: 132.4,   trend: 0.0003, assetType: "stock" },
  { ticker: "ADBE",  name: "Adobe Inc.",              sector: "Technology",             description: "Creative and document cloud software platform",               volatility: 0.025, dividendYield: 0.000, basePrice: 472.3,   trend: 0.0003, assetType: "stock" },
  { ticker: "CSCO",  name: "Cisco Systems Inc.",      sector: "Technology",             description: "Networking hardware, software, and telecommunications",       volatility: 0.014, dividendYield: 0.031, basePrice: 49.8,    trend: 0.0001, assetType: "stock" },
  { ticker: "QCOM",  name: "Qualcomm Inc.",           sector: "Technology",             description: "Semiconductor and telecommunications equipment",              volatility: 0.024, dividendYield: 0.022, basePrice: 188.7,   trend: 0.0002, assetType: "stock" },
  { ticker: "AVGO",  name: "Broadcom Inc.",           sector: "Technology",             description: "Semiconductor and infrastructure software solutions",         volatility: 0.022, dividendYield: 0.017, basePrice: 1385.0,  trend: 0.0004, assetType: "stock" },
  { ticker: "NOW",   name: "ServiceNow Inc.",         sector: "Technology",             description: "Cloud-based workflow automation and ITSM platform",          volatility: 0.028, dividendYield: 0.000, basePrice: 872.1,   trend: 0.0004, assetType: "stock" },
  { ticker: "PLTR",  name: "Palantir Technologies",   sector: "Technology",             description: "Big data analytics and AI for government and enterprise",     volatility: 0.040, dividendYield: 0.000, basePrice: 24.5,    trend: 0.0005, assetType: "stock" },

  // ── CONSUMER & INTERNET ─────────────────────────────────────────────────────
  { ticker: "AMZN",  name: "Amazon.com Inc.",         sector: "Consumer Discretionary", description: "E-commerce and cloud computing leader",                       volatility: 0.022, dividendYield: 0.000, basePrice: 218.3,   trend: 0.0004, assetType: "stock" },
  { ticker: "TSLA",  name: "Tesla Inc.",              sector: "Automotive",             description: "Electric vehicles and clean energy company",                  volatility: 0.036, dividendYield: 0.000, basePrice: 248.6,   trend: 0.0002, assetType: "stock" },
  { ticker: "NFLX",  name: "Netflix Inc.",            sector: "Communication Services", description: "Streaming entertainment platform",                             volatility: 0.026, dividendYield: 0.000, basePrice: 698.3,   trend: 0.0003, assetType: "stock" },
  { ticker: "UBER",  name: "Uber Technologies",       sector: "Consumer Discretionary", description: "Global ride-sharing and food delivery platform",               volatility: 0.027, dividendYield: 0.000, basePrice: 78.4,    trend: 0.0004, assetType: "stock" },
  { ticker: "SHOP",  name: "Shopify Inc.",            sector: "Technology",             description: "E-commerce platform for small and medium businesses",          volatility: 0.034, dividendYield: 0.000, basePrice: 83.2,    trend: 0.0004, assetType: "stock" },
  { ticker: "SPOT",  name: "Spotify Technology",      sector: "Communication Services", description: "Global leader in music and podcast streaming",                 volatility: 0.030, dividendYield: 0.000, basePrice: 352.6,   trend: 0.0003, assetType: "stock" },
  { ticker: "SNAP",  name: "Snap Inc.",               sector: "Communication Services", description: "Multimedia messaging and augmented reality company",           volatility: 0.046, dividendYield: 0.000, basePrice: 12.3,    trend: 0.0001, assetType: "stock" },
  { ticker: "PINS",  name: "Pinterest Inc.",          sector: "Communication Services", description: "Visual discovery and social media platform",                   volatility: 0.030, dividendYield: 0.000, basePrice: 31.8,    trend: 0.0002, assetType: "stock" },
  { ticker: "ABNB",  name: "Airbnb Inc.",             sector: "Consumer Discretionary", description: "Global online vacation rental and hospitality marketplace",    volatility: 0.028, dividendYield: 0.000, basePrice: 148.2,   trend: 0.0003, assetType: "stock" },

  // ── FINANCIALS ───────────────────────────────────────────────────────────────
  { ticker: "JPM",   name: "JPMorgan Chase & Co.",    sector: "Financials",             description: "Global investment banking and financial services",             volatility: 0.014, dividendYield: 0.023, basePrice: 218.7,   trend: 0.0002, assetType: "stock" },
  { ticker: "BRK",   name: "Berkshire Hathaway",      sector: "Financials",             description: "Diversified holding company led by Warren Buffett",            volatility: 0.012, dividendYield: 0.000, basePrice: 442.6,   trend: 0.0002, assetType: "stock" },
  { ticker: "GS",    name: "Goldman Sachs Group",     sector: "Financials",             description: "Global investment banking and securities firm",                 volatility: 0.018, dividendYield: 0.024, basePrice: 498.3,   trend: 0.0002, assetType: "stock" },
  { ticker: "BAC",   name: "Bank of America Corp.",   sector: "Financials",             description: "Consumer banking, investment banking, and wealth management",   volatility: 0.016, dividendYield: 0.026, basePrice: 38.9,    trend: 0.0002, assetType: "stock" },
  { ticker: "V",     name: "Visa Inc.",               sector: "Financials",             description: "Global digital payments network and technology company",        volatility: 0.014, dividendYield: 0.008, basePrice: 276.4,   trend: 0.0003, assetType: "stock" },
  { ticker: "MA",    name: "Mastercard Inc.",         sector: "Financials",             description: "Worldwide payment processing and technology solutions",         volatility: 0.014, dividendYield: 0.006, basePrice: 492.8,   trend: 0.0003, assetType: "stock" },
  { ticker: "PYPL",  name: "PayPal Holdings",         sector: "Financials",             description: "Digital payments and online money transfer platform",           volatility: 0.024, dividendYield: 0.000, basePrice: 63.5,    trend: 0.0002, assetType: "stock" },
  { ticker: "COIN",  name: "Coinbase Global",         sector: "Financials",             description: "Largest U.S. cryptocurrency exchange and trading platform",     volatility: 0.050, dividendYield: 0.000, basePrice: 218.9,   trend: 0.0004, assetType: "stock" },

  // ── HEALTHCARE ───────────────────────────────────────────────────────────────
  { ticker: "JNJ",   name: "Johnson & Johnson",       sector: "Healthcare",             description: "Pharmaceuticals, medical devices, and consumer health",         volatility: 0.010, dividendYield: 0.031, basePrice: 152.3,   trend: 0.0001, assetType: "stock" },
  { ticker: "UNH",   name: "UnitedHealth Group",      sector: "Healthcare",             description: "Health insurance and health services conglomerate",             volatility: 0.016, dividendYield: 0.015, basePrice: 524.8,   trend: 0.0002, assetType: "stock" },
  { ticker: "PFE",   name: "Pfizer Inc.",             sector: "Healthcare",             description: "Global pharmaceutical and biotechnology company",               volatility: 0.016, dividendYield: 0.060, basePrice: 27.4,    trend: 0.0001, assetType: "stock" },
  { ticker: "LLY",   name: "Eli Lilly and Co.",       sector: "Healthcare",             description: "Pharmaceutical giant known for diabetes and weight-loss drugs",  volatility: 0.022, dividendYield: 0.007, basePrice: 798.6,   trend: 0.0005, assetType: "stock" },
  { ticker: "ABBV",  name: "AbbVie Inc.",             sector: "Healthcare",             description: "Biopharmaceutical company focused on immunology and oncology",   volatility: 0.014, dividendYield: 0.038, basePrice: 168.4,   trend: 0.0002, assetType: "stock" },
  { ticker: "MRNA",  name: "Moderna Inc.",            sector: "Healthcare",             description: "mRNA therapeutics and vaccines platform company",               volatility: 0.040, dividendYield: 0.000, basePrice: 78.3,    trend: 0.0002, assetType: "stock" },

  // ── CONSUMER STAPLES ─────────────────────────────────────────────────────────
  { ticker: "KO",    name: "The Coca-Cola Co.",       sector: "Consumer Staples",       description: "Beverages and consumer products worldwide",                    volatility: 0.008, dividendYield: 0.032, basePrice: 62.5,    trend: 0.0001, assetType: "stock" },
  { ticker: "PEP",   name: "PepsiCo Inc.",            sector: "Consumer Staples",       description: "Beverages and snack foods global conglomerate",                volatility: 0.009, dividendYield: 0.030, basePrice: 168.3,   trend: 0.0001, assetType: "stock" },
  { ticker: "WMT",   name: "Walmart Inc.",            sector: "Consumer Staples",       description: "World's largest retailer with growing e-commerce presence",     volatility: 0.010, dividendYield: 0.014, basePrice: 82.6,    trend: 0.0002, assetType: "stock" },
  { ticker: "COST",  name: "Costco Wholesale",        sector: "Consumer Staples",       description: "Membership-based warehouse retailer with loyal customer base",  volatility: 0.014, dividendYield: 0.006, basePrice: 892.4,   trend: 0.0003, assetType: "stock" },
  { ticker: "MCD",   name: "McDonald's Corp.",        sector: "Consumer Discretionary", description: "World's largest fast-food restaurant chain",                    volatility: 0.010, dividendYield: 0.024, basePrice: 294.8,   trend: 0.0001, assetType: "stock" },
  { ticker: "SBUX",  name: "Starbucks Corp.",         sector: "Consumer Discretionary", description: "Global coffeehouse chain and premium beverage brand",           volatility: 0.018, dividendYield: 0.025, basePrice: 92.6,    trend: 0.0001, assetType: "stock" },
  { ticker: "NKE",   name: "Nike Inc.",               sector: "Consumer Discretionary", description: "World's leading athletic footwear and apparel company",         volatility: 0.018, dividendYield: 0.019, basePrice: 94.3,    trend: 0.0001, assetType: "stock" },

  // ── ENTERTAINMENT & MEDIA ────────────────────────────────────────────────────
  { ticker: "DIS",   name: "The Walt Disney Co.",     sector: "Communication Services", description: "Entertainment, theme parks, and streaming",                     volatility: 0.022, dividendYield: 0.000, basePrice: 103.2,   trend: 0.0002, assetType: "stock" },
  { ticker: "RBLX",  name: "Roblox Corp.",            sector: "Communication Services", description: "User-generated gaming and metaverse platform",                  volatility: 0.042, dividendYield: 0.000, basePrice: 38.9,    trend: 0.0003, assetType: "stock" },
  { ticker: "EA",    name: "Electronic Arts",         sector: "Communication Services", description: "Video game developer and publisher of major franchises",         volatility: 0.022, dividendYield: 0.007, basePrice: 128.4,   trend: 0.0002, assetType: "stock" },
  { ticker: "TTWO",  name: "Take-Two Interactive",    sector: "Communication Services", description: "Game publisher behind GTA, NBA 2K, and Red Dead Redemption",    volatility: 0.032, dividendYield: 0.000, basePrice: 162.8,   trend: 0.0002, assetType: "stock" },

  // ── ENERGY ───────────────────────────────────────────────────────────────────
  { ticker: "XOM",   name: "Exxon Mobil Corp.",       sector: "Energy",                 description: "Global oil and natural gas exploration and production",         volatility: 0.020, dividendYield: 0.034, basePrice: 112.8,   trend: 0.0001, assetType: "stock" },
  { ticker: "CVX",   name: "Chevron Corp.",           sector: "Energy",                 description: "Integrated energy company in oil, gas, and chemicals",          volatility: 0.019, dividendYield: 0.040, basePrice: 152.3,   trend: 0.0001, assetType: "stock" },
  { ticker: "NEE",   name: "NextEra Energy",          sector: "Utilities",              description: "World's largest producer of wind and solar energy",             volatility: 0.015, dividendYield: 0.030, basePrice: 68.4,    trend: 0.0002, assetType: "stock" },

  // ── INDUSTRIALS ──────────────────────────────────────────────────────────────
  { ticker: "BA",    name: "Boeing Co.",              sector: "Industrials",            description: "Global aerospace, defense, and security manufacturer",          volatility: 0.028, dividendYield: 0.000, basePrice: 183.5,   trend: 0.0001, assetType: "stock" },
  { ticker: "CAT",   name: "Caterpillar Inc.",        sector: "Industrials",            description: "World's leading maker of construction and mining equipment",    volatility: 0.018, dividendYield: 0.018, basePrice: 348.6,   trend: 0.0002, assetType: "stock" },
  { ticker: "LMT",   name: "Lockheed Martin",         sector: "Industrials",            description: "Aerospace, defense, security, and technology company",          volatility: 0.014, dividendYield: 0.028, basePrice: 478.3,   trend: 0.0002, assetType: "stock" },
  { ticker: "DE",    name: "Deere & Company",         sector: "Industrials",            description: "World's leading maker of agricultural and heavy equipment",      volatility: 0.018, dividendYield: 0.015, basePrice: 388.2,   trend: 0.0002, assetType: "stock" },

  // ── INDEX FUNDS ──────────────────────────────────────────────────────────────
  { ticker: "SPY",   name: "S&P 500 Index Fund",      sector: "Index Fund",             description: "Tracks the S&P 500 — diversified market exposure",              volatility: 0.011, dividendYield: 0.015, basePrice: 538.9,   trend: 0.0003, assetType: "stock" },
  { ticker: "QQQ",   name: "Nasdaq-100 Index Fund",   sector: "Index Fund",             description: "Tracks top 100 Nasdaq companies — tech-heavy growth",           volatility: 0.015, dividendYield: 0.007, basePrice: 468.3,   trend: 0.0004, assetType: "stock" },
  { ticker: "VTI",   name: "Total Market Index Fund", sector: "Index Fund",             description: "Tracks the entire U.S. stock market — maximum diversification",  volatility: 0.011, dividendYield: 0.014, basePrice: 248.6,   trend: 0.0003, assetType: "stock" },

  // ── CRYPTO ───────────────────────────────────────────────────────────────────
  { ticker: "BTC",   name: "Bitcoin",                 sector: "Crypto",                 description: "The original cryptocurrency — digital gold and store of value",  volatility: 0.036, dividendYield: 0.000, basePrice: 67800,   trend: 0.0005, assetType: "crypto" },
  { ticker: "ETH",   name: "Ethereum",                sector: "Crypto",                 description: "Smart contract platform and decentralized app ecosystem",         volatility: 0.040, dividendYield: 0.000, basePrice: 3520,    trend: 0.0005, assetType: "crypto" },
  { ticker: "SOL",   name: "Solana",                  sector: "Crypto",                 description: "High-speed, low-cost blockchain for DeFi and NFTs",              volatility: 0.052, dividendYield: 0.000, basePrice: 172.4,   trend: 0.0006, assetType: "crypto" },
  { ticker: "BNB",   name: "BNB (Binance Coin)",      sector: "Crypto",                 description: "Native token of the Binance exchange and BNB Chain",             volatility: 0.044, dividendYield: 0.000, basePrice: 568.3,   trend: 0.0004, assetType: "crypto" },
  { ticker: "XRP",   name: "XRP (Ripple)",            sector: "Crypto",                 description: "Digital payment protocol for fast international transfers",        volatility: 0.048, dividendYield: 0.000, basePrice: 0.58,    trend: 0.0003, assetType: "crypto" },
  { ticker: "ADA",   name: "Cardano",                 sector: "Crypto",                 description: "Research-driven proof-of-stake blockchain platform",             volatility: 0.050, dividendYield: 0.000, basePrice: 0.48,    trend: 0.0003, assetType: "crypto" },
  { ticker: "DOGE",  name: "Dogecoin",                sector: "Crypto",                 description: "Meme-born cryptocurrency with a passionate community",           volatility: 0.065, dividendYield: 0.000, basePrice: 0.16,    trend: 0.0002, assetType: "crypto" },
  { ticker: "AVAX",  name: "Avalanche",               sector: "Crypto",                 description: "Fast, eco-friendly blockchain for DeFi and enterprise apps",      volatility: 0.054, dividendYield: 0.000, basePrice: 36.8,    trend: 0.0004, assetType: "crypto" },
  { ticker: "LINK",  name: "Chainlink",               sector: "Crypto",                 description: "Decentralized oracle network connecting smart contracts",         volatility: 0.052, dividendYield: 0.000, basePrice: 14.6,    trend: 0.0003, assetType: "crypto" },
  { ticker: "DOT",   name: "Polkadot",                sector: "Crypto",                 description: "Multi-chain blockchain interoperability protocol",                volatility: 0.052, dividendYield: 0.000, basePrice: 7.8,     trend: 0.0003, assetType: "crypto" },
  { ticker: "MATIC", name: "Polygon",                 sector: "Crypto",                 description: "Ethereum scaling solution and layer-2 blockchain",               volatility: 0.056, dividendYield: 0.000, basePrice: 0.88,    trend: 0.0004, assetType: "crypto" },
  { ticker: "SHIB",  name: "Shiba Inu",               sector: "Crypto",                 description: "Community-driven meme coin and DeFi ecosystem token",            volatility: 0.075, dividendYield: 0.000, basePrice: 0.000024, trend: 0.0002, assetType: "crypto" },

  // ── POP CULTURE / FUN ────────────────────────────────────────────────────────
  { ticker: "FNCO", name: "Fortnite Corp", sector: "Pop Culture", description: "Battle royale empire driving the metaverse rush", volatility: 0.04, dividendYield: 0.000, basePrice: 142.5, trend: 0.0005, assetType: "fun" },
  { ticker: "LVPL", name: "Liverpool FC", sector: "Pop Culture", description: "English football club — trophies, TV deals, and tourism", volatility: 0.022, dividendYield: 0.012, basePrice: 78.4, trend: 0.0002, assetType: "fun" },
  { ticker: "MNCR", name: "Minecraft Inc", sector: "Pop Culture", description: "Block-building sandbox with hundreds of millions of fans", volatility: 0.03, dividendYield: 0.000, basePrice: 215.8, trend: 0.0004, assetType: "fun" },
  { ticker: "GTAVI", name: "Grand Theft Auto VI", sector: "Pop Culture", description: "Most anticipated game launch in history — Rockstar's open-world juggernaut", volatility: 0.045, dividendYield: 0.000, basePrice: 184.0, trend: 0.0005, assetType: "fun" },
  { ticker: "TSWFT", name: "Taylor Swift Inc", sector: "Pop Culture", description: "Tour, masters, brand — a one-woman entertainment economy", volatility: 0.025, dividendYield: 0.005, basePrice: 326, trend: 0.0005, assetType: "fun" },
  { ticker: "DSNY", name: "Disney+ Studios", sector: "Pop Culture", description: "Movies, parks, streaming — the original entertainment giant", volatility: 0.02, dividendYield: 0.010, basePrice: 102.4, trend: 0.0002, assetType: "fun" },
  { ticker: "SPCX", name: "SpaceX", sector: "Pop Culture", description: "Reusable rockets, Starlink, and the road to Mars", volatility: 0.038, dividendYield: 0.000, basePrice: 412.7, trend: 0.0006, assetType: "fun" },
  { ticker: "TIKK", name: "TikTok", sector: "Pop Culture", description: "Short-form video powerhouse with a billion+ users", volatility: 0.05, dividendYield: 0.000, basePrice: 86.3, trend: 0.0005, assetType: "fun" },
  { ticker: "PKMN", name: "Pokemon Company", sector: "Pop Culture", description: "Cards, games, anime — highest-grossing media franchise", volatility: 0.022, dividendYield: 0.008, basePrice: 198.5, trend: 0.0003, assetType: "fun" },
  { ticker: "OPNAI", name: "OpenAI Inc", sector: "Pop Culture", description: "Frontier AI lab behind ChatGPT and the agent revolution", volatility: 0.055, dividendYield: 0.000, basePrice: 488.2, trend: 0.0007, assetType: "fun" },
  { ticker: "LEGO", name: "LEGO Group", sector: "Pop Culture", description: "Iconic toy brick maker with movies, parks, and games", volatility: 0.018, dividendYield: 0.014, basePrice: 165, trend: 0.0002, assetType: "fun" },
  { ticker: "F1CO", name: "Formula 1 Holdings", sector: "Pop Culture", description: "Global motorsport circus — racing, streaming, and brand", volatility: 0.024, dividendYield: 0.009, basePrice: 88.6, trend: 0.0003, assetType: "fun" },
  { ticker: "UEFA", name: "UEFA Corp", sector: "Pop Culture", description: "European football's governing body — Champions League, Euros, and global broadcast rights", volatility: 0.022, dividendYield: 0.010, basePrice: 286.98, trend: 0.0004, assetType: "fun" },
  { ticker: "FIFA", name: "FIFA Corp", sector: "Pop Culture", description: "World football's governing body — the World Cup, sponsorships, and licensing empire", volatility: 0.024, dividendYield: 0.008, basePrice: 178.56, trend: 0.0004, assetType: "fun" },

  // ── WORLD CURRENCIES (grouped by continent) ──────────────────────────────────
  { ticker: "DZDX", name: "Algerian Dinar", sector: "Currency", description: "Currency of Algeria", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0073, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "AOA", name: "Angolan Kwanza", sector: "Currency", description: "Currency of Angola", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0011, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "BWP", name: "Botswana Pula", sector: "Currency", description: "Currency of Botswana", volatility: 0.012, dividendYield: 0.000, basePrice: 0.073, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "BIF", name: "Burundian Franc", sector: "Currency", description: "Currency of Burundi", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00034, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "CVE", name: "Cape Verdean Escudo", sector: "Currency", description: "Currency of Cape Verde", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0098, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "XAF", name: "CFA Franc BEAC", sector: "Currency", description: "Currency of Central African States", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0016, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "XOF", name: "CFA Franc BCEAO", sector: "Currency", description: "Currency of West African States", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0016, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "KMF", name: "Comorian Franc", sector: "Currency", description: "Currency of Comoros", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0022, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "CDF", name: "Congolese Franc", sector: "Currency", description: "Currency of DR Congo", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00035, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "DJF", name: "Djiboutian Franc", sector: "Currency", description: "Currency of Djibouti", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0056, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "EGP", name: "Egyptian Pound", sector: "Currency", description: "Currency of Egypt", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0204, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "ERN", name: "Eritrean Nakfa", sector: "Currency", description: "Currency of Eritrea", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0667, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "ETB", name: "Ethiopian Birr", sector: "Currency", description: "Currency of Ethiopia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0083, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "GMD", name: "Gambian Dalasi", sector: "Currency", description: "Currency of Gambia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0142, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "GHS", name: "Ghanaian Cedi", sector: "Currency", description: "Currency of Ghana", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0666, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "GNF", name: "Guinean Franc", sector: "Currency", description: "Currency of Guinea", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000115, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "KES", name: "Kenyan Shilling", sector: "Currency", description: "Currency of Kenya", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0077, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "LSL", name: "Lesotho Loti", sector: "Currency", description: "Currency of Lesotho", volatility: 0.012, dividendYield: 0.000, basePrice: 0.054, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "LRD", name: "Liberian Dollar", sector: "Currency", description: "Currency of Liberia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0052, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "LYD", name: "Libyan Dinar", sector: "Currency", description: "Currency of Libya", volatility: 0.012, dividendYield: 0.000, basePrice: 0.205, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "MGA", name: "Malagasy Ariary", sector: "Currency", description: "Currency of Madagascar", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000223, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "MWK", name: "Malawian Kwacha", sector: "Currency", description: "Currency of Malawi", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000578, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "MRU", name: "Mauritanian Ouguiya", sector: "Currency", description: "Currency of Mauritania", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0252, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "MUR", name: "Mauritian Rupee", sector: "Currency", description: "Currency of Mauritius", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0218, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "MAD", name: "Moroccan Dirham", sector: "Currency", description: "Currency of Morocco", volatility: 0.012, dividendYield: 0.000, basePrice: 0.099, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "MZN", name: "Mozambican Metical", sector: "Currency", description: "Currency of Mozambique", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0156, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "NAD", name: "Namibian Dollar", sector: "Currency", description: "Currency of Namibia", volatility: 0.012, dividendYield: 0.000, basePrice: 0.054, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "NGN", name: "Nigerian Naira", sector: "Currency", description: "Currency of Nigeria", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00064, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "RWF", name: "Rwandan Franc", sector: "Currency", description: "Currency of Rwanda", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00072, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "STN", name: "Sao Tome Dobra", sector: "Currency", description: "Currency of Sao Tome", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0436, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "SCR", name: "Seychellois Rupee", sector: "Currency", description: "Currency of Seychelles", volatility: 0.012, dividendYield: 0.000, basePrice: 0.072, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "SLE", name: "Sierra Leonean Leone", sector: "Currency", description: "Currency of Sierra Leone", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0436, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "SOS", name: "Somali Shilling", sector: "Currency", description: "Currency of Somalia", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00175, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "ZAR", name: "South African Rand", sector: "Currency", description: "Currency of South Africa", volatility: 0.012, dividendYield: 0.000, basePrice: 0.054, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "SSP", name: "South Sudanese Pound", sector: "Currency", description: "Currency of South Sudan", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00077, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "SDG", name: "Sudanese Pound", sector: "Currency", description: "Currency of Sudan", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00166, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "TZS", name: "Tanzanian Shilling", sector: "Currency", description: "Currency of Tanzania", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00038, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "TND", name: "Tunisian Dinar", sector: "Currency", description: "Currency of Tunisia", volatility: 0.012, dividendYield: 0.000, basePrice: 0.318, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "UGX", name: "Ugandan Shilling", sector: "Currency", description: "Currency of Uganda", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000269, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "ZMW", name: "Zambian Kwacha", sector: "Currency", description: "Currency of Zambia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0383, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "ZIG", name: "Zimbabwe Gold", sector: "Currency", description: "Currency of Zimbabwe", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0273, trend: 0.0, assetType: "currency", continent: "Africa" },
  { ticker: "AFN", name: "Afghan Afghani", sector: "Currency", description: "Currency of Afghanistan", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0142, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "DRAM", name: "Armenian Dram", sector: "Currency", description: "Currency of Armenia", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00258, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "AZN", name: "Azerbaijani Manat", sector: "Currency", description: "Currency of Azerbaijan", volatility: 0.008, dividendYield: 0.000, basePrice: 0.588, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "BHD", name: "Bahraini Dinar", sector: "Currency", description: "Currency of Bahrain", volatility: 0.008, dividendYield: 0.000, basePrice: 2.65, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "BDT", name: "Bangladeshi Taka", sector: "Currency", description: "Currency of Bangladesh", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00838, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "BTN", name: "Bhutanese Ngultrum", sector: "Currency", description: "Currency of Bhutan", volatility: 0.018, dividendYield: 0.000, basePrice: 0.012, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "BND", name: "Brunei Dollar", sector: "Currency", description: "Currency of Brunei", volatility: 0.008, dividendYield: 0.000, basePrice: 0.748, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "KHR", name: "Cambodian Riel", sector: "Currency", description: "Currency of Cambodia", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000247, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "CNY", name: "Chinese Yuan", sector: "Currency", description: "Currency of China", volatility: 0.012, dividendYield: 0.000, basePrice: 0.139, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "GEL", name: "Georgian Lari", sector: "Currency", description: "Currency of Georgia", volatility: 0.012, dividendYield: 0.000, basePrice: 0.371, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "HKD", name: "Hong Kong Dollar", sector: "Currency", description: "Currency of Hong Kong", volatility: 0.012, dividendYield: 0.000, basePrice: 0.128, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "INR", name: "Indian Rupee", sector: "Currency", description: "Currency of India", volatility: 0.018, dividendYield: 0.000, basePrice: 0.012, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "IDR", name: "Indonesian Rupiah", sector: "Currency", description: "Currency of Indonesia", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000631, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "IRR", name: "Iranian Rial", sector: "Currency", description: "Currency of Iran", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000238, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "IQD", name: "Iraqi Dinar", sector: "Currency", description: "Currency of Iraq", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000763, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "ILS", name: "Israeli New Shekel", sector: "Currency", description: "Currency of Israel", volatility: 0.012, dividendYield: 0.000, basePrice: 0.273, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "JPY", name: "Japanese Yen", sector: "Currency", description: "Currency of Japan", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0067, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "JOD", name: "Jordanian Dinar", sector: "Currency", description: "Currency of Jordan", volatility: 0.008, dividendYield: 0.000, basePrice: 1.41, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "KZT", name: "Kazakhstani Tenge", sector: "Currency", description: "Currency of Kazakhstan", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00207, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "KWD", name: "Kuwaiti Dinar", sector: "Currency", description: "Currency of Kuwait", volatility: 0.008, dividendYield: 0.000, basePrice: 3.26, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "KGS", name: "Kyrgyzstani Som", sector: "Currency", description: "Currency of Kyrgyzstan", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0114, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "LAK", name: "Lao Kip", sector: "Currency", description: "Currency of Laos", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000462, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "LBP", name: "Lebanese Pound", sector: "Currency", description: "Currency of Lebanon", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000111, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "MOP", name: "Macanese Pataca", sector: "Currency", description: "Currency of Macau", volatility: 0.012, dividendYield: 0.000, basePrice: 0.124, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "MYR", name: "Malaysian Ringgit", sector: "Currency", description: "Currency of Malaysia", volatility: 0.012, dividendYield: 0.000, basePrice: 0.224, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "MVR", name: "Maldivian Rufiyaa", sector: "Currency", description: "Currency of Maldives", volatility: 0.012, dividendYield: 0.000, basePrice: 0.065, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "MNT", name: "Mongolian Togrog", sector: "Currency", description: "Currency of Mongolia", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000293, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "MMK", name: "Myanmar Kyat", sector: "Currency", description: "Currency of Myanmar", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000476, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "NPR", name: "Nepalese Rupee", sector: "Currency", description: "Currency of Nepal", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0075, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "KPW", name: "North Korean Won", sector: "Currency", description: "Currency of North Korea", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00111, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "OMR", name: "Omani Rial", sector: "Currency", description: "Currency of Oman", volatility: 0.008, dividendYield: 0.000, basePrice: 2.60, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "PKR", name: "Pakistani Rupee", sector: "Currency", description: "Currency of Pakistan", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00359, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "PHP", name: "Philippine Peso", sector: "Currency", description: "Currency of Philippines", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0173, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "QAR", name: "Qatari Riyal", sector: "Currency", description: "Currency of Qatar", volatility: 0.012, dividendYield: 0.000, basePrice: 0.275, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "SAR", name: "Saudi Riyal", sector: "Currency", description: "Currency of Saudi Arabia", volatility: 0.012, dividendYield: 0.000, basePrice: 0.267, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "SGD", name: "Singapore Dollar", sector: "Currency", description: "Currency of Singapore", volatility: 0.008, dividendYield: 0.000, basePrice: 0.748, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "KRW", name: "South Korean Won", sector: "Currency", description: "Currency of South Korea", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000725, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "LKR", name: "Sri Lankan Rupee", sector: "Currency", description: "Currency of Sri Lanka", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00337, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "SYP", name: "Syrian Pound", sector: "Currency", description: "Currency of Syria", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000771, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "TJS", name: "Tajikistani Somoni", sector: "Currency", description: "Currency of Tajikistan", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0928, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "THB", name: "Thai Baht", sector: "Currency", description: "Currency of Thailand", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0288, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "TRY", name: "Turkish Lira", sector: "Currency", description: "Currency of Turkiye", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0263, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "TMT", name: "Turkmenistani Manat", sector: "Currency", description: "Currency of Turkmenistan", volatility: 0.012, dividendYield: 0.000, basePrice: 0.286, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "AED", name: "UAE Dirham", sector: "Currency", description: "Currency of UAE", volatility: 0.012, dividendYield: 0.000, basePrice: 0.272, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "UZS", name: "Uzbekistani Som", sector: "Currency", description: "Currency of Uzbekistan", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000785, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "VND", name: "Vietnamese Dong", sector: "Currency", description: "Currency of Vietnam", volatility: 0.028, dividendYield: 0.000, basePrice: 0.0000395, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "YER", name: "Yemeni Rial", sector: "Currency", description: "Currency of Yemen", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00399, trend: 0.0, assetType: "currency", continent: "Asia" },
  { ticker: "ALL", name: "Albanian Lek", sector: "Currency", description: "Currency of Albania", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0107, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "BYN", name: "Belarusian Ruble", sector: "Currency", description: "Currency of Belarus", volatility: 0.012, dividendYield: 0.000, basePrice: 0.305, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "BAM", name: "Bosnia Convertible Mark", sector: "Currency", description: "Currency of Bosnia", volatility: 0.008, dividendYield: 0.000, basePrice: 0.566, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "BGN", name: "Bulgarian Lev", sector: "Currency", description: "Currency of Bulgaria", volatility: 0.008, dividendYield: 0.000, basePrice: 0.566, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "CZK", name: "Czech Koruna", sector: "Currency", description: "Currency of Czech Republic", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0436, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "DKK", name: "Danish Krone", sector: "Currency", description: "Currency of Denmark", volatility: 0.012, dividendYield: 0.000, basePrice: 0.148, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "EUR", name: "Euro", sector: "Currency", description: "Currency of Eurozone", volatility: 0.008, dividendYield: 0.000, basePrice: 1.107, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "GIP", name: "Gibraltar Pound", sector: "Currency", description: "Currency of Gibraltar", volatility: 0.008, dividendYield: 0.000, basePrice: 1.273, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "HUF", name: "Hungarian Forint", sector: "Currency", description: "Currency of Hungary", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00276, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "ISK", name: "Icelandic Krona", sector: "Currency", description: "Currency of Iceland", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00729, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "MDL", name: "Moldovan Leu", sector: "Currency", description: "Currency of Moldova", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0567, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "MKD", name: "Macedonian Denar", sector: "Currency", description: "Currency of North Macedonia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.018, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "NOK", name: "Norwegian Krone", sector: "Currency", description: "Currency of Norway", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0936, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "PLN", name: "Polish Zloty", sector: "Currency", description: "Currency of Poland", volatility: 0.012, dividendYield: 0.000, basePrice: 0.252, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "GBP", name: "Pound Sterling", sector: "Currency", description: "Currency of United Kingdom", volatility: 0.008, dividendYield: 0.000, basePrice: 1.273, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "RON", name: "Romanian Leu", sector: "Currency", description: "Currency of Romania", volatility: 0.012, dividendYield: 0.000, basePrice: 0.222, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "RUB", name: "Russian Ruble", sector: "Currency", description: "Currency of Russia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0114, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "RSD", name: "Serbian Dinar", sector: "Currency", description: "Currency of Serbia", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00942, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "SEK", name: "Swedish Krona", sector: "Currency", description: "Currency of Sweden", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0938, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "CHF", name: "Swiss Franc", sector: "Currency", description: "Currency of Switzerland", volatility: 0.008, dividendYield: 0.000, basePrice: 1.176, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "UAH", name: "Ukrainian Hryvnia", sector: "Currency", description: "Currency of Ukraine", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0241, trend: 0.0, assetType: "currency", continent: "Europe" },
  { ticker: "BSD", name: "Bahamian Dollar", sector: "Currency", description: "Currency of Bahamas", volatility: 0.008, dividendYield: 0.000, basePrice: 1.0, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "BBD", name: "Barbadian Dollar", sector: "Currency", description: "Currency of Barbados", volatility: 0.012, dividendYield: 0.000, basePrice: 0.5, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "BZD", name: "Belize Dollar", sector: "Currency", description: "Currency of Belize", volatility: 0.012, dividendYield: 0.000, basePrice: 0.498, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "BMD", name: "Bermudian Dollar", sector: "Currency", description: "Currency of Bermuda", volatility: 0.008, dividendYield: 0.000, basePrice: 1.0, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "CAD", name: "Canadian Dollar", sector: "Currency", description: "Currency of Canada", volatility: 0.008, dividendYield: 0.000, basePrice: 0.731, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "KYD", name: "Cayman Islands Dollar", sector: "Currency", description: "Currency of Cayman Islands", volatility: 0.008, dividendYield: 0.000, basePrice: 1.20, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "CRC", name: "Costa Rican Colon", sector: "Currency", description: "Currency of Costa Rica", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00197, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "CUP", name: "Cuban Peso", sector: "Currency", description: "Currency of Cuba", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0417, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "DOP", name: "Dominican Peso", sector: "Currency", description: "Currency of Dominican Republic", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0167, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "XCD", name: "East Caribbean Dollar", sector: "Currency", description: "Currency of Caribbean States", volatility: 0.012, dividendYield: 0.000, basePrice: 0.370, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "GTQ", name: "Guatemalan Quetzal", sector: "Currency", description: "Currency of Guatemala", volatility: 0.012, dividendYield: 0.000, basePrice: 0.130, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "HTG", name: "Haitian Gourde", sector: "Currency", description: "Currency of Haiti", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00763, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "HNL", name: "Honduran Lempira", sector: "Currency", description: "Currency of Honduras", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0405, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "JMD", name: "Jamaican Dollar", sector: "Currency", description: "Currency of Jamaica", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00637, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "MXN", name: "Mexican Peso", sector: "Currency", description: "Currency of Mexico", volatility: 0.012, dividendYield: 0.000, basePrice: 0.0510, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "NIO", name: "Nicaraguan Cordoba", sector: "Currency", description: "Currency of Nicaragua", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0273, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "PAB", name: "Panamanian Balboa", sector: "Currency", description: "Currency of Panama", volatility: 0.008, dividendYield: 0.000, basePrice: 1.0, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "TTD", name: "Trinidad and Tobago Dollar", sector: "Currency", description: "Currency of Trinidad", volatility: 0.012, dividendYield: 0.000, basePrice: 0.147, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "USD", name: "United States Dollar", sector: "Currency", description: "Currency of United States", volatility: 0.008, dividendYield: 0.000, basePrice: 1.0, trend: 0.0, assetType: "currency", continent: "North America" },
  { ticker: "ARS", name: "Argentine Peso", sector: "Currency", description: "Currency of Argentina", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000869, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "BOB", name: "Bolivian Boliviano", sector: "Currency", description: "Currency of Bolivia", volatility: 0.012, dividendYield: 0.000, basePrice: 0.145, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "BRL", name: "Brazilian Real", sector: "Currency", description: "Currency of Brazil", volatility: 0.012, dividendYield: 0.000, basePrice: 0.183, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "CLP", name: "Chilean Peso", sector: "Currency", description: "Currency of Chile", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00109, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "COP", name: "Colombian Peso", sector: "Currency", description: "Currency of Colombia", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000254, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "FKP", name: "Falkland Islands Pound", sector: "Currency", description: "Currency of Falkland Islands", volatility: 0.008, dividendYield: 0.000, basePrice: 1.273, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "GYD", name: "Guyanese Dollar", sector: "Currency", description: "Currency of Guyana", volatility: 0.028, dividendYield: 0.000, basePrice: 0.00478, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "PYG", name: "Paraguayan Guarani", sector: "Currency", description: "Currency of Paraguay", volatility: 0.028, dividendYield: 0.000, basePrice: 0.000131, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "PEN", name: "Peruvian Sol", sector: "Currency", description: "Currency of Peru", volatility: 0.012, dividendYield: 0.000, basePrice: 0.27, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "SRD", name: "Surinamese Dollar", sector: "Currency", description: "Currency of Suriname", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0287, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "UYU", name: "Uruguayan Peso", sector: "Currency", description: "Currency of Uruguay", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0249, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "VES", name: "Venezuelan Bolivar", sector: "Currency", description: "Currency of Venezuela", volatility: 0.018, dividendYield: 0.000, basePrice: 0.0274, trend: 0.0, assetType: "currency", continent: "South America" },
  { ticker: "AUD", name: "Australian Dollar", sector: "Currency", description: "Currency of Australia", volatility: 0.008, dividendYield: 0.000, basePrice: 0.659, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "XPF", name: "CFP Franc", sector: "Currency", description: "Currency of French Pacific", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00928, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "FJD", name: "Fijian Dollar", sector: "Currency", description: "Currency of Fiji", volatility: 0.012, dividendYield: 0.000, basePrice: 0.444, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "NZD", name: "New Zealand Dollar", sector: "Currency", description: "Currency of New Zealand", volatility: 0.008, dividendYield: 0.000, basePrice: 0.594, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "PGK", name: "Papua New Guinean Kina", sector: "Currency", description: "Currency of Papua New Guinea", volatility: 0.012, dividendYield: 0.000, basePrice: 0.252, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "SBD", name: "Solomon Islands Dollar", sector: "Currency", description: "Currency of Solomon Islands", volatility: 0.012, dividendYield: 0.000, basePrice: 0.119, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "TOP", name: "Tongan Pa'anga", sector: "Currency", description: "Currency of Tonga", volatility: 0.012, dividendYield: 0.000, basePrice: 0.428, trend: 0.0, assetType: "currency", continent: "Oceania" },
  { ticker: "VUV", name: "Vanuatu Vatu", sector: "Currency", description: "Currency of Vanuatu", volatility: 0.018, dividendYield: 0.000, basePrice: 0.00833, trend: 0.0, assetType: "currency", continent: "Oceania" },
];

export function getStockByTicker(ticker: string): StockDefinition | undefined {
  return STOCKS.find((s) => s.ticker === ticker);
}

/**
 * Returns the set of stocks for a given market mode and optional continent.
 * - mode "stocks"    → all real stocks + fun pop-culture entries
 * - mode "crypto"    → all cryptos
 * - mode "mixed"     → stocks + fun + crypto
 * If `continent` is provided (and not "none"), the currencies for that
 * continent are appended to the result, regardless of mode.
 */
export function getStocksByMode(
  mode: "stocks" | "crypto" | "mixed",
  continent?: Continent | null,
): StockDefinition[] {
  let base: StockDefinition[];
  if (mode === "stocks") {
    base = STOCKS.filter((s) => s.assetType === "stock" || s.assetType === "fun");
  } else if (mode === "crypto") {
    base = STOCKS.filter((s) => s.assetType === "crypto");
  } else {
    base = STOCKS.filter((s) => s.assetType !== "currency");
  }
  if (continent) {
    const fx = STOCKS.filter((s) => s.assetType === "currency" && s.continent === continent);
    return [...base, ...fx];
  }
  return base;
}

export function isContinent(value: unknown): value is Continent {
  return value === "Africa" || value === "Asia" || value === "Europe"
    || value === "North America" || value === "South America" || value === "Oceania";
}

// ─── Country / flag metadata for currencies ──────────────────────────────────
// Maps each currency ticker → 2-letter ISO country code used to derive a flag
// emoji. Most tickers' first 2 letters already match ISO-3166 alpha-2; this
// table records overrides where they don't.
const CURRENCY_ISO_OVERRIDE: Record<string, string> = {
  DZDX: "DZ", XAF: "CM", XOF: "SN", AED: "AE", AFN: "AF", AMD: "AM", AZN: "AZ",
  BDT: "BD", BHD: "BH", BND: "BN", BTN: "BT", CNY: "CN", DRAM: "AM", GEL: "GE",
  HKD: "HK", IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR", JOD: "JO",
  JPY: "JP", KGS: "KG", KHR: "KH", KPW: "KP", KRW: "KR", KWD: "KW", KZT: "KZ",
  LAK: "LA", LBP: "LB", LKR: "LK", MMK: "MM", MNT: "MN", MOP: "MO", MVR: "MV",
  MYR: "MY", NPR: "NP", OMR: "OM", PHP: "PH", PKR: "PK", QAR: "QA", SAR: "SA",
  SGD: "SG", SYP: "SY", THB: "TH", TJS: "TJ", TMT: "TM", TRY: "TR", TWD: "TW",
  UZS: "UZ", VND: "VN", YER: "YE",
  ALL: "AL", BAM: "BA", BGN: "BG", BYN: "BY", CHF: "CH", CZK: "CZ", DKK: "DK",
  EUR: "EU", GBP: "GB", GEL_EU: "GE", HRK: "HR", HUF: "HU", ISK: "IS", MDL: "MD",
  MKD: "MK", NOK: "NO", PLN: "PL", RON: "RO", RSD: "RS", RUB: "RU", SEK: "SE",
  UAH: "UA",
  USD: "US", CAD: "CA", MXN: "MX", BSD: "BS", BBD: "BB", BZD: "BZ", CRC: "CR",
  CUP: "CU", DOP: "DO", GTQ: "GT", HNL: "HN", HTG: "HT", JMD: "JM", NIO: "NI",
  PAB: "PA", TTD: "TT", XCD: "AG", KYD: "KY",
  ARS: "AR", BOB: "BO", BRL: "BR", CLP: "CL", COP: "CO", GYD: "GY", PEN: "PE",
  PYG: "PY", SRD: "SR", UYU: "UY", VES: "VE",
  AUD: "AU", FJD: "FJ", NZD: "NZ", PGK: "PG", SBD: "SB", TOP: "TO", VUV: "VU",
  XPF: "PF",
  AOA: "AO", BWP: "BW", BIF: "BI", CVE: "CV", CDF: "CD", DJF: "DJ", EGP: "EG",
  ERN: "ER", ETB: "ET", GMD: "GM", GHS: "GH", GNF: "GN", KES: "KE", LSL: "LS",
  LRD: "LR", LYD: "LY", MGA: "MG", MWK: "MW", MUR: "MU", MAD: "MA", MZN: "MZ",
  NAD: "NA", NGN: "NG", RWF: "RW", STN: "ST", SCR: "SC", SLL: "SL", SOS: "SO",
  ZAR: "ZA", SSP: "SS", SDG: "SD", SZL: "SZ", TZS: "TZ", TND: "TN", UGX: "UG",
  ZMW: "ZM", ZWL: "ZW", KMF: "KM", CDFR: "CD",
  WST: "WS", KID: "KI",
};

function isoToFlag(iso: string): string {
  if (iso.length !== 2) return "🌐";
  const base = 0x1f1e6 - "A".charCodeAt(0);
  return String.fromCodePoint(base + iso.charCodeAt(0), base + iso.charCodeAt(1));
}

/**
 * Returns the list of currencies for a continent enriched with a country name
 * (parsed from the description) and a flag emoji.
 */
export function getCurrenciesForContinent(continent: Continent): Array<{
  ticker: string;
  name: string;
  country: string;
  flag: string;
  basePrice: number;
}> {
  return STOCKS.filter((s) => s.assetType === "currency" && s.continent === continent).map((s) => {
    const iso = CURRENCY_ISO_OVERRIDE[s.ticker] ?? s.ticker.slice(0, 2).toUpperCase();
    const country = s.description?.replace(/^Currency of\s+/i, "").trim() || s.name;
    return { ticker: s.ticker, name: s.name, country, flag: isoToFlag(iso), basePrice: s.basePrice };
  });
}

/**
 * USD per 1 unit of `currencyTicker`. Returns 1 for USD or unknown tickers.
 */
export function getCurrencyUsdRate(currencyTicker: string): number {
  if (!currencyTicker || currencyTicker === "USD") return 1;
  const def = STOCKS.find((s) => s.ticker === currencyTicker && s.assetType === "currency");
  return def?.basePrice && def.basePrice > 0 ? def.basePrice : 1;
}

/**
 * Re-denominates USD-quoted starting cash and stock prices into the chosen
 * base currency by applying the FX rate (1 / USD-per-unit). All ratios are
 * preserved so the simulation math is unchanged.
 */
export function rescaleToCurrency<T extends { price: number; open: number; high: number; low: number }>(
  prices: T[],
  cashUsd: number,
  currencyTicker: string,
): { prices: T[]; cash: number; rate: number } {
  const rate = 1 / getCurrencyUsdRate(currencyTicker);
  if (rate === 1) return { prices, cash: cashUsd, rate: 1 };
  const rescaled = prices.map((p) => ({
    ...p,
    price: p.price * rate,
    open: p.open * rate,
    high: p.high * rate,
    low: p.low * rate,
  }));
  return { prices: rescaled, cash: cashUsd * rate, rate };
}

// Fail-fast guard: tickers must be globally unique across all asset types.
(() => {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const s of STOCKS) {
    if (seen.has(s.ticker)) dupes.push(s.ticker);
    seen.add(s.ticker);
  }
  if (dupes.length > 0) {
    throw new Error(`Duplicate stock tickers detected: ${dupes.join(", ")}`);
  }
})();
