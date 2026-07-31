"use client";
import React from "react";
import { Sidebar } from "./sidebar";

/**
 * Thin wrapper kept for import compatibility. Nav items now live in
 * ./navLinks.js so the rail, drawer and mobile tab bar share one list.
 */
const Sidepane = ({ mobileOpen, setMobileOpen }) => (
  <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
);

export default Sidepane;
