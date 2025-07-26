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
import { useBusiness } from "@/hooks/use-business";

export const ClientActionsDropdown = () => {
  const { businesses } = useBusiness();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Id<"businesses"> | null>(null);
  const { setBusinessId } = useBusiness();

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
              ? businesses.find((business) => business._id === value)?.businessName
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
                  setBusinessId(currentId as Id<"businesses">);
                  setValue(currentId === value ? null : currentId as Id<"businesses">);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "w-4 h-4",
                    value === business._id ? "opacity-100" : "opacity-0"
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
