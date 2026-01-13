<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'roles' => $request->user()->roles->pluck('name'),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    'can' => [
                        'viewStudents' => $request->user()->can('view students'),
                        'createStudents' => $request->user()->can('create students'),
                        'editStudents' => $request->user()->can('edit students'),
                        'deleteStudents' => $request->user()->can('delete students'),
                        'viewPayments' => $request->user()->can('view payments'),
                        'createPayments' => $request->user()->can('create payments'),
                        'printReceipts' => $request->user()->can('print receipts'),
                        'voidPayments' => $request->user()->can('void payments'),
                        'viewReports' => $request->user()->can('view reports'),
                        'exportReports' => $request->user()->can('export reports'),
                        'manageUsers' => $request->user()->can('manage users'),
                        'manageFeeStructures' => $request->user()->can('manage fee structures'),
                    ],
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
