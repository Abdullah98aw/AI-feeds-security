import { BarChartCard, TrendChartCard } from '../components/ChartCard';
import { KpiCard } from '../components/KpiCard';
import { mockAlerts } from '../data/mockAlerts';
import { mockAccounts } from '../data/mockAccounts';
import { mockPosts } from '../data/mockPosts';
import { mockUsers, sectors } from '../data/ministryData';
import { dailyAlertTrend, researchMetrics } from '../data/mockMetrics';
import { Activity, Gauge, ScanSearch, Timer } from 'lucide-react';
import { HeatMap } from '../components/HeatMap';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const topCategories = Array.from(new Set(mockAlerts.map((alert) => alert.category))).map((category) => ({
    label: category.replace('Possible ', ''),
    value: mockAlerts.filter((alert) => alert.category === category).length
  }));
  const repeatedAccounts = mockAccounts.map((account) => ({
    id: account.id,
    label: account.username,
    value: mockAlerts.filter((alert) => mockPosts.find((post) => post.id === alert.postId)?.accountId === account.id).length
  })).filter((item) => item.value > 0);
  const severityDistribution = ['Informational', 'Low', 'Medium', 'High', 'Critical'].map((severity) => ({
    label: severity,
    value: mockAlerts.filter((alert) => alert.severity === severity).length
  }));
  const heatMapData = sectors.filter((sector) => sector.id !== 'multi-sector').map((sector) => ({
    region: sector.name.replace('General Directorate of ', ''),
    value: mockAlerts.filter((alert) => alert.sectorId === sector.id || alert.sectorId === 'multi-sector').length
  }));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-signal">Response Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">Sector response performance</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">All metrics are simulated placeholders for a research prototype. They do not represent live monitoring, confirmed incidents, or real operational performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pipeline Precision" value={`${Math.round(researchMetrics.precision * 100)}%`} detail="Mock evaluation value" icon={ScanSearch} />
        <KpiCard label="Human Review Recall" value={`${Math.round(researchMetrics.recall * 100)}%`} detail="Mock evaluation value" icon={Activity} />
        <KpiCard label="Mean Sector Response" value={`${Math.round(mockUsers.reduce((sum, user) => sum + user.responsePerformance, 0) / mockUsers.length)}%`} detail="Across mock users" icon={Gauge} />
        <KpiCard label="Review Latency" value={researchMetrics.detectionLatency} detail="Mock average latency" icon={Timer} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <TrendChartCard title="Finding Trends" data={dailyAlertTrend.map((item) => ({ label: item.day, value: item.alerts }))} />
        <BarChartCard title="Top Categories" data={topCategories} />
        <BarChartCard title="Severity Distribution" data={severityDistribution} />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-lg border border-line bg-panel p-5">
          <h2 className="text-base font-semibold leading-6 text-slate-100">Sector Distribution</h2>
          <div className="mt-5 space-y-3">
            {repeatedAccounts.map((account) => (
              <Link key={account.id} to={`/accounts/${account.id}`} className="grid gap-2 rounded-lg bg-panelSoft p-3 text-sm transition hover:bg-line sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <span className="min-w-0 font-medium leading-5 text-slate-100">{account.label}</span>
                <span className="rounded-full bg-signal/15 px-2.5 py-1 text-xs font-semibold text-signal">{account.value} findings</span>
              </Link>
            ))}
          </div>
        </section>
        <HeatMap data={heatMapData} />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-lg border border-line bg-panel p-5 2xl:col-start-2">
          <h2 className="text-base font-semibold leading-6 text-slate-100">System-wide statistics</h2>
          <dl className="mt-5 space-y-4">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Average confidence</dt>
              <dd className="font-semibold text-signal">{researchMetrics.averageConfidence}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">False positive rate</dt>
              <dd className="font-semibold text-signal">{researchMetrics.falsePositiveRate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Evaluation data</dt>
              <dd className="font-semibold text-slate-200">Mock only</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
