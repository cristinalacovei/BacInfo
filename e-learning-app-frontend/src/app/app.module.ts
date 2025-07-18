import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth-components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../app/environments/environment';
import { AuthService } from './services/auth.service';
import { AboutComponent } from './components/about/about.component';
import { LectiiComponent } from './components/lectii/lectii.component';
import { AuthRedirectComponent } from './components/auth-components/auth-redirect/auth-redirect.component';
import { LectieComponent } from './components/lectie/lectie.component';
import { ForgotPasswordComponent } from './components/auth-components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth-components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditorComponent } from './components/admin-components/add-lectie/editor.component';
import { QuillModule } from 'ngx-quill';
import { TestComponent } from './components/test/test.component';
import { AdaugaTestComponent } from './components/admin-components/adauga-test/adauga-test.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditeazaTestComponent } from './components/admin-components/editeaza-test/editeaza-test.component';
import { CompleteProfileComponent } from './components/auth-components/complete-profile/complete-profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminUserStatsComponent } from './components/admin-components/admin-user-stats/admin-user-stats.component';
import { AdminUserDetailComponent } from './components/admin-components/admin-user-detail/admin-user-detail.component';
import { QuestionDetailComponent } from './components/forum-components/question-detail/question-detail.component';
import { ForumPageComponent } from './components/forum-components/forum-page/forum-page.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContactComponent } from './components/contact/contact.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { EditeazaLectieComponent } from './components/admin-components/editeaza-lectie/editeaza-lectie.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmDialogComponent,
    HomeComponent,
    AboutComponent,
    LectiiComponent,
    AuthRedirectComponent,
    LectieComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    EditorComponent,
    TestComponent,
    AdaugaTestComponent,
    EditeazaTestComponent,
    CompleteProfileComponent,
    SidebarComponent,
    AdminUserStatsComponent,
    AdminUserDetailComponent,
    QuestionDetailComponent,
    ForumPageComponent,
    ContactComponent,
    EditeazaLectieComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    MatCardModule,
    AngularEditorModule,
    QuillModule.forRoot(),
    MatOptionModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    ImageCropperComponent,
  ],
  providers: [
    AuthService,
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
