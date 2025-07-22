'use client'
import { Button } from "@/components/ui/button"
import { CheckIcon, ChevronDown, PlusIcon } from "lucide-react"
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useState } from "react";



export const ClientActionsDropdown = () => {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                className="bg-none! bg-copywrit-blue/20 hover:bg-copywrit-blue/30 border border-copywrit-cream/20 hover:border-copywrit-cream/40 text-copywrit-cream w-[200px]"
                >
                    Client Actions
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-0">
                <DropdownMenuItem>
                    <CheckIcon />
                    Selected Client
                </DropdownMenuItem>
            </DropdownMenuContent>
            
        </DropdownMenu>
    )
}