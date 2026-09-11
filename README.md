# Shoppi-M Admin — Tableau de bord e-commerce multi-boutiques + API (Next.js 14)

![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)
![Stripe](https://img.shields.io/badge/Paiement-Stripe-635BFF?logo=stripe&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui%20%2B%20Tailwind-000000)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?logo=cloudinary&logoColor=white)

🔗 **Déploiement** : <https://shoppi-m.vercel.app> ⚠️ *renvoie actuellement une erreur 500 : la base de données PostgreSQL liée au projet n'est plus disponible (voir « Déploiement »).*
📦 **Code source** : <https://github.com/Georginio-prod/last-game>
🛍️ **Vitrine cliente associée** : [last-dance-store](https://github.com/Georginio-prod/last-dance-store) → <https://shoppi-m-store.vercel.app>
🗄️ **Export SQL de la base** : [bd](https://github.com/Georginio-prod/bd)

---

## 📌 Présentation

**Shoppi-M** est une plateforme e-commerce en deux applications, réalisée en juin 2024 :

1. **Ce dépôt — le back-office** : un tableau de bord d'administration où un marchand
   crée une ou plusieurs **boutiques** et gère bannières, catégories, tailles, couleurs,
   produits (avec images), commandes, paiements, livraisons et réductions. Il expose
   aussi une **API REST publique** consommée par la vitrine.
2. **[last-dance-store](https://github.com/Georginio-prod/last-dance-store)** — la vitrine
   côté client (catalogue, fiche produit, panier, paiement Stripe).

Le projet suit l'architecture « CMS e-commerce headless » : le dashboard est la source de
vérité, la boutique n'est qu'un client de l'API.

## ✨ Fonctionnalités

- **Authentification** Clerk (sign-in / sign-up), chaque boutique appartient à un `userId`.
- **Multi-boutiques** : sélecteur de boutique (`store-switcher`), création via modale, paramètres et suppression.
- **CRUD complets** avec tableaux (`@tanstack/react-table`), formulaires validés (`react-hook-form` + `zod`) :
  - Billboards (bannières avec image Cloudinary),
  - Catégories (liées à une bannière),
  - Tailles, Couleurs (sélecteur de couleur),
  - Produits (prix, catégorie, taille, couleur, images multiples, *featured* / *archived*),
  - Commandes (produits, téléphone, adresse, statut payé).
- **Vue d'ensemble** : revenu total, ventes, stock, **graphique** des revenus mensuels (Recharts).
- **API REST** par boutique : `GET/POST /api/[storeId]/{billboards|categories|sizes|colors|products}` et `GET/PATCH/DELETE …/[id]`, avec CORS ouvert pour la vitrine.
- **Checkout Stripe** : `POST /api/[storeId]/checkout` crée une session de paiement ; `POST /api/webhook` marque la commande payée et renseigne l'adresse.
- Thème clair / sombre (`next-themes`), notifications (`react-hot-toast`), composants **shadcn/ui**.

## 🗄️ Modèle de données (Prisma / PostgreSQL)

`Store` → `Billboard`, `Category`, `Size`, `Color`, `Product` (→ `Image[]`), `Order` (→ `OrderItem[]`),
`Paiement`, `Livraison`, `Reduction`. Les trois derniers modèles sont une extension
personnelle du tutoriel d'origine pour gérer paiements, livraisons et remises.

## 📁 Structure

```
last-game/
├── app/
│   ├── (auth)/(routes)/sign-in, sign-up      # Pages Clerk
│   ├── (root)/                               # Redirige vers la 1re boutique ou ouvre la modale de création
│   ├── (dashboard)/[storeId]/(routes)/
│   │   ├── page.tsx                          # Vue d'ensemble + graphique
│   │   ├── billboards/ categories/ sizes/ colors/ products/ orders/ settings/
│   │   └── …/[id]/page.tsx                   # Formulaire création / édition
│   └── api/
│       ├── stores/ · stores/[storeId]/
│       ├── [storeId]/{billboards,categories,sizes,colors,products}/…
│       ├── [storeId]/checkout/route.ts       # Session Stripe
│       └── webhook/route.ts                  # Webhook Stripe
├── actions/                                  # get-total-revenue, get-sales-count, get-stock-count, get-graph-revenue
├── components/ (navbar, MainNav, store-switcher, overview, modals/, ui/ shadcn)
├── hooks/ · lib/ (prismadb, stripe, utils) · providers/ · prisma/schema.prisma
└── middleware.ts                              # Protection des routes par Clerk
```

## 🚀 Installation & lancement

Prérequis : Node.js ≥ 18, une base **PostgreSQL**, des comptes **Clerk**, **Stripe** et **Cloudinary**.

```bash
git clone https://github.com/Georginio-prod/last-game.git
cd last-game
npm install
```

Créer un fichier `.env` :

```dotenv
DATABASE_URL=postgresql://user:password@host:5432/shoppi
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_STORE_URL=http://localhost:3001
```

```bash
npx prisma generate
npx prisma db push        # crée les tables
npm run dev               # http://localhost:3000
```

Pour tester le webhook Stripe en local : `stripe listen --forward-to localhost:3000/api/webhook`.

## 🌐 Déploiement

Déployé sur **Vercel**. L'application dépend d'une base PostgreSQL externe ; celle utilisée
lors du projet n'existe plus, d'où l'erreur 500 actuelle. Pour la remettre en ligne :
créer une base (Neon, Supabase, Railway…), renseigner `DATABASE_URL` et les clés ci-dessus
dans les variables d'environnement Vercel, puis exécuter `npx prisma db push`.

## 🎓 Ce que ce projet démontre

Next.js App Router (route groups, layouts imbriqués, route handlers), Prisma avec relations
multiples, authentification tierce (Clerk), paiement Stripe avec webhook, upload d'images
Cloudinary, tableaux et formulaires typés, conception d'une API consommée par un second front.

---

## 👤 Auteur

**Komla Etonam Georges EKLOU** (Georginio) — Développeur Full Stack Web & Web3

[![GitHub](https://img.shields.io/badge/GitHub-Georginio--prod-181717?logo=github)](https://github.com/Georginio-prod)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profil-0A66C2?logo=linkedin)](https://www.linkedin.com/in/komla-etonam-georges-eklou-68518b23b)
[![Portfolio](https://img.shields.io/badge/Portfolio-georginio.w3frame.com-6C63FF)](https://georginio.w3frame.com/)

> 📚 Tous mes projets sont listés et documentés sur mon [profil GitHub](https://github.com/Georginio-prod).
