// src/routes/router.tsx - Temporary fix
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
import { KDomProtectionWrapper } from "@/components/kdom/KDomProtectionWrapper";

// Pagini
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import StartKDom from "@/pages/StartKDom";
import CreatePostPage from "@/pages/CreatePostPage";
import PostDetailPage from "@/pages/PostDetailPage";
import CommunityPage from "@/pages/CommunityPage";
import CollaborationPage from "@/pages/CollaborationPage";
import ExplorePage from "@/pages/ExplorePage";

// Componente K-DOM (componente existente, fără logica de protecție)
import KDomPageContent from "@/pages/KDomPage";
import KDomHistoryPageContent from "@/pages/KDomHistoryPage";
import EditKDomPageContent from "@/pages/EditKDomPage";
import EditKDomMetadataPageContent from "@/pages/EditKDomMetadataPage";
import CreateSubKDomPageContent from "@/pages/CreateSubKDomPage";
import KDomDiscussionPageContent from "@/pages/KDomDiscussionPage";
import KDomCollaborationPageContent from "@/pages/KDomCollaborationPage";
import ModerationGuidelines from "@/components/moderation/ModerationGuidelines";
import AdminModerationPage from "@/pages/AdminModerationPage";
import UserModerationPage from "@/pages/UserModerationPage";
import ModerationHistoryPage from "@/pages/ModerationHistoryPage";
import UserProfilePage from "@/pages/UserProfilePage";
import EditProfilePage from "@/pages/EditProfilePage";
import AuditLogPage from "@/pages/AuditLogPage";

// Type assertion helper to handle components that don't accept props yet
type KDomProps = { kdom: unknown; accessResult: unknown };

const withProps =
  <P extends KDomProps>(Component: React.ComponentType<P>) =>
  (props: KDomProps) =>
    <Component {...(props as P)} />;

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
      { path: "/", element: <HomePage /> },
      { path: "/start-kdom", element: <StartKDom /> },

      // ✅ RUTE K-DOM PROTEJATE
      {
        path: "/kdoms/slug/:slug",
        element: (
          <KDomProtectionWrapper action="view">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(KDomPageContent);
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },
      {
        path: "/kdoms/:slug/history",
        element: (
          <KDomProtectionWrapper action="history">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(KDomHistoryPageContent);
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },
      {
        path: "/kdoms/:slug/edit",
        element: (
          <KDomProtectionWrapper action="edit">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(EditKDomPageContent);
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },
      {
        path: "/kdoms/:slug/metadata",
        element: (
          <KDomProtectionWrapper action="metadata">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(EditKDomMetadataPageContent);
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },
      {
        path: "/kdoms/:slug/create-sub",
        element: (
          <KDomProtectionWrapper action="create-sub">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(CreateSubKDomPageContent);
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },
      {
        path: "/kdoms/slug/:slug/discussion",
        element: (
          <KDomProtectionWrapper action="discussion">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(KDomDiscussionPageContent);
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },
      {
        path: "/kdoms/:slug/collaboration",
        element: (
          <KDomProtectionWrapper action="collaborate">
            {(kdom, accessResult) => {
              const ComponentWithProps = withProps(
                KDomCollaborationPageContent
              );
              return (
                <ComponentWithProps kdom={kdom} accessResult={accessResult} />
              );
            }}
          </KDomProtectionWrapper>
        ),
      },

      // Alte rute neprotejate
      { path: "/create-post", element: <CreatePostPage /> },
      { path: "/posts/:postId", element: <PostDetailPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/collaboration", element: <CollaborationPage /> },
      { path: "/kdom-guidelines", element: <ModerationGuidelines /> },
      {
        path: "/admin/moderation",
        element: <AdminModerationPage />,
      },
      {
        path: "/user/moderation",
        element: <UserModerationPage />,
      },
      {
        path: "/moderation/history",
        element: <ModerationHistoryPage />, // Pagină dedicată pentru istoric (admin/user)
      },
      {
        path: "/profile",
        element: <UserProfilePage />, // Pagină dedicată pentru istoric (admin/user)
      },
      {
        path: "/profile/edit",
        element: <EditProfilePage />, // Pagină dedicată pentru istoric (admin/user)
      },
      {
        path: "/profile/:userId",
        element: <UserProfilePage />, // Profilul altui user
      },
      {
        path: "/admin/logs",
        element: <AuditLogPage />, // Profilul altui user
      },
      {
        path: "/explore",
        element: <ExplorePage />, // Profilul altui user
      },
    ],
  },
]);
