import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import type { Corporate } from "@/types/corporate";
import { BoomBox } from "lucide-react";

interface CorporateDetailProps {
  corporate: Corporate;
}

const CorporateDetail = ({ corporate }: CorporateDetailProps) => {
  const getStatusVariant = (status: "ACTIVE" | "INACTIVE") => {
    return status === "ACTIVE" ? "primary" : "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-2">
        <Avatar className="h-20 w-20 border-4 border-background shadow-sm ring-2 ring-muted">
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${corporate.corporate_name}&background=random&color=fff`}
            alt={corporate.corporate_name}
          />
          <AvatarFallback className="text-2xl font-bold text-primary">
            {getInitials(corporate.corporate_name)}
          </AvatarFallback>
        </Avatar>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">
            {corporate.corporate_name}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-mono bg-muted px-2 py-0.5 rounded text-xs">
              <BoomBox className="w-3 h-3" />
              {corporate.corporate_code}
            </span>
          </div>
        </div>

        <div className="mt-2 sm:mt-0">
          <Badge
            variant={getStatusVariant(corporate.corporate_status)}
            className="px-3 py-1 text-sm uppercase"
          >
            {corporate.corporate_status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CorporateDetail;
