import { Component, input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../../classes/user/user';
import { RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/User/user.service';

@Component({
  selector: 'app-user-card',
  imports: [AvatarModule, RouterLink, CheckboxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent implements OnInit {

  user = input.required<User>();

  public activateUserForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public userService: UserService) {
    this.activateUserForm = this.formBuilder.group({
      enabled: new FormControl(false)
    });
  }

  ngOnInit() {
    const userActivated = this.user().getEnabled();
    this.activateUserForm.get('enabled')?.setValue(userActivated);
  }

  setUserDisable() {
    const id = this.user().getId();
    if (this.user().getEnabled()) {
      this.userService.disableUser(id).subscribe({
        next: () => {
          this.user().setEnabled(false);
        }
      });
    } else {
      this.userService.activateUser(id).subscribe({
        next: () => {
          this.user().setEnabled(true);
        }
      });
    }
  }
}
