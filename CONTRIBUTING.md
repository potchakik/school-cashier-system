# Contributing to School Cashier System

First off, thank you for considering contributing to the School Cashier System! This is a portfolio project that demonstrates modern full-stack development practices, and contributions are welcome.

## 🎯 Project Purpose

This project serves as:

- A portfolio showcase of Laravel + Inertia.js + React + TypeScript development
- A learning resource for modern web development patterns
- A practical example of school payment management systems

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## 📜 Code of Conduct

### Our Standards

- **Be respectful** and inclusive in all interactions
- **Provide constructive feedback** on code and ideas
- **Focus on what is best** for the community and project
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Ensure you have:

- PHP 8.2+
- Composer 2.x
- Node.js 20.x+
- npm 10.x+
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```powershell
git clone https://github.com/YOUR-USERNAME/school-cashier-system.git
cd school-cashier-system
```

3. Add upstream remote:

```powershell
git remote add upstream https://github.com/mark-john-ignacio/school-cashier-system.git
```

## 🔧 Development Setup

1. **Install dependencies**

```powershell
composer install
npm install
```

2. **Set up environment**

```powershell
Copy-Item .env.example .env
php artisan key:generate
New-Item -Path database -Name database.sqlite -ItemType File -Force
```

3. **Run migrations and seeders**

```powershell
php artisan migrate --seed
```

4. **Start development server**

```powershell
composer run dev
```

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the behavior
- **Expected vs actual** behavior
- **Screenshots** if applicable
- **Environment details** (OS, PHP version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear use case** for the enhancement
- **Expected behavior** and benefits
- **Possible implementation** approach
- **Alternative solutions** you've considered

### Code Contributions

1. **Find or create an issue** to work on
2. **Comment on the issue** to let others know you're working on it
3. **Create a branch** from `master`:

```powershell
git checkout -b feature/your-feature-name
```

4. **Make your changes** following our coding standards
5. **Test thoroughly**
6. **Commit with clear messages**
7. **Push to your fork**
8. **Open a Pull Request**

## 📐 Coding Standards

### PHP (Laravel)

- Follow **PSR-12** coding standards
- Use **Laravel Pint** for formatting:

```powershell
./vendor/bin/pint
```

- Write **descriptive variable names**
- Add **PHPDoc blocks** for classes and methods
- Use **type hints** and **return types**
- Follow **Laravel conventions**:
    - Controllers: `PascalCase` with `Controller` suffix
    - Models: Singular `PascalCase`
    - Methods: `camelCase`

**Example:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index(Request $request): Response
    {
        $payments = Payment::query()
            ->with(['student', 'user'])
            ->latest()
            ->paginate(15);

        return inertia('payments/index', [
            'payments' => $payments,
        ]);
    }
}
```

### TypeScript/React

- Use **TypeScript** for all new files
- Follow **React 19 best practices**
- Use **functional components** with hooks
- Run linters before committing:

```powershell
npm run lint
npm run types
npm run format
```

- **Import order** (handled by Prettier):
    1. React/External libraries
    2. Internal imports (@/)
    3. Relative imports (./)
    4. Type imports

**Example:**

```typescript
import { FormEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  student: {
    id: number;
    name: string;
    email: string;
  };
}

export default function StudentEdit({ student }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    name: student.name,
    email: student.email,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('students.update', student.id));
  };

  return (
    <>
      <Head title={`Edit ${student.name}`} />
      {/* Component JSX */}
    </>
  );
}
```

### CSS/Tailwind

- Use **Tailwind utility classes**
- Create **reusable components** for repeated patterns
- Follow **mobile-first** responsive design
- Use **semantic class names** for custom CSS

### Git Commits

Follow **Conventional Commits**:

```
type(scope): subject

body

footer
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (not CSS)
- `refactor`: Code restructuring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(payments): add receipt PDF generation

- Implement PDF generation using dompdf
- Add receipt template with school branding
- Include payment details and QR code

Closes #123
```

```
fix(students): resolve search filter issue

The student search was not filtering by grade level correctly.
Updated the query builder to include grade level scope.

Fixes #456
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for **all new features**
- Use **Pest PHP** for backend tests
- Follow **AAA pattern**: Arrange, Act, Assert
- Name tests descriptively

**Example:**

```php
<?php

use App\Models\Student;
use App\Models\Payment;

test('student can make a payment', function () {
    // Arrange
    $student = Student::factory()->create();

    // Act
    $payment = Payment::create([
        'student_id' => $student->id,
        'amount' => 1000.00,
        'payment_method' => 'cash',
    ]);

    // Assert
    expect($payment)
        ->toBeInstanceOf(Payment::class)
        ->amount->toBe(1000.00)
        ->and($student->fresh()->payments()->count())->toBe(1);
});
```

### Running Tests

```powershell
# Run all tests
composer test

# Run specific test file
php artisan test tests/Feature/PaymentTest.php

# Run with coverage
composer test -- --coverage
```

## 🔄 Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for your changes
3. **Run all linters and tests**:

```powershell
./vendor/bin/pint
npm run lint
npm run types
composer test
```

4. **Update the README.md** if you've added features
5. **Ensure your branch is up to date** with master:

```powershell
git fetch upstream
git rebase upstream/master
```

6. **Create Pull Request** with:
    - Clear title and description
    - Reference to related issue(s)
    - Screenshots if UI changes
    - Test results

7. **Respond to review feedback** promptly
8. **Squash commits** if requested before merge

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 📁 Project Structure

Key directories and their purposes:

```
├── app/Http/Controllers/     # Request handlers
├── app/Models/               # Eloquent models
├── database/
│   ├── factories/           # Model factories for testing
│   ├── migrations/          # Database schema
│   └── seeders/             # Data seeders
├── resources/js/
│   ├── actions/            # Auto-generated (don't edit)
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Page layouts
│   ├── pages/              # Inertia pages
│   └── routes/             # Auto-generated (don't edit)
├── routes/
│   ├── auth.php            # Authentication routes
│   ├── settings.php        # Settings routes
│   └── web.php             # Main application routes
└── tests/
    ├── Feature/            # Feature tests
    └── Unit/               # Unit tests
```

### Key Concepts

- **Inertia Pages**: React components in `resources/js/pages/` map to controller `Inertia::render()` calls
- **Type-safe Routing**: Use helpers from `@/routes` instead of hardcoded URLs
- **Wayfinder**: Auto-generates TypeScript route helpers (keep Vite running)
- **Layouts**: Shared layouts in `resources/js/layouts/`

## 🎓 Learning Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ❓ Questions?

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: [your-email@example.com] for private inquiries

## 🙏 Thank You!

Your contributions help make this project better and serve as a learning resource for the community!

---

Happy coding! 🚀
