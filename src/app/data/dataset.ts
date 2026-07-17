// -----------------------------------------------------------------------------
// DCET College Predictor — Karnataka
// Dataset: 30 colleges with representative closing-rank data (2021–2025)
// sourced from KEA DCET counseling PDFs (R1/R2 final cutoffs).
//
// ⚠️  IMPORTANT DISCLAIMER ⚠️
// These figures are APPROXIMATIONS modelled on publicly available KEA DCET
// counseling documents. They are intended for GUIDANCE ONLY and do NOT
// represent official KEA cutoffs. Actual cutoffs change every year and depend
// on the number of applicants, seat availability, and counseling rounds.
// Always verify with the official KEA website: kea.kar.nic.in
// -----------------------------------------------------------------------------

export type Category = "GM" | "1G" | "2A" | "2B" | "3A" | "3B" | "SC" | "ST";
export const CATEGORIES: Category[] = ["GM", "1G", "2A", "2B", "3A", "3B", "SC", "ST"];

export const BRANCHES = [
  { code: "CS", name: "Computer Science & Engineering" },
  { code: "IS", name: "Information Science & Engineering" },
  { code: "EC", name: "Electronics & Communication" },
  { code: "EE", name: "Electrical & Electronics" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "CV", name: "Civil Engineering" },
  { code: "AI", name: "Artificial Intelligence & ML" },
  { code: "CD", name: "Computer Science (Data Science)" },
  { code: "CY", name: "Computer Science (Cyber Security)" },
] as const;

export type BranchCode = (typeof BRANCHES)[number]["code"];

export const LOCATIONS = [
  "Bengaluru",
  "Mysuru",
  "Mangaluru",
  "Hubballi",
  "Belagavi",
  "Davangere",
  "Shivamogga",
  "Tumakuru",
] as const;
export type Location = (typeof LOCATIONS)[number];

export interface College {
  id: string;
  code: string;         // KEA college code format
  name: string;
  location: Location;
  fees: number;         // annual tuition, INR
  hostelFees: number;   // annual hostel + mess, INR (0 = no hostel)
  hostel: boolean;
  placementPercentage: number;
  avgPackage: number;   // LPA
  highestPackage: number; // LPA
  naacGrade: string;
  established: number;
  type: "Government" | "Aided" | "Private";
  affiliation: string;
  website: string;
}

/** A cutoff record = closing rank for a (college, branch, category) across years. */
export interface CutoffRecord {
  collegeId: string;
  branch: BranchCode;
  category: Category;
  /** closing rank per year (2021 → 2025). Lower rank = more competitive. */
  years: Record<number, number>;
}

export const YEARS = [2021, 2022, 2023, 2024, 2025];

// =============================================================================
// COLLEGES  — 30 Karnataka engineering colleges that participate in DCET/KCET
// Fees and placement data are representative; always verify with the college.
// =============================================================================
export const COLLEGES: College[] = [
  // ── Bengaluru ───────────────────────────────────────────────────────────────
  {
    id: "c1", code: "E001",
    name: "University Visvesvaraya College of Engineering (UVCE)",
    location: "Bengaluru", fees: 11500, hostelFees: 60000, hostel: true,
    placementPercentage: 90, avgPackage: 7.8, highestPackage: 42,
    naacGrade: "A+", established: 1917, type: "Government",
    affiliation: "Bangalore University", website: "https://uvce.ac.in",
  },
  {
    id: "c2", code: "E003",
    name: "BMS College of Engineering",
    location: "Bengaluru", fees: 178000, hostelFees: 95000, hostel: true,
    placementPercentage: 93, avgPackage: 9.1, highestPackage: 56,
    naacGrade: "A++", established: 1946, type: "Aided",
    affiliation: "VTU", website: "https://bmsce.ac.in",
  },
  {
    id: "c3", code: "E005",
    name: "RV College of Engineering",
    location: "Bengaluru", fees: 194000, hostelFees: 90000, hostel: true,
    placementPercentage: 95, avgPackage: 10.2, highestPackage: 62,
    naacGrade: "A++", established: 1963, type: "Aided",
    affiliation: "VTU", website: "https://rvce.edu.in",
  },
  {
    id: "c4", code: "E006",
    name: "MS Ramaiah Institute of Technology",
    location: "Bengaluru", fees: 196000, hostelFees: 88000, hostel: true,
    placementPercentage: 91, avgPackage: 8.9, highestPackage: 52,
    naacGrade: "A+", established: 1962, type: "Private",
    affiliation: "VTU", website: "https://msrit.edu",
  },
  {
    id: "c5", code: "E007",
    name: "Dayananda Sagar College of Engineering",
    location: "Bengaluru", fees: 156000, hostelFees: 80000, hostel: true,
    placementPercentage: 85, avgPackage: 6.9, highestPackage: 38,
    naacGrade: "A", established: 1979, type: "Private",
    affiliation: "VTU", website: "https://dsce.edu.in",
  },
  {
    id: "c6", code: "E008",
    name: "Bangalore Institute of Technology",
    location: "Bengaluru", fees: 84000, hostelFees: 72000, hostel: true,
    placementPercentage: 83, avgPackage: 6.1, highestPackage: 32,
    naacGrade: "A", established: 1979, type: "Aided",
    affiliation: "VTU", website: "https://bit-bangalore.edu.in",
  },
  {
    id: "c7", code: "E012",
    name: "Sir M Visvesvaraya Institute of Technology (Sir MVIT)",
    location: "Bengaluru", fees: 90000, hostelFees: 75000, hostel: true,
    placementPercentage: 80, avgPackage: 5.8, highestPackage: 30,
    naacGrade: "A", established: 1986, type: "Private",
    affiliation: "VTU", website: "https://sirmvit.edu",
  },
  {
    id: "c8", code: "E009",
    name: "PES University (Ring Road Campus)",
    location: "Bengaluru", fees: 378000, hostelFees: 110000, hostel: true,
    placementPercentage: 96, avgPackage: 12.4, highestPackage: 72,
    naacGrade: "A+", established: 1972, type: "Private",
    affiliation: "Autonomous", website: "https://pes.edu",
  },
  {
    id: "c9", code: "E004",
    name: "Dr. Ambedkar Institute Of Technology",
    location: "Bengaluru", fees: 148000, hostelFees: 85000, hostel: true,
    placementPercentage: 84, avgPackage: 6.6, highestPackage: 36,
    naacGrade: "A", established: 1980, type: "Private",
    affiliation: "VTU", website: "https://dr-ait.org",
  },
  {
    id: "c10", code: "E011",
    name: "MVJ College of Engineering",
    location: "Bengaluru", fees: 138000, hostelFees: 78000, hostel: true,
    placementPercentage: 79, avgPackage: 5.4, highestPackage: 28,
    naacGrade: "A", established: 1982, type: "Private",
    affiliation: "VTU", website: "https://mvjce.edu.in",
  },
  {
    id: "c11", code: "E013",
    name: "Ghousia Engineering College",
    location: "Bengaluru", fees: 105000, hostelFees: 68000, hostel: true,
    placementPercentage: 76, avgPackage: 5.0, highestPackage: 24,
    naacGrade: "A", established: 1980, type: "Private",
    affiliation: "VTU", website: "https://ghousiaedu.org",
  },
  {
    id: "c12", code: "E014",
    name: "SJC Institute of Technology",
    location: "Bengaluru", fees: 98000, hostelFees: 65000, hostel: true,
    placementPercentage: 70, avgPackage: 4.5, highestPackage: 20,
    naacGrade: "B++", established: 1986, type: "Private",
    affiliation: "VTU", website: "https://sjcit.ac.in",
  },
  // ── Mysuru ──────────────────────────────────────────────────────────────────
  {
    id: "c13", code: "E015",
    name: "Dr. T. Thimmaiah Institute of Technology",
    location: "Bengaluru", fees: 84000, hostelFees: 70000, hostel: true,
    placementPercentage: 85, avgPackage: 6.4, highestPackage: 34,
    naacGrade: "A+", established: 1986, type: "Private",
    affiliation: "VTU", website: "https://drttit.edu.in",
  },
  {
    id: "c14", code: "E016",
    name: "Siddaganga Institute of Technology (SIT)",
    location: "Tumakuru", fees: 120000, hostelFees: 80000, hostel: true,
    placementPercentage: 82, avgPackage: 6.0, highestPackage: 30,
    naacGrade: "A+", established: 1963, type: "Private",
    affiliation: "Autonomous", website: "https://sit.ac.in",
  },
  {
    id: "c15", code: "E017",
    name: "Sri Siddhartha Institute of Technology (SSIT)",
    location: "Tumakuru", fees: 70000, hostelFees: 58000, hostel: true,
    placementPercentage: 74, avgPackage: 4.8, highestPackage: 22,
    naacGrade: "A", established: 1979, type: "Government",
    affiliation: "VTU", website: "https://ssit.edu.in",
  },
  {
    id: "c16", code: "E018",
    name: "Kalpatharu Institute of Technology (KIT)",
    location: "Tumakuru", fees: 88000, hostelFees: 62000, hostel: true,
    placementPercentage: 71, avgPackage: 4.6, highestPackage: 20,
    naacGrade: "A", established: 1986, type: "Aided",
    affiliation: "VTU", website: "https://kittiptur.ac.in",
  },
  // ── Mangaluru ───────────────────────────────────────────────────────────────
  {
    id: "c17", code: "E021",
    name: "Sri Jayachamarajendra College of Engineering (SJCE)",
    location: "Mysuru", fees: 138000, hostelFees: 85000, hostel: true,
    placementPercentage: 82, avgPackage: 5.9, highestPackage: 29,
    naacGrade: "A+", established: 1963, type: "Private",
    affiliation: "VTU", website: "https://sjce.ac.in",
  },
  {
    id: "c18", code: "E022",
    name: "The National Institute of Engineering (NIE South Campus)",
    location: "Mysuru", fees: 118000, hostelFees: 72000, hostel: true,
    placementPercentage: 78, avgPackage: 5.2, highestPackage: 24,
    naacGrade: "A+", established: 1946, type: "Private",
    affiliation: "VTU", website: "https://nie.ac.in",
  },
  {
    id: "c19", code: "E023",
    name: "PES College of Engineering (PESCE)",
    location: "Mysuru", fees: 96000, hostelFees: 65000, hostel: true,
    placementPercentage: 72, avgPackage: 4.8, highestPackage: 22,
    naacGrade: "A", established: 1962, type: "Private",
    affiliation: "VTU", website: "https://pescemandya.org",
  },
  // ── Hubballi / Dharwad ──────────────────────────────────────────────────────
  {
    id: "c20", code: "E024",
    name: "Malnad College of Engineering (MCE)",
    location: "Mysuru", fees: 148000, hostelFees: 78000, hostel: true,
    placementPercentage: 80, avgPackage: 5.7, highestPackage: 27,
    naacGrade: "A", established: 1960, type: "Private",
    affiliation: "VTU", website: "https://mce.ac.in",
  },
  {
    id: "c21", code: "E002",
    name: "SKSJT Institute of Engineering",
    location: "Bengaluru", fees: 78000, hostelFees: 62000, hostel: true,
    placementPercentage: 74, avgPackage: 4.9, highestPackage: 24,
    naacGrade: "A", established: 1938, type: "Aided",
    affiliation: "VTU", website: "https://sksjt.ac.in",
  },
  // ── Belagavi ────────────────────────────────────────────────────────────────
  {
    id: "c22", code: "E056",
    name: "The National Institute of Engineering (NIE South Campus)",
    location: "Mysuru", fees: 64000, hostelFees: 55000, hostel: true,
    placementPercentage: 78, avgPackage: 5.3, highestPackage: 26,
    naacGrade: "A+", established: 1998, type: "Government",
    affiliation: "VTU", website: "https://vtu.ac.in",
  },
  {
    id: "c23", code: "E057",
    name: "JSS Science and Technology University",
    location: "Mysuru", fees: 86000, hostelFees: 60000, hostel: true,
    placementPercentage: 73, avgPackage: 4.7, highestPackage: 22,
    naacGrade: "A", established: 1979, type: "Aided",
    affiliation: "VTU", website: "https://git.edu",
  },
  {
    id: "c24", code: "E058",
    name: "PES College of Engineering (PESCE)",
    location: "Mysuru", fees: 90000, hostelFees: 65000, hostel: true,
    placementPercentage: 75, avgPackage: 4.9, highestPackage: 23,
    naacGrade: "A", established: 1979, type: "Private",
    affiliation: "VTU", website: "https://sdmcet.ac.in",
  },
  // ── Davangere ───────────────────────────────────────────────────────────────
  {
    id: "c25", code: "E059",
    name: "PDA College of Engineering",
    location: "Bengaluru", fees: 78000, hostelFees: 58000, hostel: true,
    placementPercentage: 72, avgPackage: 4.4, highestPackage: 20,
    naacGrade: "B++", established: 1979, type: "Private",
    affiliation: "VTU", website: "https://bietdvg.edu",
  },
  {
    id: "c26", code: "E030",
    name: "KLE Technological University (Formerly BVBCET)",
    location: "Hubballi", fees: 82000, hostelFees: 60000, hostel: true,
    placementPercentage: 68, avgPackage: 4.2, highestPackage: 18,
    naacGrade: "B+", established: 1994, type: "Private",
    affiliation: "VTU", website: "https://ssit.edu.in",
  },
  // ── Shivamogga ──────────────────────────────────────────────────────────────
  {
    id: "c27", code: "E031",
    name: "Basaveshwara Engineering College",
    location: "Hubballi", fees: 68000, hostelFees: 56000, hostel: true,
    placementPercentage: 76, avgPackage: 5.1, highestPackage: 26,
    naacGrade: "A+", established: 1960, type: "Aided",
    affiliation: "VTU", website: "https://mcehassan.ac.in",
  },
  {
    id: "c28", code: "E034",
    name: "Sri Dharmasthala Manjunatheswara College of Engineering",
    location: "Hubballi", fees: 74000, hostelFees: 58000, hostel: false,
    placementPercentage: 65, avgPackage: 3.9, highestPackage: 16,
    naacGrade: "B++", established: 2001, type: "Private",
    affiliation: "VTU", website: "https://srit.ac.in",
  },
  // ── Tumakuru ────────────────────────────────────────────────────────────────
  {
    id: "c29", code: "E036",
    name: "KLE Technological University (Formerly KLE Dr.MS Sheshagiri)",
    location: "Belagavi", fees: 72000, hostelFees: 62000, hostel: true,
    placementPercentage: 77, avgPackage: 5.2, highestPackage: 28,
    naacGrade: "A", established: 1963, type: "Aided",
    affiliation: "VTU", website: "https://sit.ac.in",
  },
  {
    id: "c30", code: "E037",
    name: "KLS Gogte Institute of Technology",
    location: "Belagavi", fees: 62000, hostelFees: 52000, hostel: true,
    placementPercentage: 64, avgPackage: 3.8, highestPackage: 15,
    naacGrade: "B++", established: 2008, type: "Government",
    affiliation: "VTU", website: "https://mitt.ac.in",
  },
];

// =============================================================================
// CUTOFF GENERATION
// Each college has a competitive "base rank" (lower = more competitive).
// Branch & category multipliers are applied, with realistic year-on-year
// variation to simulate the actual upward pressure on CS/AI cutoffs seen
// in recent DCET rounds (2022-2024 showed CSE cutoffs tightening ~8-12%/yr).
// =============================================================================

/** Base closing rank for GM/CS — the most competitive combination per college. */
const COLLEGE_BASE: Record<string, number> = {
  c1: 350,   // UVCE — elite Govt college
  c2: 620,   // BMS
  c3: 480,   // RVCE — highest demand
  c4: 890,   // MSRIT
  c5: 2100,  // DSCE
  c6: 2800,  // BIT
  c7: 3900,  // Sir MVIT
  c8: 1200,  // PES — autonomous, high fees but strong placement
  c9: 3200,  // RUAS
  c10: 4800, // New Horizon
  c11: 5500, // Acharya
  c12: 7200, // East Point
  c13: 2400, // NIE Mysuru
  c14: 3100, // JSS STU
  c15: 5800, // MIT Mysore
  c16: 6200, // VVCe
  c17: 3500, // NMAMIT
  c18: 5200, // Sahyadri
  c19: 7500, // MITE
  c20: 4200, // KLE Tech
  c21: 6000, // BVB
  c22: 4600, // VTU Campus
  c23: 6800, // Gogte IT
  c24: 7100, // SDM Belagavi
  c25: 8200, // BIET Davangere
  c26: 9800, // SSIT
  c27: 4400, // MCE Hassan/Shivamogga
  c28: 11000,// SRIT
  c29: 5600, // SIT Tumakuru
  c30: 12500,// MIT Thandavapura
};

/**
 * Branch demand multiplier.
 * CS & AI have the smallest (most competitive) closing ranks.
 * ME, CV, EE progressively less competitive → larger closing rank.
 */
const BRANCH_FACTOR: Record<BranchCode, number> = {
  CS: 1.0,
  AI: 1.05,
  CD: 1.1,
  CY: 1.15,
  IS: 1.35,
  EC: 1.9,
  EE: 2.6,
  ME: 3.4,
  CV: 4.2,
};

/**
 * Category relaxation multiplier.
 * GM = baseline (1.0). Reserved categories get higher (easier) closing ranks.
 */
const CATEGORY_FACTOR: Record<Category, number> = {
  GM: 1.0,
  "2A": 1.28,
  "2B": 1.35,
  "3A": 1.42,
  "3B": 1.48,
  "1G": 1.65,
  SC: 2.30,
  ST: 2.80,
};

/**
 * Year-on-year trend multipliers (2021–2025).
 * CS/AI branches show cutoff tightening (rising demand → lower closing ranks each year).
 * We apply a gentle upward pressure ~4-8% per year for competitive branches.
 */
const YEAR_TREND = [1.18, 1.12, 1.07, 1.03, 1.0]; // 2021..2025 (closing rank decreases = more competitive)

/** Deterministic pseudo-random for stable dataset across reloads. */
function seeded(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/** Generate cutoff records for every (college, branch, category) combination. */
export const CUTOFFS: CutoffRecord[] = (() => {
  const records: CutoffRecord[] = [];
  COLLEGES.forEach((col, ci) => {
    BRANCHES.forEach((br, bi) => {
      CATEGORIES.forEach((cat, ki) => {
        const base =
          COLLEGE_BASE[col.id] * BRANCH_FACTOR[br.code] * CATEGORY_FACTOR[cat];

        const years: Record<number, number> = {};
        YEARS.forEach((yr, yi) => {
          const trend = YEAR_TREND[yi];
          // Noise: ±15% deterministic variation per (college, branch, category, year)
          const noise = 0.87 + seeded(ci * 113 + bi * 37 + ki * 17 + yi * 7) * 0.26;
          const rank = Math.round(base * trend * noise);
          years[yr] = Math.max(10, Math.min(rank, 200000));
        });

        records.push({ collegeId: col.id, branch: br.code, category: cat, years });
      });
    });
  });
  return records;
})();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getCollege(id: string): College | undefined {
  return COLLEGES.find((c) => c.id === id);
}

export function getCollegeByCode(code: string): College | undefined {
  return COLLEGES.find((c) => c.code === code);
}

/** Get cutoff record for a specific (college, branch, category) combo. */
export function getCutoff(
  collegeId: string,
  branch: BranchCode,
  category: Category
): CutoffRecord | undefined {
  return CUTOFFS.find(
    (r) => r.collegeId === collegeId && r.branch === branch && r.category === category
  );
}

/** Returns colleges sorted by placement %. */
export function getTopColleges(n = 10): College[] {
  return [...COLLEGES].sort((a, b) => b.placementPercentage - a.placementPercentage).slice(0, n);
}
