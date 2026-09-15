export interface ApiSuccessEnvelope<T> { success: true; data: T }
export interface ApiErrorEnvelope { success: false; message: string; details?: unknown }
export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
export type AdminRole = "APP_ADMIN" | "COFFEE_ADMIN";
export interface AdminAuthDto { token: string; role: AdminRole; coffeeId?: string; expiresIn: string }
export interface CategoryDto { id: string; name: string; image: string | null }
export interface CoffeeDto { id: string; name: string; logo: string; cover: string | null; slug: string; categories: CategoryDto[] }
export interface ItemDto { id: string; name: string; description: string | null; price: number; promotion: number | null; isAvailable: boolean; image: string | null }
export interface AdminCoffeeDto { id: string; name: string; logo: string; cover: string | null; slug: string; categoryCount: number; createdAt: string; updatedAt: string }
export interface AdminCategoryDto { id: string; name: string; image: string | null; createdAt: string; updatedAt: string }
export interface AdminItemDto extends ItemDto { itemCategoryId: string; createdAt: string; updatedAt: string }
export interface AdminImageDto { imageId: string; url: string }
export interface CreateCoffeeBody { name: string; logo: string; cover?: string; slug?: string }
export interface UpdateCoffeeBody { name?: string; logo?: string; cover?: string; slug?: string }
export interface CreateItemBody { name: string; description?: string; price: number; promotion?: number | null; isAvailable?: boolean; image?: string }
export type UpdateItemBody = Partial<CreateItemBody>;
export interface CategoryBody { name: string; image?: string }
export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED";
export interface OrderLineDto { itemId: string; name: string; image: string | null; quantity: number; unitPrice: number; subtotal: number }
export interface OrderDto { id: string; coffeeId: string; tableNumber: number; status: OrderStatus; items: OrderLineDto[]; total: number; createdAt: string; updatedAt: string }
export interface CreateOrderBody { coffeeSlug: string; tableNumber: number; items: Array<{ itemId: string; quantity: number }> }
export interface PaginatedOrdersDto { orders: OrderDto[]; total: number; page: number; limit: number }
export type AnalyticsRange = "today" | "yesterday" | "7d" | "30d" | "this-month" | "previous-month" | "custom";
export interface AnalyticsQuery { from?: string; to?: string }
export interface InsightComparison { current: number; previous: number; change: number; changePercent: number | null; trend: "up" | "down" | "flat" }
export interface AnalyticsDto {
  scope: "coffee" | "platform"; timezone: "UTC";
  period: { from: string; to: string; granularity: "hour" | "day" | "week" | "month" };
  comparisonPeriod: { from: string; to: string };
  kpis: { confirmedRevenue: InsightComparison; totalOrders: InsightComparison; confirmedOrders: InsightComparison; pendingOrders: number; rejectedOrders: number; averageConfirmedOrderValue: InsightComparison; itemsSold: InsightComparison };
  revenueTrend: Array<{ bucket: string; revenue: number; orders: number }>;
  orderTrend: Array<{ bucket: string; revenue: number; orders: number }>;
  topItems: Array<{ itemId: string; name: string; quantitySold: number; revenue: number }>;
  categories: Array<{ categoryId: string; categoryName: string; quantitySold: number; revenue: number; percentageOfRevenue: number }>;
  peakHours: Array<{ hour: number; orders: number }>;
  busiestDays: Array<{ dayOfWeek: number; orders: number; revenue: number }>;
  statuses: Array<{ status: OrderStatus; count: number; percentage: number }>;
  promotions: { unitsSoldAtPromotionalPrice: number; promotedSalesRevenue: number; promotedItemsSold: number; discountAmount: number | null; historicalRegularPriceAvailable: false };
  availability: { availableItems: number; unavailableItems: number; availabilityPercentage: number; historicalRateAvailable: false };
  tables: Array<{ tableNumber: number; orders: number; revenue: number }>;
  insights: Array<{ id: string; message: string; kind: "positive" | "warning" | "neutral" }>;
  limitations: string[];
  platform?: { totalCoffees: number; activeCoffees: number };
}
