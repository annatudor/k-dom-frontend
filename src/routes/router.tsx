// src/routes/router.tsx - Actualizat cu protecția K-DOM
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
import { KDomProtectionWrapper } from "@/components/kdom/KDomProtectionWrapper";

// Pagini
import { Home } from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import StartKDom from "@/pages/StartKDom";
import CreatePostPage from "@/pages/CreatePostPage";
import PostDetailPage from "@/pages/PostDetailPage";
import CommunityPage from "@/pages/CommunityPage";
import CollaborationPage from "@/pages/CollaborationPage";

// Componente K-DOM (componente existente, fără logica de protecție)
import KDomPageContent from "@/pages/KDomPage";
import KDomHistoryPageContent from "@/pages/KDomHistoryPage";
import EditKDomPageContent from "@/pages/EditKDomPage";
import EditKDomMetadataPageContent from "@/pages/EditKDomMetadataPage";
import CreateSubKDomPageContent from "@/pages/CreateSubKDomPage";
import KDomDiscussionPageContent from "@/pages/KDomDiscussionPage";
import KDomCollaborationPageContent from "@/pages/KDomCollaborationPage";

// ✅ PAGINI K-DOM PROTEJATE - folosesc wrapper-ul de protecție
const ProtectedKDomPage = () => (
  <KDomProtectionWrapper action="view">
    {(kdom, accessResult) => (
      <KDomPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

const ProtectedKDomHistoryPage = () => (
  <KDomProtectionWrapper action="history">
    {(kdom, accessResult) => (
      <KDomHistoryPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

const ProtectedEditKDomPage = () => (
  <KDomProtectionWrapper action="edit">
    {(kdom, accessResult) => (
      <EditKDomPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

const ProtectedEditKDomMetadataPage = () => (
  <KDomProtectionWrapper action="metadata">
    {(kdom, accessResult) => (
      <EditKDomMetadataPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

const ProtectedCreateSubKDomPage = () => (
  <KDomProtectionWrapper action="create-sub">
    {(kdom, accessResult) => (
      <CreateSubKDomPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

const ProtectedKDomDiscussionPage = () => (
  <KDomProtectionWrapper action="discussion">
    {(kdom, accessResult) => (
      <KDomDiscussionPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

const ProtectedKDomCollaborationPage = () => (
  <KDomProtectionWrapper action="collaborate">
    {(kdom, accessResult) => (
      <KDomCollaborationPageContent kdom={kdom} accessResult={accessResult} />
    )}
  </KDomProtectionWrapper>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/start-kdom", element: <StartKDom /> },

      // ✅ RUTE K-DOM PROTEJATE
      { path: "/kdoms/slug/:slug", element: <ProtectedKDomPage /> },
      { path: "/kdoms/:slug/history", element: <ProtectedKDomHistoryPage /> },
      { path: "/kdoms/:slug/edit", element: <ProtectedEditKDomPage /> },
      {
        path: "/kdoms/:slug/metadata",
        element: <ProtectedEditKDomMetadataPage />,
      },
      {
        path: "/kdoms/:slug/create-sub",
        element: <ProtectedCreateSubKDomPage />,
      },
      {
        path: "/kdoms/slug/:slug/discussion",
        element: <ProtectedKDomDiscussionPage />,
      },
      {
        path: "/kdoms/:slug/collaboration",
        element: <ProtectedKDomCollaborationPage />,
      },

      // Alte rute neprotejate
      { path: "/create-post", element: <CreatePostPage /> },
      { path: "/posts/:postId", element: <PostDetailPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/collaboration", element: <CollaborationPage /> },
    ],
  },
]);
