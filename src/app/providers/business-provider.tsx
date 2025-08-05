'use client'
import { createContext, useContext, useState, useMemo } from "react";
import { Doc, Id } from "../../../convex/_generated/dataModel";

const BusinessContext = createContext<{
    businessId: Id<"businesses">
    setBusinessId: (businessId: Id<"businesses">) => void
    businesses: Doc<"businesses">[]
    setBusinesses: (businesses: Doc<"businesses">[]) => void
    selectedBusiness: Doc<"businesses"> | null
}>({
    businessId: "" as Id<"businesses">,
    setBusinessId: () => {},
    businesses: [],
    setBusinesses: () => {},
    selectedBusiness: null
})

export const useBusiness = () => {
    const context = useContext(BusinessContext)
    if (!context) {
        throw new Error("useBusiness must be used within a BusinessProvider")
    }
    return context
}

interface BusinessProviderProps {
    children: React.ReactNode
    initialBusinesses: Doc<"businesses">[]
}

export const BusinessProvider = ({ children, initialBusinesses }: BusinessProviderProps) => {
    
    // Always call hooks first, before any conditional logic
    const [businessId, setBusinessId] = useState<Id<"businesses">>(
        initialBusinesses?.[0]?._id || "" as Id<"businesses">
    )
    const [businesses, setBusinesses] = useState<Doc<"businesses">[]>(initialBusinesses || [])

    const selectedBusiness = useMemo(() => {
        return businesses.find(business => business._id === businessId) || null
    }, [businesses, businessId])

    const contextValue = useMemo(() => {
        return {
            businessId,
            setBusinessId,
            businesses,
            setBusinesses,
            selectedBusiness
        };
    }, [businessId, businesses, selectedBusiness])

    return (
        <BusinessContext.Provider value={contextValue}>
            {children}
        </BusinessContext.Provider>
    )
}