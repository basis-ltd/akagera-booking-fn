import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CustomBreadcrumbProps = {
  navigationLinks: { route: string; label: string }[];
};

const CustomBreadcrumb = ({ navigationLinks }: CustomBreadcrumbProps) => {
  const visibleLinks = navigationLinks?.slice(-3);
  const hiddenLinks = navigationLinks?.slice(0, -3);

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center gap-2">
        {hiddenLinks?.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenLinks?.map((link, index) => (
                    <DropdownMenuItem key={index}>
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
        {visibleLinks?.map((link, index: number) => (
          <menu key={index} className="flex items-center gap-2">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={link.route} className="text-[14px]">
                {link.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </menu>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
