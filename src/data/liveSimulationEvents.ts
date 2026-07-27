import { sectors } from './ministryData';
import type { Alert, NotificationRecord, Post, SectorId, Severity } from '../types';

type Template = {
  key: string;
  title: string;
  messageAr: string;
  source: NonNullable<Post['sourceType']>;
  primarySector: Exclude<SectorId, 'admin' | 'multi-sector'>;
  supportingSectors: SectorId[];
  severity: Severity;
  confidence: number;
  category: string;
  recommendedAction: string;
  entities: string[];
  preview?: string;
};

export type GeneratedSimulationEvent = {
  finding: Alert;
  notification: NotificationRecord;
  signature: string;
};

const templates: Template[] = [
  { key: 'dark-prison-inmate', title: 'Simulated inmate information claim', messageAr: 'حدث استخباراتي تجريبي: رصد ادعاء غير مؤكد حول معلومات نزلاء ويتطلب مراجعة قطاع السجون.', source: 'Dark Web', primarySector: 'prisons', supportingSectors: [], severity: 'Critical', confidence: 84, category: 'Inmate Information Claim', recommendedAction: 'Verify the sample claim, keep previews masked, and document the analyst decision.', entities: ['Prisons', 'Inmate information', 'Masked sample'], preview: 'Inmate reference: SIM-******' },
  { key: 'paste-public-security-creds', title: 'Simulated public security credential exposure', messageAr: 'حدث استخباراتي تجريبي: رصد قائمة اعتماد مزعومة مرتبطة بالأمن العام وتحتاج تحقق بشري.', source: 'Paste Site', primarySector: 'public-security', supportingSectors: [], severity: 'High', confidence: 79, category: 'Credential Exposure', recommendedAction: 'Check whether the credential pattern matches mock users and rotate only if validated in the prototype workflow.', entities: ['Public Security', 'Credential pattern', 'Paste sample'], preview: 'u***@example.gov.sa' },
  { key: 'vuln-civil-defense', title: 'Simulated Civil Defense asset vulnerability mention', messageAr: 'حدث استخباراتي تجريبي: مؤشر ثغرة محتملة يخص أصل تقني للدفاع المدني.', source: 'Vulnerability Intelligence', primarySector: 'civil-defense', supportingSectors: [], severity: 'High', confidence: 82, category: 'Vulnerability Intelligence', recommendedAction: 'Compare the affected product/version with registered Civil Defense mock assets and record remediation status.', entities: ['Civil Defense', 'Incident GIS Portal', 'Version match'] },
  { key: 'social-facility-image', title: 'Simulated suspicious facility image', messageAr: 'حدث استخباراتي تجريبي: صورة عامة قد تتضمن سياق منشأة وتحتاج مراجعة بصرية آمنة.', source: 'Social Media', primarySector: 'civil-defense', supportingSectors: ['public-security'], severity: 'Medium', confidence: 68, category: 'Suspicious Facility Image', recommendedAction: 'Review the simulated visual context and confirm that no real facility or sensitive detail is displayed.', entities: ['Facility image', 'Public post', 'Visual review'] },
  { key: 'passport-counterfeit', title: 'Simulated counterfeit passport discussion', messageAr: 'حدث استخباراتي تجريبي: نقاش حول جوازات سفر مزيفة موجه للجوازات.', source: 'Underground Forum', primarySector: 'passports', supportingSectors: [], severity: 'High', confidence: 77, category: 'Counterfeit Passport', recommendedAction: 'Route to Passports, preserve the simulated source context, and verify whether the claim has any supporting sample.', entities: ['Passports', 'Counterfeit document', 'Forum discussion'], preview: 'P-SIM-****' },
  { key: 'uniform-sale', title: 'Simulated uniform or equipment sale', messageAr: 'حدث استخباراتي تجريبي: منشور بيع زي أو معدات يحتاج تقييم الأمن العام.', source: 'Underground Forum', primarySector: 'public-security', supportingSectors: [], severity: 'Medium', confidence: 65, category: 'Uniform or Equipment Sale', recommendedAction: 'Assess whether the simulated listing includes controlled identifiers and add an analyst note.', entities: ['Uniform', 'Equipment sale', 'Public Security'] },
  { key: 'border-smuggling', title: 'Simulated border route smuggling discussion', messageAr: 'حدث استخباراتي تجريبي: نقاش عن مسار حدودي مشبوه مع ارتباط محتمل بالمخدرات.', source: 'Messaging Channel', primarySector: 'border-guard', supportingSectors: ['narcotics'], severity: 'High', confidence: 80, category: 'Smuggling Discussion', recommendedAction: 'Assign Border Guard as primary and Narcotics Control as supporting sector for joint review.', entities: ['Border route', 'Smuggling terms', 'Supporting narcotics context'] },
  { key: 'drug-trafficking', title: 'Simulated drug trafficking discussion', messageAr: 'حدث استخباراتي تجريبي: مصطلحات مخدرات مشفرة تتطلب مراجعة مكافحة المخدرات.', source: 'Messaging Channel', primarySector: 'narcotics', supportingSectors: ['border-guard'], severity: 'High', confidence: 76, category: 'Drug Trafficking Discussion', recommendedAction: 'Route to Narcotics Control and keep Border Guard as supporting when route terms appear.', entities: ['Narcotics', 'Coded terms', 'Route mention'] },
  { key: 'exploit-public-gateway', title: 'Simulated exploit discussion for public security gateway', messageAr: 'حدث استخباراتي تجريبي: نقاش استغلال محتمل يذكر بوابة تقنية للأمن العام.', source: 'Vulnerability Intelligence', primarySector: 'public-security', supportingSectors: [], severity: 'Critical', confidence: 87, category: 'Exploit Discussion', recommendedAction: 'Compare the exploit claim with the registered Secure Gateway mock asset and escalate if version exposure matches.', entities: ['Secure Gateway', 'Exploit discussion', 'Public Security asset'] },
  { key: 'government-doc-exposure', title: 'Simulated government document exposure claim', messageAr: 'حدث استخباراتي تجريبي: ادعاء غير مؤكد عن وثيقة حكومية يتطلب مراجعة مركزية.', source: 'Paste Site', primarySector: 'public-security', supportingSectors: ['passports'], severity: 'Medium', confidence: 63, category: 'Government Document Exposure', recommendedAction: 'Keep the finding in central review until sector ownership is confirmed by extracted entities.', entities: ['Government document', 'Paste claim', 'Unverified sample'], preview: 'Document preview masked' },
  { key: 'access-offer-passports', title: 'Simulated unauthorized access offer', messageAr: 'حدث استخباراتي تجريبي: عرض وصول غير مصدق مرتبط بخدمة الجوازات.', source: 'Dark Web', primarySector: 'passports', supportingSectors: ['public-security'], severity: 'Critical', confidence: 83, category: 'Unauthorized Access Offer', recommendedAction: 'Verify authenticity, keep the claim unconfirmed, and review related public service gateway context.', entities: ['Access offer', 'Passports service', 'Unconfirmed actor'] },
  { key: 'public-security-mention', title: 'Simulated public security mention in open source', messageAr: 'حدث استخباراتي تجريبي: إشارة عامة للأمن العام في مصدر مفتوح تحتاج تصنيفاً أولياً.', source: 'Social Media', primarySector: 'public-security', supportingSectors: [], severity: 'Low', confidence: 58, category: 'Public Security Mention', recommendedAction: 'Classify the public mention and close if no credible threat indicators are present.', entities: ['Public Security', 'Open source mention', 'Low-confidence signal'] },
  { key: 'border-route-activity', title: 'Simulated border route activity chatter', messageAr: 'حدث استخباراتي تجريبي: نشاط حديث حول مسار حدودي بحاجة لمراجعة حرس الحدود.', source: 'Messaging Channel', primarySector: 'border-guard', supportingSectors: [], severity: 'Medium', confidence: 71, category: 'Border Route Activity', recommendedAction: 'Review route terminology and add supporting sectors only if narcotics or document indicators appear.', entities: ['Border Guard', 'Route activity', 'Messaging chatter'] },
  { key: 'data-leak-passports', title: 'Simulated passport data leak claim', messageAr: 'حدث استخباراتي تجريبي: ادعاء تسريب بيانات يتعلق بالجوازات مع عينة مقنعة.', source: 'Dark Web', primarySector: 'passports', supportingSectors: [], severity: 'Critical', confidence: 85, category: 'Data Leak', recommendedAction: 'Keep sample data masked, validate source reliability, and record authenticity decision.', entities: ['Passports', 'Data leak', 'Masked sample'], preview: 'Passport record: SIM-******' },
  { key: 'dark-web-narcotics', title: 'Simulated narcotics marketplace intelligence', messageAr: 'حدث استخباراتي تجريبي: إشارة سوق مظلم مرتبطة بمكافحة المخدرات.', source: 'Dark Web', primarySector: 'narcotics', supportingSectors: [], severity: 'High', confidence: 74, category: 'Dark Web Intelligence', recommendedAction: 'Review the simulated marketplace reference and determine whether it links to any route discussion.', entities: ['Narcotics', 'Dark Web Intelligence', 'Marketplace terms'] },
  { key: 'social-osint-border', title: 'Simulated social OSINT border mention', messageAr: 'حدث استخباراتي تجريبي: منشور عام يذكر نشاطاً قرب مسار حدودي.', source: 'Social Media', primarySector: 'border-guard', supportingSectors: [], severity: 'Low', confidence: 56, category: 'Social OSINT', recommendedAction: 'Document the public context and close if no corroborating indicators exist.', entities: ['Social OSINT', 'Border route', 'Public post'] }
];

const sectorName = (sectorId: SectorId) => sectors.find((sector) => sector.id === sectorId)?.name ?? 'Ministry Admin';
const sectorShort = (sectorId: SectorId) => sectors.find((sector) => sector.id === sectorId)?.shortName ?? 'Ministry';

export function generateLiveSimulationEvent(options: { existingCount: number; recentSignatures: string[]; now?: Date }): GeneratedSimulationEvent {
  const now = options.now ?? new Date();
  const eligible = templates.filter((template) => !options.recentSignatures.includes(signature(template)));
  const pool = eligible.length > 0 ? eligible : templates;
  const template = pool[Math.floor(Math.random() * pool.length)];
  const sequence = options.existingCount + 1;
  const id = `sim-finding-${now.getTime()}-${sequence}`;
  const timestamp = now.toLocaleString();
  const due = new Date(now.getTime() + (template.severity === 'Critical' ? 6 : template.severity === 'High' ? 12 : 24) * 60 * 60 * 1000);
  const priority = template.severity === 'Critical' ? 'P1' : template.severity === 'High' ? 'P2' : template.severity === 'Medium' ? 'P3' : 'P4';
  const status = template.severity === 'Low' ? 'New' : 'Verification Required';
  const finding: Alert = {
    id,
    postId: `sim-post-${now.getTime()}-${sequence}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    category: template.category,
    severity: template.severity,
    confidence: template.confidence + Math.floor(Math.random() * 8) - 3,
    status,
    sectorId: template.supportingSectors.length ? 'multi-sector' : template.primarySector,
    sectorName: sectorName(template.primarySector),
    primarySector: template.primarySector,
    supportingSectors: template.supportingSectors,
    sectorReasons: Object.fromEntries([template.primarySector, ...template.supportingSectors].map((sector) => [sector, sector === template.primarySector ? `Primary routing selected because ${template.category} indicators match ${sectorShort(sector)}.` : `Supporting sector added due to related simulated context for ${sectorShort(sector)}.`])),
    source: template.source,
    collectionTime: timestamp,
    dueDate: due.toISOString().slice(0, 10),
    lastUpdate: timestamp,
    processingStage: status,
    threatSource: `${template.source} simulated live source`,
    authenticity: 'Verification Required',
    reliability: template.source === 'Vulnerability Intelligence' ? 'Reliable' : template.source === 'Social Media' ? 'Questionable' : 'Unknown',
    credibility: 'Unverified',
    previousAccuracy: 55 + Math.floor(Math.random() * 30),
    independentConfirmation: false,
    sampleAvailability: template.preview ? 'Limited' : 'Unavailable',
    firstObserved: timestamp,
    lastObserved: timestamp,
    evidenceAvailability: template.preview ? 'Limited' : 'Not Available',
    detectedEntities: template.entities,
    maskedPreview: template.preview,
    sectorMatching: `Simulated Live Intelligence Event routed to ${sectorName(template.primarySector)} using local template rules for ${template.category}.`,
    aiExplanation: `Simulated Live Intelligence Event: the frontend prototype classified this event as ${template.category} from ${template.source}. This is local mock logic, not real AI analysis or live intelligence.`,
    riskExplanation: `Risk is simulated from severity, sector relevance, confidence, source type, and whether masked evidence exists. No real Ministry intelligence is used.`,
    originalFinding: `Simulated Live Intelligence Event - ${template.title}. Source: ${template.source}. This is frontend-only demo data.`,
    assignedAnalyst: `${sectorShort(template.primarySector)} Analyst`,
    escalationLevel: template.severity === 'Critical' ? 'Immediate Review' : template.severity === 'High' ? 'Elevated' : template.severity === 'Medium' ? 'Watch' : 'None',
    priority,
    falsePositiveRisk: template.confidence >= 80 ? 'Medium' : 'High',
    analystNotes: 'Generated by the controlled live simulation.',
    relatedAlertIds: [],
    similarPreviousCases: ['Controlled live simulation example'],
    whyFlagged: `Local simulated template matched ${template.category} to ${sectorShort(template.primarySector)}.`,
    evidence: ['Simulated Live Intelligence Event', `${template.source} template selected`, 'No real dark web access', template.preview ? 'Sensitive preview remains masked' : 'No sensitive preview available'],
    contextIndicators: ['Sector relevance', 'Source type', 'Severity mix', 'Confidence score'],
    notDetected: ['No confirmed incident', 'No real personal data', 'No external collection'],
    confidenceReasoning: `${template.confidence}% simulated confidence based on local event-template metadata and routing rules.`,
    detectionTimeline: ['Collected', 'Normalizing', 'Entity Extraction', 'Sector Classification', 'Risk Assessment', 'Verification Required'],
    recommendedAction: template.recommendedAction,
    suggestedNextAction: 'Open the generated finding, review the risk panel, and record analyst notes.'
  };
  const notification: NotificationRecord = {
    id: `sim-notification-${now.getTime()}-${sequence}`,
    title: template.title,
    messageAr: template.messageAr,
    severity: template.severity,
    sector: template.primarySector,
    source: template.source,
    simulated: true,
    time: timestamp,
    findingId: id,
    read: false
  };
  return { finding, notification, signature: signature(template) };
}

function signature(template: Template) {
  return `${template.key}:${template.primarySector}:${template.source}:${template.severity}`;
}
