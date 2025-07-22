'use client'
import { createContext, useContext, useState, useMemo } from "react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

const BusinessContext = createContext<{
    businessId: Id<"businesses">
    setBusinessId: (businessId: Id<"businesses">) => void
    businesses: Doc<"businesses">[]
    setBusinesses: (businesses: Doc<"businesses">[]) => void
}>({
    businessId: "" as Id<"businesses">,
    setBusinessId: () => {},
    businesses: [],
    setBusinesses: () => {}
})

export const useBusinessContext = () => {
    const context = useContext(BusinessContext)
    if (!context) {
        throw new Error("useBusinessContext must be used within a BusinessProvider")
    }
    return context
}

interface BusinessProviderProps {
    children: React.ReactNode
    initialBusinesses: Doc<"businesses">[]
}

export const BusinessProvider = ({ children, initialBusinesses }: BusinessProviderProps) => {

    // Ensure there's at least one business
    if (!initialBusinesses || initialBusinesses.length === 0) {
        return <div>No businesses found. Please create a business first.</div>
    }

    const [businessId, setBusinessId] = useState<Id<"businesses">>(initialBusinesses[0]._id)
    const [businesses, setBusinesses] = useState<Doc<"businesses">[]>(initialBusinesses)

    const contextValue = useMemo(() => ({
        businessId,
        setBusinessId,
        businesses,
        setBusinesses
    }), [businessId, businesses])

    return (
        <BusinessContext.Provider value={contextValue}>
            {children}
        </BusinessContext.Provider>
    )
}