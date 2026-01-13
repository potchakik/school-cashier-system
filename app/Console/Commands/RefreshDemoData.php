<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class RefreshDemoData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'demo:refresh {--force : Force refresh without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh demo data for the application (WARNING: Destroys all existing data)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (app()->environment('production') && ! $this->option('force')) {
            $this->error('This command cannot be run in production without --force flag.');
            $this->warn('This will DELETE ALL DATA and reseed the database.');

            return self::FAILURE;
        }

        if (! $this->option('force')) {
            if (! $this->confirm('This will DELETE ALL DATA and reseed the database. Continue?')) {
                $this->info('Operation cancelled.');

                return self::SUCCESS;
            }
        }

        $this->info('🔄 Refreshing demo data...');
        $this->newLine();

        // Clear all caches
        $this->components->task('Clearing caches', function () {
            Artisan::call('cache:clear');
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
        });

        // Migrate fresh
        $this->components->task('Running fresh migrations', function () {
            Artisan::call('migrate:fresh', ['--force' => true]);
        });

        // Seed database
        $this->components->task('Seeding demo data', function () {
            Artisan::call('db:seed', ['--force' => true]);
        });

        $this->newLine();
        $this->info('✅ Demo data refreshed successfully!');
        $this->newLine();

        // Display demo accounts
        $this->displayDemoAccounts();

        return self::SUCCESS;
    }

    /**
     * Display demo account credentials.
     */
    private function displayDemoAccounts(): void
    {
        $this->components->info('Demo Accounts:');
        $this->newLine();

        $users = User::with('roles')->get();

        $tableData = $users->map(function ($user) {
            return [
                $user->name,
                $user->email,
                'password',
                $user->roles->pluck('name')->implode(', ') ?: 'No role',
            ];
        })->toArray();

        $this->table(
            ['Name', 'Email', 'Password', 'Role'],
            $tableData
        );

        $this->newLine();
        $this->components->warn('Remember to change these passwords in production!');
    }
}
