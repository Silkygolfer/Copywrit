import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { BusinessContext } from "../../../convex/schema"
import { CopywritSystemPrompt } from "../../../src/prompts/CopywritSystemPrompt";

export class SystemPromptBuilder {
    private convex: ConvexHttpClient;
    private businessId: Id<"businesses">;

    constructor(businessId: Id<"businesses">) {
        this.convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        this.businessId = businessId;
    }

    async getBusinessContext(): Promise<BusinessContext> {
        const business = await this.convex.query(api.businesses.getBusiness, { businessId: this.businessId });
        if (!business) {
            throw new Error("Business not found");
        }
        return business.businessContext;
    }

    async buildSystemPrompt() {
        const businessContext = await this.getBusinessContext();
        return CopywritSystemPrompt(businessContext)        
    }
}