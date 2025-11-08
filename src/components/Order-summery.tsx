"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { OrderSummary as OrderSummaryType } from "@/components/types/checkout"

interface OrderSummaryProps {
  order: OrderSummaryType
}

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {item.quantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
              </div>
              <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${order.tax.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount</span>
              <span className="text-green-600">-${order.discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
