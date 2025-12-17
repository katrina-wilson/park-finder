import * as React from 'react';
import { Avatar, Button, Dialog, Menu, MenuItem, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Login from './Login';
import { clearCurrentUser } from "../stores/authSlice";
import { useToast } from '../contexts/ToastContext';


function TopNav() {

  const dispatch = useDispatch();
  const { addToast } = useToast();

  // const { currentUser, currentUserStatus } = useSelector((state) => state.auth.currentUser);
  const { currentUser, status } = useSelector(
    (state) => state.auth ?? { currentUser: null, status: "idle" }
  );


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

    addToast({
      message: 'Successfully logged out!',
      severity: 'success',
      duration: 4000,
    });
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
          {status === 'loading' ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              currentUser ? (
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
              )
            )
          }
        </div>
      </div>
    </>
  )
}

export default TopNav;