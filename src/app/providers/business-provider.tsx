'use client'
import { createContext, useContext, useState, useMemo, useCallback } from "react";
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
    console.log('BusinessProvider render', { initialBusinesses: initialBusinesses?.length });
    
    // Always call hooks first, before any conditional logic
    const [businessId, setBusinessIdState] = useState<Id<"businesses">>(
        initialBusinesses?.[0]?._id || "" as Id<"businesses">
    )
    // Use a ref to store the initial businesses and only update if they actually change
    const [businesses, setBusinessesState] = useState<Doc<"businesses">[]>(() => initialBusinesses || [])

    const setBusinessId = useCallback((newId: Id<"businesses">) => {
        console.log('setBusinessId called', { to: newId });
        setBusinessIdState(newId);
    }, []);

    const setBusinesses = useCallback((newBusinesses: Doc<"businesses">[]) => {
        console.log('setBusinesses called', { length: newBusinesses.length });
        setBusinessesState(newBusinesses);
    }, []);

    const selectedBusiness = useMemo(() => {
        console.log('selectedBusiness recalculated', { businessId, businessesLength: businesses.length, businessesRef: businesses });
        return businesses.find(business => business._id === businessId) || null
    }, [businesses, businessId])

    const contextValue = useMemo(() => {
        console.log('BusinessContext value recreated', { businessId, businessesLength: businesses.length, businessesRef: businesses });
        return {
            businessId,
            setBusinessId,
            businesses,
            setBusinesses,
            selectedBusiness
        };
    }, [businessId, setBusinessId, businesses, setBusinesses, selectedBusiness])

    return (
        <BusinessContext.Provider value={contextValue}>
            {children}
        </BusinessContext.Provider>
    )
}