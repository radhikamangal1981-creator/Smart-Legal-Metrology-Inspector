import { InspectionAuditResult, MandatoryRuleConfig, ComplianceCheckResult, ComplianceStatus } from '../types/inspection';

export function reevaluateAuditWithRules(
  currentResult: InspectionAuditResult,
  activeRules: MandatoryRuleConfig[]
): InspectionAuditResult {
  const activeRuleMap = new Map(activeRules.filter((r) => r.required).map((r) => [r.id, r]));

  // Keep existing checks that are still active, or compute fallback for active rules
  const updatedChecks: ComplianceCheckResult[] = currentResult.checks.map((check) => {
    const isActive = activeRuleMap.has(check.ruleId);
    return {
      ...check,
      // If rule is inactive, we could either filter it or keep it as reviewed
    };
  }).filter((c) => activeRuleMap.has(c.ruleId));

  // Compute updated score
  const total = updatedChecks.length;
  if (total === 0) {
    return {
      ...currentResult,
      checks: updatedChecks,
      overallScore: 100,
      overallStatus: 'COMPLIANT',
      suggestedAction: 'APPROVE',
    };
  }

  const passCount = updatedChecks.filter((c) => c.status === 'PASS').length;
  const failCount = updatedChecks.filter((c) => c.status === 'FAIL').length;
  const criticalFails = updatedChecks.filter((c) => c.status === 'FAIL' && c.severity === 'CRITICAL').length;

  const calculatedScore = Math.round((passCount / total) * 100);

  let overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' = 'COMPLIANT';
  let suggestedAction: 'APPROVE' | 'ISSUE_NOTICE' | 'CONFISCATE_SAMPLE' | 'PHYSICAL_INSPECTION_REQUIRED' = 'APPROVE';

  if (criticalFails > 0 || failCount >= 2) {
    overallStatus = 'NON_COMPLIANT';
    suggestedAction = 'ISSUE_NOTICE';
  } else if (failCount === 1 || updatedChecks.some((c) => c.status === 'NEEDS_REVIEW')) {
    overallStatus = 'PARTIALLY_COMPLIANT';
    suggestedAction = 'PHYSICAL_INSPECTION_REQUIRED';
  }

  return {
    ...currentResult,
    checks: updatedChecks,
    overallScore: calculatedScore,
    overallStatus,
    suggestedAction,
  };
}
