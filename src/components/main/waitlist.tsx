"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type FormData = z.infer<typeof schema>;

export default function Waitlist() {
    const joinWaitlist = useMutation(api.waitlist.join);

    const waitlistCount = useQuery(api.waitlist.count);

    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onSubmit"
    })

    const onSubmit = async (data: FormData) => {
        try {
            const { success, error } = await joinWaitlist({ email: data.email });
            if (success) {
                reset();
                toast.success("Successfully joined waitlist!");
            } 
            
            if (error) {
                toast.error(error || "Failed to join waitlist");
            }
        } catch (error: unknown) {
            console.error("Failed to join waitlist:", error);
            toast.error((error as Error).message || "Failed to join waitlist");
        }
    }

    return (
        <section className="py-32" id="waitlist">
            <div className="w-full flex justify-center px-4">
                <div className="mx-auto flex max-w-screen-md flex-col gap-10">
                    <h1 className="text-center text-copywrit-cream text-3xl font-bold lg:text-5xl">
                        Join the waitlist
                    </h1>
                    <p className="text-center text-lg text-copywrit-cream lg:text-2xl">
                        Be the first to know when we launch and get early access to Copywrit.ai
                    </p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mx-auto flex w-full max-w-md flex-col gap-4 sm:flex-row sm:gap-2"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 rounded-md border px-4 py-2 border-copywrit-cream/50 hover:border-copywrit-cream/70 shadow-md transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-copywrit-cream text-copywrit-cream placeholder:text-copywrit-cream/50"
                            {...register("email")}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-copywrit-blue px-6 py-2 text-copywrit-cream hover:bg-copywrit-blue/90 disabled:opacity-50"
                        >
                            {isSubmitting ? "Joining..." : "Join Waitlist"}
                        </button>
                    </form>
                    <div className="text-center text-copywrit-cream">
                        <p className="text-sm">Join the {waitlistCount?.toString() || ""} writers who want to save time and write better copy </p>
                    </div>
                </div>
            </div>
        </section>
    );
}