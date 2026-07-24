import { Bell, Volume2, VolumeX, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Alert } from '../types';

const arabicMessages = [
  'تم اكتشاف تهديد جديد يتطلب مراجعة المحلل',
  'تم اكتشاف ثغرة قد تؤثر على أحد الأصول التقنية',
  'تم اكتشاف تسريب بيانات محتمل',
  'تم تحديث مستوى الخطورة',
  'تم بدء التحقيق'
];

export function LiveNotification({ alert, muted, onToggleMute, onDismiss }: { alert?: Alert; muted: boolean; onToggleMute: () => void; onDismiss: () => void }) {
  const navigate = useNavigate();
  if (!alert) return null;
  return (
    <div className="fixed right-4 top-20 z-40 max-h-[calc(100vh-6rem)] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto animate-feed-in cursor-pointer rounded-lg border border-danger/40 bg-panel/95 p-4 shadow-glow backdrop-blur transition hover:-translate-y-0.5 hover:border-danger hover:bg-panelSoft" onClick={() => navigate(`/investigation/${alert.id}`)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/investigation/${alert.id}`); }} title="Open alert investigation">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-danger/15 text-danger"><Bell size={20} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-7 text-danger" dir="rtl" lang="ar">{arabicMessages[alert.id.length % arabicMessages.length]}</p>
          <p className="mt-1 text-sm leading-7 text-slate-100" dir="rtl" lang="ar">تم تعيين الحالة إلى قطاع {alert.sectorName}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500" dir="rtl" lang="ar">حدث محلي تجريبي - يتطلب التحقق البشري</p>
        </div>
        <button className="text-slate-400 hover:text-white" onClick={(event) => { event.stopPropagation(); onDismiss(); }} title="Dismiss notification"><X size={16} /></button>
      </div>
      <button className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-graphite/60 px-3 py-2 text-sm leading-5 text-slate-200 hover:text-white" onClick={(event) => { event.stopPropagation(); onToggleMute(); }}>
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        {muted ? 'التنبيه صامت' : 'التنبيه مفعل'}
      </button>
    </div>
  );
}
