import {
  users,
  products,
  orders,
  orderItems,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type InsertOrderItem,
  type OrderItem,
  type InsertOrderWithItems,
} from "./schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProductsByCategory(category: string): Promise<Product[]>;
  
  // Order operations
  createOrder(orderData: InsertOrderWithItems): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  
  // Stats operations
  getTodayStats(): Promise<{
    totalProducts: number;
    todayOrders: number;
    todayRevenue: string;
    averageOrderValue: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.category, category), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt));
  }

  // Order operations
  async createOrder(orderData: InsertOrderWithItems): Promise<Order> {
    const total = orderData.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    // Apply PIX discount
    const finalTotal = orderData.paymentMethod === 'pix' ? total * 0.95 : total;

    const [order] = await db
      .insert(orders)
      .values({
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        paymentMethod: orderData.paymentMethod,
        total: finalTotal.toFixed(2),
        pixCode: orderData.paymentMethod === 'pix' ? this.generatePIXCode(finalTotal) : null,
      })
      .returning();

    // Insert order items
    for (const item of orderData.items) {
      await db
        .insert(orderItems)
        .values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
    }

    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const ordersWithItems = await db.query.orders.findMany({
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: desc(orders.createdAt),
    });
    return ordersWithItems;
  }

  // Stats operations
  async getTodayStats(): Promise<{
    totalProducts: number;
    todayOrders: number;
    todayRevenue: string;
    averageOrderValue: string;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [stats] = await db
      .select({
        totalProducts: sql<number>`COUNT(DISTINCT ${products.id})`,
        todayOrders: sql<number>`COUNT(CASE WHEN ${orders.createdAt} >= ${today} AND ${orders.createdAt} < ${tomorrow} THEN 1 END)`,
        todayRevenue: sql<string>`COALESCE(SUM(CASE WHEN ${orders.createdAt} >= ${today} AND ${orders.createdAt} < ${tomorrow} THEN ${orders.total} END), 0)`,
        averageOrderValue: sql<string>`COALESCE(AVG(CASE WHEN ${orders.createdAt} >= ${today} AND ${orders.createdAt} < ${tomorrow} THEN ${orders.total} END), 0)`,
      })
      .from(products)
      .fullJoin(orders, sql`1=1`);

    return {
      totalProducts: stats.totalProducts,
      todayOrders: stats.todayOrders,
      todayRevenue: parseFloat(stats.todayRevenue).toFixed(2),
      averageOrderValue: parseFloat(stats.averageOrderValue).toFixed(2),
    };
  }

  private generatePIXCode(amount: number): string {
    // Simple PIX code generation - in production, use a proper PIX API
    const timestamp = Date.now().toString();
    const amountStr = amount.toFixed(2).replace('.', '');
    return `00020126580014BR.GOV.BCB.PIX01362020030301040${amountStr}5204000053039865802BR5925SNACKS CHICKEN DELIVERY6009SAO PAULO62070503***63044E0A`;
  }
}

export const storage = new DatabaseStorage();