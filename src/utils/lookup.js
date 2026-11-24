export const byId = (list = [], id) => list.find((item) => item.id === id);

export const customerName = (customers, id) => byId(customers, id)?.name || 'Noma’lum mijoz';
export const productName = (products, id) => byId(products, id)?.name || 'Noma’lum mahsulot';
export const employeeName = (employees, id) => {
  const employee = byId(employees, id);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Biriktirilmagan';
};
