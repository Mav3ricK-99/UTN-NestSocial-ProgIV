import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'feed',
        loadChildren: () =>
            import('./core/routes/feed/feed.routes')
                .then(m => m.FEED_ROUTES)
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./core/routes/auth.routes')
                .then(m => m.AUTH_ROUTES)
    },
];
