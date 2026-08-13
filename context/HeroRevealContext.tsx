"use client";

import { createContext, useContext } from "react";

/*
 * Lets `Hero` know when the Intro's doors have started unzipping,
 * without `page.tsx` (a server component) needing to hold that state
 * itself or be converted to a client component. `Intro` owns and
 * provides this value; `Hero` (already a client component) just reads
 * it with `useHeroRevealed()`.
 */
const HeroRevealContext = createContext(false);

export const HeroRevealProvider = HeroRevealContext.Provider;

export function useHeroRevealed() {
  return useContext(HeroRevealContext);
}
