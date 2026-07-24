import { Link } from 'react-router-dom';
import { Play, Image, MessageSquare, Youtube } from 'lucide-react';
import { SeverityBadge } from '../components/SeverityBadge';
import { socialOsintExamples, sectors } from '../data/ministryData';

const icons = { Instagram: Image, TikTok: Play, X: MessageSquare, YouTube: Youtube } as const;

export default function SocialOsint() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Social OSINT</p>
        <h1 className="mt-2 text-3xl font-semibold">Simulated Public Social Media Finding</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Professionally designed examples demonstrate public social media review without copying platform interfaces or showing real people, accounts, facilities, or data.</p>
      </div>
      <section className="grid gap-4 2xl:grid-cols-2">
        {socialOsintExamples.map((item) => {
          const Icon = icons[item.platform as keyof typeof icons];
          const isVideo = item.platform === 'TikTok';
          return (
            <article key={item.id} className="min-w-0 rounded-lg border border-line bg-panel p-5">
              <div className={`grid gap-5 ${isVideo ? 'lg:grid-cols-[minmax(10rem,16rem)_minmax(0,1fr)] lg:items-start' : ''}`}>
                <div className={`relative grid ${isVideo ? 'mx-auto aspect-[9/16] w-full max-w-[16rem]' : 'aspect-video w-full'} place-items-center rounded-lg border border-dashed border-line bg-panelSoft p-4 text-slate-400`}>
                  <div className="text-center">
                    <Icon className="mx-auto text-signal" size={32} />
                    <p className="mt-3 text-sm leading-5">{item.platform} {item.type} placeholder</p>
                  </div>
                  {isVideo && <span className="absolute bottom-3 right-3 rounded-full bg-graphite/80 px-2.5 py-1 text-xs text-slate-200">00:37</span>}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex max-w-full rounded-full bg-panelSoft px-3 py-1.5 text-[0.78rem] leading-snug text-slate-300">{item.platform}</span>
                    <span className="inline-flex max-w-full rounded-full bg-signal/10 px-3 py-1.5 text-[0.78rem] leading-snug text-signal">Simulated Public Social Media Finding</span>
                    <SeverityBadge severity={item.risk} />
                  </div>
                  <h2 className="mt-4 font-semibold leading-6">{item.username}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.caption}</p>
                </div>
              </div>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <Info label="Publication time" value={item.time} />
                <Info label="Affected sector" value={sectors.find((sector) => sector.id === item.sector)?.name ?? item.sector} />
                <Info label={item.platform === 'TikTok' ? 'Speech-to-text preview' : item.platform === 'Instagram' ? 'OCR findings' : 'Detected context'} value={item.findings.join('; ')} />
                <Info label="Visual findings" value={item.findings[0]} />
              </dl>
              <Link to="/alerts" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-signal px-4 py-2 text-center text-sm font-semibold leading-5 text-graphite sm:w-auto">Open Investigation</Link>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg bg-panelSoft p-3"><dt className="text-slate-500">{label}</dt><dd className="mt-1 leading-6 text-slate-200">{value}</dd></div>;
}
