"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, RefreshCw, CreditCard, ArrowLeft, AlertTriangle, HelpCircle } from "lucide-react"

interface PaymentFailedProps {
    amount?: string
    transactionId?: string
    errorMessage?: string
    errorCode?: string
}

export default function PaymentFailed({
    amount = "$99.99",
    transactionId = "TXN-2024-001234",
    errorMessage = "Your card was declined. Please try a different payment method.",
    errorCode = "CARD_DECLINED",
}: PaymentFailedProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isShaking, setIsShaking] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setIsShaking(true)
            setTimeout(() => setIsShaking(false), 500)
        }, 300)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <Card
                className={`w-full max-w-md relative z-10 border-0 shadow-2xl bg-white/80 backdrop-blur-sm transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
                    } ${isShaking ? "animate-shake" : ""}`}
            >
                <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                        <div
                            className={`w-20 h-20 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center transition-all duration-700 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                                }`}
                        >
                            <XCircle className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
                        </div>
                    </div>

                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</CardTitle>
                    <CardDescription className="text-gray-600">
                        We couldn't process your payment. Please review the details below.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                    </Alert>

                    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border border-red-200">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600">Amount</span>
                            <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                                Failed
                            </Badge>
                        </div>
                        <div className="text-3xl font-bold text-red-600 mb-2">{amount}</div>
                        <div className="text-sm text-gray-500">
                            Transaction ID: <span className="font-mono">{transactionId}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Error Code: <span className="font-mono text-red-600">{errorCode}</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-blue-900 mb-1">Common Solutions</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Check your card details and billing address</li>
                                    <li>• Ensure sufficient funds are available</li>
                                    <li>• Try a different payment method</li>
                                    <li>• Contact your bank if the issue persists</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="group hover:bg-gray-50 transition-all duration-200 hover:scale-105 bg-transparent"
                        >
                            <CreditCard className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                            New Card
                        </Button>
                        <Button
                            variant="outline"
                            className="group hover:bg-gray-50 transition-all duration-200 hover:scale-105 bg-transparent"
                        >
                            <HelpCircle className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                            Support
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                            <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
                            Try Again
                        </Button>

                        <Button variant="ghost" className="w-full group hover:bg-gray-50 transition-all duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                            Back to Cart
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
