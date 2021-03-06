import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DialogService} from "./dialog.service";
import {MediaEditComponent} from "./media-edit/media-edit.component";
import {ScreenEditComponent} from "./screen-edit/screen-edit.component";
import {MatDialogModule} from "@angular/material/dialog";
import {SimpleConfirmationDialogComponent} from "./simple-confirmation-dialog/simple-confirmation-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ScreenClipOptionsComponent} from "./screen-clip-options/screen-clip-options.component";
import {MatIconModule} from "@angular/material/icon";
import {PipesModule} from "../../../core/pipes/pipes.module";
import {TwitchEditComponent} from './twitch-edit/twitch-edit.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  declarations: [
    MediaEditComponent,
    ScreenEditComponent,
    SimpleConfirmationDialogComponent,
    ScreenClipOptionsComponent,
    TwitchEditComponent,
  ],
  imports: [
    PipesModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSliderModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  providers: [DialogService],
})
export class DialogsModule {}
