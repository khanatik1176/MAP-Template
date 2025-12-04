import React, { FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { Ellipsis } from "lucide-react";

type GlobalBreadCrumbProps = {
  initialData?: string;
  secondaryData?: string;
  thirdData?: string;
  initialLink?: string;
  secondaryLink?: string;
  thirdLink?: string;
};

const GlobalBreadCrumb: FC<GlobalBreadCrumbProps> = ({
  initialLink,
  initialData,
  secondaryData,
  secondaryLink,
  thirdData,
  thirdLink,
}) => {
  return (
    <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center">
        {/* <SidebarTrigger className="-ml-5" /> */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={initialLink}
                className={secondaryData || thirdData ? "text-subHeading text-sm" : "!text-black text-sm"}
              >
                {initialData}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {secondaryData ? (
              <>
                <BreadcrumbSeparator className="text-subHeading" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={secondaryLink}
                    className={thirdData ? "text-subHeading text-sm hidden md:block" : "!text-black text-sm"}
                  >
                    {secondaryData}
                  </BreadcrumbLink>
                  {thirdData ? (
                    <BreadcrumbItem className="md:hidden">
                      <Ellipsis size={14} className="text-subHeading" />
                    </BreadcrumbItem>
                  ) : null}
                </BreadcrumbItem>
              </>
            ) : null}
            {thirdData ? (
              <>
                <BreadcrumbSeparator className="text-subHeading" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={thirdLink} className="!text-black text-sm">
                    {thirdData}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default GlobalBreadCrumb;