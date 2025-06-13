// // src/components/providers/PostHogProvider.tsx - CREEAZĂ ACEST FIȘIER NOU
// "use client";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect } from "react";

// if (typeof window !== "undefined") {
//   posthog.init("phc_lUyIsiuJU2lxv0bsx9Huynxy2qdoWxbYIKgWi5C4xMM", {
//     api_host: "https://app.posthog.com",
//     capture_pageviews: true, // CORECTEAZĂ: era capture_pageviews
//     capture_pageleaves: true,
//     disable_session_recording: false,
//     loaded: () => {
//       if (
//         typeof window !== "undefined" &&
//         window.location.hostname === "localhost"
//       ) {
//         console.log("PostHog loaded successfully");
//       }
//     },
//   });
// }

// // Component pentru identificarea utilizatorilor
// function PostHogIdentifier({ children }: { children: React.ReactNode }) {
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user && typeof window !== "undefined") {
//       posthog.identify(user.id.toString(), {
//         // Elimină email și name dacă nu există în AuthUser
//         // email: user.email,
//         // name: user.name,
//         role: user.role,
//         userId: user.id,
//       });
//     } else if (!user && typeof window !== "undefined") {
//       posthog.reset();
//     }
//   }, [user]);

//   return <>{children}</>;
// }

// // Provider principal
// export default function PostHogAnalyticsProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <PostHogProvider client={posthog}>
//       <PostHogIdentifier>{children}</PostHogIdentifier>
//     </PostHogProvider>
//   );
// }
