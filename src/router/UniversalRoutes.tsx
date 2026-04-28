import {
  PrivacyPage,
  SupportPage, 
  TermsPage,
} from "@/pages";

export const universalRoutes = [
  { path: "/support", element: <SupportPage /> },
  { path: "/privacy", element: <PrivacyPage /> },
  { path: "/terms", element: <TermsPage /> },
];
