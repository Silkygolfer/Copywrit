"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils/tw-utils";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useBusiness } from "@/app/providers/business-provider";

export const ClientActionsDropdown = () => {
  const { businesses, businessId, setBusinessId } = useBusiness();
  const [open, setOpen] = useState(false);

  return (
    <Popover 
    open={open} 
    onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="bg-none! bg-copywrit-blue/20 hover:bg-copywrit-blue/30 border border-copywrit-cream/20 hover:border-copywrit-cream/40 text-copywrit-cream w-[200px]"
        >
          <span>
            {businesses
              ? businesses.find((business) => business._id === businessId)?.businessName
              : "Select Client"}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search client..." />
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            {businesses.map((business) => (
              <CommandItem
                key={business._id}
                value={business._id}
                onSelect={(currentId: string) => {
                  const newBusinessId = currentId as Id<"businesses">;
                  setBusinessId(newBusinessId);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "w-4 h-4",
                    businessId === business._id ? "opacity-100" : "opacity-0"
                  )}
                />
                {business.businessName}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
