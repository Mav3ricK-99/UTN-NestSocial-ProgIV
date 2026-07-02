import { Routes } from '@angular/router';
import { loggedUsersOnlyGuard } from './guards/LoggedUsersOnly/logged-users-only.guard';

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
                .then(m => m.FEED_ROUTES),
        canActivate: [loggedUsersOnlyGuard]
    },
    {
        path: 'post/:id',
        loadComponent: () =>
            import('./features/show-post/show-post.component')
                .then(m => m.ShowPostComponent),
        canActivate: [loggedUsersOnlyGuard]
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./core/routes/auth.routes')
                .then(m => m.AUTH_ROUTES)
    },
    {
        path: 'profile/:username',
        loadComponent: () =>
            import('./features/profile/profile.component')
                .then(m => m.ProfileComponent),
        canActivate: [loggedUsersOnlyGuard]
    },
];
