import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ReactNode, useRef, useState, useEffect } from "react";

interface SlideGroupProps {
  items: object[];
  renderItem: (item: object, index: number) => ReactNode;
  gap?: number;
  showArrows?: boolean;
}

function SlideGroup({ items, renderItem, gap = 3, showArrows = true }: SlideGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const amount = containerRef.current.clientWidth * 0.8;
    containerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });

    setTimeout(updateScrollState, 300);
  };

  return (
    <Box sx={{ position: "relative", paddingX: showArrows ? 8 : 0 }}>
      {showArrows && (
        <IconButton
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255,255,255,1)",
            color: "primary",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            boxShadow: 3,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          gap,
          overflowX: "auto",
          scrollBehavior: "smooth",
          py: 1,
          px: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        onScroll={updateScrollState}
      >
        {items.map((item, index) => (
          <Box key={index} sx={{ flex: "0 0 auto" }}>
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>

      {showArrows && (
        <IconButton
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255,255,255,1)",
            color: "primary",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            boxShadow: 3,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default SlideGroup;
