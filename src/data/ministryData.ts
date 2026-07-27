import type {
  Account,
  Alert,
  AnalystNote,
  Asset,
  AuditEvent,
  InvestigationCase,
  MinistryUser,
  NotificationRecord,
  Post,
  Priority,
  PrototypeSettings,
  SectorId,
  Severity,
  ThreatSourceRecord,
  VulnerabilityRecord
} from '../types';

export const sectors: Array<{ id: SectorId; name: string; nameAr: string; shortName: string }> = [
  { id: 'admin', name: 'Ministry Admin', nameAr: 'إدارة الوزارة', shortName: 'Ministry' },
  { id: 'prisons', name: 'General Directorate of Prisons', nameAr: 'المديرية العامة للسجون', shortName: 'Prisons' },
  { id: 'public-security', name: 'Public Security', nameAr: 'الأمن العام', shortName: 'Public Security' },
  { id: 'civil-defense', name: 'Civil Defense', nameAr: 'الدفاع المدني', shortName: 'Civil Defense' },
  { id: 'narcotics', name: 'General Directorate of Narcotics Control', nameAr: 'المديرية العامة لمكافحة المخدرات', shortName: 'Narcotics' },
  { id: 'border-guard', name: 'Border Guard', nameAr: 'حرس الحدود', shortName: 'Border Guard' },
  { id: 'passports', name: 'General Directorate of Passports', nameAr: 'المديرية العامة للجوازات', shortName: 'Passports' },
  { id: 'multi-sector', name: 'Multi-Sector', nameAr: 'متعدد القطاعات', shortName: 'Multi-Sector' }
];

export const operationalStatuses = ['New', 'Verification Required', 'Assigned', 'Investigating', 'Resolved', 'Closed', 'Overdue'] as const;
export const processingStages = ['Collected', 'Normalizing', 'Entity Extraction', 'Sector Classification', 'Risk Assessment', 'Verification Required', 'Assigned', 'Investigating'] as const;
export const priorities: Priority[] = ['P1', 'P2', 'P3', 'P4'];

const sectorName = (id: SectorId) => sectors.find((sector) => sector.id === id)?.name ?? 'Ministry Admin';
const sectorShort = (id: SectorId) => sectors.find((sector) => sector.id === id)?.shortName ?? 'Ministry';

export const mockAccounts: Account[] = sectors.filter((sector) => sector.id !== 'multi-sector').map((sector, index) => ({
  id: sector.id,
  name: sector.name,
  username: sector.id === 'admin' ? 'ministry.admin' : sector.name.toLowerCase().replace(/\s+/g, '.'),
  avatarInitials: sector.shortName.split(' ').map((word) => word[0]).join('').slice(0, 3),
  profileSummary: `${sector.name} is monitored from the central Ministry Threat Intelligence Center. This prototype does not require switching accounts.`,
  accountAge: `${4 + index} years`,
  postingFrequency: 'Central review',
  language: 'Mixed',
  lastActivity: `2026-07-23 ${String(9 + index).padStart(2, '0')}:20`,
  previousAlerts: 8 + index,
  riskScore: 55 + index * 5,
  riskLevel: (['Low', 'Medium', 'Medium', 'High', 'High', 'Critical', 'High'][index] ?? 'Medium') as Exclude<Severity, 'Informational'>,
  repeatedPatterns: ['Sector response tracking', 'Human verification workflow', 'Simulated intelligence routing'],
  notes: 'Displayed for central Ministry analyst context only.',
  interactionHistory: ['Finding assigned', 'Status changed', 'Case reviewed'],
  indicators: ['Open findings', 'Overdue findings', 'Critical exposure'],
  relatedAccounts: ['admin']
}));

export const mockUsers: MinistryUser[] = Array.from({ length: 20 }, (_, index) => {
  const sector = sectors[index % 7];
  return {
    id: `user-${String(index + 1).padStart(2, '0')}`,
    name: index % 7 === 0 ? `Ministry Analyst ${Math.floor(index / 7) + 1}` : `${sector.shortName} Analyst ${index + 1}`,
    role: 'Central Ministry Analyst',
    sectorId: sector.id,
    sectorName: sector.name,
    permissions: ['Monitor all sectors', 'Assign findings', 'Manage cases', 'Update notes', 'Review audit history'],
    responsePerformance: 69 + ((index * 6) % 28)
  };
});

const assetRows: Array<[string, SectorId, string, string, string, Severity, string, boolean, string]> = [
  ['asset-001', 'prisons', 'Oracle', 'Corrections Case Registry', '12.2.1', 'Critical', 'Prisons IT', false, 'Custody record continuity'],
  ['asset-002', 'prisons', 'Microsoft', 'Identity Services', '2022', 'High', 'Prisons IT', false, 'Staff access governance'],
  ['asset-003', 'public-security', 'Cisco', 'Secure Gateway', '4.2', 'Critical', 'Public Security NOC', true, 'Branch connectivity'],
  ['asset-004', 'public-security', 'LenelS2', 'Access Control Console', '8.2', 'High', 'Facilities Security', false, 'Physical access review'],
  ['asset-005', 'civil-defense', 'Esri', 'Incident GIS Portal', '11.1', 'Critical', 'Civil Defense GIS', true, 'Emergency dispatch mapping'],
  ['asset-006', 'civil-defense', 'Motorola', 'Dispatch Console', '2025.1', 'High', 'Operations Center', false, 'Incident response coordination'],
  ['asset-007', 'narcotics', 'IBM', 'Case Analytics', '4.8', 'High', 'Narcotics Analytics', false, 'Investigation triage'],
  ['asset-008', 'narcotics', 'Palo Alto', 'Threat Prevention', '11.2', 'Critical', 'Narcotics SOC', true, 'Perimeter filtering'],
  ['asset-009', 'border-guard', 'Thales', 'Coastal Sensor Hub', '6.4', 'Critical', 'Border Systems', false, 'Border situational awareness'],
  ['asset-010', 'border-guard', 'Fortinet', 'Remote Access VPN', '7.2', 'High', 'Border Network', true, 'Remote operations access'],
  ['asset-011', 'passports', 'Entrust', 'Passport Enrollment', '10.5', 'Critical', 'Passports Applications', false, 'Passport issuance workflow'],
  ['asset-012', 'passports', 'F5', 'Public Services Gateway', '16.1', 'High', 'Passports Network', true, 'Citizen service availability'],
  ['asset-013', 'admin', 'ServiceNow', 'SOC Case Desk', 'Washington', 'Medium', 'Ministry SOC', true, 'Case routing'],
  ['asset-014', 'admin', 'Splunk', 'Intelligence Analytics', '9.2', 'High', 'Ministry SOC', false, 'Cross-sector correlation'],
  ['asset-015', 'multi-sector', 'Microsoft', 'Exchange Online', 'Current', 'High', 'Shared Services', true, 'Email continuity']
];

export const mockAssets: Asset[] = assetRows.map(([id, sectorId, vendor, product, version, criticality, owner, internetFacing, businessImpact]) => ({
  id,
  sectorId,
  sectorName: sectorName(sectorId),
  vendor,
  product,
  version,
  criticality,
  owner,
  internetFacing,
  businessImpact
}));

const findingTemplates: Array<{
  category: string;
  title: string;
  sector: SectorId;
  supporting?: SectorId[];
  source: Post['sourceType'];
  severity: Severity;
  status: Alert['status'];
  confidence: number;
  dueOffset: number;
  maskedPreview?: string;
}> = [
  { category: 'Data Leaks', title: 'Claimed inmate record sample requires verification', sector: 'prisons', source: 'Dark Web', severity: 'Critical', status: 'Verification Required', confidence: 86, dueOffset: -1, maskedPreview: 'Inmate reference: *******92' },
  { category: 'Employee Credentials', title: 'Claimed employee credential list mentions Ministry email pattern', sector: 'multi-sector', source: 'Paste Site', severity: 'High', status: 'Assigned', confidence: 78, dueOffset: 1, maskedPreview: 'a***@example.gov.sa' },
  { category: 'Access for Sale', title: 'Unverified access-for-sale post references public service gateway', sector: 'passports', source: 'Underground Forum', severity: 'Critical', status: 'Investigating', confidence: 81, dueOffset: 0, maskedPreview: 'Restricted Preview' },
  { category: 'Counterfeit Passports', title: 'Counterfeit passport discussion observed in underground source', sector: 'passports', source: 'Dark Web', severity: 'High', status: 'New', confidence: 74, dueOffset: 2, maskedPreview: 'P******123' },
  { category: 'Military Uniforms and Equipment', title: 'Possible sale of uniforms and equipment requires analyst review', sector: 'public-security', source: 'Underground Forum', severity: 'Medium', status: 'Verification Required', confidence: 69, dueOffset: 3 },
  { category: 'Facility Images', title: 'Public image may show restricted facility context', sector: 'civil-defense', source: 'Social Media', severity: 'High', status: 'Overdue', confidence: 83, dueOffset: -2 },
  { category: 'Exploit Discussions', title: 'Exploit discussion references Secure Gateway affected versions', sector: 'public-security', supporting: ['civil-defense'], source: 'Vulnerability Intelligence', severity: 'Critical', status: 'Investigating', confidence: 88, dueOffset: 0 },
  { category: 'Smuggling Discussions', title: 'Possible border route smuggling discussion requires routing', sector: 'border-guard', supporting: ['narcotics'], source: 'Messaging Channel', severity: 'High', status: 'Assigned', confidence: 77, dueOffset: 1 },
  { category: 'Drug Trafficking Discussions', title: 'Drug trafficking discussion mentions coded border route terms', sector: 'narcotics', supporting: ['border-guard'], source: 'Messaging Channel', severity: 'High', status: 'Verification Required', confidence: 75, dueOffset: 1 },
  { category: 'Government Documents', title: 'Unverified claim of government document sample requires triage', sector: 'admin', source: 'Paste Site', severity: 'Medium', status: 'New', confidence: 62, dueOffset: 4 },
  { category: 'Threat Actor Discussions', title: 'Threat actor discussion mentions Ministry-related services', sector: 'multi-sector', source: 'Dark Web', severity: 'Medium', status: 'Resolved', confidence: 67, dueOffset: 5 },
  { category: 'Inmate Data', title: 'Claimed inmate data leak routed to Prisons', sector: 'prisons', source: 'Dark Web', severity: 'Critical', status: 'Closed', confidence: 91, dueOffset: 6, maskedPreview: 'Restricted Preview - Masked for Prototype' }
];

export const mockPosts: Post[] = findingTemplates.flatMap((template, index) =>
  Array.from({ length: index < 4 ? 3 : 2 }, (_, copyIndex) => {
    const id = index * 3 + copyIndex + 1;
    return {
      id: `finding-post-${String(id).padStart(3, '0')}`,
      accountId: template.sector === 'multi-sector' ? 'admin' : template.sector,
      sourceType: template.source!,
      timestamp: `2026-07-23 ${String(8 + Math.floor(id / 4)).padStart(2, '0')}:${String((id * 7) % 60).padStart(2, '0')}`,
      text: `${template.source} simulated finding: ${template.title}. The claim is unverified and requires Ministry analyst review.`,
      language: (copyIndex === 1 ? 'Arabic' : 'English') as Post['language'],
      imageLabel: template.category.includes('Facility') || template.category.includes('Uniforms') ? 'Safe simulated visual placeholder; no real facility, person, logo, or credential is shown.' : undefined,
      likes: 0,
      reposts: 0,
      replies: 0,
      views: 900 + id * 121,
      fictionalRegion: ['Region Alpha', 'Region Bravo', 'Region Charlie', 'Region Delta'][id % 4] as Post['fictionalRegion'],
      category: template.category,
      severity: template.severity,
      confidence: Math.min(96, template.confidence + copyIndex * 3),
      status: template.status
    };
  })
).slice(0, 28);

export const mockAlerts: Alert[] = mockPosts.map((post, index) => {
  const template = findingTemplates[index % findingTemplates.length];
  const primarySector = template.sector === 'multi-sector' ? 'admin' : template.sector;
  const supportingSectors = template.supporting ?? (template.sector === 'multi-sector' ? ['passports', 'public-security'] : []);
  const status = template.status;
  const dueDay = 23 + template.dueOffset;
  const priority: Priority = post.severity === 'Critical' ? 'P1' : post.severity === 'High' ? 'P2' : post.severity === 'Medium' ? 'P3' : 'P4';
  return {
    id: `finding-${String(index + 1).padStart(3, '0')}`,
    postId: post.id,
    createdAt: post.timestamp,
    updatedAt: `2026-07-23 ${String(10 + (index % 6)).padStart(2, '0')}:${String((index * 9) % 60).padStart(2, '0')}`,
    category: post.category,
    severity: post.severity,
    confidence: post.confidence,
    status,
    sectorId: template.sector,
    sectorName: template.sector === 'multi-sector' ? 'Multi-Sector' : sectorName(template.sector),
    primarySector,
    supportingSectors,
    sectorReasons: Object.fromEntries([primarySector, ...supportingSectors].map((sector) => [sector, sector === primarySector ? `Primary routing based on ${post.category} indicators.` : 'Supporting sector added because the finding mentions related operational context.'])),
    source: post.sourceType!,
    collectionTime: post.timestamp,
    dueDate: `2026-07-${String(Math.max(21, dueDay)).padStart(2, '0')}`,
    lastUpdate: `2026-07-23 ${String(11 + (index % 5)).padStart(2, '0')}:${String((index * 13) % 60).padStart(2, '0')}`,
    processingStage: status === 'New' ? 'Collected' : status === 'Verification Required' ? 'Verification Required' : status === 'Assigned' ? 'Assigned' : status === 'Investigating' ? 'Investigating' : 'Risk Assessment',
    threatSource: `${post.sourceType} simulated source`,
    authenticity: post.category.includes('Exploit') ? 'Potential Exposure' : status === 'Verification Required' ? 'Verification Required' : 'Authenticity Not Confirmed',
    reliability: index % 4 === 0 ? 'Usually Reliable' : index % 4 === 1 ? 'Unknown' : index % 4 === 2 ? 'Reliable' : 'Questionable',
    credibility: index % 5 === 0 ? 'Possibly True' : index % 5 === 1 ? 'Unverified' : index % 5 === 2 ? 'Probably True' : index % 5 === 3 ? 'Probably False' : 'Unverified',
    previousAccuracy: 54 + ((index * 8) % 39),
    independentConfirmation: index % 3 === 0,
    sampleAvailability: index % 3 === 0 ? 'Available' : index % 3 === 1 ? 'Limited' : 'Unavailable',
    firstObserved: post.timestamp,
    lastObserved: `2026-07-23 ${String(12 + (index % 5)).padStart(2, '0')}:${String((index * 17) % 60).padStart(2, '0')}`,
    evidenceAvailability: index % 3 === 0 ? 'Available' : index % 3 === 1 ? 'Limited' : 'Not Available',
    detectedEntities: [sectorShort(primarySector), post.category, template.maskedPreview ?? 'Unverified source claim'],
    maskedPreview: template.maskedPreview,
    sectorMatching: `The finding was routed to ${sectorShort(primarySector)} because category, extracted entities, and source context match the configured prototype routing rules.`,
    aiExplanation: `The prototype classified this as ${post.category} using local mock indicators: source type, entity keywords, affected sector, confidence, and evidence availability. This is not real AI analysis.`,
    riskExplanation: post.category.includes('Exploit') ? 'A simulated external vulnerability discussion references a registered product/version range, creating Potential Exposure only.' : 'Risk is based on simulated source sensitivity, sector relevance, confidence, and whether evidence is available for human review.',
    originalFinding: post.text,
    assignedAnalyst: `${sectorShort(primarySector)} Analyst`,
    escalationLevel: post.severity === 'Critical' ? 'Immediate Review' : post.severity === 'High' ? 'Elevated' : post.severity === 'Medium' ? 'Watch' : 'None',
    priority,
    falsePositiveRisk: post.confidence >= 85 ? 'Low' : post.confidence >= 70 ? 'Medium' : 'High',
    analystNotes: 'Awaiting Ministry analyst validation.',
    relatedAlertIds: [],
    similarPreviousCases: ['Prior simulated finding reviewed without confirmed incident', 'Prototype calibration example'],
    whyFlagged: `The local prototype detected ${post.category.toLowerCase()} indicators relevant to ${sectorShort(primarySector)}.`,
    evidence: ['Simulated source record collected', 'Sector/entity terms detected', 'Authenticity not confirmed', template.maskedPreview ? 'Sensitive data preview is masked' : 'No sensitive data displayed'],
    contextIndicators: ['Source reliability', 'Information credibility', 'Sector relevance', 'Evidence availability'],
    notDetected: ['No confirmed breach', 'No real dark web access', 'No real personal data', 'No operational instructions'],
    confidenceReasoning: `${post.confidence}% reflects simulated source reliability, entity matching, sample availability, and uncertainty because authenticity is not confirmed.`,
    detectionTimeline: ['Finding created', 'Sector assigned', 'Analyst assigned', `Status changed to ${status}`],
    recommendedAction: 'Review the finding, confirm sector routing, add analyst notes, and update workflow status.',
    suggestedNextAction: status === 'Overdue' ? 'Prioritize verification and escalation review.' : 'Open the investigation page for technical details.'
  };
});

export const mockRiskFactors = mockAlerts.map((alert) => ({
  alertId: alert.id,
  factors: [
    { label: 'Sector relevance', contribution: Math.min(96, alert.confidence + 5), detail: alert.sectorMatching },
    { label: 'Source reliability', contribution: alert.reliability === 'Reliable' ? 88 : alert.reliability === 'Usually Reliable' ? 76 : 52, detail: `Source reliability is ${alert.reliability}.` },
    { label: 'Evidence availability', contribution: alert.evidenceAvailability === 'Available' ? 82 : alert.evidenceAvailability === 'Limited' ? 62 : 38, detail: `Evidence availability is ${alert.evidenceAvailability}.` },
    { label: 'Unknowns penalty', contribution: 100 - alert.confidence, detail: 'Confidence is reduced because authenticity and impact are not confirmed.' }
  ]
}));

export const mockVulnerabilities: VulnerabilityRecord[] = [
  {
    id: 'vuln-001',
    cveId: 'CVE-2026-41001',
    title: 'Secure Gateway session validation weakness',
    vendor: 'Cisco',
    product: 'Secure Gateway',
    affectedVersions: '4.0 to 4.5',
    minVersion: 4.0,
    maxVersion: 4.5,
    severity: 'Critical',
    exploitedInWild: true,
    patchAvailability: 'Patch Available',
    publishedDate: '2026-07-18',
    matchedAssetIds: ['asset-003'],
    affectedSectors: ['public-security'],
    remediationStatus: 'Patch Pending',
    dueDate: '2026-07-25',
    assetOwner: 'Public Security NOC',
    recommendedMitigation: 'Validate gateway version, apply vendor patch, and keep external exposure under heightened monitoring.'
  },
  {
    id: 'vuln-002',
    cveId: 'CVE-2026-39218',
    title: 'Incident GIS Portal query handling flaw',
    vendor: 'Esri',
    product: 'Incident GIS Portal',
    affectedVersions: '10.9 to 11.1',
    minVersion: 10.9,
    maxVersion: 11.1,
    severity: 'High',
    exploitedInWild: false,
    patchAvailability: 'Workaround Available',
    publishedDate: '2026-07-15',
    matchedAssetIds: ['asset-005'],
    affectedSectors: ['civil-defense'],
    remediationStatus: 'Review Required',
    dueDate: '2026-07-27',
    assetOwner: 'Civil Defense GIS',
    recommendedMitigation: 'Apply workaround, restrict administrative access, and schedule vendor update.'
  },
  {
    id: 'vuln-003',
    cveId: 'CVE-2026-36640',
    title: 'Passport enrollment document preview issue',
    vendor: 'Entrust',
    product: 'Passport Enrollment',
    affectedVersions: '10.0 to 10.4',
    minVersion: 10.0,
    maxVersion: 10.4,
    severity: 'Medium',
    exploitedInWild: false,
    patchAvailability: 'Patch Available',
    publishedDate: '2026-07-10',
    matchedAssetIds: [],
    affectedSectors: ['passports'],
    remediationStatus: 'Not Affected',
    dueDate: '2026-07-31',
    assetOwner: 'Passports Applications',
    recommendedMitigation: 'Registered asset version is outside the affected range; retain evidence and close after owner confirmation.'
  },
  {
    id: 'vuln-004',
    cveId: 'CVE-2026-38872',
    title: 'Remote Access VPN privilege validation issue',
    vendor: 'Fortinet',
    product: 'Remote Access VPN',
    affectedVersions: '7.0 to 7.2',
    minVersion: 7.0,
    maxVersion: 7.2,
    severity: 'Critical',
    exploitedInWild: true,
    patchAvailability: 'Patch Available',
    publishedDate: '2026-07-20',
    matchedAssetIds: ['asset-010'],
    affectedSectors: ['border-guard'],
    remediationStatus: 'Mitigation Applied',
    dueDate: '2026-07-24',
    assetOwner: 'Border Network',
    recommendedMitigation: 'Confirm mitigation, apply patch in maintenance window, and monitor remote access logs.'
  }
];

export const mockCases: InvestigationCase[] = [
  {
    id: 'case-001',
    alertId: 'finding-001',
    findingIds: ['finding-001', 'finding-012'],
    title: 'Claimed inmate record sample review',
    summary: 'Human verification case for a simulated claimed inmate data leak. No authenticity is confirmed.',
    primarySector: 'prisons',
    supportingSectors: [],
    sectorName: sectorName('prisons'),
    owner: 'Prisons Analyst',
    priority: 'P1',
    status: 'Investigating',
    openedAt: '2026-07-23 09:30',
    notes: 'Validate evidence availability and keep all sensitive previews masked.',
    recommendedActions: ['Confirm source sample availability', 'Document verification result', 'Close if unsupported'],
    attachments: ['Restricted Preview placeholder', 'Masked sample placeholder'],
    timeline: []
  },
  {
    id: 'case-002',
    alertId: 'finding-008',
    findingIds: ['finding-008', 'finding-009'],
    title: 'Border route smuggling discussion',
    summary: 'Multi-sector review for a simulated border route and narcotics discussion.',
    primarySector: 'border-guard',
    supportingSectors: ['narcotics'],
    sectorName: sectorName('border-guard'),
    owner: 'Border Guard Analyst',
    priority: 'P2',
    status: 'Awaiting Verification',
    openedAt: '2026-07-23 10:10',
    notes: 'Supporting sector added because narcotics terms appear in the simulated discussion.',
    recommendedActions: ['Review routing reasons', 'Update sector-specific actions', 'Record verification outcome'],
    attachments: ['Simulated transcript placeholder'],
    timeline: []
  }
];

export const mockNotifications: NotificationRecord[] = mockAlerts.slice(0, 12).map((alert, index) => ({
  id: `notification-${String(index + 1).padStart(3, '0')}`,
  messageAr: [
    'تم اكتشاف ثغرة قد تؤثر على أصل تقني تابع للدفاع المدني',
    'تم اكتشاف تسريب بيانات محتمل متعلق بقطاع السجون',
    'تم إسناد الحالة إلى قطاع الجوازات',
    'تم تغيير حالة التنبيه إلى قيد التحقيق',
    'تم إغلاق الحالة بنجاح'
  ][index % 5],
  severity: alert.severity,
  sector: alert.primarySector,
  time: alert.lastUpdate,
  findingId: alert.id,
  caseId: index < 2 ? mockCases[index]?.id : undefined,
  read: index > 3
}));

export const mockAuditEvents: AuditEvent[] = [
  { id: 'audit-001', date: '2026-07-23', time: '09:30', user: 'Ministry Analyst', action: 'Finding created', sector: 'prisons', findingId: 'finding-001', newValue: 'Verification Required', description: 'Finding created from simulated source and queued for verification.' },
  { id: 'audit-002', date: '2026-07-23', time: '09:36', user: 'Ministry Analyst', action: 'Sector assigned', sector: 'prisons', findingId: 'finding-001', previousValue: 'Unassigned', newValue: 'Prisons', description: 'Finding assigned to General Directorate of Prisons.' },
  { id: 'audit-003', date: '2026-07-23', time: '10:10', user: 'Ministry Analyst', action: 'Case created', sector: 'border-guard', findingId: 'finding-008', caseId: 'case-002', newValue: 'case-002', description: 'Multi-sector case created for border route discussion.' }
];

export const defaultSettings: PrototypeSettings = {
  language: 'en',
  notificationDuration: 5,
  simulationSpeed: 'Normal',
  defaultDateRange: 'This week',
  defaultSector: 'all',
  riskThreshold: 'High',
  liveSimulation: false,
  liveSimulationSettings: {
    eventIntervalSeconds: 10,
    durationMinutes: 30,
    toastEnabled: true,
    soundEnabled: false,
    severityMix: 'Balanced',
    sectorMix: 'Balanced',
    autoCreateFindings: true,
    autoCreateAuditEvents: true
  }
};

export const defaultNotes: AnalystNote[] = [
  { id: 'note-001', targetId: 'finding-001', targetType: 'finding', author: 'Ministry Analyst', createdAt: '2026-07-23 09:38', text: 'Keep sample masked until verification is complete.', visibility: 'Ministry Internal' },
  { id: 'note-002', targetId: 'case-002', targetType: 'case', author: 'Ministry Analyst', createdAt: '2026-07-23 10:18', text: 'Shared routing rationale with supporting sector.', visibility: 'Shared With Assigned Sectors' }
];

export const socialOsintExamples = [
  { id: 'social-ig', platform: 'Instagram', type: 'Image post', username: '@public_scene_24', caption: 'Public image near a government facility. Simulated example only.', sector: 'civil-defense' as SectorId, findings: ['Visual: facility-like exterior', 'OCR: no real signage', 'Risk: requires visual review'], risk: 'High' as Severity, time: '2026-07-23 11:04' },
  { id: 'social-tt', platform: 'TikTok', type: 'Vertical video', username: '@route_story', caption: 'Speech-to-text mentions a border route in a public clip. Simulated example only.', sector: 'border-guard' as SectorId, findings: ['Speech: route reference', 'Entity: border area term', 'Duration: 00:37'], risk: 'Medium' as Severity, time: '2026-07-23 11:16' },
  { id: 'social-x', platform: 'X', type: 'Public mention', username: '@civic_watch', caption: 'Public mention asks about a claimed service disruption. Simulated example only.', sector: 'passports' as SectorId, findings: ['Entity: passport service', 'No credential data', 'Confidence: limited'], risk: 'Low' as Severity, time: '2026-07-23 11:30' },
  { id: 'social-yt', platform: 'YouTube', type: 'Public comment', username: '@viewer-014', caption: 'Comment references uniforms in a public discussion. Simulated example only.', sector: 'public-security' as SectorId, findings: ['Keyword: uniform', 'No illegal content', 'Needs context review'], risk: 'Medium' as Severity, time: '2026-07-23 11:42' }
];

export const mockThreatSources: ThreatSourceRecord[] = [
  { id: 'source-001', name: 'Simulated Dark Web Feed Alpha', type: 'Dark Web Feed', status: 'Enabled', reliability: 'Usually Reliable', lastSuccessfulUpdate: '2026-07-23 11:50', findingsCollected: 14, averageDelay: '12m', collectionMethod: 'Mock scheduled feed', healthStatus: 'Healthy' },
  { id: 'source-002', name: 'Underground Forum Monitor', type: 'Underground Forum', status: 'Enabled', reliability: 'Unknown', lastSuccessfulUpdate: '2026-07-23 11:35', findingsCollected: 9, averageDelay: '18m', collectionMethod: 'Mock collector', healthStatus: 'Delayed' },
  { id: 'source-003', name: 'Public Social OSINT Stream', type: 'Social Media OSINT', status: 'Enabled', reliability: 'Questionable', lastSuccessfulUpdate: '2026-07-23 11:58', findingsCollected: 6, averageDelay: '6m', collectionMethod: 'Simulated public search', healthStatus: 'Healthy' },
  { id: 'source-004', name: 'Vulnerability Feed', type: 'Vulnerability Feed', status: 'Enabled', reliability: 'Reliable', lastSuccessfulUpdate: '2026-07-23 11:45', findingsCollected: 4, averageDelay: '24m', collectionMethod: 'Mock CVE feed', healthStatus: 'Healthy' },
  { id: 'source-005', name: 'Manual Submission Queue', type: 'Manual Submission', status: 'Disabled', reliability: 'Unknown', lastSuccessfulUpdate: '2026-07-22 16:10', findingsCollected: 0, averageDelay: 'N/A', collectionMethod: 'Prototype form placeholder', healthStatus: 'Review Required' }
];
