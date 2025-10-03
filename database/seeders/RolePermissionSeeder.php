<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Student Management
            'view students',
            'create students',
            'edit students',
            'delete students',
            
            // Payment Processing
            'view payments',
            'create payments',
            'print receipts',
            'void payments',
            
            // Reports
            'view reports',
            'export reports',
            
            // Dashboard
            'view dashboard',
            
            // User Management (Admin only)
            'manage users',
            'manage roles',
            
            // Settings
            'manage fee structures',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Admin role - has all permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Cashier role - limited permissions
        $cashierRole = Role::create(['name' => 'cashier']);
        $cashierRole->givePermissionTo([
            'view students',
            'view payments',
            'create payments',
            'print receipts',
            'view dashboard',
        ]);

        // Optional: Create additional roles
        
        // Accountant role - reports and viewing only
        $accountantRole = Role::create(['name' => 'accountant']);
        $accountantRole->givePermissionTo([
            'view students',
            'view payments',
            'view reports',
            'export reports',
            'view dashboard',
        ]);

        // Manager role - can do most things except user management
        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view students',
            'create students',
            'edit students',
            'delete students',
            'view payments',
            'create payments',
            'print receipts',
            'void payments',
            'view reports',
            'export reports',
            'view dashboard',
            'manage fee structures',
        ]);
    }
}
