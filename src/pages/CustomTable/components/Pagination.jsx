import React, { useMemo, useState, useEffect } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useSelector } from "react-redux";
import axios from "axios";

function useIsMobile(breakpoint = 640) {
  // returns true if viewport width is < breakpoint (default 640 = sm)
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
  const isMobile = useIsMobile(640); // matches Tailwind "sm" breakpoint
    const userData = useSelector((state) => state.user);

  // Windowed pages logic: show fewer buttons on mobile
  const maxButtons = isMobile ? 3 : 7; // 3 on mobile, 7 on desktop
  const pagesToShow = useMemo(() => {
    if (totalPages <= maxButtons) return [...Array(totalPages)].map((_, i) => i + 1);

    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Adjust when near edges
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


      const fetchTableStructure = async () => {
      try {
        const apiParams = {
          schemaName: userData.schema_name,
          tableName: "jobstatus",
          userId: userData.id,
          userEmail: userData.email,
          page: 2 
        };
  
        // console.log('Fetching table structure for:', tableName);
  
        // Fetch all data to extract columns
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`,
          apiParams
        );
  
        console.log('Response:', response.data);
  
        const fetchedData = response.data.data || [];
        console.log(fetchedData)
  
       
      } catch (error) {
        console.error('Error fetching table structure:', error);
        throw error;
      }
    };
  return (
    <div className="flex items-center justify-between mt-4 w-full px-4">
      {/* Left info: hidden on mobile to save space */}
      <div className="hidden sm:block text-sm text-slate-500">
        Showing <span className="font-medium">{Math.min(records.length, pageSize)}</span> of{" "}
        <span className="font-medium">{totalRecords}</span> records
      </div>

      {/* Pagination */}
      <div className="flex-1 flex justify-center sm:justify-end">
        {/* Allow horizontal scroll on very small screens */}
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

              {/* If we collapsed pages (mobile) show first page + ellipsis when needed */}
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

                  {/* show ellipsis - hide on larger screens? Keep simple */}
                  <PaginationItem>
                    <span className="inline-flex items-center px-2">…</span>
                  </PaginationItem>
                </>
              )}

              {/* Render the windowed page numbers */}
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

              {/* If last shown page < totalPages show ellipsis + last page */}
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
                    fetchTableStructure()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    
                  }}
                  // className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
