import prisma from '../config/prisma';

class OrderService {
  public async createOrder(customerId: string, orderData: any) {
    const { storeId, items } = orderData;

    let totalAmount = 0;
    const orderItems = items.map((item: any) => {
      totalAmount += item.price * item.quantity;
      return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      };
    });

    return await prisma.order.create({
      data: {
        customerId,
        storeId,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        store: true,
      },
    });
  }

  public async getOrdersByCustomer(customerId: string) {
    return await prisma.order.findMany({
      where: { customerId },
      include: {
        items: true,
        store: true,
        helper: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async getOrdersByStoreOwner(ownerId: string) {
    const store = await prisma.store.findUnique({ where: { ownerId } });
    if (!store) throw { status: 404, message: 'Store not found' };

    return await prisma.order.findMany({
      where: { storeId: store.id },
      include: {
        items: true,
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async getAvailableTasks() {
    return await prisma.order.findMany({
      where: { status: 'ACCEPTED', helperId: null },
      include: {
        store: true,
        customer: { select: { name: true, phone: true } },
      },
    });
  }

  public async updateStatus(orderId: string, status: string, helperId?: string) {
    const data: any = { status };
    if (helperId && status === 'PICKED_UP') {
      data.helperId = helperId;
    }

    return await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        items: true,
        store: true,
        customer: { select: { name: true, phone: true } },
      },
    });
  }
}

export default new OrderService();
 
