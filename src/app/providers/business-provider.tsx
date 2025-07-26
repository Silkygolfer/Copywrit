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

export const useBusinessContext = () => {
    const context = useContext(BusinessContext)
    if (!context) {
        throw new Error("useBusinessContext must be used within a BusinessProvider")
    }
    return context
}

export const useBusiness = () => {
    const { selectedBusiness, businessId, setBusinessId, businesses } = useBusinessContext()
    
    return {
        business: selectedBusiness,
        businessId,
        setBusinessId,
        businesses,
    }
}

interface BusinessProviderProps {
    children: React.ReactNode
    initialBusinesses: Doc<"businesses">[]
}

export const BusinessProvider = ({ children, initialBusinesses }: BusinessProviderProps) => {

    if (!initialBusinesses || initialBusinesses.length === 0) {
        return <div>No businesses found. Please create a business first.</div>
    }

    const [businessId, setBusinessId] = useState<Id<"businesses">>(initialBusinesses[0]._id)
    const [businesses, setBusinesses] = useState<Doc<"businesses">[]>(initialBusinesses)

    const selectedBusiness = useMemo(() => {
        return businesses.find(business => business._id === businessId) || null
    }, [businesses, businessId])

    const contextValue = useMemo(() => ({
        businessId,
        setBusinessId,
        businesses,
        setBusinesses,
        selectedBusiness
    }), [businessId, businesses, selectedBusiness])

    return (
        <BusinessContext.Provider value={contextValue}>
            {children}
        </BusinessContext.Provider>
    )
}