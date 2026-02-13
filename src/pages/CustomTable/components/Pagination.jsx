import React, { useMemo, useState, useEffect } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function ResponsivePagination({
  currentPage,
  setCurrentPage,
  totalPages,
  records = [],
  pageSize = 10,
  totalRecords = 0,
}) {
  const isMobile = useIsMobile(640);

  const maxButtons = isMobile ? 3 : 7;
  const pagesToShow = useMemo(() => {
    if (totalPages <= maxButtons) return [...Array(totalPages)].map((_, i) => i + 1);

    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      start = 1;
      end = maxButtons;
    } else if (currentPage + half >= totalPages) {
      start = totalPages - maxButtons + 1;
      end = totalPages;
    }

    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [totalPages, currentPage, maxButtons]);

  return (
    <div className="flex items-center justify-between mt-4 w-full px-4">
      {/* Left info */}
      <div className="hidden sm:block text-sm text-slate-500">
        Showing <span className="font-medium">{Math.min(records.length, pageSize)}</span> of{" "}
        <span className="font-medium">{totalRecords}</span> records
      </div>

      {/* Pagination */}
      <div className="flex-1 flex justify-center sm:justify-end">
        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible py-1">
          <Pagination>
            <PaginationContent>
              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* First page + ellipsis */}
              {pagesToShow[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                      }}
                      isActive={currentPage === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="inline-flex items-center px-2">…</span>
                  </PaginationItem>
                </>
              )}

              {/* Windowed page numbers */}
              {pagesToShow.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(p);
                    }}
                    isActive={currentPage === p}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Last page + ellipsis */}
              {pagesToShow[pagesToShow.length - 1] < totalPages && (
                <>
                  <PaginationItem>
                    <span className="inline-flex items-center px-2">…</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(totalPages);
                      }}
                      isActive={currentPage === totalPages}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
