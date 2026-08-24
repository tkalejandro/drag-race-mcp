/**
 * List catalog codes so agents can map "france" / "latinas" to filter values.
 */

import {
  Currency,
  FRANCHISE_LABEL,
  FRANCHISE_REGION_CODES,
  FranchiseCode,
  FranchiseRegion,
} from "../../kb/catalogs.ts";
import {
  ORIGIN_REGION_ALIASES,
  ORIGIN_REGION_LABEL,
  OriginRegion,
} from "../../kb/origin.ts";

export const FRANCHISE_ALIASES: Record<FranchiseCode, readonly string[]> = {
  US: ["us", "rupauls drag race", "america"],
  AS: ["all stars", "allstars"],
  UK: ["uk", "britain", "united kingdom"],
  UKVTW: ["uk vs the world", "ukvtw"],
  DE: ["germany", "deutschland"],
  FR: ["france", "française", "francaise", "drag race france"],
  NL: ["holland", "netherlands", "dutch"],
  BE: ["belgium", "belgique", "belgië"],
  SE: ["sweden", "sverige"],
  ES: ["spain", "españa", "espana", "drag race españa"],
  ESAS: ["españa all stars", "spain all stars"],
  GAS: ["global all stars", "gas"],
  CA: ["canada", "canadas drag race"],
  CVTW: ["canada vs the world", "cvtw"],
  CAS: ["canada all stars"],
  DU: ["down under", "australia"],
  DUVTW: ["down under vs the world"],
  TH: ["thailand"],
  PH: ["philippines"],
  PHSR: ["slaysian royale", "philippines slaysian"],
  IT: ["italy", "italia"],
  BR: ["brazil", "brasil"],
  MX: ["mexico", "méxico"],
  MXLR: ["mexico latina royale", "latina royale"],
};

export type CatalogKind = "franchises" | "regions" | "origin_regions" | "currencies";

export type CatalogRow = {
  code: string;
  label: string;
  region?: string;
  aliases?: string[];
};

export const listCatalogs = (kind: CatalogKind): CatalogRow[] => {
  if (kind === "franchises") {
    return Object.values(FranchiseCode).map((code) => {
      const region = (
        Object.entries(FRANCHISE_REGION_CODES) as [
          FranchiseRegion,
          readonly FranchiseCode[],
        ][]
      ).find(([, codes]) => codes.includes(code))?.[0];
      return {
        code,
        label: FRANCHISE_LABEL[code],
        ...(region ? { region } : {}),
        aliases: [...FRANCHISE_ALIASES[code]],
      };
    });
  }
  if (kind === "regions") {
    return Object.values(FranchiseRegion).map((code) => ({
      code,
      label: code,
      aliases: [code],
    }));
  }
  if (kind === "origin_regions") {
    return Object.values(OriginRegion).map((code) => ({
      code,
      label: ORIGIN_REGION_LABEL[code],
      aliases: [...ORIGIN_REGION_ALIASES[code]],
    }));
  }
  return Object.values(Currency).map((code) => ({
    code,
    label: code,
  }));
};
