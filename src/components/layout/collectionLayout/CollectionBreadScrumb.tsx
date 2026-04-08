import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TENANT_ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";

function CollectionBreadScrumb({ collectionName }: { collectionName: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={TENANT_ROUTES.COLLECTIONS}>Collections</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {collectionName && <BreadcrumbSeparator />}

        {collectionName && (
          <BreadcrumbItem>
            <BreadcrumbPage>{collectionName || "Wishlist"}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default CollectionBreadScrumb;
