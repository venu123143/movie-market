import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

const Home = () => {
    const showShadcnToast = () => {
        toast({
            title: "Shadcn Toast",
            description: "This is a toast from shadcn/ui",
        });
    };

    const showShadcnWarning = () => {
        toast({
            title: "Warning",
            description: "This is a warning toast",
            variant: "warning",
        });
    };

    const showShadcnError = () => {
        toast({
            title: "Error",
            description: "This is an error toast",
            variant: "destructive",
        });
    };

    const showSonnerToast = () => {
        sonnerToast("Sonner Toast", {
            description: "This is a toast from sonner",
        });
    };

    const showSonnerWarning = () => {
        sonnerToast.warning("Warning", {
            description: "This is a warning toast",
            style: {
                background: "#fef3c7",
                color: "#92400e",
                border: "1px solid #f59e0b",
            },
        });
    };

    const showSonnerError = () => {
        sonnerToast.error("Error", {
            description: "This is an error toast",
            style: {
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #ef4444",
            },
        });
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Toast Examples</h1>
            <div className="space-y-4">
                <div className="space-x-4">
                    <Button onClick={showShadcnToast}>Show Shadcn Toast</Button>
                    <Button onClick={showShadcnWarning} variant="secondary">Show Shadcn Warning</Button>
                    <Button onClick={showShadcnError} variant="destructive">Show Shadcn Error</Button>
                </div>
                <div className="space-x-4">
                    <Button onClick={showSonnerToast}>Show Sonner Toast</Button>
                    <Button onClick={showSonnerWarning} variant="secondary">Show Sonner Warning</Button>
                    <Button onClick={showSonnerError} variant="destructive">Show Sonner Error</Button>
                </div>
            </div>
        </div>
    );
};

export default Home;

