import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KycComponent } from './kyc/kyc.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ResponsibleGamingComponent } from './responsible-gaming/responsible-gaming.component';
import { RuleRegulationComponent } from './rule-regulation/rule-regulation.component';
import { TermConditionComponent } from './term-condition/term-condition.component';
import { FooterPagesComponent } from './footer-pages.component';

const route: Routes = [
  {
    path: '', component: FooterPagesComponent, children: [
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'term-condition', component: TermConditionComponent },
      { path: 'rule-regulation', component: RuleRegulationComponent },
      { path: 'KYC', component: KycComponent },
      { path: 'responsible-gaming', component: ResponsibleGamingComponent }
    ]
  }
]

@NgModule({
  declarations: [PrivacyPolicyComponent,
    TermConditionComponent,
    RuleRegulationComponent,
    KycComponent,
    ResponsibleGamingComponent,
    FooterPagesComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ],
  exports: [FooterPagesComponent]
})
export class FooterPagesModule { }
