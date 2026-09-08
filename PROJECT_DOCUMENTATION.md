# Student Enrollment Platform

## 1. Project overview

This project is a student enrollment system designed to help a school or training center capture student details, validate the information, store it in a database, and display all enrolled students in a register.

The application solves a common administrative problem: student enrollment records are often captured manually using paper forms or scattered spreadsheets, which makes it difficult to maintain accurate data, search records, and export reports.

This platform centralizes the process into a simple web form that:

- collects student details,
- validates required fields,
- saves data to a backend data store,
- shows a live student register,
- allows exports to CSV, Excel, and PDF.

## 2. Problem the project is solving

Before this system, managing student enrollment could be slow and error-prone because records were stored in disconnected places and manual data entry often caused incomplete or inconsistent information.

This project addresses that by creating:

- a single enrollment form,
- required field validation,
- consistent data formatting,
- centralized storage with DynamoDB,
- a table view of enrolled students,
- downloadable reports for administration.

## 3. Main features

- Student enrollment form
- Validation for required fields and email format
- Sex selection dropdown
- Student register table
- CSV, Excel, and PDF export
- AWS-hosted deployment
- Docker-based containerization
- Infrastructure as Code with Terraform
- CI/CD deployment through GitHub Actions

## 4. Tools and technologies used

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend and validation
- Zod for schema validation
- Next.js API routes
- AWS DynamoDB for persistence

### Deployment and infrastructure
- Docker
- Amazon ECR
- Amazon ECS Fargate
- Application Load Balancer
- Terraform
- GitHub Actions
- AWS CloudWatch

### Testing and reporting
- Vitest
- xlsx for Excel export
- jsPDF and jsPDF AutoTable for PDF export

## 5. Project structure

```text
student-enrollment/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── terraform.yml
├── infra/
│   ├── main.tf
│   ├── outputs.tf
│   ├── variables.tf
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── enrollments/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── store.ts
│   │   ├── validation.ts
│   │   └── validation.test.ts
│   └── ...
├── .dockerignore
├── .env.example
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── PROJECT_DOCUMENTATION.md
├── tsconfig.json
├── vitest.config.ts
└── ...
```

### Key files

- `src/app/page.tsx` — main student enrollment page and UI
- `src/app/api/enrollments/route.ts` — API for creating and retrieving enrollment records
- `src/lib/store.ts` — data access layer for DynamoDB or in-memory storage
- `src/lib/validation.ts` — Zod schema validation for student input
- `src/lib/validation.test.ts` — validation tests
- `infra/main.tf` — AWS infrastructure definition
- `.github/workflows/*.yml` — deployment automation and CI checks
- `Dockerfile` — container image for the application

## 6. How the system works

1. A user opens the enrollment page.
2. The form captures details such as first name, last name, email, date of birth, course, phone, sex, and address.
3. The app validates the input before saving.
4. The backend stores the student record in DynamoDB.
5. The page refreshes the student register and displays the latest records.
6. The user can download the list as CSV, Excel, or PDF.

## 7. How to access the project

### Local access

Run the following commands in the project folder:

```bash
npm install
npm run dev
```

Then open in a browser:

```text
http://localhost:3000
```

### Deployed access

The project is deployed to AWS and can be accessed through the live application URL:

```text
http://student-enrollment-dev-1658490077.us-east-1.elb.amazonaws.com/
```

## 8. How to use the tool

1. Open the app in a browser.
2. Fill in the required student details.
3. Select the student sex from the dropdown.
4. Click the enrollment button.
5. The record appears in the register table below.
6. Use the CSV, Excel, or PDF buttons to export the student list.

## 9. Notes and warnings

This is a demo project and should not be used with real student data unless security and privacy controls are added. The application currently focuses on the enrollment workflow and does not yet include full authentication, role-based access, or advanced data protection controls.

## 10. Summary

This project demonstrates how to build and deploy a functional student enrollment system using modern web technologies and cloud infrastructure. It combines frontend UI, backend API logic, validation, database storage, and automated AWS deployment into one complete solution.
