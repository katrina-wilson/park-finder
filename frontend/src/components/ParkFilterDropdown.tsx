import React from "react";
import { IconButton, Popover, Box } from "@mui/material";

interface ParkFilterDropdownProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    handleClose: () => void;
};


function ParkFilterDropdown({ anchorEl, open, handleClose }: ParkFilterDropdownProps) {
  return (
    <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        className="tw:mt-1 tw:rounded-2xl"
    >
        <div className="tw:p-4 tw:rounded-2xl">
            Filters coming soon
        </div>
    </Popover>
  );
};

export default ParkFilterDropdown;