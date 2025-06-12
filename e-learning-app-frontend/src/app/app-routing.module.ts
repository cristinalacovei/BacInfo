import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LectiiComponent } from './components/lectii/lectii.component';
import { AuthRedirectComponent } from './components/auth-redirect/auth-redirect.component';
import { LectieComponent } from './components/lectie/lectie.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/add-lectie/editor.component';
import { TestComponent } from './components/test/test.component';
import { AdaugaTestComponent } from './components/adauga-test/adauga-test.component';
import { EditeazaTestComponent } from './components/editeaza-test/editeaza-test.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { AdminUserStatsComponent } from './components/admin-user-stats/admin-user-stats.component';
import { AdminUserDetailComponent } from './components/admin-user-detail/admin-user-detail.component';
import { QuestionDetailComponent } from './forum/question-detail/question-detail.component';
import { ForumPageComponent } from './forum/forum-page/forum-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lectii', component: LectiiComponent, canActivate: [AuthGuard] },
  { path: 'lectie/:id', component: LectieComponent },
  { path: 'oauth2/redirect', component: AuthRedirectComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'editor', component: EditorComponent },
  { path: 'test/:id', component: TestComponent },
  {
    path: 'test-general',
    component: TestComponent,
  },
  { path: 'adauga-test/:lessonId', component: AdaugaTestComponent },
  {
    path: 'editeaza-test/:testId',
    component: EditeazaTestComponent,
  },
  {
    path: 'complete-profile',
    component: CompleteProfileComponent,
  },
  {
    path: 'admin/users',
    component: AdminUserStatsComponent,
  },
  {
    path: 'admin/user/:id',
    component: AdminUserDetailComponent,
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
