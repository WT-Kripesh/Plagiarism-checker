import { Avatar, IconButton, MenuItem, Menu } from "@material-ui/core";
import { Add, Apps, Menu as MenuIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { auth, logout } from "./firebase";
import { createDialogAtom, joinDialogAtom } from "./atom";
import CreateClass from "./createclass";
import JoinClass from "./joinclass";
import "./styles/navbar.css";

function Navbar() {
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createOpened, setCreateOpened] = useRecoilState(createDialogAtom);
  const [joinOpened, setJoinOpened] = useRecoilState(joinDialogAtom);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <CreateClass />
      <JoinClass />
      <nav className="navbar">
        <div className="navbar__left">
          <IconButton title="Menu">
            <MenuIcon />
          </IconButton>
          <Link
            to="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              // src="https://1000logos.net/wp-content/uploads/2021/05/Google-logo.png"
              src="./newLogo.png"
              //src="https://1000logos.net/wp-content/uploads/2020/10/Duolingo-logo.png"
              alt="Logo"
              className="navbar__logo"
            />{" "}
          </Link>
          <span>Classroom</span>
        </div>
        <div className="navbar__right">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Add />
          </IconButton>
          <IconButton title="All apps">
            <Apps />
          </IconButton>
          <IconButton onClick={logout} title="Logout">
            <Avatar src={user?.photoURL} />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {!createOpened && (
              <MenuItem
                onClick={() => {
                  setCreateOpened(true);
                  handleClose();
                }}
              >
                Create Class
              </MenuItem>
            )}
            {!joinOpened && (
              <MenuItem
                onClick={() => {
                  setJoinOpened(true);
                  handleClose();
                }}
              >
                Join Class
              </MenuItem>
            )}
          </Menu>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
