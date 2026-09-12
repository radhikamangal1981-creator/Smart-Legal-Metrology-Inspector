export type ComplianceStatus = 'PASS' | 'FAIL' | 'NEEDS_REVIEW';

export type SeverityLevel = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

export type PackageCategory = 'FOOD_BEVERAGE' | 'COSMETICS' | 'GENERAL_FMCG' | 'ELECTRONICS' | 'IMPORTED_GOODS';

export type FieldReadability = 'Clear' | 'Difficult' | 'Unreadable';
export type FieldPresenceStatus = 'Present' | 'Missing' | 'Unclear';

export interface DetectedDeclarationField {
  id: string;
  fieldName: string;
  tag: BoundingBox['tag'];
  extractedValue: string;
  confidence: number; // percentage 0 - 100
  location: string; // e.g. "Front panel", "Back panel", "Side panel"
  boundingBoxCoords?: { x: number; y: number; width: number; height: number };
  readability: FieldReadability;
  status: FieldPresenceStatus;
  rawText?: string;
  legalRuleId?: string;
}

export interface BoundingBox {
  id: string;
  label: string;
  tag: 'product_name' | 'mrp' | 'net_quantity' | 'mfg_date' | 'exp_date' | 'packer' | 'consumer_care' | 'origin' | 'batch' | 'fssai_bis' | 'other';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
  confidence: number;
  textSnippet: string;
  readabilityScore: number; // 0 - 100
}

export interface ExtractedDeclarations {
  productName: {
    value: string;
    genericName?: string;
    confidence: number;
    rawText: string;
  };
  manufacturerPacker: {
    type: 'Manufacturer' | 'Packer' | 'Importer' | 'Marketed By' | 'Multiple';
    name: string;
    fullAddress: string;
    pinCode?: string;
    confidence: number;
    rawText: string;
  };
  netQuantity: {
    declaredValue: string;
    numericAmount?: number;
    unit?: string;
    standardUnitCompliant: boolean;
    confidence: number;
    rawText: string;
  };
  mrp: {
    declaredValue: string;
    numericPrice?: number;
    currencySymbol: string;
    includesTaxesDeclaration: boolean;
    unitSalePriceMentioned?: boolean;
    unitSalePrice?: string;
    confidence: number;
    rawText: string;
  };
  dates: {
    mfgDateDeclared: boolean;
    mfgDate?: string;
    expiryDateDeclared: boolean;
    expiryDate?: string;
    bestBeforePeriod?: string;
    rawText: string;
  };
  consumerCare: {
    declared: boolean;
    contactPersonOrCell?: string;
    phoneOrTollFree?: string;
    email?: string;
    postalAddress?: string;
    rawText: string;
  };
  countryOfOrigin: {
    declared: boolean;
    country?: string;
    rawText: string;
  };
  batchLotNo: {
    declared: boolean;
    code?: string;
    rawText: string;
  };
  certifications: {
    fssaiDeclared?: boolean;
    fssaiNumber?: string;
    isiBisDeclared?: boolean;
    vegNonVegLogo?: 'VEG' | 'NON_VEG' | 'NOT_APPLICABLE' | 'MISSING';
  };
}

export interface LanguageDetection {
  language: string;
  code: string;
  script: string;
  isPrimary: boolean;
  percentageConfidence: number;
  sampleTextFound: string;
}

export interface LayoutAnalysis {
  pdpEstimatedPercentage: number;
  pdpLocation: 'Front Panel' | 'Back Panel' | 'Side Panel' | 'Multi-Surface';
  fontLegibilityScore: number; // 0 - 100
  contrastRatio: 'HIGH' | 'MEDIUM' | 'POOR';
  backgroundInterference: 'NONE' | 'SLIGHT_GRAPHICS' | 'SEVERE_CLUTTER';
  lightingQuality: 'GOOD' | 'UNEVEN_SHADOWS' | 'GLARE_PRESENT';
  pdpComplianceAssessment: string;
}

export interface ComplianceCheckResult {
  ruleId: string;
  ruleName: string;
  legalReference: string; // e.g. "Rule 6(1)(a) Legal Metrology (Packaged Commodities) Rules, 2011"
  status: ComplianceStatus;
  severity: SeverityLevel;
  extractedEvidence: string;
  expectedRequirement: string;
  findingsAndExplanation: string;
  remedialAction: string;
  penalProvision: string; // e.g. "Section 36(1) of Legal Metrology Act, 2009"
}

export interface MandatoryRuleConfig {
  id: string;
  name: string;
  legalRef: string;
  required: boolean;
  applicableCategories: PackageCategory[];
  severity: SeverityLevel;
  description: string;
}

export interface InspectionAuditResult {
  inspectionId: string;
  timestamp: string;
  inspectorName: string;
  inspectionLocation: string;
  packageCategory: PackageCategory;
  imageFileName: string;
  imageUrl: string;
  overallScore: number; // 0 - 100
  overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT';
  extractedDeclarations: ExtractedDeclarations;
  detectedFields?: DetectedDeclarationField[];
  detectedLanguages: LanguageDetection[];
  layoutAnalysis: LayoutAnalysis;
  boundingBoxes: BoundingBox[];
  checks: ComplianceCheckResult[];
  summaryNotes: string;
  suggestedAction: 'APPROVE' | 'ISSUE_NOTICE' | 'CONFISCATE_SAMPLE' | 'PHYSICAL_INSPECTION_REQUIRED';
}

export interface SamplePackageItem {
  id: string;
  title: string;
  category: PackageCategory;
  brand: string;
  description: string;
  expectedOutcome: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT';
  tags: string[];
  imageUrl: string;
  precomputedResult: InspectionAuditResult;
}
