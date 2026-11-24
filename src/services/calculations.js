// All statistics are derived from real stored records — nothing is hard-coded.

import { MONTH_NAMES_UZ, dayKey, monthKey } from '../utils/format';

const sum = (items, pick) => items.reduce((total, item) => total + (Number(pick(item)) || 0), 0);

export function getPaymentSummary(sales = [], payments = []) {
  const totalSales = sum(sales, (s) => s.total);
  const paid = sum(payments, (p) => p.amount);
  return {
    totalSales,
    paid,
    unpaid: Math.max(0, totalSales - paid),
    percent: totalSales ? Math.min(100, Math.round((paid / totalSales) * 100)) : 0,
  };
}

export function getSalesWithStatus(sales = [], payments = []) {
  return sales.map((sale) => {
    const paidAmount = sum(payments.filter((p) => p.saleId === sale.id), (p) => p.amount);
    const status = paidAmount >= sale.total ? 'To‘langan' : paidAmount > 0 ? 'Qisman' : 'To‘lanmagan';
    return { ...sale, paidAmount, remaining: Math.max(0, sale.total - paidAmount), status };
  });
}

export function getDashboardStats(data) {
  const { customers = [], orders = [], sales = [], payments = [], tasks = [], employees = [], products = [] } = data;
  const payment = getPaymentSummary(sales, payments);
  return {
    totalCustomers: customers.length,
    totalOrders: orders.length,
    revenue: payment.totalSales,
    pendingOrders: orders.filter((o) => o.status === 'Kutilmoqda').length,
    completedOrders: orders.filter((o) => o.status === 'Yakunlandi').length,
    paid: payment.paid,
    unpaid: payment.unpaid,
    activeEmployees: employees.filter((e) => e.active).length,
    activeTasks: tasks.filter((t) => t.status !== 'Bajarildi').length,
    lowStock: products.filter((p) => p.stock <= 15).length,
  };
}

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { key: monthKey(d), label: `${MONTH_NAMES_UZ[d.getMonth()]} ${String(d.getFullYear()).slice(2)}` };
  });
}

export function getMonthlySales(sales = []) {
  return lastSixMonths().map(({ key, label }) => ({
    name: label,
    savdo: sum(sales.filter((s) => monthKey(s.date) === key), (s) => s.total),
  }));
}

export function getWeeklySales(sales = []) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dayKey(d);
    const daySales = sales.filter((s) => dayKey(s.date) === key);
    return { name: key, savdo: sum(daySales, (s) => s.total), soni: daySales.length };
  });
}

export function getCustomerGrowth(customers = []) {
  return lastSixMonths().map(({ key, label }) => ({
    name: label,
    mijozlar: customers.filter((c) => monthKey(c.createdAt) === key).length,
  }));
}

export function getTopCustomers(sales = [], customers = [], limit = 5) {
  return customers.map((customer) => {
    const own = sales.filter((s) => s.customerId === customer.id);
    return { ...customer, orderCount: own.length, total: sum(own, (s) => s.total) };
  }).sort((a, b) => b.total - a.total).slice(0, limit);
}

export function getTopProducts(sales = [], products = [], limit = 6) {
  return products.map((product) => {
    const own = sales.filter((s) => s.productId === product.id);
    return {
      ...product,
      sold: sum(own, (s) => s.quantity),
      revenue: sum(own, (s) => s.total),
    };
  }).sort((a, b) => b.sold - a.sold).slice(0, limit);
}

export function getEmployeePerformance(sales = [], employees = [], tasks = []) {
  return employees.map((employee) => ({
    ...employee,
    revenue: sum(sales.filter((s) => s.employeeId === employee.id), (s) => s.total),
    completedTasks: tasks.filter((t) => t.employeeId === employee.id && t.status === 'Bajarildi').length,
  })).sort((a, b) => b.revenue - a.revenue);
}

export function getDailyReport(sales = []) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const daySales = sales.filter((s) => dayKey(s.date) === key);
    return { key, Summa: sum(daySales, (s) => s.total), Buyurtma: daySales.length };
  }).reverse();
}
