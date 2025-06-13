import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AuthSuccess() {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        // In a real app, redirect to the main dashboard
        navigate('/');
    };

    return (
        <div className="container relative min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Authentication Successful!</h1>
                    <p className="text-muted-foreground">
                        You have been successfully signed in to your account.
                    </p>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg text-green-600 dark:text-green-400">
                            Welcome Back!
                        </CardTitle>
                        <CardDescription>
                            Your authentication was completed successfully. You can now access all features of your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                        Authentication Complete
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        Your session has been established and you're now logged in.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleGoToDashboard}
                                className="w-full h-11 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <User className="mr-2 h-4 w-4" />
                                Go to Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="w-full h-11 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button>
                        </div>

                        {/* <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Redirecting to dashboard in {countdown} seconds...</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div> */}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        If you experience any issues, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
}