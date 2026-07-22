// One-off content generator for sample Markdown articles.
// Run: node scripts/generate-articles.mjs [category-slug]
import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "content", "articles");
fs.mkdirSync(OUT_DIR, { recursive: true });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

// index 0 = most recent. Spreads n2026 dates across Jan 1 - Jul 21 2026,
// and n2025 dates across Jun 1 - Dec 31 2025, descending (newest first).
function genDates(n2026, n2025) {
  const dates = [];
  for (let i = 0; i < n2026; i++) {
    const frac = n2026 > 1 ? i / (n2026 - 1) : 0;
    const dayOffset = Math.round(200 - frac * 200);
    const d = new Date(Date.UTC(2026, 0, 1));
    d.setUTCDate(d.getUTCDate() + dayOffset);
    dates.push(d.toISOString().slice(0, 10));
  }
  for (let i = 0; i < n2025; i++) {
    const frac = n2025 > 1 ? i / (n2025 - 1) : 0;
    const dayOffset = Math.round(213 - frac * 213);
    const d = new Date(Date.UTC(2025, 5, 1));
    d.setUTCDate(d.getUTCDate() + dayOffset);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const FIRST_NAMES = [
  "Sarah", "James", "Maria", "Robert", "Ashley", "Michael", "Jennifer", "David",
  "Amanda", "Chris", "Emily", "Brian", "Megan", "Kevin", "Laura", "Daniel",
  "Nicole", "Andrew", "Rachel", "Tyler",
];
const LAST_NAMES = [
  "Johnson", "Ramirez", "Nguyen", "Davis", "Torres", "Wilson", "Moore", "Castillo",
  "Anderson", "Reyes", "Jackson", "White", "Ortega", "Martin", "Delgado",
  "Garcia", "Robinson", "Clark", "Silva", "Walker",
];

function personName(seed) {
  return `${pick(FIRST_NAMES, seed)} ${pick(LAST_NAMES, seed + 7)}`;
}

const ROLES = {
  "finance-economy": ["regional economist", "chamber of commerce director", "city finance director", "economic development officer", "bank spokesperson"],
  "business-leaders": ["chief executive", "founder", "managing partner", "board chair", "chief operating officer"],
  "beauty-wellness": ["spa owner", "licensed esthetician", "wellness director", "master stylist", "clinic founder"],
  "education": ["superintendent", "school principal", "university spokesperson", "program director", "district board chair"],
  "healthcare": ["hospital administrator", "chief medical officer", "clinic director", "public health officer", "nursing director"],
};

const BODY_INTROS = {
  "finance-economy": (city) =>
    `The update adds to a string of recent economic developments across ${city}, part of a broader trend reshaping local balance sheets this year.`,
  "business-leaders": (city) =>
    `The announcement is the latest sign of momentum for ${city}'s business community, which has drawn growing attention from investors across the Southwest.`,
  "beauty-wellness": (city) =>
    `The news comes as wellness businesses across ${city} report steady demand from both longtime regulars and a growing number of visitors drawn to the desert lifestyle.`,
  "education": (city) =>
    `District and campus leaders in ${city} say the change reflects months of planning and input from families, faculty, and students.`,
  "healthcare": (city) =>
    `Health officials in ${city} say the move is meant to keep pace with a fast-growing population and rising demand for local care.`,
};

const BODY_DETAILS = {
  "finance-economy": (city, seed) =>
    `Analysts point to ${city}'s expanding workforce and comparatively low cost of doing business relative to coastal markets. The shift is expected to affect roughly ${20 + (seed % 130)} million dollars in local economic activity over the next two years, according to figures reviewed by the Copper State Chronicle.`,
  "business-leaders": (city, seed) =>
    `The company now employs roughly ${15 + (seed % 200)} people across its Arizona operations, with plans to keep hiring if growth holds through next year. Leadership says ${city}'s talent pipeline was a deciding factor in choosing to expand locally rather than out of state.`,
  "beauty-wellness": (city, seed) =>
    `Staff say appointment requests have climbed roughly ${10 + (seed % 30)} percent since word spread locally. The business currently employs ${3 + (seed % 12)} licensed practitioners and plans to add more positions if demand keeps pace.`,
  "education": (city, seed) =>
    `The plan affects roughly ${300 + seed * 41} students this year, with additional phases expected over the next ${1 + (seed % 3)} to ${2 + (seed % 3)} school years. Officials say funding is already in place for the first phase.`,
  "healthcare": (city, seed) =>
    `The expansion is expected to add roughly ${20 + (seed % 60)} new positions, including clinical and support staff, and comes as regional population growth pushes demand for care to record levels.`,
};

const BODY_CLOSERS = {
  "finance-economy": () =>
    `Local officials say they will continue tracking the impact on jobs and tax revenue in the months ahead.`,
  "business-leaders": () =>
    `Company leadership says an update on hiring and expansion plans is expected before the end of the year.`,
  "beauty-wellness": () =>
    `Those interested can book online or by phone, and walk-ins are welcome as availability allows.`,
  "education": () =>
    `Families can find updates and opportunities to comment through the district's official channels in the weeks ahead.`,
  "healthcare": () =>
    `Patients are encouraged to check with their provider directly for scheduling as the new services come online.`,
};

function buildBody(category, city, seed) {
  const role = pick(ROLES[category], seed);
  const name = personName(seed);
  const intro = BODY_INTROS[category](city);
  const detail = BODY_DETAILS[category](city, seed);
  const closer = BODY_CLOSERS[category]();

  const quotes = [
    `"This is something our community has been asking for, and we're glad to finally see it come together," said ${name}, ${role} in ${city}.`,
    `"We've put a lot of work into getting this right, and people are already noticing the difference," said ${name}, ${role} in ${city}.`,
    `"It's a big step forward for ${city}, and it wouldn't have happened without a lot of people pulling in the same direction," said ${name}, ${role}.`,
  ];
  const quote = pick(quotes, seed);

  const pullQuotes = [
    `"We're proud of what this means for ${city} and the people who live here."`,
    `"This is exactly the kind of progress our community deserves."`,
    `"It took teamwork, but we got there."`,
  ];
  const pullQuote = pick(pullQuotes, seed + 3);

  return `${intro}

${quote}

${detail}

> ${pullQuote} — ${name}

${closer}`;
}

const CATEGORY_DATA = {
  "finance-economy": {
    name: "Finance & Economy",
    split: [14, 3],
    items: [
      ["Desert Ridge Bank Reports Record Small-Business Lending in Q2", "A Phoenix-based bank says small-business loan volume hit an all-time high last quarter.", "Phoenix", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Austin Distel"],
      ["Old Pueblo Credit Union Surpasses $2 Billion in Assets", "A Tucson credit union reached a new milestone in total assets this quarter.", "Tucson", "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Scott Graham"],
      ["Camelback Capital Partners Closes $50M Growth Fund", "A Scottsdale investment firm closed a new fund aimed at Southwest expansion-stage companies.", "Scottsdale", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Chris Liverani"],
      ["Mesa Manufacturing Corridor Adds 400 Jobs in Six Months", "New job figures show Mesa's manufacturing corridor growing faster than the statewide average.", "Mesa", "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Markus Spiske"],
      ["Tempe Town Lake District Office Vacancy Hits Five-Year Low", "Office space near Tempe Town Lake is filling up at the fastest pace in five years.", "Tempe", "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Jason Goodman"],
      ["Chandler's Tech Manufacturing Base Drives Record Tax Revenue", "Chandler's expanding tech manufacturing sector pushed city tax revenue to a new high.", "Chandler", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Adeolu Eletu"],
      ["Gilbert Ranks Among Fastest-Growing Local Economies in Southwest", "A new regional index ranks Gilbert among the fastest-growing local economies in the Southwest.", "Gilbert", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Carlos Muza"],
      ["Glendale Sales Tax Revenue Hits Record After Stadium District Growth", "Glendale reported record sales tax collections tied to its growing stadium entertainment district.", "Glendale", "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Jp Valery"],
      ["Flagstaff Ski Season Revenue Lifts Northern Arizona Economy", "A strong snow season delivered a revenue boost to Flagstaff-area businesses.", "Flagstaff", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Josh Carter"],
      ["Peoria Logistics Park Breaks Ground on Second Phase", "Developers broke ground on a second phase of a major Peoria logistics park.", "Peoria", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Ivan Bandura"],
      ["City of Surprise Earns Upgraded Bond Rating", "A ratings agency upgraded the city of Surprise's bond rating, citing strong fiscal management.", "Surprise", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Sean Pollock"],
      ["Yuma County Agricultural Exports Hit Record Levels", "Yuma County's agricultural exporters reported record shipment volumes this season.", "Yuma", "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Jed Owen"],
      ["Prescott Sees Wave of Retiree-Driven Spending Boost Local Economy", "An influx of retirees is fueling a spending boost across Prescott's local economy.", "Prescott", "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Everett Bumstead"],
      ["Casa Grande Solar Manufacturing Plant Announces Expansion", "A solar panel manufacturer in Casa Grande announced a major plant expansion.", "Casa Grande", "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/American Public Power Association"],
      ["Lake Havasu City Tourism Spending Rebounds to Pre-2020 Levels", "Visitor spending in Lake Havasu City has climbed back above pre-pandemic levels.", "Lake Havasu City", "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Adam Kool"],
      ["Sedona Weighs New Short-Term Rental Tax as Visitor Numbers Climb", "Sedona officials are considering a new tax on short-term rentals as tourism grows.", "Sedona", "https://images.unsplash.com/photo-1602088113235-229c19758e9f?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Dan Gold"],
      ["Kingman Freight Corridor Investment Aims to Ease I-40 Bottlenecks", "A new investment package targets freight bottlenecks along Kingman's I-40 corridor.", "Kingman", "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Ian Livesey"],
    ],
  },
  "business-leaders": {
    name: "Business Leaders",
    split: [14, 3],
    items: [
      ["Sonoran Trust Financial Names Elena Marsh as Chief Executive", "A Phoenix financial firm named a longtime executive as its new chief executive.", "Phoenix", "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Cytonn Photography"],
      ["Saguaro Robotics Founder Named Regional Entrepreneur of the Year", "A Tucson robotics founder was honored as the region's entrepreneur of the year.", "Tucson", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Christina @ wocintechchat.com"],
      ["Camelback Wellness Group CEO Steps Down After a Decade at the Helm", "The longtime CEO of a Scottsdale wellness company announced her retirement.", "Scottsdale", "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/LinkedIn Sales Navigator"],
      ["Desert Silicon Works Founder Opens Second Fabrication Facility", "A Mesa tech manufacturer's founder cut the ribbon on a second local facility.", "Mesa", "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Israel Andrade"],
      ["Copper Vine Hospitality Group Expands Under New Leadership", "A Tempe hospitality company is expanding after naming a new managing partner.", "Tempe", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Marvin Meyer"],
      ["Verde Analytics Co-Founder Named to State Tech Council", "A Chandler software co-founder was appointed to a statewide technology advisory council.", "Chandler", "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Austin Distel"],
      ["Ironwood Health Ventures Founder Launches Second Startup", "A Gilbert health-tech founder is launching a second company after an early exit.", "Gilbert", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Christina @ wocintechchat.com"],
      ["Papago Freight Systems Promotes Longtime COO to Chief Executive", "A Glendale logistics firm promoted its chief operating officer to the top job.", "Glendale", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Charles Forerunner"],
      ["Peaks Outfitters Founder Named Small Business Person of the Year", "A Flagstaff outdoor retailer's founder won a statewide small business honor.", "Flagstaff", "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/LinkedIn Sales Navigator"],
      ["Skyline Credit Solutions Names First Female Chief Executive", "A Peoria fintech company named its first female CEO to lead the next growth phase.", "Peoria", "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Austin Distel"],
      ["Sun Valley Homes Founder Marks 20 Years in Business", "A Surprise homebuilding founder is celebrating two decades running the company.", "Surprise", "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Christina @ wocintechchat.com"],
      ["Colorado River Produce Co. Founder Expands Into New Markets", "A Yuma produce company founder is pushing into new distribution markets.", "Yuma", "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Perry Grone"],
      ["Granite Mountain Capital Founder Steps Into Advisory Role", "A Prescott investment firm's founder is transitioning to a part-time advisory role.", "Prescott", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Annie Spratt"],
      ["Pinal Solar Works CEO Named to National Manufacturing Board", "A Casa Grande solar manufacturer's CEO joined a national manufacturing advisory board.", "Casa Grande", "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Marten Bjork"],
      ["Havasu Marine Ventures Founder Buys Second Marina", "A Lake Havasu City entrepreneur is expanding her marina business with a second property.", "Lake Havasu City", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Alesia Kazantceva"],
      ["Red Rock Retreats Founder Named Tourism Industry Leader", "A Sedona hospitality founder was recognized as a leader in the state's tourism industry.", "Sedona", "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/LinkedIn Sales Navigator"],
      ["Route 66 Freight Founder Reflects on Three Decades in Trucking", "A Kingman trucking company founder is marking thirty years in the freight business.", "Kingman", "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Carlos Muza"],
    ],
  },
  "beauty-wellness": {
    name: "Beauty & Wellness",
    split: [14, 3],
    items: [
      ["Ocotillo Spa Debuts Desert Clay Facial Line", "A Scottsdale spa introduced a new facial line built around desert clay sourced regionally.", "Scottsdale", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Content Pixie"],
      ["Valley Wellness Collective Opens Second Location in Arcadia", "A Phoenix wellness studio is expanding into the Arcadia neighborhood with a second location.", "Phoenix", "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Toa Heftiba"],
      ["Sonoran Bloom Skincare Launches Prickly Pear Serum", "A Tucson skincare brand launched a new serum featuring prickly pear extract.", "Tucson", "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Sara Kurfeß"],
      ["Red Rock Renewal Spa Adds Sound Bath Therapy Room", "A Sedona spa added a dedicated sound bath therapy room to its treatment menu.", "Sedona", "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Kike Vega"],
      ["Copper Canyon Day Spa Wins Statewide Customer Service Award", "A Mesa day spa was recognized with a statewide customer service honor.", "Mesa", "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Madison Lavern"],
      ["Desert Sage Wellness Studio Adds Infrared Sauna Suites", "A Tempe wellness studio expanded its offerings with new infrared sauna suites.", "Tempe", "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Adam Winger"],
      ["Agave Glow Beauty Bar Trains Five New Estheticians", "A Chandler beauty bar is investing in its team through a new local training program.", "Chandler", "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Introspectivedsgn"],
      ["Ironwood Wellness Center Opens Dedicated Men's Grooming Suite", "A Gilbert wellness center opened a new suite dedicated to men's grooming services.", "Gilbert", "https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Jared Rice"],
      ["High Country Spa Adds Pine-and-Juniper Massage Treatment", "A Flagstaff spa introduced a new massage treatment inspired by the surrounding pine forest.", "Flagstaff", "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Content Pixie"],
      ["Whiskey Row Beauty Lounge Expands Bridal Suite", "A Prescott beauty lounge expanded its dedicated bridal suite ahead of wedding season.", "Prescott", "https://images.unsplash.com/photo-1620733723572-11c53f73a416?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Marissa Rangel"],
      ["Papago Park Wellness Studio Hosts Community Yoga Series", "A Glendale wellness studio launched a free community yoga series near Papago Park.", "Glendale", "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Element5 Digital"],
      ["Sundown Skincare Studio Sources Ingredients From Local Farms", "A Peoria skincare studio switched to locally farmed ingredients for its full product line.", "Peoria", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Alexandra Tran"],
      ["Desert Bloom Day Spa Opens First Yuma Location", "A regional spa chain opened its first Yuma location this month.", "Yuma", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Chelsea Shapouri"],
      ["Cactus Blossom Nail Bar Wins Small-Business Grant", "A Casa Grande nail bar was awarded a small-business grant to fund its expansion.", "Casa Grande", "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Dan Gold"],
      ["Havasu Wellness Retreat Adds Lakeside Yoga Deck", "A Lake Havasu City retreat added a new lakeside deck for outdoor yoga sessions.", "Lake Havasu City", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Gabby K"],
      ["Sunrise Mountain Spa Debuts Organic Skincare Line", "A Surprise spa introduced a new organic skincare line made with regional ingredients.", "Surprise", "https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Angela Bailey"],
      ["Route 66 Beauty Bar Celebrates Fifth Anniversary", "A Kingman beauty bar marked five years in business with a community open house.", "Kingman", "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Kate Walker"],
    ],
  },
  education: {
    name: "Education",
    split: [14, 3],
    items: [
      ["Arizona State University Opens New Engineering Innovation Hub", "ASU's Tempe campus opened a new hub dedicated to student engineering projects.", "Tempe", "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Vasily Koloda"],
      ["University of Arizona Breaks Ground on Data Science Building", "UArizona broke ground on a new building dedicated to its data science programs.", "Tucson", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Nathan Dumlao"],
      ["Northern Arizona University Expands Online Degree Programs", "NAU is expanding its slate of online degree offerings for working students.", "Flagstaff", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Standsome Worklifestyle"],
      ["Phoenix Union High School District Pilots Four-Day Week", "Two campuses in the Phoenix Union district are testing a four-day school week.", "Phoenix", "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Element5 Digital"],
      ["Scottsdale Unified Approves New STEM Magnet Program", "Scottsdale Unified's governing board approved a new STEM magnet school program.", "Scottsdale", "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Kenny Eliason"],
      ["Mesa Community College Adds Advanced Manufacturing Certificate", "Mesa Community College launched a new certificate program in advanced manufacturing.", "Mesa", "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/MD Duran"],
      ["Chandler Unified Breaks Ground on Third New Elementary School", "Chandler Unified broke ground on a third new elementary campus to handle growth.", "Chandler", "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Nathan Dumlao"],
      ["Gilbert Public Schools Wins State Literacy Grant", "Gilbert Public Schools was awarded a statewide grant to fund new literacy programs.", "Gilbert", "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Vasily Koloda"],
      ["Glendale Community College Expands Nursing Program Capacity", "Glendale Community College is adding seats to its high-demand nursing program.", "Glendale", "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Compare Fibre"],
      ["Peoria Unified Adds Dual-Language Immersion Track", "Peoria Unified is launching a new dual-language immersion track at two campuses.", "Peoria", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Nathan Dumlao"],
      ["Paradise Education District Opens New Career Tech Center", "A new career and technical education center opened to serve the Surprise area.", "Surprise", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Green Chameleon"],
      ["Yuma Union High School District Approves New Trade Skills Wing", "Yuma Union's governing board approved a new trade skills wing for one of its campuses.", "Yuma", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Vasily Koloda"],
      ["Yavapai College Adds Renewable Energy Technician Program", "Yavapai College launched a new technician training program focused on renewable energy.", "Prescott", "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Kenny Eliason"],
      ["Central Arizona College Expands Agriculture Technology Lab", "Central Arizona College expanded its agriculture technology lab in Casa Grande.", "Casa Grande", "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Changbok Ko"],
      ["Lake Havasu Unified Opens New STEM Elementary Wing", "Lake Havasu Unified opened a new STEM-focused wing at one of its elementary schools.", "Lake Havasu City", "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Vasily Koloda"],
      ["Sedona Charter School Wins Statewide Arts Education Grant", "A Sedona charter school was awarded a statewide grant to expand its arts programming.", "Sedona", "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Nathan Dumlao"],
      ["Mohave Community College Adds Logistics and Supply Chain Program", "Mohave Community College launched a new program focused on logistics and supply chain careers.", "Kingman", "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Nathan Dumlao"],
    ],
  },
  healthcare: {
    name: "Healthcare",
    split: [14, 3],
    items: [
      ["Desert Vista Medical Center Opens New Cardiac Wing", "A Phoenix hospital opened a new wing dedicated to cardiac care.", "Phoenix", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Marcelo Leal"],
      ["Sonoran Regional Hospital Expands Emergency Department", "A Tucson hospital completed an expansion of its emergency department.", "Tucson", "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Olga Guryanova"],
      ["Camelback Health Partners Opens New Urgent Care Clinic", "A Scottsdale health network opened a new urgent care location.", "Scottsdale", "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Hush Naidoo Jade Photography"],
      ["Mesa Family Health Network Adds Pediatric Specialty Clinic", "A Mesa clinic network added a new specialty clinic focused on pediatric care.", "Mesa", "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/National Cancer Institute"],
      ["Tempe Community Hospital Launches Telehealth Expansion", "A Tempe hospital expanded its telehealth program to serve more rural patients.", "Tempe", "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Piron Guillaume"],
      ["Chandler Regional Health Opens New Outpatient Surgery Center", "A Chandler health system opened a new outpatient surgery center.", "Chandler", "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Martha Dominguez de Gouveia"],
      ["Ironwood Medical Group Adds Behavioral Health Program", "A Gilbert medical group launched a new behavioral health program for patients of all ages.", "Gilbert", "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Marcelo Leal"],
      ["Glendale Community Hospital Breaks Ground on New Tower", "A Glendale hospital broke ground on a new patient tower to add bed capacity.", "Glendale", "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Olga Guryanova"],
      ["Flagstaff Mountain Health Expands Rural Clinic Network", "A Flagstaff health system is expanding its network of rural clinics across northern Arizona.", "Flagstaff", "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Accuray"],
      ["Peoria Health Alliance Opens New Senior Care Center", "A Peoria health group opened a new center dedicated to senior care services.", "Peoria", "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Owen Beard"],
      ["Surprise Valley Medical Center Adds Maternity Wing", "A Surprise hospital added a new maternity wing to serve a growing number of families.", "Surprise", "https://images.unsplash.com/photo-1580281657702-257584239a55?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/JC Gellidon"],
      ["Yuma Regional Health Expands Rural Telemedicine Program", "A Yuma health system expanded its telemedicine program to reach outlying farm communities.", "Yuma", "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Hush Naidoo Jade Photography"],
      ["Prescott Highlands Hospital Adds New Cancer Care Wing", "A Prescott hospital opened a new wing dedicated to cancer treatment and support services.", "Prescott", "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/CDC"],
      ["Casa Grande Regional Medical Center Opens Diabetes Clinic", "A Casa Grande hospital opened a new clinic focused on diabetes care and prevention.", "Casa Grande", "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Rawpixel"],
      ["Havasu Community Hospital Expands ICU Capacity", "A Lake Havasu City hospital expanded its intensive care unit to add more beds.", "Lake Havasu City", "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Accuray"],
      ["Red Rock Health Clinic Adds Mental Health Counseling Wing", "A Sedona clinic added a new wing dedicated to mental health counseling services.", "Sedona", "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Marcelo Leal"],
      ["Kingman Regional Medical Center Adds New Trauma Bay", "A Kingman hospital added a new trauma bay to improve emergency response capacity.", "Kingman", "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&h=800&q=80", "Unsplash/Piron Guillaume"],
    ],
  },
};

const onlyCategory = process.argv[2];

let totalWritten = 0;
const usedSlugs = new Set();
let globalIndex = 0;

for (const [categorySlug, cat] of Object.entries(CATEGORY_DATA)) {
  if (onlyCategory && categorySlug !== onlyCategory) {
    globalIndex += cat.items.length;
    continue;
  }

  const dates = genDates(cat.split[0], cat.split[1]);
  let written = 0;

  cat.items.forEach(([title, excerpt, city, coverImage, imageCredit], i) => {
    const date = dates[i];
    const seed = globalIndex;

    let slug = slugify(`${city}-${title}`);
    if (usedSlugs.has(slug)) slug = `${slug}-${seed}`;
    usedSlugs.add(slug);

    const body = buildBody(categorySlug, city, seed);
    const featured = categorySlug === "finance-economy" && i === 0;

    const frontmatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `slug: ${JSON.stringify(slug)}`,
      `excerpt: ${JSON.stringify(excerpt)}`,
      `category: ${JSON.stringify(categorySlug)}`,
      `date: ${JSON.stringify(date)}`,
      `coverImage: ${JSON.stringify(coverImage)}`,
      ...(featured ? [`featured: true`] : []),
      `imageCredit: ${JSON.stringify(imageCredit)}`,
      "---",
      "",
    ].join("\n");

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), frontmatter + body + "\n");
    written++;
    totalWritten++;
    globalIndex++;
  });

  console.log(`[${cat.name}] wrote ${written} articles`);
}

console.log(`Done. ${totalWritten} articles written to content/articles/`);
