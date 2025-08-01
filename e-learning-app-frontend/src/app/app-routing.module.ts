import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth-components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LectiiComponent } from './components/lectii/lectii.component';
import { AuthRedirectComponent } from './components/auth-components/auth-redirect/auth-redirect.component';
import { LectieComponent } from './components/lectie/lectie.component';
import { ForgotPasswordComponent } from './components/auth-components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth-components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/admin-components/add-lectie/editor.component';
import { TestComponent } from './components/test/test.component';
import { AdaugaTestComponent } from './components/admin-components/adauga-test/adauga-test.component';
import { EditeazaTestComponent } from './components/admin-components/editeaza-test/editeaza-test.component';
import { CompleteProfileComponent } from './components/auth-components/complete-profile/complete-profile.component';
import { AdminUserStatsComponent } from './components/admin-components/admin-user-stats/admin-user-stats.component';
import { AdminUserDetailComponent } from './components/admin-components/admin-user-detail/admin-user-detail.component';
import { QuestionDetailComponent } from './components/forum-components/question-detail/question-detail.component';
import { ForumPageComponent } from './components/forum-components/forum-page/forum-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ContactComponent } from './components/contact/contact.component';
import { EditeazaLectieComponent } from './components/admin-components/editeaza-lectie/editeaza-lectie.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lectii', component: LectiiComponent, canActivate: [AuthGuard] },
  { path: 'lectie/:id', component: LectieComponent, canActivate: [AuthGuard] },
  { path: 'oauth2/redirect', component: AuthRedirectComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'test/:id', component: TestComponent, canActivate: [AuthGuard] },
  {
    path: 'test-general',
    component: TestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adauga-test/:lessonId',
    component: AdaugaTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editeaza-test/:testId',
    component: EditeazaTestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'complete-profile',
    component: CompleteProfileComponent,
  },
  {
    path: 'editeaza-lectie/:id',
    component: EditeazaLectieComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/users',
    component: AdminUserStatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/user/:id',
    component: AdminUserDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: 'forum', component: ForumPageComponent, canActivate: [AuthGuard] },
  {
    path: 'forum/:id',
    component: QuestionDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
