import Vendor from '../models/Vendor.js';
import RFQ from '../models/RFQ.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Invoice from '../models/Invoice.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getDashboardAnalytics = async (req, res) => {
  const [
    totalVendors,
    activeRFQs,
    pendingPOs,
    totalSpendAggregate
  ] = await Promise.all([
    Vendor.countDocuments({ status: 'active' }),
    RFQ.countDocuments({ status: { $in: ['open', 'awarded'] } }),
    PurchaseOrder.countDocuments({ status: { $ne: 'completed' } }),
    Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ])
  ]);

  const totalSpend = totalSpendAggregate.length > 0 ? totalSpendAggregate[0].total : 0;

  // Monthly Spend Chart Data (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySpend = await Invoice.aggregate([
    { $match: { status: 'paid', paidAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
        total: { $sum: '$grandTotal' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonthlySpend = monthlySpend.map(item => ({
    name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    value: item.total
  }));

  sendSuccess(res, {
    overview: {
      totalVendors,
      activeRFQs,
      pendingPOs,
      totalSpend
    },
    charts: {
      monthlySpend: formattedMonthlySpend
    }
  }, 'Dashboard analytics fetched');
};

export const getVendorPerformanceAnalytics = async (req, res) => {
  const topVendors = await Vendor.find({ status: 'active' })
    .sort({ totalSpend: -1, rating: -1 })
    .limit(5)
    .select('name totalSpend rating category');

  sendSuccess(res, topVendors, 'Vendor performance analytics fetched');
};
