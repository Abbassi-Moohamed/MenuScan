/**
 * Types aligned with the MENU SCAN public API (backend `src/types/index.ts`).
 *
 * The backend is the single source of truth; these types mirror its DTOs
 * verbatim so the frontend never invents fields or relationships.
 *
 * Relationship hierarchy (never assume item → coffee):
 *   Coffee └── ItemCategory └── Item
 */

/** Success envelope: every 2xx response is `{ success: true, data }`. */
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
}

/** Error envelope: every 4xx/5xx response is `{ success: false, message }`. */
export interface ApiErrorEnvelope {
  success: false;
  message: string;
  details?: unknown;
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/** Category summary embedded in a coffee's response. */
export interface CategoryDto {
  id: string;
  name: string;
  image: string | null;
}

/** GET /api/v1/coffees/:coffeeSlug — the coffee with only its own categories. */
export interface CoffeeDto {
  id: string;
  name: string;
  logo: string;
  cover: string | null;
  slug: string;
  categories: CategoryDto[];
}

/** GET /api/v1/categories/:categoryId/items — one of these per item. */
export interface ItemDto {
  id: string;
  name: string;
  description: string | null;
  /** Decimal price in the coffee's default currency (e.g. `2.5` TND). */
  price: number;
  promotion: number | null;
  isAvailable: boolean;
  image: string | null;
}

/* ------------------------------------------------------------------------ */
/* Backoffice (admin) DTOs — mirror backend `src/types/index.ts`.            */
/* ------------------------------------------------------------------------ */

/** The two administrator levels of the MENU SCAN backoffice. */
export type AdminRole = "APP_ADMIN" | "COFFEE_ADMIN";

/** POST /api/v1/admin/auth/* — a short-lived bearer token session. */
export interface AdminAuthDto {
  token: string;
  role: AdminRole;
  /** Present only for COFFEE_ADMIN sessions: the single owned coffee. */
  coffeeId?: string;
  /** Token lifetime in jsonwebtoken notation (e.g. "12h"). */
  expiresIn: string;
}

/** App-admin coffee rows: includes category count, never PIN material. */
export interface AdminCoffeeDto {
  id: string;
  name: string;
  logo: string;
  cover: string | null;
  slug: string;
  categoryCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Coffee-admin category row. */
export interface AdminCategoryDto {
  id: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Coffee-admin item row (decimal price, e.g. `2.5` TND). */
export interface AdminItemDto {
  id: string;
  name: string;
  description: string | null;
  price: number;
  promotion: number | null;
  isAvailable: boolean;
  image: string | null;
  itemCategoryId: string;
  createdAt: string;
  updatedAt: string;
}

/** POST /api/v1/admin/images response. */
export interface AdminImageDto {
  imageId: string;
  url: string;
}

/** Bodies accepted by the app-admin coffee endpoints. */
export interface CreateCoffeeBody {
  name: string;
  logo: string;
  cover?: string;
  slug?: string;
}

export interface UpdateCoffeeBody {
  name?: string;
  logo?: string;
  cover?: string;
  slug?: string;
}

/** Body accepted by the coffee-admin item endpoints. */
export interface CreateItemBody {
  name: string;
  description?: string;
  price: number;
  promotion?: number | null;
  isAvailable?: boolean;
  image?: string;
}

export interface CategoryBody {
  name: string;
  image?: string;
}

export interface UpdateItemBody {
  name?: string;
  description?: string;
  price?: number;
  promotion?: number | null;
  isAvailable?: boolean;
  image?: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export interface OrderLineDto {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  coffeeId: string;
  tableNumber: number;
  status: OrderStatus;
  items: OrderLineDto[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderBody {
  coffeeSlug: string;
  tableNumber: number;
  items: Array<{ itemId: string; quantity: number }>;
}

export interface PaginatedOrdersDto {
  orders: OrderDto[];
  total: number;
  page: number;
  limit: number;
}