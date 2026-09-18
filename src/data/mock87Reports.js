// Data repository containing all 87 Legal Metrology inspection reports

const brands = [
    { company: 'Gujarat Cooperative Milk Marketing Federation Ltd.', category: 'Food & Beverages' },
    { company: 'Adani Wilmar Limited', category: 'Edible Oils' },
    { company: 'Mondelez India Foods Pvt Ltd', category: 'Confectionery' },
    { company: 'Hindustan Unilever Limited', category: 'Personal Care' },
    { company: 'Reckitt Benckiser (India) Pvt Ltd', category: 'Household & Cleaning' },
    { company: 'Tata Consumer Products Ltd', category: 'Food & Beverages' },
    { company: 'Procter & Gamble Hygiene and Health Care Ltd', category: 'Baby Care' },
    { company: 'Colgate-Palmolive (India) Ltd', category: 'Personal Care' },
    { company: 'Nestle India Ltd', category: 'Food & Beverages' },
    { company: 'Dabur India Ltd', category: 'Personal Care' },
    { company: 'ITC Limited', category: 'Food & Beverages' },
    { company: 'Marico Limited', category: 'Edible Oils' },
    { company: 'Britannia Industries Ltd', category: 'Confectionery' },
    { company: 'Godrej Consumer Products Ltd', category: 'Household & Cleaning' },
    { company: 'L\'Oreal India Pvt Ltd', category: 'Cosmetics' }
];

const platforms = ['Amazon', 'Flipkart', 'Blinkit', 'Swiggy Instamart', 'BigBasket', 'JioMart', 'Myntra'];

const productCatalog = [
    { name: 'Amul Taaza Homogenised Toned Milk 1L', cat: 'Food & Beverages', company: 'Gujarat Cooperative Milk Marketing Federation Ltd.' },
    { name: 'Fortune Sunlite Refined Sunflower Oil 1L', cat: 'Edible Oils', company: 'Adani Wilmar Limited' },
    { name: 'Cadbury Dairy Milk Silk Chocolate Bar 150g', cat: 'Confectionery', company: 'Mondelez India Foods Pvt Ltd' },
    { name: 'Surf Excel Easy Wash Detergent Powder 1kg', cat: 'Household & Cleaning', company: 'Hindustan Unilever Limited' },
    { name: 'Dettol Antiseptic Liquid Disinfectant 550ml', cat: 'Household & Cleaning', company: 'Reckitt Benckiser (India) Pvt Ltd' },
    { name: 'Tata Salt Vacuum Evaporated Iodised Salt 1kg', cat: 'Food & Beverages', company: 'Tata Consumer Products Ltd' },
    { name: 'Pampers All round Protection Baby Diapers (Medium, 76 Count)', cat: 'Baby Care', company: 'Procter & Gamble Hygiene and Health Care Ltd' },
    { name: 'Colgate Strong Teeth Toothpaste 500g Value Pack', cat: 'Personal Care', company: 'Colgate-Palmolive (India) Ltd' },
    { name: 'Nestle Everyday Dairy Whitener Powder 1kg', cat: 'Food & Beverages', company: 'Nestle India Ltd' },
    { name: 'Dabur Honey 100% Pure Squeezy Pack 400g', cat: 'Food & Beverages', company: 'Dabur India Ltd' },
    { name: 'Aashirvaad Shuddh Chakki Atta 10kg', cat: 'Food & Beverages', company: 'ITC Limited' },
    { name: 'Saffola Gold Pro Healthy Fatty Acid Edible Oil 5L Jar', cat: 'Edible Oils', company: 'Marico Limited' },
    { name: 'Britannia Good Day Cashew Cookies 600g Family Pack', cat: 'Confectionery', company: 'Britannia Industries Ltd' },
    { name: 'Goodknight Gold Flash Mosquito Repellent Liquid Refill 45ml', cat: 'Household & Cleaning', company: 'Godrej Consumer Products Ltd' },
    { name: 'Maybelline New York Fit Me Liquid Foundation 30ml', cat: 'Cosmetics', company: 'L\'Oreal India Pvt Ltd' },
    { name: 'Parachute Advansed Coconut Hair Oil 300ml', cat: 'Personal Care', company: 'Marico Limited' },
    { name: 'Sunfeast Dark Fantasy Choco Fills Biscuits 300g', cat: 'Confectionery', company: 'ITC Limited' },
    { name: 'Maggi 2-Minute Masala Instant Noodles 420g (6 Pack)', cat: 'Food & Beverages', company: 'Nestle India Ltd' },
    { name: 'Red Label Natural Care Tea 1kg', cat: 'Food & Beverages', company: 'Hindustan Unilever Limited' },
    { name: 'Vim Dishwash Liquid Gel Lemon 750ml Bottle', cat: 'Household & Cleaning', company: 'Hindustan Unilever Limited' },
    { name: 'Lizol Disinfectant Surface Floor Cleaner Citrus 2L', cat: 'Household & Cleaning', company: 'Reckitt Benckiser (India) Pvt Ltd' },
    { name: 'Huggies Complete Care Baby Wipes (80 Sheets)', cat: 'Baby Care', company: 'Kimberly-Clark India' },
    { name: 'Pond\'s Bright Beauty Spotless Glow Face Wash 100g', cat: 'Personal Care', company: 'Hindustan Unilever Limited' },
    { name: 'Nivea Soft Light Moisturizing Cream 300ml', cat: 'Personal Care', company: 'Nivea India Pvt Ltd' },
    { name: 'Oreo Original Vanilla Cream Sandwich Biscuits 300g', cat: 'Confectionery', company: 'Mondelez India Foods Pvt Ltd' },
    { name: 'Harpic Power Plus Toilet Cleaner Liquid 1L', cat: 'Household & Cleaning', company: 'Reckitt Benckiser (India) Pvt Ltd' },
    { name: 'Lays Potato Chips Magic Masala 115g Party Pack', cat: 'Food & Beverages', company: 'PepsiCo India Holdings Pvt Ltd' },
    { name: 'Tropicana 100% Juice Orange 1L Tetra Pak', cat: 'Food & Beverages', company: 'PepsiCo India Holdings Pvt Ltd' },
    { name: 'Dove Cream Beauty Bathing Bar Soap 125g (Pack of 4)', cat: 'Personal Care', company: 'Hindustan Unilever Limited' },
    { name: 'Head & Shoulders Anti-Dandruff Shampoo Smooth & Silky 650ml', cat: 'Personal Care', company: 'Procter & Gamble Hygiene and Health Care Ltd' }
];

const violationTemplates = [
    {
        type: 'Font Height Violation',
        rule: 'PCR Rule 9(1)H',
        risk: 'High',
        desc: 'Net quantity declaration numeral height is 1.4 mm (Minimum mandatory threshold: 3.0 mm for >500g net content).'
    },
    {
        type: 'Missing Country of Origin',
        rule: 'PCR Rule 6(1)(n)',
        risk: 'High',
        desc: 'Product listing fails to declare mandatory Country of Origin on imported retail package.'
    },
    {
        type: 'Missing Consumer Care Details',
        rule: 'PCR Rule 6(2)',
        risk: 'Medium',
        desc: 'Customer helpline telephone number and email address missing from declaration panel.'
    },
    {
        type: 'Unit Sale Price Format Error',
        rule: 'PCR Rule 6(1)(n)',
        risk: 'Medium',
        desc: 'Unit sale price is printed as ₹0.45 instead of standard metric representation ₹0.45/g.'
    },
    {
        type: 'Missing Date of Packaging',
        rule: 'PCR Rule 6(1)(e)',
        risk: 'High',
        desc: 'Month and year of manufacture or packaging not stated on principal display panel.'
    },
    {
        type: 'Non-Standard Net Quantity Unit',
        rule: 'PCR Rule 7 & Schedule 2',
        risk: 'Low',
        desc: 'Net contents declared as 450 gms instead of standard international unit symbol 450 g.'
    }
];

// Helper to generate a single detailed report object
const generateReport = (index) => {
    const reportNum = index + 1;
    const reportId = `RPT-2026-${String(reportNum).padStart(4, '0')}`;
    const product = productCatalog[index % productCatalog.length];
    const platform = platforms[index % platforms.length];

    // Determine compliance (54 compliant, 33 non-compliant out of 87)
    const isCompliant = (index % 87 < 54);
    const overallStatus = isCompliant ? 'Compliant' : 'Non-Compliant';

    const violation = isCompliant
        ? null
        : violationTemplates[(index * 3) % violationTemplates.length];

    const riskLevel = isCompliant ? 'Pass' : violation.risk;

    // Dates spread from Sep 18, 2026 back to Sep 01, 2026
    const day = Math.max(1, 18 - Math.floor(index / 5));
    const hour = 9 + (index % 9);
    const min = (index * 7) % 60;
    const scanDateTime = `${String(day).padStart(2, '0')} Sep 2026, ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;

    // Declarations matrix
    const extractedDeclarations = [
        {
            name: 'Generic Product Name',
            extracted: product.name.split(' ')[0] + ' ' + product.name.split(' ')[1],
            rule: 'Rule 6(1)(b)',
            measurement: '3.4 mm (Min: 2.0 mm)',
            status: 'Valid'
        },
        {
            name: 'Net Quantity',
            extracted: product.name.match(/\d+(?:kg|g|L|ml|Count)/i)?.[0] || '500 g',
            rule: 'Rule 7 & Rule 9(1)H',
            measurement: (!isCompliant && violation?.type === 'Font Height Violation')
                ? '1.4 mm (Min: 3.0 mm - FAIL)'
                : '3.6 mm (Min: 3.0 mm)',
            status: (!isCompliant && violation?.type === 'Font Height Violation') ? 'Violation' : 'Valid'
        },
        {
            name: 'Maximum Retail Price (MRP)',
            extracted: `₹${(45 + (index * 13) % 450).toFixed(2)} (INCL. OF ALL TAXES)`,
            rule: 'Rule 6(1)(f)',
            measurement: '2.8 mm (Min: 2.0 mm)',
            status: 'Valid'
        },
        {
            name: 'Mfg / Packaging Date',
            extracted: (!isCompliant && violation?.type === 'Missing Date of Packaging') ? 'NOT DECLARED' : 'AUG 2026',
            rule: 'Rule 6(1)(e)',
            measurement: (!isCompliant && violation?.type === 'Missing Date of Packaging') ? 'N/A' : '2.2 mm (Min: 1.8 mm)',
            status: (!isCompliant && violation?.type === 'Missing Date of Packaging') ? 'Violation' : 'Valid'
        },
        {
            name: 'Country of Origin',
            extracted: (!isCompliant && violation?.type === 'Missing Country of Origin') ? 'MISSING' : 'India',
            rule: 'Rule 6(1)(n)',
            measurement: (!isCompliant && violation?.type === 'Missing Country of Origin') ? 'N/A' : '2.1 mm (Min: 1.8 mm)',
            status: (!isCompliant && violation?.type === 'Missing Country of Origin') ? 'Violation' : 'Valid'
        },
        {
            name: 'Manufacturer Details',
            extracted: product.company + ', Reg. Office: Industrial Estate, Plot ' + (10 + index),
            rule: 'Rule 6(1)(a)',
            measurement: '2.4 mm (Min: 1.8 mm)',
            status: 'Valid'
        },
        {
            name: 'Consumer Care Details',
            extracted: (!isCompliant && violation?.type === 'Missing Consumer Care Details')
                ? 'Address Only (No Tel/Email)'
                : 'Toll-Free: 1800-200-' + (1000 + index) + ' | Email: care@' + product.company.split(' ')[0].toLowerCase() + '.co.in',
            rule: 'Rule 6(2)',
            measurement: (!isCompliant && violation?.type === 'Missing Consumer Care Details') ? 'Incomplete' : '1.9 mm (Min: 1.6 mm)',
            status: (!isCompliant && violation?.type === 'Missing Consumer Care Details') ? 'Violation' : 'Valid'
        },
        {
            name: 'Unit Sale Price',
            extracted: (!isCompliant && violation?.type === 'Unit Sale Price Format Error')
                ? `₹${((45 + index) / 100).toFixed(2)}`
                : `₹${((45 + index) / 100).toFixed(2)}/g`,
            rule: 'Rule 6(1)(n)',
            measurement: '2.0 mm (Min: 1.8 mm)',
            status: (!isCompliant && violation?.type === 'Unit Sale Price Format Error') ? 'Violation' : 'Valid'
        }
    ];

    const applicableRules = [
        'PCR Rule 6(1)(a)',
        'PCR Rule 6(1)(e)',
        'PCR Rule 6(1)(f)',
        'PCR Rule 9(1)H',
        'LMA Section 18(1)'
    ];

    return {
        id: reportId,
        productName: product.name,
        category: product.cat,
        company: product.company,
        platform: platform,
        scanDateTime: scanDateTime,
        overallStatus: overallStatus,
        riskLevel: riskLevel,
        primaryViolation: isCompliant ? 'All mandatory declarations compliant' : violation.type,
        violationDetail: isCompliant ? null : violation.desc,
        applicableRules: applicableRules,
        extractedDeclarations: extractedDeclarations,
        productImages: [
            { label: 'Front Panel Scan', type: 'Front' },
            { label: 'Declaration Panel OCR', type: 'Back' },
            { label: 'Barcode & Price Tag', type: 'Barcode' }
        ],
        verificationQrCode: `https://legalmetrology.gov.in/verify/${reportId}`
    };
};

// Generate all 87 fixed realistic reports
export const mock87Reports = Array.from({ length: 87 }, (_, index) => generateReport(index));
