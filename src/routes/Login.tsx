import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import LoginImg from "@/assets/3d-loginimg.png"
import GoogleIcon from "@/assets/GOOGLE_ICON.png"



export function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { theme, setTheme } = useTheme();

    const handleGoogleLogin = async () => {
        // In a real implementation, this would redirect to Google OAuth
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
 
        // Simulate email login
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.href = '/auth/success';
        } catch (error) {
            console.error('Login failed:', error);
            window.location.href = '/auth/error';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden">
            {/* Left side - Branding */}
            <div className="relative hidden lg:flex h-full flex-col bg-muted text-white dark:border-r">
                <div className="login-image" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={LoginImg} alt="Login" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="lg:p-8 py-8 px-4 sm:px-6 md:px-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                            <CardDescription className="text-center">
                                Choose your preferred sign in method
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Google Login Button */}
                            <Button
                                variant="outline"
                                className="w-full gap-6 h-11 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <img src={GoogleIcon} alt="google icon" className='w-6 h-6' />
                                )}
                                Continue with Google
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* Email Login Form */}
                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-9 h-11"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="pl-9 pr-9 h-11"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Sign In
                                </Button>
                            </form>

                            <div className="text-center text-sm">
                                <Button variant="link" className="px-0 font-normal text-muted-foreground">
                                    Forgot your password?
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Theme Toggle */}
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            className="text-muted-foreground"
                        >
                            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}