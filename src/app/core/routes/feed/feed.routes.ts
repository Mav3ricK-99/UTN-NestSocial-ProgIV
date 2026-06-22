import { Routes } from '@angular/router';

export const FEED_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../../../features/feed/feed.component')
                .then(m => m.FeedComponent),
    }, {
        path: '**',
        loadComponent: () =>
            import('../../../features/feed/feed.component')
                .then(m => m.FeedComponent),
    }
];