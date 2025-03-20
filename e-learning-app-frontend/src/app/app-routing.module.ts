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
import { EditorComponent } from './components/editor/editor.component';
import { CreateQuestionsComponent } from './components/create-questions/create-questions.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lectii', component: LectiiComponent },
  { path: 'lectie/:id', component: LectieComponent },
  { path: 'oauth2/redirect', component: AuthRedirectComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'create-questions/:testId', component: CreateQuestionsComponent },
  { path: 'test/:id', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
