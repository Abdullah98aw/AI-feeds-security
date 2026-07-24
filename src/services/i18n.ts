import type { Language } from '../types';

export const labels = {
  en: {
    dashboard: 'Threat Dashboard',
    findings: 'Findings',
    vulnerabilities: 'Vulnerability Intelligence',
    darkWeb: 'Dark Web Intelligence',
    social: 'Social OSINT',
    cases: 'Cases',
    unassigned: 'Unassigned Findings',
    sources: 'Threat Sources',
    audit: 'Audit Log',
    notifications: 'Notifications',
    analytics: 'Analytics',
    settings: 'Settings',
    accounts: 'Sector Overview',
    overviewTitle: 'Ministry Threat Intelligence Overview',
    overviewSubtitle: 'Central monitoring of dark web, vulnerability intelligence, public social media, data leaks, and underground threat sources.',
    researchMode: 'Research Mode',
    simulated: 'Simulated Intelligence Data',
    search: 'Search findings, cases, assets, sectors, CVEs, entities...'
  },
  ar: {
    dashboard: 'لوحة التهديدات',
    findings: 'النتائج',
    vulnerabilities: 'استخبارات الثغرات',
    darkWeb: 'استخبارات الويب المظلم',
    social: 'المصادر الاجتماعية العامة',
    cases: 'الحالات',
    unassigned: 'نتائج غير مسندة',
    sources: 'مصادر التهديد',
    audit: 'سجل التدقيق',
    notifications: 'الإشعارات',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    accounts: 'نظرة عامة على القطاعات',
    overviewTitle: 'نظرة عامة على استخبارات تهديدات الوزارة',
    overviewSubtitle: 'مراقبة مركزية لمحاكاة الويب المظلم واستخبارات الثغرات ووسائل التواصل العامة وتسريبات البيانات ومصادر التهديد تحت الأرض.',
    researchMode: 'وضع البحث',
    simulated: 'بيانات استخبارات محاكاة',
    search: 'ابحث في النتائج والحالات والأصول والقطاعات والثغرات والكيانات...'
  }
} satisfies Record<Language, Record<string, string>>;
