import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw,  HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AuthError() {
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  // Get error details from URL params (in a real app)
  const urlParams = new URLSearchParams(window.location.search);
  const errorCode = urlParams.get('code') || 'unknown';
  const errorMessage = urlParams.get('message') || 'An unexpected error occurred during authentication.';

  const getErrorDetails = (code: string) => {
    switch (code) {
      case 'access_denied':
        return {
          title: 'Access Denied',
          message: 'You denied permission to access your account. Please try again and allow the necessary permissions.',
          suggestion: 'Make sure to click "Allow" when prompted by Google.'
        };
      case 'invalid_request':
        return {
          title: 'Invalid Request',
          message: 'The authentication request was invalid or malformed.',
          suggestion: 'This is usually a temporary issue. Please try signing in again.'
        };
      case 'server_error':
        return {
          title: 'Server Error',
          message: 'Our authentication server encountered an error.',
          suggestion: 'Please wait a moment and try again. If the problem persists, contact support.'
        };
      default:
        return {
          title: 'Authentication Failed',
          message: errorMessage,
          suggestion: 'Please try signing in again. If the problem continues, contact our support team.'
        };
    }
  };

  const errorDetails = getErrorDetails(errorCode);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Simulate retry delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/login');
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support form/chat
    window.open('mailto:support@example.com?subject=Authentication Error&body=Error Code: ' + errorCode);
  };

  return (
    <div className="container relative min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Authentication Failed</h1>
          <p className="text-muted-foreground">
            We encountered an issue while trying to sign you in.
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-red-600 dark:text-red-400">
              {errorDetails.title}
            </CardTitle>
            <CardDescription>
              {errorDetails.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Error Code:</strong> {errorCode.toUpperCase()}
                <br />
                <strong>Suggestion:</strong> {errorDetails.suggestion}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full h-11 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                {isRetrying ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Try Again
              </Button>

              <Button 
                variant="outline"
                onClick={handleGoHome}
                className="w-full h-11 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>

            <div className="border-t pt-4">
              <Button 
                variant="ghost"
                onClick={handleContactSupport}
                className="w-full h-11 text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <p><strong>Troubleshooting Tips:</strong></p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Make sure you have a stable internet connection</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try using a different browser or incognito mode</li>
                <li>Disable browser extensions that might interfere</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need immediate assistance? Contact our support team at{' '}
            <Button variant="link" className="px-0 h-auto text-xs" onClick={handleContactSupport}>
              support@example.com
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}