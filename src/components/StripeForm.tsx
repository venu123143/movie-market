import React, { useState } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';

interface StripeFormProps {
    onPaymentSuccess: (paymentIntentId: string) => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
    customerEmail?: string;
}

const StripeForm: React.FC<StripeFormProps> = ({
    onPaymentSuccess,
    isSubmitting,
    setIsSubmitting,
    customerEmail,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsSubmitting(true);
        setErrorMessage(null);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/success`,
                receipt_email: customerEmail
            },
            redirect: "if_required", // prevents redirection; useful for embedded flows
        });

        if (result.error) {
            setErrorMessage(result.error.message || 'Payment failed.');
            setIsSubmitting(false);
        } else if (result.paymentIntent) {
            onPaymentSuccess(result.paymentIntent.id);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />

            {errorMessage && (
                <div className="text-red-600 text-sm">{errorMessage}</div>
            )}

            <button
                type="submit"
                disabled={!stripe || isSubmitting}
                className="bg-primary text-white py-2 px-4 rounded hover:opacity-90 disabled:opacity-50"
            >
                {isSubmitting ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default StripeForm;
