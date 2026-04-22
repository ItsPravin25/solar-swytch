# Solar Swytch Backend

TypeScript backend API for the Solar Swytch B2B solar business management platform.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start PostgreSQL (Docker)
docker-compose up -d

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Commands

```bash
# Push schema changes
npm run db:push

# Generate migration
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npx prisma studio
```

## API Endpoints

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Get current user |

### Quotations
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/quotations` | List quotations |
| POST | `/api/v1/quotations` | Create quotation |
| GET | `/api/v1/quotations/:id` | Get quotation |
| PUT | `/api/v1/quotations/:id` | Update quotation |
| DELETE | `/api/v1/quotations/:id` | Delete quotation |
| PATCH | `/api/v1/quotations/:id/approve` | Approve quotation |

### Pricing
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/pricing` | Get pricing list |
| PUT | `/api/v1/pricing` | Bulk update pricing |
| PUT | `/api/v1/pricing/:id` | Update single pricing |

### Profile
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/profile` | Get user profile |
| PUT | `/api/v1/profile` | Update profile |
| POST | `/api/v1/profile/photo` | Upload photo |

### Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/settings/gst` | Get GST settings |
| PUT | `/api/v1/settings/gst` | Update GST settings |
| GET | `/api/v1/settings/technical` | Get panel types |
| PUT | `/api/v1/settings/technical` | Update panel types |

### Calculations
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/calculations/roi` | Calculate ROI |
| POST | `/api/v1/calculations/emi` | Calculate EMI |
| POST | `/api/v1/calculations/panels` | Calculate panel requirements |

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Express app entry
│   ├── config/
│   │   └── database.ts          # Prisma client
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   ├── error-handler.ts     # Error handler
│   │   └── validate.ts         # Zod validation
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── quotations.ts
│   │   ├── pricing.ts
│   │   ├── profile.ts
│   │   ├── settings.ts
│   │   └── calculations.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── quotation.service.ts
│   │   ├── pricing.service.ts
│   │   ├── profile.service.ts
│   │   └── calculations.service.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
└── tests/
```

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solar_swytch"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```
