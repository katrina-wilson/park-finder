import * as React from 'react';
import { Avatar, Button, Dialog, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Login from './Login';
import { clearCurrentUser } from "../stores/authSlice";


function TopNav() {

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const [openLogin, setOpenLogin] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const userSettingsOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    handleClose();
    localStorage.removeItem("token");
  };

  return (
    <>
      <Dialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
            paper: {
                sx: {
                  borderRadius: 4,
                  border: "2px solid #000",
                  padding: 2,
                  boxShadow: 8,
                }
            }
        }}
      >
        <Login 
          isLanding={false}
          handleGoBack={() => setOpenLogin(false)} 
          handleLogin={() => setOpenLogin(false)} 
        />
      </Dialog>

      <div className="tw:h-18 tw:w-full tw:p-4 tw:flex tw:items-center tw:bg-primary tw:text-white">
        <div className="tw:w-full tw:text-4xl">
          Triangle Park Finder
        </div>

        <div>
          {currentUser ? (
            <>
              <Avatar
                alt={currentUser.name}
                onClick={handleAvatarClick}
                className="tw:cursor-pointer"
              >
                {currentUser.name[0].toUpperCase()}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={userSettingsOpen}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  onClick={handleLogout}
                >
                  Logout
                  </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              variant='outlined'
              color='inherit'
              onClick={() => setOpenLogin(true)}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default TopNav;