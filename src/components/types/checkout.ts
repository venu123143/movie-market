export interface CheckoutFormData {
  // Contact Information
  email: string
  phone: string

  // Billing Address
  firstName: string
  lastName: string
  company?: string
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string

  // Payment Information
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string

  // Options
  saveInfo: boolean
  sameAsShipping: boolean
  newsletter: boolean
  terms: boolean

  // Promo
  promoCode?: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export interface OrderSummary {
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
}
