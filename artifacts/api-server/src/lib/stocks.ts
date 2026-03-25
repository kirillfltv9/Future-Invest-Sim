export type StockDefinition = {
  ticker: string;
  name: string;
  sector: string;
  description: string;
  volatility: number;
  dividendYield: number;
  basePrice: number;
  trend: number;
  assetType: "stock" | "crypto";
};

export const STOCKS: StockDefinition[] = [
  // ── TECHNOLOGY ──────────────────────────────────────────────────────────────
  { ticker: "AAPL",  name: "Apple Inc.",             sector: "Technology",             description: "Consumer electronics, software, and services giant",         volatility: 0.018, dividendYield: 0.005, basePrice: 189.5,   trend: 0.0003, assetType: "stock" },
  { ticker: "MSFT",  name: "Microsoft Corp.",         sector: "Technology",             description: "Cloud computing, software, and enterprise solutions",        volatility: 0.016, dividendYield: 0.007, basePrice: 415.2,   trend: 0.0004, assetType: "stock" },
  { ticker: "NVDA",  name: "NVIDIA Corp.",            sector: "Technology",             description: "Graphics processing units and AI chips",                     volatility: 0.038, dividendYield: 0.001, basePrice: 875.4,   trend: 0.0006, assetType: "stock" },
  { ticker: "GOOGL", name: "Alphabet Inc.",           sector: "Technology",             description: "Search, advertising, and cloud services",                    volatility: 0.020, dividendYield: 0.000, basePrice: 175.8,   trend: 0.0003, assetType: "stock" },
  { ticker: "META",  name: "Meta Platforms Inc.",     sector: "Technology",             description: "Social media and virtual reality platforms",                 volatility: 0.028, dividendYield: 0.003, basePrice: 562.1,   trend: 0.0004, assetType: "stock" },
  { ticker: "AMD",   name: "Advanced Micro Devices",  sector: "Technology",             description: "High-performance CPUs and GPUs for PCs and data centers",    volatility: 0.040, dividendYield: 0.000, basePrice: 168.2,   trend: 0.0004, assetType: "stock" },
  { ticker: "INTC",  name: "Intel Corp.",             sector: "Technology",             description: "Global semiconductor and computing solutions maker",          volatility: 0.022, dividendYield: 0.015, basePrice: 31.5,    trend: 0.0001, assetType: "stock" },
  { ticker: "CRM",   name: "Salesforce Inc.",         sector: "Technology",             description: "Cloud-based CRM and enterprise software",                    volatility: 0.026, dividendYield: 0.000, basePrice: 285.6,   trend: 0.0003, assetType: "stock" },
  { ticker: "ORCL",  name: "Oracle Corp.",            sector: "Technology",             description: "Database software, cloud infrastructure and ERP",            volatility: 0.020, dividendYield: 0.014, basePrice: 132.4,   trend: 0.0003, assetType: "stock" },
  { ticker: "ADBE",  name: "Adobe Inc.",              sector: "Technology",             description: "Creative and document cloud software platform",               volatility: 0.025, dividendYield: 0.000, basePrice: 472.3,   trend: 0.0003, assetType: "stock" },
  { ticker: "CSCO",  name: "Cisco Systems Inc.",      sector: "Technology",             description: "Networking hardware, software, and telecommunications",       volatility: 0.014, dividendYield: 0.031, basePrice: 49.8,    trend: 0.0001, assetType: "stock" },
  { ticker: "QCOM",  name: "Qualcomm Inc.",           sector: "Technology",             description: "Semiconductor and telecommunications equipment",              volatility: 0.024, dividendYield: 0.022, basePrice: 188.7,   trend: 0.0002, assetType: "stock" },
  { ticker: "AVGO",  name: "Broadcom Inc.",           sector: "Technology",             description: "Semiconductor and infrastructure software solutions",         volatility: 0.022, dividendYield: 0.017, basePrice: 1385.0,  trend: 0.0004, assetType: "stock" },
  { ticker: "NOW",   name: "ServiceNow Inc.",         sector: "Technology",             description: "Cloud-based workflow automation and ITSM platform",          volatility: 0.028, dividendYield: 0.000, basePrice: 872.1,   trend: 0.0004, assetType: "stock" },
  { ticker: "PLTR",  name: "Palantir Technologies",   sector: "Technology",             description: "Big data analytics and AI for government and enterprise",     volatility: 0.050, dividendYield: 0.000, basePrice: 24.5,    trend: 0.0005, assetType: "stock" },

  // ── CONSUMER & INTERNET ─────────────────────────────────────────────────────
  { ticker: "AMZN",  name: "Amazon.com Inc.",         sector: "Consumer Discretionary", description: "E-commerce and cloud computing leader",                       volatility: 0.022, dividendYield: 0.000, basePrice: 218.3,   trend: 0.0004, assetType: "stock" },
  { ticker: "TSLA",  name: "Tesla Inc.",              sector: "Automotive",             description: "Electric vehicles and clean energy company",                  volatility: 0.045, dividendYield: 0.000, basePrice: 248.6,   trend: 0.0002, assetType: "stock" },
  { ticker: "NFLX",  name: "Netflix Inc.",            sector: "Communication Services", description: "Streaming entertainment platform",                             volatility: 0.032, dividendYield: 0.000, basePrice: 698.3,   trend: 0.0003, assetType: "stock" },
  { ticker: "UBER",  name: "Uber Technologies",       sector: "Consumer Discretionary", description: "Global ride-sharing and food delivery platform",               volatility: 0.034, dividendYield: 0.000, basePrice: 78.4,    trend: 0.0004, assetType: "stock" },
  { ticker: "SHOP",  name: "Shopify Inc.",            sector: "Technology",             description: "E-commerce platform for small and medium businesses",          volatility: 0.042, dividendYield: 0.000, basePrice: 83.2,    trend: 0.0004, assetType: "stock" },
  { ticker: "SPOT",  name: "Spotify Technology",      sector: "Communication Services", description: "Global leader in music and podcast streaming",                 volatility: 0.038, dividendYield: 0.000, basePrice: 352.6,   trend: 0.0003, assetType: "stock" },
  { ticker: "SNAP",  name: "Snap Inc.",               sector: "Communication Services", description: "Multimedia messaging and augmented reality company",           volatility: 0.060, dividendYield: 0.000, basePrice: 12.3,    trend: 0.0001, assetType: "stock" },
  { ticker: "PINS",  name: "Pinterest Inc.",          sector: "Communication Services", description: "Visual discovery and social media platform",                   volatility: 0.038, dividendYield: 0.000, basePrice: 31.8,    trend: 0.0002, assetType: "stock" },
  { ticker: "ABNB",  name: "Airbnb Inc.",             sector: "Consumer Discretionary", description: "Global online vacation rental and hospitality marketplace",    volatility: 0.036, dividendYield: 0.000, basePrice: 148.2,   trend: 0.0003, assetType: "stock" },

  // ── FINANCIALS ───────────────────────────────────────────────────────────────
  { ticker: "JPM",   name: "JPMorgan Chase & Co.",    sector: "Financials",             description: "Global investment banking and financial services",             volatility: 0.014, dividendYield: 0.023, basePrice: 218.7,   trend: 0.0002, assetType: "stock" },
  { ticker: "BRK",   name: "Berkshire Hathaway",      sector: "Financials",             description: "Diversified holding company led by Warren Buffett",            volatility: 0.012, dividendYield: 0.000, basePrice: 442.6,   trend: 0.0002, assetType: "stock" },
  { ticker: "GS",    name: "Goldman Sachs Group",     sector: "Financials",             description: "Global investment banking and securities firm",                 volatility: 0.018, dividendYield: 0.024, basePrice: 498.3,   trend: 0.0002, assetType: "stock" },
  { ticker: "BAC",   name: "Bank of America Corp.",   sector: "Financials",             description: "Consumer banking, investment banking, and wealth management",   volatility: 0.016, dividendYield: 0.026, basePrice: 38.9,    trend: 0.0002, assetType: "stock" },
  { ticker: "V",     name: "Visa Inc.",               sector: "Financials",             description: "Global digital payments network and technology company",        volatility: 0.014, dividendYield: 0.008, basePrice: 276.4,   trend: 0.0003, assetType: "stock" },
  { ticker: "MA",    name: "Mastercard Inc.",         sector: "Financials",             description: "Worldwide payment processing and technology solutions",         volatility: 0.014, dividendYield: 0.006, basePrice: 492.8,   trend: 0.0003, assetType: "stock" },
  { ticker: "PYPL",  name: "PayPal Holdings",         sector: "Financials",             description: "Digital payments and online money transfer platform",           volatility: 0.030, dividendYield: 0.000, basePrice: 63.5,    trend: 0.0002, assetType: "stock" },
  { ticker: "COIN",  name: "Coinbase Global",         sector: "Financials",             description: "Largest U.S. cryptocurrency exchange and trading platform",     volatility: 0.065, dividendYield: 0.000, basePrice: 218.9,   trend: 0.0004, assetType: "stock" },

  // ── HEALTHCARE ───────────────────────────────────────────────────────────────
  { ticker: "JNJ",   name: "Johnson & Johnson",       sector: "Healthcare",             description: "Pharmaceuticals, medical devices, and consumer health",         volatility: 0.010, dividendYield: 0.031, basePrice: 152.3,   trend: 0.0001, assetType: "stock" },
  { ticker: "UNH",   name: "UnitedHealth Group",      sector: "Healthcare",             description: "Health insurance and health services conglomerate",             volatility: 0.016, dividendYield: 0.015, basePrice: 524.8,   trend: 0.0002, assetType: "stock" },
  { ticker: "PFE",   name: "Pfizer Inc.",             sector: "Healthcare",             description: "Global pharmaceutical and biotechnology company",               volatility: 0.016, dividendYield: 0.060, basePrice: 27.4,    trend: 0.0001, assetType: "stock" },
  { ticker: "LLY",   name: "Eli Lilly and Co.",       sector: "Healthcare",             description: "Pharmaceutical giant known for diabetes and weight-loss drugs",  volatility: 0.022, dividendYield: 0.007, basePrice: 798.6,   trend: 0.0005, assetType: "stock" },
  { ticker: "ABBV",  name: "AbbVie Inc.",             sector: "Healthcare",             description: "Biopharmaceutical company focused on immunology and oncology",   volatility: 0.014, dividendYield: 0.038, basePrice: 168.4,   trend: 0.0002, assetType: "stock" },
  { ticker: "MRNA",  name: "Moderna Inc.",            sector: "Healthcare",             description: "mRNA therapeutics and vaccines platform company",               volatility: 0.050, dividendYield: 0.000, basePrice: 78.3,    trend: 0.0002, assetType: "stock" },

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
  { ticker: "RBLX",  name: "Roblox Corp.",            sector: "Communication Services", description: "User-generated gaming and metaverse platform",                  volatility: 0.055, dividendYield: 0.000, basePrice: 38.9,    trend: 0.0003, assetType: "stock" },
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
  { ticker: "BTC",   name: "Bitcoin",                 sector: "Crypto",                 description: "The original cryptocurrency — digital gold and store of value",  volatility: 0.045, dividendYield: 0.000, basePrice: 67800,   trend: 0.0005, assetType: "crypto" },
  { ticker: "ETH",   name: "Ethereum",                sector: "Crypto",                 description: "Smart contract platform and decentralized app ecosystem",         volatility: 0.050, dividendYield: 0.000, basePrice: 3520,    trend: 0.0005, assetType: "crypto" },
  { ticker: "SOL",   name: "Solana",                  sector: "Crypto",                 description: "High-speed, low-cost blockchain for DeFi and NFTs",              volatility: 0.065, dividendYield: 0.000, basePrice: 172.4,   trend: 0.0006, assetType: "crypto" },
  { ticker: "BNB",   name: "BNB (Binance Coin)",      sector: "Crypto",                 description: "Native token of the Binance exchange and BNB Chain",             volatility: 0.055, dividendYield: 0.000, basePrice: 568.3,   trend: 0.0004, assetType: "crypto" },
  { ticker: "XRP",   name: "XRP (Ripple)",            sector: "Crypto",                 description: "Digital payment protocol for fast international transfers",        volatility: 0.060, dividendYield: 0.000, basePrice: 0.58,    trend: 0.0003, assetType: "crypto" },
  { ticker: "ADA",   name: "Cardano",                 sector: "Crypto",                 description: "Research-driven proof-of-stake blockchain platform",             volatility: 0.062, dividendYield: 0.000, basePrice: 0.48,    trend: 0.0003, assetType: "crypto" },
  { ticker: "DOGE",  name: "Dogecoin",                sector: "Crypto",                 description: "Meme-born cryptocurrency with a passionate community",           volatility: 0.085, dividendYield: 0.000, basePrice: 0.16,    trend: 0.0002, assetType: "crypto" },
  { ticker: "AVAX",  name: "Avalanche",               sector: "Crypto",                 description: "Fast, eco-friendly blockchain for DeFi and enterprise apps",      volatility: 0.068, dividendYield: 0.000, basePrice: 36.8,    trend: 0.0004, assetType: "crypto" },
  { ticker: "LINK",  name: "Chainlink",               sector: "Crypto",                 description: "Decentralized oracle network connecting smart contracts",         volatility: 0.065, dividendYield: 0.000, basePrice: 14.6,    trend: 0.0003, assetType: "crypto" },
  { ticker: "DOT",   name: "Polkadot",                sector: "Crypto",                 description: "Multi-chain blockchain interoperability protocol",                volatility: 0.065, dividendYield: 0.000, basePrice: 7.8,     trend: 0.0003, assetType: "crypto" },
  { ticker: "MATIC", name: "Polygon",                 sector: "Crypto",                 description: "Ethereum scaling solution and layer-2 blockchain",               volatility: 0.070, dividendYield: 0.000, basePrice: 0.88,    trend: 0.0004, assetType: "crypto" },
  { ticker: "SHIB",  name: "Shiba Inu",               sector: "Crypto",                 description: "Community-driven meme coin and DeFi ecosystem token",            volatility: 0.095, dividendYield: 0.000, basePrice: 0.000024, trend: 0.0002, assetType: "crypto" },
];

export function getStockByTicker(ticker: string): StockDefinition | undefined {
  return STOCKS.find((s) => s.ticker === ticker);
}

export function getStocksByMode(mode: "stocks" | "crypto" | "mixed"): StockDefinition[] {
  if (mode === "stocks") return STOCKS.filter((s) => s.assetType === "stock");
  if (mode === "crypto") return STOCKS.filter((s) => s.assetType === "crypto");
  return STOCKS;
}
