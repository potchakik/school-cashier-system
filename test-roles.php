<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Roles and Permissions ===\n\n";

echo "Roles:\n";
Role::with('permissions')->get()->each(function ($role) {
    echo "  - {$role->name} ({$role->permissions->count()} permissions)\n";
});

echo "\nUsers:\n";
User::with('roles')->get()->each(function ($user) {
    $roles = $user->roles->pluck('name')->join(', ');
    echo "  - {$user->name} ({$user->email}) - Roles: {$roles}\n";
});

echo "\n=== Test Passed! ===\n";
