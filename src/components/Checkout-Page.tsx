"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Lock, Truck, Shield, Tag, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { FormField } from "@/components/Form-field"
import { OrderSummary } from "@/components/Order-summery"
import type { CheckoutFormData, OrderSummary as OrderSummaryType } from "./types/checkout"
import apiClient from "@/services/axios"
import PaymentForm from "@/components/StripeForm";
// Mock order data
const mockOrder: OrderSummaryType = {
    items: [
        {
            id: "1",
            name: "Premium Wireless Headphones",
            price: 299.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            variant: "Black, Noise Cancelling",
        },
        {
            id: "2",
            name: "Smartphone Case",
            price: 29.99,
            quantity: 2,
            image: "https://images.samsung.com/is/image/samsung/p6pim/in/2501/gallery/in-galaxy-s25-ps931-ef-ps931cregin-544548011?$684_547_PNG$",
            variant: "Clear, iPhone 15",
        },
    ],
    subtotal: 359.97,
    shipping: 0,
    tax: 28.8,
    discount: 36.0,
    total: 352.77,
}

const STORAGE_KEY = "checkout_form_data"

export default function CheckoutPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [promoApplied, setPromoApplied] = useState(false)
    const [showPromoError, setShowPromoError] = useState(false)
    const [clientSecret, setcClientSecret] = useState(null);
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

    // Load saved form data from localStorage
    const loadSavedData = () => {
        if (typeof window !== 'undefined') {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY)
                if (savedData) {
                    const parsed = JSON.parse(savedData)
                    return parsed.formData || {}
                }
            } catch (error) {
                console.error('Error loading saved data:', error)
            }
        }
        return {}
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        defaultValues: {
            country: "US",
            sameAsShipping: true,
            saveInfo: false,
            newsletter: false,
            terms: true,
            ...loadSavedData(), // Load saved data as default values
        },
    })

    // Restore promo code state on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY)
                if (savedData) {
                    const parsed = JSON.parse(savedData)
                    setPromoCode(parsed.promoCode || "")
                    setPromoApplied(parsed.promoApplied || false)
                }
            } catch (error) {
                console.error('Error loading saved promo code state:', error)
            }
        }
    }, [])

    // Watch all form fields to save them to localStorage
    const watchedFields = watch()

    // Save form data to localStorage whenever fields change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dataToSave = {
                formData: watchedFields,
                promoCode,
                promoApplied,
                timestamp: new Date().toISOString(),
            }

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
            } catch (error) {
                console.error('Error saving data to localStorage:', error)
            }
        }
    }, [watchedFields, promoCode, promoApplied])

    // Load saved data on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY)
                if (savedData) {
                    const parsed = JSON.parse(savedData)

                    // Restore form fields
                    if (parsed.formData) {
                        Object.keys(parsed.formData).forEach(key => {
                            if (parsed.formData[key] !== undefined) {
                                setValue(key as keyof CheckoutFormData, parsed.formData[key])
                            }
                        })
                    }

                    // Restore promo code state
                    if (parsed.promoCode) {
                        setPromoCode(parsed.promoCode)
                    }
                    if (parsed.promoApplied) {
                        setPromoApplied(parsed.promoApplied)
                    }
                }
            } catch (error) {
                console.error('Error loading saved data:', error)
            }
        }
    }, [setValue])

    // Save promo code to localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
            currentData.promoCode = promoCode
            currentData.promoApplied = promoApplied
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData))
        }
    }, [promoCode, promoApplied])

    const onSubmit = async (data: CheckoutFormData) => {
        try {
            console.log("calling....")
            setIsSubmitting(true)
            // Simulate API call
            const payload = {
                amount: 29.99,
                currency: "usd",
                description: "Payment for Order #ORD123456"
            }
            const result = await apiClient.post(`${import.meta.env.VITE_BACKEND_URL}/stripe/create-payment-intent`, payload)
            console.log(result.data.data.client_secret, "payment ")
            setcClientSecret(result.data.data.client_secret);
            setIsSubmitting(false)
        } catch (error: any) {
            setIsSubmitting(false)

        }
    }

    const applyPromoCode = () => {
        if (promoCode.toLowerCase() === "save10") {
            setPromoApplied(true)
            setShowPromoError(false)
        } else {
            setShowPromoError(true)
            setPromoApplied(false)
        }
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ""
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(" ")
        } else {
            return v
        }
    }

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
        if (v.length >= 2) {
            return v.substring(0, 2) + "/" + v.substring(2, 4)
        }
        return v
    }

    // Clear saved data function (optional - you can add a button for this)
    const clearSavedData = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
            window.location.reload()
        }
    }
    const handlePaymentSuccess = () => {
        console.log("handle payment success...")
    }
    return (
        <div className="min-h-screen bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">Complete your purchase securely</p>
                    {/* Optional: Add a clear data button */}
                    <button
                        onClick={clearSavedData}
                        className="text-sm text-blue-600 hover:underline mt-2"
                        type="button"
                    >
                        Clear saved data
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">1</span>
                                        </div>
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Email Address" required error={errors.email?.message}>
                                            <Input
                                                type="email"
                                                placeholder="john@example.com"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address",
                                                    },
                                                })}
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                        </FormField>

                                        <FormField label="Phone Number" required error={errors.phone?.message}>
                                            <Input
                                                type="tel"
                                                placeholder="+1 (555) 123-4567"
                                                {...register("phone", {
                                                    required: "Phone number is required",
                                                    pattern: {
                                                        value: /^[+]?[1-9][\d]{0,15}$/,
                                                        message: "Invalid phone number",
                                                    },
                                                })}
                                                className={errors.phone ? "border-red-500" : ""}
                                            />
                                        </FormField>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">2</span>
                                        </div>
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="First Name" required error={errors.firstName?.message}>
                                            <Input
                                                placeholder="John"
                                                {...register("firstName", { required: "First name is required" })}
                                                className={errors.firstName ? "border-red-500" : ""}
                                            />
                                        </FormField>

                                        <FormField label="Last Name" required error={errors.lastName?.message}>
                                            <Input
                                                placeholder="Doe"
                                                {...register("lastName", { required: "Last name is required" })}
                                                className={errors.lastName ? "border-red-500" : ""}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="Company" error={errors.company?.message}>
                                        <Input placeholder="Company name (optional)" {...register("company")} />
                                    </FormField>

                                    <FormField label="Address" required error={errors.address?.message}>
                                        <Input
                                            placeholder="123 Main Street"
                                            {...register("address", { required: "Address is required" })}
                                            className={errors.address ? "border-red-500" : ""}
                                        />
                                    </FormField>

                                    <FormField label="Apartment, suite, etc." error={errors.apartment?.message}>
                                        <Input placeholder="Apartment, suite, etc. (optional)" {...register("apartment")} />
                                    </FormField>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField label="City" required error={errors.city?.message}>
                                            <Input
                                                placeholder="New York"
                                                {...register("city", { required: "City is required" })}
                                                className={errors.city ? "border-red-500" : ""}
                                            />
                                        </FormField>

                                        <FormField label="State" required error={errors.state?.message}>
                                            <Select onValueChange={(value) => setValue("state", value)}>
                                                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="Select state" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NY">New York</SelectItem>
                                                    <SelectItem value="CA">California</SelectItem>
                                                    <SelectItem value="TX">Texas</SelectItem>
                                                    <SelectItem value="FL">Florida</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        <FormField label="ZIP Code" required error={errors.zipCode?.message}>
                                            <Input
                                                placeholder="10001"
                                                {...register("zipCode", { required: "ZIP code is required" })}
                                                className={errors.zipCode ? "border-red-500" : ""}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="Country" required error={errors.country?.message}>
                                        <Select defaultValue="US" onValueChange={(value) => setValue("country", value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="US">United States</SelectItem>
                                                <SelectItem value="CA">Canada</SelectItem>
                                                <SelectItem value="UK">United Kingdom</SelectItem>
                                                <SelectItem value="AU">Australia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                </CardContent>
                            </Card>

                            {/* Payment Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold text-sm">3</span>
                                        </div>
                                        Payment Information
                                        <Lock className="w-4 h-4 text-green-600 ml-auto" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Alert>
                                        <Shield className="h-4 w-4" />
                                        <AlertDescription>Your payment information is encrypted and secure.</AlertDescription>
                                    </Alert>

                                    <FormField label="Card Number" required error={errors.cardNumber?.message}>
                                        <div className="relative">
                                            <Input
                                                placeholder="1234 5678 9012 3456"
                                                {...register("cardNumber", {
                                                    required: "Card number is required",
                                                    onChange: (e) => {
                                                        e.target.value = formatCardNumber(e.target.value)
                                                    },
                                                })}
                                                className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
                                                maxLength={19}
                                            />
                                            <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                        </div>
                                    </FormField>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Expiry Date" required error={errors.expiryDate?.message}>
                                            <Input
                                                placeholder="MM/YY"
                                                {...register("expiryDate", {
                                                    required: "Expiry date is required",
                                                    onChange: (e) => {
                                                        e.target.value = formatExpiryDate(e.target.value)
                                                    },
                                                })}
                                                className={errors.expiryDate ? "border-red-500" : ""}
                                                maxLength={5}
                                            />
                                        </FormField>

                                        <FormField label="CVV" required error={errors.cvv?.message}>
                                            <Input
                                                placeholder="123"
                                                {...register("cvv", {
                                                    required: "CVV is required",
                                                    pattern: {
                                                        value: /^[0-9]{3,4}$/,
                                                        message: "Invalid CVV",
                                                    },
                                                })}
                                                className={errors.cvv ? "border-red-500" : ""}
                                                maxLength={4}
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="Name on Card" required error={errors.cardName?.message}>
                                        <Input
                                            placeholder="John Doe"
                                            {...register("cardName", { required: "Name on card is required" })}
                                            className={errors.cardName ? "border-red-500" : ""}
                                        />
                                    </FormField>

                                    <div className="space-y-3 pt-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="sameAsShipping" {...register("sameAsShipping")} />
                                            <label htmlFor="sameAsShipping" className="text-sm text-gray-700">
                                                Billing address same as shipping
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="saveInfo" {...register("saveInfo")} />
                                            <label htmlFor="saveInfo" className="text-sm text-gray-700">
                                                Save payment information for next time
                                            </label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Terms and Submit */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="newsletter" {...register("newsletter")} />
                                            <label htmlFor="newsletter" className="text-sm text-gray-700">
                                                Subscribe to our newsletter for updates and offers
                                            </label>
                                        </div>

                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="terms"
                                                {...register("terms", { required: "You must accept the terms" })}
                                                className={errors.terms ? "border-red-500" : ""}
                                            />
                                            <label htmlFor="terms" className="text-sm text-gray-700">
                                                I agree to the{" "}
                                                <a href="#" className="text-blue-600 hover:underline">
                                                    Terms of Service
                                                </a>{" "}
                                                and{" "}
                                                <a href="#" className="text-blue-600 hover:underline">
                                                    Privacy Policy
                                                </a>
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                        </div>
                                        {errors.terms && (
                                            <p className="text-sm text-red-600 flex items-center gap-1 ml-6">
                                                <span className="text-red-500">⚠</span>
                                                {errors.terms.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 h-12 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5 mr-2" />
                                                Complete Order - ${mockOrder.total.toFixed(2)}
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <Shield className="w-3 h-3 mr-1" />
                                            SSL Encrypted
                                        </div>
                                        <div className="flex items-center">
                                            <Lock className="w-3 h-3 mr-1" />
                                            Secure Payment
                                        </div>
                                        <div className="flex items-center">
                                            <Truck className="w-3 h-3 mr-1" />
                                            Free Shipping
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-6">
                        <OrderSummary order={{
                            ...mockOrder,
                            items: mockOrder.items.map(item => ({
                                ...item,
                                image: item.image
                            }))
                        }} />

                        {/* Promo Code */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Tag className="w-4 h-4" />
                                    Promo Code
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="outline" onClick={applyPromoCode} disabled={!promoCode}>
                                        Apply
                                    </Button>
                                </div>
                                {promoApplied && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        Promo code applied! You saved $36.00
                                    </div>
                                )}
                                {showPromoError && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        Invalid promo code. Try "SAVE10"
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Security Features */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        256-bit SSL encryption
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Lock className="w-4 h-4 text-green-600" />
                                        PCI DSS compliant
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Truck className="w-4 h-4 text-green-600" />
                                        Free shipping on orders over $50
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {
                        clientSecret && (
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: "stripe",
                                        variables: {
                                            colorPrimary: "hsl(var(--primary))",
                                            colorBackground: "hsl(var(--background))",
                                            colorText: "hsl(var(--foreground))",
                                            colorDanger: "hsl(var(--destructive))",
                                            fontFamily: "system-ui, sans-serif",
                                            spacingUnit: "4px",
                                            borderRadius: "8px",
                                        },
                                    },
                                }}
                            >
                                <PaymentForm
                                    onPaymentSuccess={handlePaymentSuccess}
                                    isSubmitting={isSubmitting}
                                    setIsSubmitting={setIsSubmitting}
                                />
                            </Elements>
                        )
                    }
                </div>
            </div>
        </div>
    )
}