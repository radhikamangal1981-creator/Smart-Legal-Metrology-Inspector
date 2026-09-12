import {
  InspectionAuditResult,
  DetectedDeclarationField,
  BoundingBox,
  FieldReadability,
  FieldPresenceStatus,
} from '../types/inspection';

/**
 * Derives or extracts standardized declaration fields from an audit result.
 * Ensures every detected field has:
 * - Field name
 * - Extracted value
 * - Confidence
 * - Bounding box/location (e.g. "Front panel", "Back panel")
 * - Readability: Clear / Difficult / Unreadable
 * - Status: Present / Missing / Unclear
 */
export function deriveDetectedFields(result: InspectionAuditResult): DetectedDeclarationField[] {
  if (result.detectedFields && result.detectedFields.length > 0) {
    return result.detectedFields;
  }

  const { extractedDeclarations, boundingBoxes, layoutAnalysis } = result;

  // Helper to find corresponding bounding box by tag
  const findBox = (tag: BoundingBox['tag']): BoundingBox | undefined => {
    return boundingBoxes.find((b) => b.tag === tag);
  };

  const getReadability = (score?: number, isDeclared?: boolean): FieldReadability => {
    if (!isDeclared) return 'Unreadable';
    if (score === undefined) {
      return layoutAnalysis.fontLegibilityScore >= 70 ? 'Clear' : 'Difficult';
    }
    if (score >= 70) return 'Clear';
    if (score >= 40) return 'Difficult';
    return 'Unreadable';
  };

  const getLocationDesc = (box?: BoundingBox, fallback = 'Front panel'): string => {
    if (!box) return fallback;
    const yPos = box.y < 35 ? 'Top' : box.y < 65 ? 'Center' : 'Bottom';
    const xPos = box.x < 35 ? 'Left' : box.x < 65 ? 'Center' : 'Right';
    
    // Panel classification
    let panel = 'Front panel';
    if (box.tag === 'packer' || box.tag === 'consumer_care') {
      panel = 'Back/side panel';
    } else if (box.tag === 'mfg_date' || box.tag === 'exp_date' || box.tag === 'batch') {
      panel = box.y > 60 ? 'Back panel' : 'Front panel';
    }

    return `${panel} (${yPos}-${xPos})`;
  };

  const fields: DetectedDeclarationField[] = [];

  // 1. Generic Commodity Name
  const nameBox = findBox('product_name');
  const nameVal = extractedDeclarations.productName?.value || extractedDeclarations.productName?.genericName || '';
  const isNamePresent = !!nameVal && nameVal.trim() !== '';
  fields.push({
    id: 'field_generic_name',
    fieldName: 'Generic Commodity Name',
    tag: 'product_name',
    extractedValue: isNamePresent ? nameVal : 'Not Detected',
    confidence: extractedDeclarations.productName?.confidence || (nameBox ? nameBox.confidence : 98),
    location: getLocationDesc(nameBox, 'Front panel (Upper Center)'),
    boundingBoxCoords: nameBox ? { x: nameBox.x, y: nameBox.y, width: nameBox.width, height: nameBox.height } : undefined,
    readability: getReadability(nameBox?.readabilityScore, isNamePresent),
    status: isNamePresent ? 'Present' : 'Missing',
    rawText: extractedDeclarations.productName?.rawText,
    legalRuleId: 'RULE_6_1_B_COMMODITY_NAME',
  });

  // 2. Net Quantity
  const qtyBox = findBox('net_quantity');
  const qtyVal = extractedDeclarations.netQuantity?.declaredValue || '';
  const isQtyPresent = !!qtyVal && qtyVal.trim() !== '';
  const qtyStatus: FieldPresenceStatus = isQtyPresent
    ? extractedDeclarations.netQuantity?.standardUnitCompliant === false
      ? 'Unclear'
      : 'Present'
    : 'Missing';

  fields.push({
    id: 'field_net_qty',
    fieldName: 'Net Quantity',
    tag: 'net_quantity',
    extractedValue: isQtyPresent ? qtyVal : 'Not Detected',
    confidence: extractedDeclarations.netQuantity?.confidence || (qtyBox ? qtyBox.confidence : 98),
    location: getLocationDesc(qtyBox, 'Front panel (Lower Center)'),
    boundingBoxCoords: qtyBox ? { x: qtyBox.x, y: qtyBox.y, width: qtyBox.width, height: qtyBox.height } : undefined,
    readability: getReadability(qtyBox?.readabilityScore, isQtyPresent),
    status: qtyStatus,
    rawText: extractedDeclarations.netQuantity?.rawText,
    legalRuleId: 'RULE_6_1_C_NET_QUANTITY',
  });

  // 3. Maximum Retail Price (MRP)
  const mrpBox = findBox('mrp');
  const mrpVal = extractedDeclarations.mrp?.declaredValue || '';
  const isMrpPresent = !!mrpVal && mrpVal.trim() !== '';
  const mrpStatus: FieldPresenceStatus = isMrpPresent
    ? extractedDeclarations.mrp?.includesTaxesDeclaration === false
      ? 'Unclear'
      : 'Present'
    : 'Missing';

  fields.push({
    id: 'field_mrp',
    fieldName: 'Maximum Retail Price (MRP)',
    tag: 'mrp',
    extractedValue: isMrpPresent ? mrpVal : 'Not Detected',
    confidence: extractedDeclarations.mrp?.confidence || (mrpBox ? mrpBox.confidence : 95),
    location: getLocationDesc(mrpBox, 'Front panel (Right)'),
    boundingBoxCoords: mrpBox ? { x: mrpBox.x, y: mrpBox.y, width: mrpBox.width, height: mrpBox.height } : undefined,
    readability: getReadability(mrpBox?.readabilityScore, isMrpPresent),
    status: mrpStatus,
    rawText: extractedDeclarations.mrp?.rawText,
    legalRuleId: 'RULE_6_1_E_MRP_DECLARATION',
  });

  // 4. Manufacturer / Packer / Importer
  const packerBox = findBox('packer');
  const packerName = extractedDeclarations.manufacturerPacker?.name || '';
  const packerAddr = extractedDeclarations.manufacturerPacker?.fullAddress || '';
  const isPackerPresent = !!packerName && packerName.trim() !== '';
  const packerText = isPackerPresent
    ? packerAddr
      ? `${packerName}, ${packerAddr}`
      : packerName
    : 'Not Detected';
  const packerStatus: FieldPresenceStatus = isPackerPresent
    ? !extractedDeclarations.manufacturerPacker?.pinCode
      ? 'Unclear'
      : 'Present'
    : 'Missing';

  fields.push({
    id: 'field_packer',
    fieldName: 'Manufacturer / Packer / Importer',
    tag: 'packer',
    extractedValue: packerText,
    confidence: extractedDeclarations.manufacturerPacker?.confidence || (packerBox ? packerBox.confidence : 97),
    location: getLocationDesc(packerBox, 'Back/side panel'),
    boundingBoxCoords: packerBox ? { x: packerBox.x, y: packerBox.y, width: packerBox.width, height: packerBox.height } : undefined,
    readability: getReadability(packerBox?.readabilityScore, isPackerPresent),
    status: packerStatus,
    rawText: extractedDeclarations.manufacturerPacker?.rawText,
    legalRuleId: 'RULE_6_1_A_NAME_ADDRESS',
  });

  // 5. Consumer Care Details
  const careBox = findBox('consumer_care');
  const careDeclared = extractedDeclarations.consumerCare?.declared;
  const careParts: string[] = [];
  if (extractedDeclarations.consumerCare?.phoneOrTollFree) careParts.push(extractedDeclarations.consumerCare.phoneOrTollFree);
  if (extractedDeclarations.consumerCare?.email) careParts.push(extractedDeclarations.consumerCare.email);
  if (extractedDeclarations.consumerCare?.contactPersonOrCell) careParts.push(extractedDeclarations.consumerCare.contactPersonOrCell);
  const careVal = careParts.length > 0 ? careParts.join(' | ') : (careDeclared ? 'Executive Cell Declared' : 'Not Detected');
  const isCarePresent = !!careDeclared || careParts.length > 0;

  fields.push({
    id: 'field_consumer_care',
    fieldName: 'Consumer Care Details',
    tag: 'consumer_care',
    extractedValue: isCarePresent ? careVal : 'Not Detected',
    confidence: isCarePresent ? (careBox ? careBox.confidence : 98) : 0,
    location: getLocationDesc(careBox, 'Back panel (Bottom)'),
    boundingBoxCoords: careBox ? { x: careBox.x, y: careBox.y, width: careBox.width, height: careBox.height } : undefined,
    readability: getReadability(careBox?.readabilityScore, isCarePresent),
    status: isCarePresent ? 'Present' : 'Missing',
    rawText: extractedDeclarations.consumerCare?.rawText,
    legalRuleId: 'RULE_6_1_G_CONSUMER_CARE',
  });

  // 6. Date of Manufacture / Packaging
  const mfgBox = findBox('mfg_date');
  const mfgVal = extractedDeclarations.dates?.mfgDate || (extractedDeclarations.dates?.mfgDateDeclared ? 'Declared' : '');
  const isMfgPresent = !!mfgVal;

  fields.push({
    id: 'field_mfg_date',
    fieldName: 'Date of Manufacture / Packaging',
    tag: 'mfg_date',
    extractedValue: isMfgPresent ? mfgVal : 'Not Detected',
    confidence: isMfgPresent ? (mfgBox ? mfgBox.confidence : 96) : 0,
    location: getLocationDesc(mfgBox, 'Back/side panel'),
    boundingBoxCoords: mfgBox ? { x: mfgBox.x, y: mfgBox.y, width: mfgBox.width, height: mfgBox.height } : undefined,
    readability: getReadability(mfgBox?.readabilityScore, isMfgPresent),
    status: isMfgPresent ? 'Present' : 'Missing',
    rawText: extractedDeclarations.dates?.rawText,
    legalRuleId: 'RULE_6_1_D_MONTH_YEAR_MFG',
  });

  // 7. Date of Expiry / Best Before
  const expBox = findBox('exp_date');
  const expVal = extractedDeclarations.dates?.expiryDate || extractedDeclarations.dates?.bestBeforePeriod || (extractedDeclarations.dates?.expiryDateDeclared ? 'Declared' : '');
  const isExpPresent = !!expVal;

  fields.push({
    id: 'field_exp_date',
    fieldName: 'Date of Expiry / Best Before',
    tag: 'exp_date',
    extractedValue: isExpPresent ? expVal : 'Not Declared',
    confidence: isExpPresent ? (expBox ? expBox.confidence : 95) : 0,
    location: getLocationDesc(expBox, 'Back panel'),
    boundingBoxCoords: expBox ? { x: expBox.x, y: expBox.y, width: expBox.width, height: expBox.height } : undefined,
    readability: getReadability(expBox?.readabilityScore, isExpPresent),
    status: isExpPresent ? 'Present' : 'Missing',
    rawText: extractedDeclarations.dates?.rawText,
    legalRuleId: 'RULE_6_1_D_BEST_BEFORE',
  });

  // 8. Batch / Lot Number
  const batchBox = findBox('batch');
  const batchVal = extractedDeclarations.batchLotNo?.code || (extractedDeclarations.batchLotNo?.declared ? 'Declared' : '');
  const isBatchPresent = !!batchVal;

  fields.push({
    id: 'field_batch_no',
    fieldName: 'Batch / Lot Number',
    tag: 'batch',
    extractedValue: isBatchPresent ? batchVal : 'Not Detected',
    confidence: isBatchPresent ? (batchBox ? batchBox.confidence : 94) : 0,
    location: getLocationDesc(batchBox, 'Back panel'),
    boundingBoxCoords: batchBox ? { x: batchBox.x, y: batchBox.y, width: batchBox.width, height: batchBox.height } : undefined,
    readability: getReadability(batchBox?.readabilityScore, isBatchPresent),
    status: isBatchPresent ? 'Present' : 'Missing',
    rawText: extractedDeclarations.batchLotNo?.rawText,
    legalRuleId: 'RULE_6_1_E_BATCH_CODE',
  });

  // 9. Country of Origin
  const originBox = findBox('origin');
  const originVal = extractedDeclarations.countryOfOrigin?.country || (extractedDeclarations.countryOfOrigin?.declared ? 'Declared' : '');
  const isOriginPresent = !!originVal;

  fields.push({
    id: 'field_country_origin',
    fieldName: 'Country of Origin',
    tag: 'origin',
    extractedValue: isOriginPresent ? originVal : 'Not Declared',
    confidence: isOriginPresent ? (originBox ? originBox.confidence : 96) : 0,
    location: getLocationDesc(originBox, 'Back/side panel'),
    boundingBoxCoords: originBox ? { x: originBox.x, y: originBox.y, width: originBox.width, height: originBox.height } : undefined,
    readability: getReadability(originBox?.readabilityScore, isOriginPresent),
    status: isOriginPresent ? 'Present' : 'Missing',
    rawText: extractedDeclarations.countryOfOrigin?.rawText,
    legalRuleId: 'RULE_6_10_COUNTRY_OF_ORIGIN',
  });

  return fields;
}
