import {
    trigger,
    transition,
    style,
    query,
    group,
    animate,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
    transition('HomePage <=> LoginPage', [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            })
        ], { optional: true }),

        query(':enter', [
            style({ opacity: 0 })
        ], { optional: true }),

        group([
            query(':leave', [
                animate('500ms ease-in-out', style({ opacity: 0 }))
            ], { optional: true }),
            query(':enter', [
                animate('500ms ease-in-out', style({ opacity: 1 }))
            ], { optional: true }),
        ])
    ]),

    transition('* <=> *', [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            })
        ], { optional: true }),

        query(':enter', [
            style({ opacity: 0 })
        ], { optional: true }),

        group([
            query(':leave', [
                animate('300ms ease-in-out', style({ opacity: 0 }))
            ], { optional: true }),
            query(':enter', [
                animate('300ms ease-in-out', style({ opacity: 1 }))
            ], { optional: true }),
        ]),
    ]),
]);