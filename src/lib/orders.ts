import type { CreateOrderBody, OrderDto, OrderStatus, PaginatedOrdersDto } from "@/types/backend";
import { requestWithToken } from "@/lib/api";

export function createOrder(body: CreateOrderBody) {
  return requestWithToken<OrderDto>("/orders", { method: "POST", body: JSON.stringify(body) });
}

export function getOrder(orderId: string) {
  return requestWithToken<OrderDto>(`/orders/${encodeURIComponent(orderId)}`);
}

export function listOrders(token: string, status?: OrderStatus) {
  const query = status ? `?status=${status}` : "";
  return requestWithToken<PaginatedOrdersDto>(`/admin/my-coffee/orders${query}`, {}, token);
}

export function updateOrderStatus(token: string, orderId: string, status: OrderStatus) {
  return requestWithToken<OrderDto>(
    `/admin/my-coffee/orders/${encodeURIComponent(orderId)}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) },
    token,
  );
}
