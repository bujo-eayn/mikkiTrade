import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  try {
    // Get total vehicles count (excluding deleted)
    const { count: totalVehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    // Get published vehicles count
    const { count: publishedVehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .is('deleted_at', null);

    // Get draft vehicles count
    const { count: draftVehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', false)
      .is('deleted_at', null);

    // Get vehicles by status
    const { count: availableVehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')
      .is('deleted_at', null);

    const { count: soldVehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sold')
      .is('deleted_at', null);

    const { count: reservedVehicles } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'reserved')
      .is('deleted_at', null);

    // Get vehicles on deal
    const { count: dealsCount } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('on_deal', true)
      .is('deleted_at', null);

    // Get featured vehicles count
    const { count: featuredCount } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)
      .is('deleted_at', null);

    // Get vehicles added this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const { count: addedThisWeek } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())
      .is('deleted_at', null);

    // Get vehicles added this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const { count: addedThisMonth } = await supabaseAdmin
      .from('vehicles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneMonthAgo.toISOString())
      .is('deleted_at', null);

    return NextResponse.json({
      totalVehicles: totalVehicles || 0,
      publishedVehicles: publishedVehicles || 0,
      draftVehicles: draftVehicles || 0,
      availableVehicles: availableVehicles || 0,
      soldVehicles: soldVehicles || 0,
      reservedVehicles: reservedVehicles || 0,
      dealsCount: dealsCount || 0,
      featuredCount: featuredCount || 0,
      addedThisWeek: addedThisWeek || 0,
      addedThisMonth: addedThisMonth || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
