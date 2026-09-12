import { SamplePackageItem } from '../types/inspection';

// Helper to create realistic SVG packaging images
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

const SAMPLE_1_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900" width="700" height="900" style="background:#fefbf4; font-family:'Segoe UI', Arial, sans-serif;">
  <!-- Bag Outline -->
  <rect x="50" y="40" width="600" height="820" rx="24" fill="#fdfbf5" stroke="#d97706" stroke-width="4" />
  <rect x="70" y="60" width="560" height="780" rx="16" fill="#fff" stroke="#fde68a" stroke-width="2" />
  
  <!-- Header Pattern -->
  <rect x="70" y="60" width="560" height="110" rx="16" fill="#92400e" />
  <text x="350" y="115" text-anchor="middle" font-size="32" font-weight="bold" fill="#fef3c7" letter-spacing="2">BHARAT ORGANICS</text>
  <text x="350" y="145" text-anchor="middle" font-size="16" font-weight="bold" fill="#fef08a">भारत ऑर्गेनिक्स • शुद्धता और विश्वास</text>

  <!-- Commodity Name -->
  <rect x="110" y="195" width="480" height="95" rx="12" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
  <text x="350" y="235" text-anchor="middle" font-size="24" font-weight="bold" fill="#78350f">SHARBATI WHOLE WHEAT ATTA</text>
  <text x="350" y="265" text-anchor="middle" font-size="20" font-weight="bold" fill="#92400e">शरबती संपूर्ण गेहूं का आटा (100% Chakki Fresh)</text>

  <!-- Net Quantity Box (PDP prominent) -->
  <rect x="110" y="310" width="220" height="90" rx="8" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
  <text x="125" y="335" font-size="13" font-weight="bold" fill="#475569">NET QUANTITY / शुद्ध मात्रा</text>
  <text x="220" y="375" text-anchor="middle" font-size="34" font-weight="900" fill="#0f172a">5 kg</text>
  <text x="220" y="392" text-anchor="middle" font-size="11" fill="#64748b">(Standard Metric Package)</text>

  <!-- MRP & USP Box -->
  <rect x="360" y="310" width="230" height="90" rx="8" fill="#f0fdf4" stroke="#166534" stroke-width="2" />
  <text x="375" y="335" font-size="13" font-weight="bold" fill="#166534">MAXIMUM RETAIL PRICE (MRP)</text>
  <text x="375" y="365" font-size="24" font-weight="bold" fill="#14532d">₹ 290.00</text>
  <text x="375" y="385" font-size="12" font-weight="bold" fill="#15803d">INCL. OF ALL TAXES</text>
  <text x="500" y="365" font-size="12" fill="#166534">Unit Sale Price:</text>
  <text x="500" y="383" font-size="14" font-weight="bold" fill="#166534">₹ 58.00 / kg</text>

  <!-- Dates & Batch -->
  <rect x="110" y="420" width="480" height="85" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />
  <text x="130" y="448" font-size="13" font-weight="bold" fill="#334155">Date of Packaging:</text>
  <text x="265" y="448" font-size="14" font-weight="bold" fill="#0f172a">08 / 2026</text>
  <text x="365" y="448" font-size="13" font-weight="bold" fill="#334155">Batch / Lot No:</text>
  <text x="475" y="448" font-size="14" font-family="monospace" font-weight="bold" fill="#0f172a">BO-2608-A1</text>
  <text x="130" y="480" font-size="13" font-weight="bold" fill="#b45309">BEST BEFORE 4 MONTHS FROM PACKAGING DATE</text>

  <!-- Manufacturer Details -->
  <rect x="110" y="525" width="480" height="120" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
  <text x="130" y="550" font-size="13" font-weight="bold" fill="#1e293b">MANUFACTURED &amp; PACKED BY:</text>
  <text x="130" y="572" font-size="14" font-weight="bold" fill="#0f172a">Bharat Organics Agro Foods Pvt. Ltd.</text>
  <text x="130" y="594" font-size="13" fill="#334155">Plot No. 44-B, Sector 7, Industrial Area, Indore, MP - 452010</text>
  <text x="130" y="616" font-size="13" font-weight="bold" fill="#1e293b">COUNTRY OF ORIGIN: INDIA</text>
  <text x="130" y="635" font-size="12" fill="#047857">FSSAI Lic. No. 11422850000321</text>

  <!-- Consumer Care Box -->
  <rect x="110" y="665" width="480" height="110" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
  <text x="130" y="690" font-size="13" font-weight="bold" fill="#1d4ed8">CONSUMER CARE EXECUTIVE / उपभोक्ता शिकायत:</text>
  <text x="130" y="712" font-size="13" fill="#1e293b">For feedback / complaints, contact Consumer Cell at above address.</text>
  <text x="130" y="734" font-size="13" font-weight="bold" fill="#1e3a8a">Toll-Free Helpline: 1800-202-9900</text>
  <text x="130" y="756" font-size="13" font-weight="bold" fill="#1d4ed8">Email: care@bharatorganics.in | Web: www.bharatorganics.in</text>

  <!-- Veg Logo -->
  <g transform="translate(540, 680)">
    <rect x="0" y="0" width="34" height="34" fill="#fff" stroke="#16a34a" stroke-width="2"/>
    <circle cx="17" cy="17" r="10" fill="#16a34a"/>
  </g>
</svg>`;

const SAMPLE_2_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900" width="700" height="900" style="background:#fff7ed; font-family:'Segoe UI', Arial, sans-serif;">
  <!-- Carton Outline -->
  <rect x="70" y="50" width="560" height="800" rx="16" fill="#fff" stroke="#ea580c" stroke-width="4" />
  
  <!-- Header -->
  <rect x="90" y="70" width="520" height="100" rx="12" fill="#ea580c" />
  <text x="350" y="125" text-anchor="middle" font-size="30" font-weight="900" fill="#fff" letter-spacing="3">SUNFRESH BEVERAGES</text>
  <text x="350" y="150" text-anchor="middle" font-size="14" fill="#ffedd5">100% Real Alphonso Taste</text>

  <!-- Commodity -->
  <text x="350" y="220" text-anchor="middle" font-size="28" font-weight="bold" fill="#9a3412">MANGO FRUIT DRINK</text>

  <!-- NON-COMPLIANT Net Quantity: uses "mls" instead of standard "ml" -->
  <rect x="120" y="270" width="220" height="80" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2" />
  <text x="135" y="295" font-size="12" font-weight="bold" fill="#991b1b">NET QTY (NON-STANDARD UNIT):</text>
  <text x="230" y="335" text-anchor="middle" font-size="30" font-weight="900" fill="#b91c1c">200 mls</text>

  <!-- NON-COMPLIANT MRP: Missing "incl. of all taxes" text, only has "MRP: 45/-" -->
  <rect x="360" y="270" width="220" height="80" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2" />
  <text x="375" y="295" font-size="12" font-weight="bold" fill="#991b1b">PRICE (MISSING TAXES TEXT):</text>
  <text x="470" y="335" text-anchor="middle" font-size="28" font-weight="900" fill="#b91c1c">MRP: Rs. 45/-</text>

  <!-- Manufacturing & Expiry -->
  <rect x="120" y="380" width="460" height="80" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />
  <text x="140" y="410" font-size="14" font-weight="bold" fill="#334155">Mfg Date: 06/2026</text>
  <text x="340" y="410" font-size="14" font-weight="bold" fill="#334155">Use By: 12/2026</text>
  <text x="140" y="440" font-size="13" fill="#64748b">Batch No: SF-MAN-0922</text>

  <!-- NON-COMPLIANT Manufacturer: Missing PIN code, vague address -->
  <rect x="120" y="490" width="460" height="110" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" />
  <text x="140" y="515" font-size="13" font-weight="bold" fill="#991b1b">MANUFACTURED BY (INCOMPLETE ADDRESS):</text>
  <text x="140" y="540" font-size="14" font-weight="bold" fill="#1e293b">SunFresh Agro Drinks Ltd.</text>
  <text x="140" y="565" font-size="13" fill="#475569">GIDC Estate, Phase II, Vapi, Gujarat (NO PINCODE)</text>
  <text x="140" y="588" font-size="12" font-weight="bold" fill="#dc2626">CRITICAL: Missing 6-digit Postal PIN Code</text>

  <!-- Consumer Care missing email -->
  <rect x="120" y="630" width="460" height="90" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
  <text x="140" y="655" font-size="13" font-weight="bold" fill="#92400e">CONSUMER CARE (PARTIAL):</text>
  <text x="140" y="680" font-size="13" fill="#1e293b">Customer Helpline: +91 98200 12345</text>
  <text x="140" y="702" font-size="12" font-weight="bold" fill="#b45309">No official email or website provided</text>

  <text x="140" y="755" font-size="13" font-weight="bold" fill="#15803d">Made in India</text>
</svg>`;

const SAMPLE_3_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900" width="700" height="900" style="background:#f1f5f9; font-family:'Segoe UI', Arial, sans-serif;">
  <rect x="70" y="50" width="560" height="800" rx="16" fill="#ffffff" stroke="#475569" stroke-width="3" />
  <rect x="90" y="70" width="520" height="90" rx="10" fill="#1e293b" />
  <text x="350" y="125" text-anchor="middle" font-size="28" font-weight="bold" fill="#f8fafc" letter-spacing="2">NORDIC GLITZ</text>
  
  <text x="350" y="200" text-anchor="middle" font-size="22" font-weight="bold" fill="#334155">CRISPY COCOA WAFER BAR</text>
  
  <rect x="120" y="240" width="220" height="70" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
  <text x="135" y="265" font-size="12" fill="#64748b">Net Weight:</text>
  <text x="230" y="295" text-anchor="middle" font-size="24" font-weight="bold" fill="#0f172a">75 g</text>

  <rect x="360" y="240" width="220" height="70" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
  <text x="375" y="265" font-size="12" fill="#64748b">MRP (incl. of all taxes):</text>
  <text x="470" y="295" text-anchor="middle" font-size="24" font-weight="bold" fill="#0f172a">₹ 120.00</text>

  <!-- Dates -->
  <rect x="120" y="330" width="460" height="70" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
  <text x="140" y="358" font-size="13" fill="#334155">Packed Date: 05/2026</text>
  <text x="320" y="358" font-size="13" fill="#334155">Best Before: 12 months from date</text>
  <text x="140" y="385" font-size="12" fill="#64748b">Lot: NG-EUR-88319</text>

  <!-- Missing Country of Origin -->
  <rect x="120" y="425" width="460" height="90" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2" />
  <text x="140" y="450" font-size="13" font-weight="bold" fill="#dc2626">COUNTRY OF ORIGIN: [NOT DECLARED ON PACK]</text>
  <text x="140" y="475" font-size="12" fill="#475569">Manufactured by Nordic Confections AB, Stockholm</text>
  <text x="140" y="495" font-size="12" font-weight="bold" fill="#b91c1c">Violation: Rule 6(10) Mandatory Origin for imported packaged goods</text>

  <!-- Importer Sticker / Consumer Care -->
  <rect x="120" y="540" width="460" height="110" rx="8" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
  <text x="140" y="565" font-size="13" font-weight="bold" fill="#b45309">IMPORTED &amp; MARKETED IN INDIA BY:</text>
  <text x="140" y="590" font-size="13" fill="#1e293b">Global Gourmet Impex LLP, Andheri East, Mumbai - 400069</text>
  <text x="140" y="615" font-size="12" fill="#1e293b">Consumer Care: customercare@globalgourmet.co.in (No phone number)</text>
  <text x="140" y="635" font-size="11" fill="#b45309">Needs Review: Missing direct telephone contact under Rule 6(1)(g)</text>

  <rect x="120" y="675" width="460" height="60" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
  <text x="140" y="700" font-size="12" fill="#334155">Languages Found: English only (No Hindi/Devanagari declaration)</text>
  <text x="140" y="720" font-size="11" fill="#64748b">FSSAI Importer Lic: 10018022007890</text>
</svg>`;

const SAMPLE_4_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900" width="700" height="900" style="background:#faf5ff; font-family:'Segoe UI', Arial, sans-serif;">
  <rect x="100" y="50" width="500" height="800" rx="20" fill="#ffffff" stroke="#7e22ce" stroke-width="3" />
  
  <rect x="120" y="70" width="460" height="90" rx="10" fill="#6b21a8" />
  <text x="350" y="125" text-anchor="middle" font-size="28" font-weight="bold" fill="#faf5ff" letter-spacing="2">AYURGLOW BOTANICS</text>
  
  <text x="350" y="200" text-anchor="middle" font-size="22" font-weight="bold" fill="#581c87">HERBAL RADIANT SKIN CLEANSER</text>
  <text x="350" y="225" text-anchor="middle" font-size="13" fill="#6b21a8">With Neem, Tulsi &amp; Organic Aloe</text>

  <!-- Readability Issue: Tiny font on Net Qty & MRP -->
  <rect x="140" y="260" width="200" height="60" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.5" />
  <text x="150" y="280" font-size="10" fill="#92400e">Net Vol (Tiny Font &lt; 2mm):</text>
  <text x="240" y="305" text-anchor="middle" font-size="14" font-weight="bold" fill="#b45309">100 ml</text>

  <rect x="360" y="260" width="200" height="60" rx="6" fill="#fffbeb" stroke="#d97706" stroke-width="1.5" />
  <text x="370" y="280" font-size="10" fill="#92400e">MRP incl. of taxes:</text>
  <text x="460" y="305" text-anchor="middle" font-size="14" font-weight="bold" fill="#b45309">₹ 175.00</text>

  <rect x="140" y="340" width="420" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
  <text x="155" y="365" font-size="12" fill="#334155">Mfg Dt: 07/2026 | Use Before 24 months</text>
  <text x="155" y="390" font-size="12" fill="#334155">Batch No: AG-2607-B9</text>

  <rect x="140" y="430" width="420" height="100" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
  <text x="155" y="455" font-size="12" font-weight="bold" fill="#334155">Manufactured &amp; Marketed by:</text>
  <text x="155" y="475" font-size="13" font-weight="bold" fill="#0f172a">AyurGlow Wellness Herbals Ltd.</text>
  <text x="155" y="495" font-size="12" fill="#475569">Survey 128, Kadi-Kalol Highway, Mehsana, Gujarat - 382715</text>
  <text x="155" y="515" font-size="12" font-weight="bold" fill="#15803d">Country of Origin: India</text>

  <rect x="140" y="550" width="420" height="90" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1" />
  <text x="155" y="575" font-size="12" font-weight="bold" fill="#1d4ed8">Consumer Grievance Cell:</text>
  <text x="155" y="595" font-size="12" fill="#1e293b">Toll Free: 1800-889-1122 | support@ayurglow.in</text>
  <text x="155" y="615" font-size="11" fill="#475569">Cosmetic Mfg Lic. No: GC/1429-A</text>
</svg>`;

export const SAMPLE_PACKAGES: SamplePackageItem[] = [
  {
    id: 'sample-1',
    title: 'Bharat Organics Sharbati Atta (5 kg)',
    category: 'FOOD_BEVERAGE',
    brand: 'Bharat Organics',
    description: 'Fully compliant standard Indian food commodity with complete bilingual declarations, full address, unit sale price, and valid consumer cell.',
    expectedOutcome: 'COMPLIANT',
    tags: ['Compliant', 'Bilingual', 'USP Declared', 'Passes All Rules'],
    imageUrl: createSvgDataUrl(SAMPLE_1_SVG),
    precomputedResult: {
      inspectionId: 'INSP-2026-0911-001',
      timestamp: '2026-09-11 10:15 IST',
      inspectorName: 'Legal Metrology Inspector (Div-I)',
      inspectionLocation: 'Zone 4 Logistics Hub, Indore',
      packageCategory: 'FOOD_BEVERAGE',
      imageFileName: 'bharat_organics_atta_5kg.jpg',
      imageUrl: createSvgDataUrl(SAMPLE_1_SVG),
      overallScore: 98,
      overallStatus: 'COMPLIANT',
      summaryNotes: 'All mandatory declarations under Rule 6 of Legal Metrology (Packaged Commodities) Rules, 2011 are properly stated with legible contrast and bilingual compliance.',
      suggestedAction: 'APPROVE',
      extractedDeclarations: {
        productName: {
          value: 'Sharbati Whole Wheat Atta',
          genericName: 'Whole Wheat Flour / Atta',
          confidence: 99,
          rawText: 'SHARBATI WHOLE WHEAT ATTA / शरबती संपूर्ण गेहूं का आटा',
        },
        manufacturerPacker: {
          type: 'Manufacturer',
          name: 'Bharat Organics Agro Foods Pvt. Ltd.',
          fullAddress: 'Plot No. 44-B, Sector 7, Industrial Area, Indore, MP - 452010',
          pinCode: '452010',
          confidence: 97,
          rawText: 'MANUFACTURED & PACKED BY: Bharat Organics Agro Foods Pvt. Ltd., Plot No. 44-B, Sector 7, Industrial Area, Indore, MP - 452010',
        },
        netQuantity: {
          declaredValue: '5 kg',
          numericAmount: 5,
          unit: 'kg',
          standardUnitCompliant: true,
          confidence: 99,
          rawText: 'NET QUANTITY / शुद्ध मात्रा: 5 kg',
        },
        mrp: {
          declaredValue: '₹ 290.00',
          numericPrice: 290.00,
          currencySymbol: '₹',
          includesTaxesDeclaration: true,
          unitSalePriceMentioned: true,
          unitSalePrice: '₹ 58.00 / kg',
          confidence: 98,
          rawText: 'MAXIMUM RETAIL PRICE (MRP) ₹ 290.00 INCL. OF ALL TAXES | Unit Sale Price: ₹ 58.00 / kg',
        },
        dates: {
          mfgDateDeclared: true,
          mfgDate: '08/2026',
          expiryDateDeclared: true,
          bestBeforePeriod: 'Best before 4 months from packaging date',
          rawText: 'Date of Packaging: 08/2026 | BEST BEFORE 4 MONTHS FROM PACKAGING DATE',
        },
        consumerCare: {
          declared: true,
          contactPersonOrCell: 'Consumer Care Executive',
          phoneOrTollFree: '1800-202-9900',
          email: 'care@bharatorganics.in',
          postalAddress: 'Plot No. 44-B, Sector 7, Industrial Area, Indore, MP - 452010',
          rawText: 'Toll-Free Helpline: 1800-202-9900, Email: care@bharatorganics.in',
        },
        countryOfOrigin: {
          declared: true,
          country: 'India',
          rawText: 'COUNTRY OF ORIGIN: INDIA',
        },
        batchLotNo: {
          declared: true,
          code: 'BO-2608-A1',
          rawText: 'Batch / Lot No: BO-2608-A1',
        },
        certifications: {
          fssaiDeclared: true,
          fssaiNumber: '11422850000321',
          vegNonVegLogo: 'VEG',
        },
      },
      detectedLanguages: [
        {
          language: 'English',
          code: 'en',
          script: 'Latin',
          isPrimary: true,
          percentageConfidence: 65,
          sampleTextFound: 'SHARBATI WHOLE WHEAT ATTA, NET QUANTITY 5 kg',
        },
        {
          language: 'Hindi',
          code: 'hi',
          script: 'Devanagari',
          isPrimary: false,
          percentageConfidence: 35,
          sampleTextFound: 'शरबती संपूर्ण गेहूं का आटा, शुद्ध मात्रा, उपभोक्ता शिकायत',
        },
      ],
      layoutAnalysis: {
        pdpEstimatedPercentage: 42,
        pdpLocation: 'Front Panel',
        fontLegibilityScore: 95,
        contrastRatio: 'HIGH',
        backgroundInterference: 'NONE',
        lightingQuality: 'GOOD',
        pdpComplianceAssessment: 'Principal Display Panel exceeds minimum 40% frontal area; Net quantity font height is ~7mm, safely above the 6mm requirement for 5kg packages.',
      },
      boundingBoxes: [
        {
          id: 'box-commodity',
          label: 'Generic Commodity Name',
          tag: 'product_name',
          x: 16,
          y: 21,
          width: 68,
          height: 11,
          confidence: 99,
          textSnippet: 'SHARBATI WHOLE WHEAT ATTA / संपूर्ण गेहूं का आटा',
          readabilityScore: 96,
        },
        {
          id: 'box-netqty',
          label: 'Net Quantity',
          tag: 'net_quantity',
          x: 16,
          y: 34,
          width: 31,
          height: 10,
          confidence: 99,
          textSnippet: '5 kg (Metric compliant)',
          readabilityScore: 98,
        },
        {
          id: 'box-mrp',
          label: 'MRP & Unit Sale Price',
          tag: 'mrp',
          x: 51,
          y: 34,
          width: 33,
          height: 10,
          confidence: 98,
          textSnippet: '₹ 290.00 INCL. OF ALL TAXES | ₹ 58.00 / kg',
          readabilityScore: 97,
        },
        {
          id: 'box-dates',
          label: 'Packaging Date & Batch',
          tag: 'mfg_date',
          x: 16,
          y: 46,
          width: 68,
          height: 9,
          confidence: 96,
          textSnippet: 'Mfg: 08/2026, Lot: BO-2608-A1',
          readabilityScore: 94,
        },
        {
          id: 'box-packer',
          label: 'Manufacturer / Packer',
          tag: 'packer',
          x: 16,
          y: 58,
          width: 68,
          height: 14,
          confidence: 97,
          textSnippet: 'Bharat Organics Agro Foods Pvt. Ltd., Indore - 452010',
          readabilityScore: 93,
        },
        {
          id: 'box-consumer-care',
          label: 'Consumer Care Cell',
          tag: 'consumer_care',
          x: 16,
          y: 74,
          width: 68,
          height: 12,
          confidence: 98,
          textSnippet: '1800-202-9900, care@bharatorganics.in',
          readabilityScore: 95,
        },
      ],
      checks: [
        {
          ruleId: 'RULE_MANUFACTURER_PACKER',
          ruleName: 'Manufacturer / Packer / Importer Details',
          legalReference: 'Rule 6(1)(a) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'CRITICAL',
          extractedEvidence: 'Bharat Organics Agro Foods Pvt. Ltd., Plot No. 44-B, Sector 7, Industrial Area, Indore, MP - 452010',
          expectedRequirement: 'Full physical address of manufacturer/packer with state and PIN code.',
          findingsAndExplanation: 'Manufacturer name, specific industrial plot number, city, state, and valid 6-digit PIN code are fully declared.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(1)(a)',
        },
        {
          ruleId: 'RULE_GENERIC_COMMODITY_NAME',
          ruleName: 'Generic / Common Commodity Name',
          legalReference: 'Rule 6(1)(b) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'MAJOR',
          extractedEvidence: 'Sharbati Whole Wheat Atta / संपूर्ण गेहूं का आटा',
          expectedRequirement: 'Common/generic commodity name prominently displayed on Principal Display Panel.',
          findingsAndExplanation: 'Prominently declared in prominent display area in both English and Hindi.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(1)(b)',
        },
        {
          ruleId: 'RULE_NET_QUANTITY_STANDARD',
          ruleName: 'Net Quantity in Standard Metric Units',
          legalReference: 'Rule 6(1)(c) & Rule 12 - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'CRITICAL',
          extractedEvidence: '5 kg',
          expectedRequirement: 'Metric unit in standard symbol (kg), minimum 6mm font height for 5kg.',
          findingsAndExplanation: 'Font height is approximately 7.2mm, using standard symbol "kg" without invalid qualifiers.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 12',
        },
        {
          ruleId: 'RULE_MRP_DECLARATION',
          ruleName: 'MRP with "Inclusive of all taxes"',
          legalReference: 'Rule 6(1)(e) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'CRITICAL',
          extractedEvidence: '₹ 290.00 INCL. OF ALL TAXES',
          expectedRequirement: 'Explicit mention of "inclusive of all taxes" or "incl. of all taxes".',
          findingsAndExplanation: 'Both MRP symbol and tax declaration are explicitly legible in green high-contrast container.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(1)(e)',
        },
        {
          ruleId: 'RULE_UNIT_SALE_PRICE',
          ruleName: 'Unit Sale Price (USP)',
          legalReference: 'Rule 6(11) - LMPC Amendment 2021',
          status: 'PASS',
          severity: 'MAJOR',
          extractedEvidence: '₹ 58.00 / kg',
          expectedRequirement: 'Price per kg for packages exceeding 1 kg.',
          findingsAndExplanation: 'Properly calculated (290 / 5 = 58) and declared alongside MRP.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(11)',
        },
        {
          ruleId: 'RULE_MFG_PACK_DATE',
          ruleName: 'Month and Year of Manufacture / Packing',
          legalReference: 'Rule 6(1)(d) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'CRITICAL',
          extractedEvidence: 'Date of Packaging: 08/2026',
          expectedRequirement: 'Month and year of manufacture or packing clearly stated.',
          findingsAndExplanation: 'Month and year clearly identified.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(1)(d)',
        },
        {
          ruleId: 'RULE_EXPIRY_BEST_BEFORE',
          ruleName: 'Expiry Date / Best Before Period',
          legalReference: 'Rule 6(1)(d) & FSSAI Packaging Regulations',
          status: 'PASS',
          severity: 'CRITICAL',
          extractedEvidence: 'BEST BEFORE 4 MONTHS FROM PACKAGING DATE',
          expectedRequirement: 'Durability / Best before declaration for edible grain products.',
          findingsAndExplanation: 'Unambiguous shelf-life duration given.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with FSSAI & LMPC',
        },
        {
          ruleId: 'RULE_CONSUMER_CARE',
          ruleName: 'Consumer Care Cell Details',
          legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'MAJOR',
          extractedEvidence: 'Toll-Free Helpline: 1800-202-9900 | care@bharatorganics.in',
          expectedRequirement: 'Name, address, telephone number, and email address of consumer redressal cell.',
          findingsAndExplanation: 'Full quadruple declaration (address, telephone, toll-free, email) is present.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(1)(g)',
        },
        {
          ruleId: 'RULE_COUNTRY_OF_ORIGIN',
          ruleName: 'Country of Origin Declaration',
          legalReference: 'Rule 6(10) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'MAJOR',
          extractedEvidence: 'COUNTRY OF ORIGIN: INDIA',
          expectedRequirement: 'Declaration of the country where manufactured.',
          findingsAndExplanation: 'Distinctly printed in block letters.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 6(10)',
        },
        {
          ruleId: 'RULE_LANGUAGE_COMPLIANCE',
          ruleName: 'Official Language (Hindi / English)',
          legalReference: 'Rule 9 - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'MAJOR',
          extractedEvidence: 'English (Latin script) & Hindi (Devanagari script)',
          expectedRequirement: 'Declarations in Hindi in Devanagari script or English.',
          findingsAndExplanation: 'Bilingual representation satisfies statutory expectations with excellence.',
          remedialAction: 'None required.',
          penalProvision: 'Complies with Rule 9',
        },
      ],
    },
  },
  {
    id: 'sample-2',
    title: 'SunFresh Mango Fruit Beverage (200 ml)',
    category: 'FOOD_BEVERAGE',
    brand: 'SunFresh',
    description: 'Severely non-compliant FMCG juice pack: Non-standard unit "mls", MRP missing mandatory "inclusive of all taxes" text, and manufacturer missing postal PIN code.',
    expectedOutcome: 'NON_COMPLIANT',
    tags: ['Violations Found', 'Non-Standard Units', 'Missing Tax Text', 'No PIN Code'],
    imageUrl: createSvgDataUrl(SAMPLE_2_SVG),
    precomputedResult: {
      inspectionId: 'INSP-2026-0911-002',
      timestamp: '2026-09-11 10:28 IST',
      inspectorName: 'Legal Metrology Inspector (Div-I)',
      inspectionLocation: 'Wholesale Depot, Vapi',
      packageCategory: 'FOOD_BEVERAGE',
      imageFileName: 'sunfresh_mango_drink_200ml.jpg',
      imageUrl: createSvgDataUrl(SAMPLE_2_SVG),
      overallScore: 42,
      overallStatus: 'NON_COMPLIANT',
      summaryNotes: 'Multiple critical violations of Rule 6(1)(c), Rule 6(1)(e), and Rule 6(1)(a). Requires immediate issuance of statutory show-cause notice under Section 36(1) of Legal Metrology Act, 2009.',
      suggestedAction: 'ISSUE_NOTICE',
      extractedDeclarations: {
        productName: {
          value: 'SunFresh Mango Fruit Drink',
          genericName: 'Ready to Serve Fruit Beverage',
          confidence: 96,
          rawText: 'SUNFRESH BEVERAGES - MANGO FRUIT DRINK',
        },
        manufacturerPacker: {
          type: 'Manufacturer',
          name: 'SunFresh Agro Drinks Ltd.',
          fullAddress: 'GIDC Estate, Phase II, Vapi, Gujarat',
          confidence: 90,
          rawText: 'SunFresh Agro Drinks Ltd., GIDC Estate, Phase II, Vapi, Gujarat',
        },
        netQuantity: {
          declaredValue: '200 mls',
          numericAmount: 200,
          unit: 'mls',
          standardUnitCompliant: false,
          confidence: 98,
          rawText: 'NET QTY: 200 mls',
        },
        mrp: {
          declaredValue: 'Rs. 45/-',
          numericPrice: 45.00,
          currencySymbol: 'Rs.',
          includesTaxesDeclaration: false,
          unitSalePriceMentioned: false,
          confidence: 99,
          rawText: 'MRP: Rs. 45/-',
        },
        dates: {
          mfgDateDeclared: true,
          mfgDate: '06/2026',
          expiryDateDeclared: true,
          expiryDate: '12/2026',
          rawText: 'Mfg Date: 06/2026 | Use By: 12/2026',
        },
        consumerCare: {
          declared: true,
          phoneOrTollFree: '+91 98200 12345',
          rawText: 'Customer Helpline: +91 98200 12345',
        },
        countryOfOrigin: {
          declared: true,
          country: 'India',
          rawText: 'Made in India',
        },
        batchLotNo: {
          declared: true,
          code: 'SF-MAN-0922',
          rawText: 'Batch No: SF-MAN-0922',
        },
        certifications: {
          vegNonVegLogo: 'NOT_APPLICABLE',
        },
      },
      detectedLanguages: [
        {
          language: 'English',
          code: 'en',
          script: 'Latin',
          isPrimary: true,
          percentageConfidence: 100,
          sampleTextFound: 'SUNFRESH BEVERAGES, MANGO FRUIT DRINK, 200 mls',
        },
      ],
      layoutAnalysis: {
        pdpEstimatedPercentage: 35,
        pdpLocation: 'Front Panel',
        fontLegibilityScore: 78,
        contrastRatio: 'MEDIUM',
        backgroundInterference: 'NONE',
        lightingQuality: 'GOOD',
        pdpComplianceAssessment: 'Principal display panel layout is present, but critical declaration text formats violate statutory standards.',
      },
      boundingBoxes: [
        {
          id: 'box-s2-qty',
          label: 'Net Quantity (Non-Standard Unit)',
          tag: 'net_quantity',
          x: 17,
          y: 30,
          width: 31,
          height: 9,
          confidence: 98,
          textSnippet: '200 mls (VIOLATION)',
          readabilityScore: 92,
        },
        {
          id: 'box-s2-mrp',
          label: 'MRP (Missing Tax Declaration)',
          tag: 'mrp',
          x: 51,
          y: 30,
          width: 31,
          height: 9,
          confidence: 99,
          textSnippet: 'MRP: Rs. 45/- (VIOLATION)',
          readabilityScore: 94,
        },
        {
          id: 'box-s2-mfg',
          label: 'Manufacturer (Missing PIN Code)',
          tag: 'packer',
          x: 17,
          y: 54,
          width: 66,
          height: 12,
          confidence: 90,
          textSnippet: 'SunFresh Agro Drinks, Vapi (No PIN)',
          readabilityScore: 88,
        },
        {
          id: 'box-s2-care',
          label: 'Consumer Care (Missing Email)',
          tag: 'consumer_care',
          x: 17,
          y: 70,
          width: 66,
          height: 10,
          confidence: 92,
          textSnippet: '+91 98200 12345 (No email)',
          readabilityScore: 85,
        },
      ],
      checks: [
        {
          ruleId: 'RULE_NET_QUANTITY_STANDARD',
          ruleName: 'Net Quantity in Standard Metric Units',
          legalReference: 'Rule 6(1)(c) & Rule 12 - LMPC Rules, 2011',
          status: 'FAIL',
          severity: 'CRITICAL',
          extractedEvidence: '200 mls',
          expectedRequirement: 'Standard metric symbol "ml" or "mL" without pluralizing "s" or invalid suffixes.',
          findingsAndExplanation: 'Pack declares "200 mls". Pluralizing units with "s" is strictly prohibited under Rule 12 of LMPC Rules.',
          remedialAction: 'Repack or replace packaging plates to use standard metric symbol "ml".',
          penalProvision: 'Section 36(1) of Legal Metrology Act, 2009 (Fine up to ₹25,000 for first offence)',
        },
        {
          ruleId: 'RULE_MRP_DECLARATION',
          ruleName: 'MRP with "Inclusive of all taxes"',
          legalReference: 'Rule 6(1)(e) - LMPC Rules, 2011',
          status: 'FAIL',
          severity: 'CRITICAL',
          extractedEvidence: 'MRP: Rs. 45/-',
          expectedRequirement: 'Mandatory words "inclusive of all taxes" or "incl. of all taxes".',
          findingsAndExplanation: 'The words "inclusive of all taxes" or "incl. of all taxes" are completely missing from the price panel.',
          remedialAction: 'Immediately issue statutory notice to withdraw or affix compliant re-stickering where authorized.',
          penalProvision: 'Section 36(1) of Legal Metrology Act, 2009 (Penal non-compliance)',
        },
        {
          ruleId: 'RULE_MANUFACTURER_PACKER',
          ruleName: 'Manufacturer / Packer / Importer Details',
          legalReference: 'Rule 6(1)(a) - LMPC Rules, 2011',
          status: 'FAIL',
          severity: 'CRITICAL',
          extractedEvidence: 'SunFresh Agro Drinks Ltd., GIDC Estate, Phase II, Vapi, Gujarat',
          expectedRequirement: 'Complete postal address with 6-digit postal PIN code.',
          findingsAndExplanation: 'Address fails to specify the 6-digit postal PIN code, making manufacturer postal verification impossible.',
          remedialAction: 'Ensure full postal address including PIN code is printed on all commercial packages.',
          penalProvision: 'Rule 6(1)(a) violation under Legal Metrology Act',
        },
        {
          ruleId: 'RULE_CONSUMER_CARE',
          ruleName: 'Consumer Care Cell Details',
          legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
          status: 'NEEDS_REVIEW',
          severity: 'MAJOR',
          extractedEvidence: 'Customer Helpline: +91 98200 12345 (No email provided)',
          expectedRequirement: 'Must provide telephone/toll-free number AND email address.',
          findingsAndExplanation: 'Only a telephone number is declared; official consumer grievance email is missing.',
          remedialAction: 'Add consumer support email address.',
          penalProvision: 'Rule 6(1)(g) advisory',
        },
        {
          ruleId: 'RULE_MFG_PACK_DATE',
          ruleName: 'Month and Year of Manufacture / Packing',
          legalReference: 'Rule 6(1)(d) - LMPC Rules, 2011',
          status: 'PASS',
          severity: 'CRITICAL',
          extractedEvidence: 'Mfg Date: 06/2026',
          expectedRequirement: 'Month and year of manufacture or packaging.',
          findingsAndExplanation: 'Properly declared.',
          remedialAction: 'None',
          penalProvision: 'Complies with Rule 6(1)(d)',
        },
      ],
    },
  },
  {
    id: 'sample-3',
    title: 'Nordic Glitz Cocoa Wafer Bar (75 g)',
    category: 'IMPORTED_GOODS',
    brand: 'Nordic Glitz',
    description: 'Imported confectionery packaged product missing mandatory "Country of Origin" declaration under Rule 6(10) and lacking telephone helpline in consumer grievance cell.',
    expectedOutcome: 'NON_COMPLIANT',
    tags: ['Imported Goods', 'Missing Country of Origin', 'Incomplete Importer Cell'],
    imageUrl: createSvgDataUrl(SAMPLE_3_SVG),
    precomputedResult: {
      inspectionId: 'INSP-2026-0911-003',
      timestamp: '2026-09-11 10:45 IST',
      inspectorName: 'Legal Metrology Inspector (Div-I)',
      inspectionLocation: 'Air Cargo Complex, Mumbai',
      packageCategory: 'IMPORTED_GOODS',
      imageFileName: 'nordic_glitz_wafer_75g.jpg',
      imageUrl: createSvgDataUrl(SAMPLE_3_SVG),
      overallScore: 56,
      overallStatus: 'NON_COMPLIANT',
      summaryNotes: 'Imported packaged commodity lacks the mandatory "Country of Origin" declaration required under Rule 6(10). Importer details require review.',
      suggestedAction: 'ISSUE_NOTICE',
      extractedDeclarations: {
        productName: {
          value: 'Crispy Cocoa Wafer Bar',
          genericName: 'Wafer Confectionery',
          confidence: 95,
          rawText: 'NORDIC GLITZ - CRISPY COCOA WAFER BAR',
        },
        manufacturerPacker: {
          type: 'Importer',
          name: 'Global Gourmet Impex LLP',
          fullAddress: 'Andheri East, Mumbai - 400069',
          pinCode: '400069',
          confidence: 93,
          rawText: 'IMPORTED & MARKETED IN INDIA BY: Global Gourmet Impex LLP, Andheri East, Mumbai - 400069',
        },
        netQuantity: {
          declaredValue: '75 g',
          numericAmount: 75,
          unit: 'g',
          standardUnitCompliant: true,
          confidence: 98,
          rawText: 'Net Weight: 75 g',
        },
        mrp: {
          declaredValue: '₹ 120.00',
          numericPrice: 120.00,
          currencySymbol: '₹',
          includesTaxesDeclaration: true,
          unitSalePriceMentioned: false,
          confidence: 97,
          rawText: 'MRP (incl. of all taxes): ₹ 120.00',
        },
        dates: {
          mfgDateDeclared: true,
          mfgDate: '05/2026',
          expiryDateDeclared: true,
          bestBeforePeriod: 'Best Before: 12 months from date',
          rawText: 'Packed Date: 05/2026 | Best Before: 12 months from date',
        },
        consumerCare: {
          declared: true,
          email: 'customercare@globalgourmet.co.in',
          rawText: 'customercare@globalgourmet.co.in (No phone number)',
        },
        countryOfOrigin: {
          declared: false,
          rawText: 'NOT DECLARED',
        },
        batchLotNo: {
          declared: true,
          code: 'NG-EUR-88319',
          rawText: 'Lot: NG-EUR-88319',
        },
        certifications: {
          fssaiDeclared: true,
          fssaiNumber: '10018022007890',
        },
      },
      detectedLanguages: [
        {
          language: 'English',
          code: 'en',
          script: 'Latin',
          isPrimary: true,
          percentageConfidence: 100,
          sampleTextFound: 'NORDIC GLITZ, CRISPY COCOA WAFER BAR',
        },
      ],
      layoutAnalysis: {
        pdpEstimatedPercentage: 38,
        pdpLocation: 'Front Panel',
        fontLegibilityScore: 88,
        contrastRatio: 'HIGH',
        backgroundInterference: 'NONE',
        lightingQuality: 'GOOD',
        pdpComplianceAssessment: 'Layout is clean and readable, but the mandatory country of origin declaration is entirely missing.',
      },
      boundingBoxes: [
        {
          id: 'box-s3-origin',
          label: 'Country of Origin (MISSING)',
          tag: 'origin',
          x: 17,
          y: 47,
          width: 66,
          height: 10,
          confidence: 97,
          textSnippet: 'MISSING: Country of Origin',
          readabilityScore: 0,
        },
        {
          id: 'box-s3-importer',
          label: 'Importer & Consumer Care',
          tag: 'packer',
          x: 17,
          y: 60,
          width: 66,
          height: 12,
          confidence: 93,
          textSnippet: 'Global Gourmet Impex LLP, Mumbai - 400069',
          readabilityScore: 89,
        },
      ],
      checks: [
        {
          ruleId: 'RULE_COUNTRY_OF_ORIGIN',
          ruleName: 'Country of Origin Declaration',
          legalReference: 'Rule 6(10) - LMPC Rules, 2011',
          status: 'FAIL',
          severity: 'CRITICAL',
          extractedEvidence: 'Not found on package label',
          expectedRequirement: 'Every imported package shall prominently declare the country of origin/manufacture.',
          findingsAndExplanation: 'The package originates outside India but fails to declare the Country of Origin anywhere on the display panels.',
          remedialAction: 'Issuance of customs detention notice or mandatory over-stickering under Rule 6(10).',
          penalProvision: 'Rule 6(10) punishable under Section 36 of Legal Metrology Act',
        },
        {
          ruleId: 'RULE_CONSUMER_CARE',
          ruleName: 'Consumer Care Cell Details',
          legalReference: 'Rule 6(1)(g) - LMPC Rules, 2011',
          status: 'NEEDS_REVIEW',
          severity: 'MAJOR',
          extractedEvidence: 'customercare@globalgourmet.co.in (Telephone missing)',
          expectedRequirement: 'Must contain both telephone number and email address.',
          findingsAndExplanation: 'Only email provided; lacks telephone helpline contact.',
          remedialAction: 'Add phone/toll-free contact number.',
          penalProvision: 'Rule 6(1)(g)',
        },
      ],
    },
  },
  {
    id: 'sample-4',
    title: 'AyurGlow Herbal Skin Cleanser (100 ml)',
    category: 'COSMETICS',
    brand: 'AyurGlow',
    description: 'Cosmetic bottle with partially compliant declarations; Net volume and MRP font sizes are borderline/below the 2mm minimum requirement for PDP under 200ml.',
    expectedOutcome: 'PARTIALLY_COMPLIANT',
    tags: ['Cosmetic Item', 'Borderline Font Size', 'Needs Readability Review'],
    imageUrl: createSvgDataUrl(SAMPLE_4_SVG),
    precomputedResult: {
      inspectionId: 'INSP-2026-0911-004',
      timestamp: '2026-09-11 11:02 IST',
      inspectorName: 'Legal Metrology Inspector (Div-I)',
      inspectionLocation: 'Retail Mall, Ahmedabad',
      packageCategory: 'COSMETICS',
      imageFileName: 'ayurglow_cleanser_100ml.jpg',
      imageUrl: createSvgDataUrl(SAMPLE_4_SVG),
      overallScore: 74,
      overallStatus: 'PARTIALLY_COMPLIANT',
      summaryNotes: 'All mandatory fields exist, but Principal Display Panel declaration font sizes appear below the statutory 2.0 mm threshold for 100ml containers.',
      suggestedAction: 'PHYSICAL_INSPECTION_REQUIRED',
      extractedDeclarations: {
        productName: {
          value: 'Herbal Radiant Skin Cleanser',
          genericName: 'Facial Cleanser / Face Wash',
          confidence: 97,
          rawText: 'AYURGLOW BOTANICS - HERBAL RADIANT SKIN CLEANSER',
        },
        manufacturerPacker: {
          type: 'Manufacturer',
          name: 'AyurGlow Wellness Herbals Ltd.',
          fullAddress: 'Survey 128, Kadi-Kalol Highway, Mehsana, Gujarat - 382715',
          pinCode: '382715',
          confidence: 95,
          rawText: 'AyurGlow Wellness Herbals Ltd., Mehsana, Gujarat - 382715',
        },
        netQuantity: {
          declaredValue: '100 ml',
          numericAmount: 100,
          unit: 'ml',
          standardUnitCompliant: true,
          confidence: 94,
          rawText: 'Net Vol: 100 ml (Font ~1.3mm)',
        },
        mrp: {
          declaredValue: '₹ 175.00',
          numericPrice: 175.00,
          currencySymbol: '₹',
          includesTaxesDeclaration: true,
          confidence: 94,
          rawText: 'MRP incl. of taxes: ₹ 175.00',
        },
        dates: {
          mfgDateDeclared: true,
          mfgDate: '07/2026',
          expiryDateDeclared: true,
          bestBeforePeriod: 'Use Before 24 months',
          rawText: 'Mfg Dt: 07/2026 | Use Before 24 months',
        },
        consumerCare: {
          declared: true,
          phoneOrTollFree: '1800-889-1122',
          email: 'support@ayurglow.in',
          rawText: 'Toll Free: 1800-889-1122 | support@ayurglow.in',
        },
        countryOfOrigin: {
          declared: true,
          country: 'India',
          rawText: 'Country of Origin: India',
        },
        batchLotNo: {
          declared: true,
          code: 'AG-2607-B9',
          rawText: 'Batch No: AG-2607-B9',
        },
        certifications: {
          vegNonVegLogo: 'NOT_APPLICABLE',
        },
      },
      detectedLanguages: [
        {
          language: 'English',
          code: 'en',
          script: 'Latin',
          isPrimary: true,
          percentageConfidence: 100,
          sampleTextFound: 'AYURGLOW BOTANICS, HERBAL RADIANT SKIN CLEANSER',
        },
      ],
      layoutAnalysis: {
        pdpEstimatedPercentage: 30,
        pdpLocation: 'Front Panel',
        fontLegibilityScore: 68,
        contrastRatio: 'MEDIUM',
        backgroundInterference: 'NONE',
        lightingQuality: 'GOOD',
        pdpComplianceAssessment: 'Font height of net quantity and price is estimated at ~1.3mm to 1.5mm, which is below the mandatory 2.0mm threshold prescribed in Table 1 of Rule 12 for packages 50ml - 200ml.',
      },
      boundingBoxes: [
        {
          id: 'box-s4-font',
          label: 'Net Qty & MRP (Sub-Standard Font Size)',
          tag: 'net_quantity',
          x: 20,
          y: 29,
          width: 60,
          height: 7,
          confidence: 94,
          textSnippet: '100 ml & ₹ 175.00 (Font < 2mm)',
          readabilityScore: 68,
        },
      ],
      checks: [
        {
          ruleId: 'RULE_PDP_PROMINENCE_CONTRAST',
          ruleName: 'Principal Display Panel (PDP) & Font Legibility',
          legalReference: 'Rule 6, 7 & 8 - LMPC Rules, 2011',
          status: 'NEEDS_REVIEW',
          severity: 'MAJOR',
          extractedEvidence: 'Estimated numeral height ~1.4mm on 100ml container',
          expectedRequirement: 'Minimum height of numeral for 50ml-200ml package is 2.0 mm (Rule 12 Table 1).',
          findingsAndExplanation: 'The numerals for net volume and price are visibly compact and borderline/below 2.0mm. Needs physical verification with a micrometer or calibration gauge.',
          remedialAction: 'Inspector to verify using physical optical gauge at station.',
          penalProvision: 'Rule 12 & Rule 7 advisory under Legal Metrology Act',
        },
      ],
    },
  },
];
