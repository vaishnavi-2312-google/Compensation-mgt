import { NextResponse } from 'next/server';
import { mockSalaries, getCompanySummary } from '@/data/mock-salaries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get('name');

  if (!companyName) {
    // Return all unique companies with counts
    const counts: Record<string, number> = {};
    mockSalaries.forEach(s => {
      counts[s.company] = (counts[s.company] || 0) + 1;
    });

    const list = Object.entries(counts).map(([name, count]) => {
      const summary = getCompanySummary(name);
      return {
        name,
        count,
        medianCompensation: summary?.medianCompensation || 0,
      };
    }).sort((a, b) => b.medianCompensation - a.medianCompensation);

    return NextResponse.json(list);
  }

  const summary = getCompanySummary(companyName);
  if (!summary) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const entries = mockSalaries.filter(s => s.company.toLowerCase() === companyName.toLowerCase());

  // Generate Compensation Histogram (e.g. 50k buckets)
  const histogramBuckets: Record<string, number> = {};
  entries.forEach(e => {
    const bucketMin = Math.floor(e.totalCompensation / 50) * 50;
    const bucketLabel = `$${bucketMin}k - $${bucketMin + 50}k`;
    histogramBuckets[bucketLabel] = (histogramBuckets[bucketLabel] || 0) + 1;
  });
  
  // Sort buckets numerically
  const histogram = Object.entries(histogramBuckets)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => {
      const aVal = parseInt(a.range.replace(/[^0-9]/g, ''), 10);
      const bVal = parseInt(b.range.replace(/[^0-9]/g, ''), 10);
      return aVal - bVal;
    });

  // Level Progression: yoe, average tc, base, stock, bonus per level
  const levelsSet = Array.from(new Set(entries.map(e => e.level)));
  const levelProgression = levelsSet.map(level => {
    const levelEntries = entries.filter(e => e.level === level);
    const avgYOE = parseFloat((levelEntries.reduce((sum, e) => sum + e.yoe, 0) / levelEntries.length).toFixed(1));
    const avgTC = Math.round(levelEntries.reduce((sum, e) => sum + e.totalCompensation, 0) / levelEntries.length);
    const avgBase = Math.round(levelEntries.reduce((sum, e) => sum + e.base, 0) / levelEntries.length);
    const avgStock = Math.round(levelEntries.reduce((sum, e) => sum + e.stock, 0) / levelEntries.length);
    const avgBonus = Math.round(levelEntries.reduce((sum, e) => sum + e.bonus, 0) / levelEntries.length);

    return {
      level,
      yoe: avgYOE,
      base: avgBase,
      stock: avgStock,
      bonus: avgBonus,
      totalCompensation: avgTC,
    };
  }).sort((a, b) => a.yoe - b.yoe); // sort by typical experience progression

  // Compensation Trends over time (grouped by createdAt month)
  const trendsMap: Record<string, { sum: number; count: number }> = {};
  entries.forEach(e => {
    const date = new Date(e.createdAt);
    const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!trendsMap[monthLabel]) {
      trendsMap[monthLabel] = { sum: 0, count: 0 };
    }
    trendsMap[monthLabel].sum += e.totalCompensation;
    trendsMap[monthLabel].count += 1;
  });

  const trends = Object.entries(trendsMap).map(([month, data]) => ({
    month,
    medianCompensation: Math.round(data.sum / data.count),
  }));

  return NextResponse.json({
    ...summary,
    histogram,
    levelProgression,
    trends,
    rawEntries: entries,
  });
}
