import { NextResponse } from 'next/server';
import { mockSalaries } from '@/data/mock-salaries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyA = searchParams.get('companyA');
  const roleA = searchParams.get('roleA');
  const levelA = searchParams.get('levelA');

  const companyB = searchParams.get('companyB');
  const roleB = searchParams.get('roleB');
  const levelB = searchParams.get('levelB');

  if (!companyA || !companyB) {
    return NextResponse.json({ error: 'Missing required comparison company parameters' }, { status: 400 });
  }

  // Find entries
  const entriesA = mockSalaries.filter(
    s => 
      s.company.toLowerCase() === companyA.toLowerCase() &&
      (!roleA || s.role.toLowerCase() === roleA.toLowerCase()) &&
      (!levelA || s.level.toLowerCase() === levelA.toLowerCase())
  );

  const entriesB = mockSalaries.filter(
    s => 
      s.company.toLowerCase() === companyB.toLowerCase() &&
      (!roleB || s.role.toLowerCase() === roleB.toLowerCase()) &&
      (!levelB || s.level.toLowerCase() === levelB.toLowerCase())
  );

  // Fallback if level specific doesn't exist, search company + role general
  const targetA = entriesA.length > 0 ? entriesA : mockSalaries.filter(s => s.company.toLowerCase() === companyA.toLowerCase());
  const targetB = entriesB.length > 0 ? entriesB : mockSalaries.filter(s => s.company.toLowerCase() === companyB.toLowerCase());

  if (targetA.length === 0 || targetB.length === 0) {
    return NextResponse.json({ error: 'One or both companies contain no records' }, { status: 404 });
  }

  // Math aggregates
  const getStats = (list: typeof mockSalaries) => {
    const tcSum = list.reduce((sum, e) => sum + e.totalCompensation, 0);
    const baseSum = list.reduce((sum, e) => sum + e.base, 0);
    const bonusSum = list.reduce((sum, e) => sum + e.bonus, 0);
    const stockSum = list.reduce((sum, e) => sum + e.stock, 0);
    const yoeSum = list.reduce((sum, e) => sum + e.yoe, 0);

    const count = list.length;
    return {
      totalCompensation: Math.round(tcSum / count),
      base: Math.round(baseSum / count),
      bonus: Math.round(bonusSum / count),
      stock: Math.round(stockSum / count),
      yoe: parseFloat((yoeSum / count).toFixed(1)),
    };
  };

  const statsA = getStats(targetA);
  const statsB = getStats(targetB);

  // Deltas (A relative to B)
  const deltaTC = statsA.totalCompensation - statsB.totalCompensation;
  const pctDeltaTC = parseFloat(((deltaTC / (statsB.totalCompensation || 1)) * 100).toFixed(1));

  const deltaBase = statsA.base - statsB.base;
  const pctDeltaBase = parseFloat(((deltaBase / (statsB.base || 1)) * 100).toFixed(1));

  const deltaStock = statsA.stock - statsB.stock;
  const pctDeltaStock = parseFloat(((deltaStock / (statsB.stock || 1)) * 100).toFixed(1));

  const deltaBonus = statsA.bonus - statsB.bonus;
  const pctDeltaBonus = parseFloat(((deltaBonus / (statsB.bonus || 1)) * 100).toFixed(1));

  // Determine better overall package
  const betterPackage = deltaTC > 0 ? 'A' : deltaTC < 0 ? 'B' : 'Equal';

  // Build a structured insights summary text
  const labelA = `${companyA} ${levelA ? `(${levelA})` : ''}`;
  const labelB = `${companyB} ${levelB ? `(${levelB})` : ''}`;
  
  let insights = '';
  if (betterPackage === 'A') {
    insights = `${labelA} is on average ${Math.abs(pctDeltaTC)}% higher in total compensation compared to ${labelB}. This is primarily driven by ${
      deltaStock > 0 ? `a larger stock grant architecture (+$${deltaStock}k/yr)` : `a higher base salary (+$${deltaBase}k/yr)`
    }.`;
  } else if (betterPackage === 'B') {
    insights = `${labelB} is on average ${Math.abs(pctDeltaTC)}% higher in total compensation compared to ${labelA}. This is primarily driven by ${
      deltaStock < 0 ? `a larger stock grant architecture (+$${Math.abs(deltaStock)}k/yr)` : `a higher base salary (+$${Math.abs(deltaBase)}k/yr)`
    }.`;
  } else {
    insights = `Both packages are highly similar in average total compensation ($${statsA.totalCompensation}k).`;
  }

  return NextResponse.json({
    companyA: {
      name: companyA,
      role: roleA || 'All Roles',
      level: levelA || 'All Levels',
      stats: statsA,
    },
    companyB: {
      name: companyB,
      role: roleB || 'All Roles',
      level: levelB || 'All Levels',
      stats: statsB,
    },
    comparison: {
      betterPackage,
      insights,
      deltas: {
        totalCompensation: { amount: deltaTC, percentage: pctDeltaTC },
        base: { amount: deltaBase, percentage: pctDeltaBase },
        stock: { amount: deltaStock, percentage: pctDeltaStock },
        bonus: { amount: deltaBonus, percentage: pctDeltaBonus },
      },
    },
  });
}
