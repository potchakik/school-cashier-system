# 🚀 Deployment Guide

This guide covers deploying the School Cashier System to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
- [Production Setup](#production-setup)
- [Scheduled Tasks](#scheduled-tasks)
- [Queue Workers](#queue-workers)
- [Server Requirements](#server-requirements)
- [Security Checklist](#security-checklist)
- [Maintenance](#maintenance)

---

## ✅ Prerequisites

### Server Requirements

- **PHP:** 8.2 or higher
- **Database:** MySQL 8.0+ / PostgreSQL 14+ / SQLite 3.8+
- **Node.js:** 20.x or higher (for build process)
- **Web Server:** Nginx or Apache with mod_rewrite
- **Composer:** 2.x
- **Memory:** 512MB minimum, 1GB+ recommended
- **Storage:** 1GB minimum for application + logs

### PHP Extensions

Required extensions:

```
- BCMath
- Ctype
- cURL
- DOM
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PCRE
- PDO
- Tokenizer
- XML
```

---

## 🔧 Environment Configuration

### 1. Copy and Configure Environment File

```bash
cp .env.example .env
```

### 2. Essential Environment Variables

```bash
# Application
APP_NAME="School Cashier System"
APP_ENV=production
APP_KEY=                        # Generate with: php artisan key:generate
APP_DEBUG=false                 # CRITICAL: Must be false in production
APP_URL=https://yourdomain.com

# Database (MySQL Example)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=school_cashier
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password

# Session & Cache
SESSION_DRIVER=database         # or redis for better performance
SESSION_LIFETIME=120
CACHE_STORE=redis              # or database/file

# Queue
QUEUE_CONNECTION=database      # or redis/sqs for production

# Mail (for password resets, notifications)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Redis (if using)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error                # Use 'error' in production, 'debug' only for troubleshooting
LOG_DEPRECATIONS_CHANNEL=null
LOG_STACK=daily                # Rotate logs daily

# Inertia SSR (Optional but recommended for SEO)
INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

---

## 🌐 Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx mysql-server php8.2-fpm php8.2-cli php8.2-mysql \
    php8.2-mbstring php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip \
    php8.2-gd redis-server supervisor git unzip

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Step 2: Clone and Install Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/mark-john-ignacio/school-cashier-system.git
cd school-cashier-system

# Set ownership
sudo chown -R www-data:www-data /var/www/school-cashier-system

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci
npm run build
npm run build:ssr
```

#### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/school-cashier`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/school-cashier-system/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/school-cashier /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ipil-shephered-montessori.com -d www.ipil-shephered-montessori.com
```

### Option 2: Laravel Forge

1. **Connect your server** (DigitalOcean, AWS, etc.)
2. **Create new site** with your domain
3. **Deploy from Git** repository
4. **Enable Quick Deploy** for automatic deployments
5. **Configure environment** variables in Forge panel
6. **Enable SSL** (automatic with Let's Encrypt)

### Option 3: Ploi.io

Similar to Forge, fully automated deployment platform.

### Option 4: Shared Hosting

Not recommended due to queue worker and SSR requirements. If necessary:

- Disable SSR (`INERTIA_SSR_ENABLED=false`)
- Use `sync` queue driver (not recommended for production)
- Contact host for specific Laravel setup instructions

---

## 🔧 Production Setup

### 1. Run Migrations and Seeders

```bash
# Run migrations
php artisan migrate --force

# Seed database (if deploying for first time)
php artisan db:seed --force

# Or use the demo refresh command
php artisan demo:refresh --force
```

### 2. Optimize for Performance

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev
```

### 3. Set Correct Permissions

```bash
sudo chown -R www-data:www-data /var/www/school-cashier-system
sudo chmod -R 755 /var/www/school-cashier-system
sudo chmod -R 775 /var/www/school-cashier-system/storage
sudo chmod -R 775 /var/www/school-cashier-system/bootstrap/cache
```

### 4. Start SSR Server (if using)

```bash
php artisan inertia:start-ssr
```

Keep it running with Supervisor (see below).

---

## ⏰ Scheduled Tasks

Laravel's task scheduler needs to run every minute.

### Add Cron Entry

```bash
crontab -e
```

Add:

```cron
* * * * * cd /var/www/school-cashier-system && php artisan schedule:run >> /dev/null 2>&1
```

### Define Scheduled Tasks

Edit `routes/console.php`:

```php
<?php

use Illuminate\Support\Facades\Schedule;

// Refresh demo data daily at 2 AM (for live demo sites)
Schedule::command('demo:refresh --force')
    ->dailyAt('02:00')
    ->environments(['staging', 'demo']);

// Clean up old logs weekly
Schedule::command('log:clear')
    ->weekly()
    ->sundays()
    ->at('03:00');

// Queue failed jobs cleanup monthly
Schedule::command('queue:flush')
    ->monthly();

// Database backup daily (if using backup package)
Schedule::command('backup:run')
    ->dailyAt('01:00')
    ->environments(['production']);
```

### Useful Scheduled Tasks for Demo Sites

If you want to showcase your project with **auto-refreshing demo data**:

```php
// Refresh demo every 6 hours
Schedule::command('demo:refresh --force')
    ->cron('0 */6 * * *')
    ->environments(['demo']);

// Or refresh nightly
Schedule::command('demo:refresh --force')
    ->dailyAt('00:00')
    ->environments(['demo']);
```

---

## 🔄 Queue Workers

Queue workers process background jobs (emails, reports, etc.).

### Supervisor Configuration

Create `/etc/supervisor/conf.d/school-cashier-worker.conf`:

```ini
[program:school-cashier-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/school-cashier-system/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/school-cashier-system/storage/logs/worker.log
stopwaitsecs=3600
```

### SSR Server Configuration (if using SSR)

Create `/etc/supervisor/conf.d/school-cashier-ssr.conf`:

```ini
[program:school-cashier-ssr]
process_name=%(program_name)s
command=php /var/www/school-cashier-system/artisan inertia:start-ssr
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/school-cashier-system/storage/logs/ssr.log
```

### Restart Supervisor

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### Check Worker Status

```bash
sudo supervisorctl status
```

---

## 🔒 Security Checklist

- [ ] **APP_DEBUG=false** in production
- [ ] **Strong APP_KEY** generated
- [ ] **Database credentials** are secure and unique
- [ ] **File permissions** set correctly (755 for directories, 644 for files)
- [ ] **Storage and cache** directories writable by web server
- [ ] **SSL certificate** installed and HTTPS enforced
- [ ] **Firewall configured** (only ports 80, 443, 22 open)
- [ ] **Database accessible** only from localhost (if on same server)
- [ ] **Default passwords changed** for demo accounts
- [ ] **Regular backups** scheduled
- [ ] **Security headers** configured in Nginx/Apache
- [ ] **Rate limiting** enabled for login routes
- [ ] **CSRF protection** enabled (default in Laravel)
- [ ] **SQL injection protection** via Eloquent (don't use raw queries)
- [ ] **XSS protection** via Blade/React escaping

### Additional Security Headers (Nginx)

Add to your Nginx config:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## 🔧 Maintenance

### Deployment Workflow

```bash
# 1. Pull latest code
cd /var/www/school-cashier-system
git pull origin main

# 2. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# 3. Build assets
npm run build
npm run build:ssr

# 4. Run migrations
php artisan migrate --force

# 5. Clear and recache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Restart queue workers
sudo supervisorctl restart all

# 7. Restart PHP-FPM (if needed)
sudo systemctl restart php8.2-fpm
```

### Zero-Downtime Deployment with Deployer

Install Deployer:

```bash
composer require deployer/deployer --dev
```

See [Laravel Deployer Recipe](https://deployer.org/docs/7.x/recipe/laravel) for setup.

### Database Backups

Using Laravel Backup package:

```bash
composer require spatie/laravel-backup
php artisan backup:run
```

Schedule daily:

```php
Schedule::command('backup:run')->dailyAt('01:00');
```

### Log Rotation

Laravel rotates logs by default if using `daily` channel. For manual cleanup:

```bash
# Clear logs older than 30 days
find /var/www/school-cashier-system/storage/logs -name "*.log" -type f -mtime +30 -delete
```

### Monitoring

Consider:

- **Laravel Telescope** (development only, not for production)
- **Laravel Pulse** (production monitoring)
- **Sentry** (error tracking)
- **New Relic** (APM)
- **Server monitoring** (Netdata, Prometheus)

---

## 📦 Docker Deployment (Optional)

If using Docker:

```dockerfile
# Dockerfile example
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Build frontend assets
RUN npm ci && npm run build && npm run build:ssr

EXPOSE 9000
CMD ["php-fpm"]
```

---

## 🆘 Troubleshooting

### Issue: 500 Error

1. Check storage permissions
2. Verify `.env` file exists and is correct
3. Check logs: `storage/logs/laravel.log`
4. Run: `php artisan config:clear`

### Issue: Queue Jobs Not Processing

1. Check supervisor status: `sudo supervisorctl status`
2. Check worker logs: `storage/logs/worker.log`
3. Restart workers: `sudo supervisorctl restart all`

### Issue: SSR Not Working

1. Check if SSR is enabled in `.env`
2. Verify SSR server is running: `ps aux | grep inertia:start-ssr`
3. Check SSR logs: `storage/logs/ssr.log`
4. Rebuild SSR: `npm run build:ssr`

### Issue: Assets Not Loading

1. Run: `npm run build`
2. Check `public/build` directory exists
3. Verify APP_URL in `.env` matches your domain

---

## 📞 Support

For deployment issues:

- Check [Laravel Deployment Documentation](https://laravel.com/docs/deployment)
- Review [Inertia.js Server-Side Rendering](https://inertiajs.com/server-side-rendering)
- Open an issue on GitHub

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Login works with demo credentials
- [ ] Assets (CSS/JS) load properly
- [ ] Database connections work
- [ ] Queue workers are running
- [ ] Scheduled tasks are configured
- [ ] SSL certificate is valid
- [ ] Email sending works
- [ ] Error pages render correctly
- [ ] Logs are being written
- [ ] Backups are scheduled (if applicable)
- [ ] Monitoring is active

---

**Congratulations! Your School Cashier System is now deployed! 🎉**
