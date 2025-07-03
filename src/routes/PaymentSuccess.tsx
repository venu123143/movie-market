"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, ArrowRight, Sparkles } from "lucide-react"

interface PaymentSuccessProps {
    amount?: string
    transactionId?: string
    customerEmail?: string
    productName?: string
}

export default function PaymentSuccess({
    amount = "$99.99",
    transactionId = "TXN-2024-001234",
    customerEmail = "customer@example.com",
    productName = "Premium Subscription",
}: PaymentSuccessProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => setShowConfetti(true), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Card
                className={`w-full max-w-md relative z-10 border-0 shadow-2xl bg-white/80 backdrop-blur-sm transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                    }`}
            >
                <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                        <div
                            className={`w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center transition-all duration-700 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                                }`}
                        >
                            <CheckCircle className="w-10 h-10 text-white animate-bounce" />
                        </div>
                        {showConfetti && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-ping" />
                                <Sparkles className="w-4 h-4 text-pink-400 absolute -bottom-1 -left-2 animate-ping animation-delay-300" />
                                <Sparkles className="w-5 h-5 text-blue-400 absolute top-1 -left-3 animate-ping animation-delay-600" />
                            </div>
                        )}
                    </div>

                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</CardTitle>
                    <CardDescription className="text-gray-600">
                        Thank you for your purchase. Your payment has been processed successfully.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600">Amount Paid</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                Completed
                            </Badge>
                        </div>
                        <div className="text-3xl font-bold text-green-600 mb-2">{amount}</div>
                        <div className="text-sm text-gray-500">
                            Transaction ID: <span className="font-mono">{transactionId}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Product</span>
                            <span className="font-medium text-gray-900">{productName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium text-gray-900">{customerEmail}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Status</span>
                            <span className="font-medium text-green-600">Confirmed</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="group hover:bg-gray-50 transition-all duration-200 hover:scale-105 bg-transparent"
                        >
                            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                            Receipt
                        </Button>
                        <Button
                            variant="outline"
                            className="group hover:bg-gray-50 transition-all duration-200 hover:scale-105 bg-transparent"
                        >
                            <Mail className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                            Email
                        </Button>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                        Continue Shopping
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
