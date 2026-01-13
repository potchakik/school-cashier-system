<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@school.test',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        // Create cashier user
        $cashier = User::factory()->create([
            'name' => 'Cashier User',
            'email' => 'cashier@school.test',
            'role' => 'cashier',
            'is_active' => true,
        ]);
        $cashier->assignRole('cashier');

        // Create additional test users
        $manager = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@school.test',
            'role' => 'manager',
            'is_active' => true,
        ]);
        $manager->assignRole('manager');

        $accountant = User::factory()->create([
            'name' => 'Accountant User',
            'email' => 'accountant@school.test',
            'role' => 'accountant',
            'is_active' => true,
        ]);
        $accountant->assignRole('accountant');

        // Seed fee structures and students
        $this->call([
            FeeStructureSeeder::class,
            StudentSeeder::class,
        ]);
    }
}
