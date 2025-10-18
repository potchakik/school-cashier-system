<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled Tasks for Production/Demo Environments

// Refresh demo data nightly (for demo/staging environments only)
Schedule::command('demo:refresh --force')
    ->dailyAt('00:00')
    ->environments(['demo', 'staging'])
    ->onSuccess(function () {
        \Log::info('Demo data refreshed successfully');
    })
    ->onFailure(function () {
        \Log::error('Demo data refresh failed');
    });

// Clean old log files (older than 30 days)
Schedule::command('log:clear')
    ->weekly()
    ->sundays()
    ->at('03:00');

// Prune old failed jobs from queue
Schedule::command('queue:prune-failed --hours=168')
    ->weekly()
    ->mondays()
    ->at('02:00');

// Clear expired password reset tokens
Schedule::command('auth:clear-resets')
    ->everyFifteenMinutes();

// Optional: Database backup (requires spatie/laravel-backup)
// Schedule::command('backup:run')
//     ->dailyAt('01:00')
//     ->environments(['production']);
