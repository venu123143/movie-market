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

    const showSonnerToast = () => {
        sonnerToast("Sonner Toast", {
            description: "This is a toast from sonner",
        });
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Toast Examples</h1>
            <div className="space-x-4">
                <Button onClick={showShadcnToast}>Show Shadcn Toast</Button>
                <Button onClick={showSonnerToast}>Show Sonner Toast</Button>
            </div>
        </div>
    );
};

export default Home;

