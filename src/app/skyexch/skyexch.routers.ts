import { Routes } from "@angular/router";
import { SkyexchComponent } from "./skyexch.component";

export const exchRoute: Routes = [

    {
        path: '', component: SkyexchComponent, children: [
            { path: 'sport', loadComponent: () => import('./sport/sport.component').then(m => m.SportComponent) },
            { path: 'match/:sportId/:eventId', loadComponent: () => import('./match/match.component').then(m => m.MatchComponent) },
            { path: 'sports-parlay', loadComponent: () => import('./parlay/parlay.component').then(m => m.ParlayComponent) },
            { path: 'premium-parlay/:sportId/:eventId', loadComponent: () => import('./premium-parlay/premium-parlay.component').then(m => m.PremiumParlayComponent) },
            { path: 'cupwinner/:sportId/:eventId', loadComponent: () => import('./cupwinner/cupwinner.component').then(m => m.CupwinnerComponent) },
            { path: 'toss-parlay', loadComponent: () => import('./toss-parlay/toss-parlay.component').then(m => m.TossParlayComponent) },
            { path: "search", loadComponent: () => import('./search/search.component').then(m => m.SearchComponent) },
            { path: "setting", loadComponent: () => import('./setting/setting.component').then(m => m.SettingComponent) },
            { path: "privacy-policy", loadComponent: () => import('./footer/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent) },
            { path: "kyc", loadComponent: () => import('./footer/kyc/kyc.component').then(m => m.KycComponent) },
            { path: "rule-reg", loadComponent: () => import('./footer/rules-and-reg/rules-and-reg.component').then(m => m.RulesAndRegComponent) },
            { path: "resp-gaming", loadComponent: () => import('./footer/responsible-gaming/responsible-gaming.component').then(m => m.ResponsibleGamingComponent) },
            { path: "term-condition", loadComponent: () => import('./footer/tandc/tandc.component').then(m => m.TandcComponent) },
            { path: "account", loadComponent: () => import('../components/classic/account/account.component').then(m => m.AccountComponent) },
        ]
    },
]
