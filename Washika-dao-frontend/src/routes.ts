import { route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout.tsx", [
    index("./pages/HomePage.tsx"),

    // Auth
    route("login", "./pages/Login.tsx"),
    route("register", "./pages/Register.tsx"),

    // DAOs
    ...prefix("daos", [
      index("./pages/DaosList.tsx"), // /daos
      route("create", "./pages/DaoCreate.tsx"), // /daos/create
      route(":daoId", "./pages/DaoProfile.tsx", [
        index("./pages/DaoOverview.tsx"), // /daos/:daoId
        route("edit", "./pages/DaoEdit.tsx"), // /daos/:daoId/edit
        route("members", "./pages/DaoMembers.tsx"), // /daos/:daoId/members
        route("proposals", "./pages/DaoProposals.tsx", [
          index("./pages/ProposalsList.tsx"), // /daos/:daoId/proposals
          route("create", "./pages/ProposalCreate.tsx"), // /daos/:daoId/proposals/create
          route(":proposalId", "./pages/ProposalDetail.tsx"), // /daos/:daoId/proposals/:proposalId
        ]),
        route("treasury", "./pages/DaoTreasury.tsx"), // /daos/:daoId/treasury
        route("settings", "./pages/DaoSettings.tsx"), // /daos/:daoId/settings
      ]),
    ]),

    // User Profile
    route("profile", "./pages/UserProfile.tsx"),
    route("notifications", "./pages/Notifications.tsx"),

    // Blog/Education
    ...prefix("blog", [
      index("./pages/BlogList.tsx"),
      route(":slug", "./pages/BlogDetail.tsx"),
    ]),

    // Marketplace
    route("marketplace", "./pages/MarketPlace.tsx"),

    // 404
    route("*", "./pages/NotFound.tsx"),

    // DAO SuperAdmin (council) page
    route("DaoSuperAdmin/:daoId", "./pages/DaoSuperAdmin.tsx"),
  ]),
]; 